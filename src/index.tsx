import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'

type Bindings = {
  DB: D1Database
}

type Variables = {
  user: { id: number; username: string; display_name: string } | null
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// CORS設定
app.use('/api/*', cors({
  origin: '*',
  credentials: true,
}))

// セッション認証ミドルウェア
app.use('/api/admin/*', async (c, next) => {
  const sessionId = getCookie(c, 'session_id')
  
  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const session = await c.env.DB.prepare(
      `SELECT s.*, u.id as user_id, u.username, u.display_name 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    ).bind(sessionId).first()

    if (!session) {
      deleteCookie(c, 'session_id')
      return c.json({ error: 'Session expired' }, 401)
    }

    c.set('user', {
      id: session.user_id as number,
      username: session.username as string,
      display_name: session.display_name as string
    })
  } catch (e) {
    return c.json({ error: 'Database error' }, 500)
  }

  await next()
})

// ==================== 認証API ====================

// ログイン
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password, remember } = await c.req.json()

    if (!username || !password) {
      return c.json({ error: 'Username and password required' }, 400)
    }

    const user = await c.env.DB.prepare(
      'SELECT * FROM users WHERE username = ?'
    ).bind(username).first()

    if (!user || user.password_hash !== password) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // セッション作成
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (remember ? 30 : 1)) // 30日 or 1日

    await c.env.DB.prepare(
      'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
    ).bind(sessionId, user.id, expiresAt.toISOString()).run()

    // Cookie設定
    setCookie(c, 'session_id', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      path: '/',
      maxAge: remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60
    })

    return c.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        display_name: user.display_name
      }
    })
  } catch (e) {
    console.error('Login error:', e)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// ログアウト
app.post('/api/auth/logout', async (c) => {
  const sessionId = getCookie(c, 'session_id')
  
  if (sessionId) {
    await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run()
    deleteCookie(c, 'session_id')
  }

  return c.json({ success: true })
})

// セッション確認
app.get('/api/auth/me', async (c) => {
  const sessionId = getCookie(c, 'session_id')
  
  if (!sessionId) {
    return c.json({ authenticated: false })
  }

  try {
    const session = await c.env.DB.prepare(
      `SELECT u.id, u.username, u.display_name 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.id = ? AND s.expires_at > datetime('now')`
    ).bind(sessionId).first()

    if (!session) {
      deleteCookie(c, 'session_id')
      return c.json({ authenticated: false })
    }

    return c.json({
      authenticated: true,
      user: {
        id: session.id,
        username: session.username,
        display_name: session.display_name
      }
    })
  } catch (e) {
    return c.json({ authenticated: false })
  }
})

// ==================== 公開ブログAPI ====================

// 公開記事一覧取得
app.get('/api/posts', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT id, slug, title, excerpt, category, tags, featured, published_at 
       FROM posts 
       WHERE status = 'published' 
       ORDER BY featured DESC, published_at DESC`
    ).all()

    return c.json({ posts: results })
  } catch (e) {
    console.error('Fetch posts error:', e)
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// タグ一覧取得（記事数付き）
app.get('/api/tags', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT tags FROM posts WHERE status = 'published' AND tags IS NOT NULL AND tags != ''`
    ).all()

    // タグをカウント
    const tagCounts: Record<string, number> = {}
    for (const row of results as any[]) {
      const tags = row.tags.split(',')
      for (const tag of tags) {
        const trimmedTag = tag.trim()
        if (trimmedTag) {
          tagCounts[trimmedTag] = (tagCounts[trimmedTag] || 0) + 1
        }
      }
    }

    // ソートして返す（記事数の多い順）
    const sortedTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return c.json({ tags: sortedTags })
  } catch (e) {
    console.error('Fetch tags error:', e)
    return c.json({ error: 'Failed to fetch tags' }, 500)
  }
})

// タグ別記事一覧取得
app.get('/api/posts/tag/:tag', async (c) => {
  const tag = decodeURIComponent(c.req.param('tag'))

  try {
    const { results } = await c.env.DB.prepare(
      `SELECT id, slug, title, excerpt, category, tags, featured, published_at 
       FROM posts 
       WHERE status = 'published' AND tags LIKE ?
       ORDER BY featured DESC, published_at DESC`
    ).bind(`%${tag}%`).all()

    // タグが完全一致するものだけフィルタリング
    const filteredPosts = (results as any[]).filter(post => {
      const postTags = post.tags.split(',').map((t: string) => t.trim())
      return postTags.includes(tag)
    })

    return c.json({ posts: filteredPosts, tag })
  } catch (e) {
    console.error('Fetch posts by tag error:', e)
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// 公開記事詳細取得
app.get('/api/posts/:slug', async (c) => {
  const slug = c.req.param('slug')

  try {
    const post = await c.env.DB.prepare(
      `SELECT p.*, u.display_name as author_name 
       FROM posts p 
       JOIN users u ON p.author_id = u.id 
       WHERE p.slug = ? AND p.status = 'published'`
    ).bind(slug).first()

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    return c.json({ post })
  } catch (e) {
    return c.json({ error: 'Failed to fetch post' }, 500)
  }
})

// ==================== 管理者用API ====================

// 全記事一覧（下書き含む）
app.get('/api/admin/posts', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT id, slug, title, excerpt, category, tags, status, featured, published_at, created_at, updated_at 
       FROM posts 
       ORDER BY updated_at DESC`
    ).all()

    return c.json({ posts: results })
  } catch (e) {
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// 記事詳細取得（編集用）
app.get('/api/admin/posts/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(id).first()

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    return c.json({ post })
  } catch (e) {
    return c.json({ error: 'Failed to fetch post' }, 500)
  }
})

// 記事作成
app.post('/api/admin/posts', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  try {
    const { title, slug, content, excerpt, category, tags, status, featured } = await c.req.json()

    if (!title || !slug || !content) {
      return c.json({ error: 'Title, slug, and content are required' }, 400)
    }

    const publishedAt = status === 'published' ? new Date().toISOString() : null

    const result = await c.env.DB.prepare(
      `INSERT INTO posts (slug, title, content, excerpt, category, tags, status, featured, author_id, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(slug, title, content, excerpt || '', category || 'テック考察', tags || '', status || 'draft', featured ? 1 : 0, user.id, publishedAt).run()

    return c.json({ 
      success: true, 
      id: result.meta.last_row_id,
      message: 'Post created successfully'
    })
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Slug already exists' }, 400)
    }
    console.error('Create post error:', e)
    return c.json({ error: 'Failed to create post' }, 500)
  }
})

// 記事更新
app.put('/api/admin/posts/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const { title, slug, content, excerpt, category, tags, status, featured } = await c.req.json()

    // 現在の記事を取得
    const existingPost = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(id).first()

    if (!existingPost) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // 公開日時の設定
    let publishedAt = existingPost.published_at
    if (status === 'published' && !existingPost.published_at) {
      publishedAt = new Date().toISOString()
    }

    await c.env.DB.prepare(
      `UPDATE posts SET 
        title = ?, slug = ?, content = ?, excerpt = ?, 
        category = ?, tags = ?, status = ?, featured = ?,
        published_at = ?, updated_at = datetime('now')
       WHERE id = ?`
    ).bind(
      title, slug, content, excerpt || '', 
      category || 'テック考察', tags || '', status || 'draft', featured ? 1 : 0,
      publishedAt, id
    ).run()

    return c.json({ success: true, message: 'Post updated successfully' })
  } catch (e: any) {
    if (e.message?.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'Slug already exists' }, 400)
    }
    return c.json({ error: 'Failed to update post' }, 500)
  }
})

// 記事削除
app.delete('/api/admin/posts/:id', async (c) => {
  const id = c.req.param('id')

  try {
    await c.env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run()
    return c.json({ success: true, message: 'Post deleted successfully' })
  } catch (e) {
    return c.json({ error: 'Failed to delete post' }, 500)
  }
})

// 統計情報
app.get('/api/admin/stats', async (c) => {
  try {
    const published = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM posts WHERE status = 'published'"
    ).first()
    
    const drafts = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM posts WHERE status = 'draft'"
    ).first()

    return c.json({
      published: published?.count || 0,
      drafts: drafts?.count || 0
    })
  } catch (e) {
    return c.json({ error: 'Failed to fetch stats' }, 500)
  }
})

// ==================== SEO ====================

// robots.txt
app.get('/robots.txt', (c) => {
  return c.text(`# robots.txt for kai-blog.pages.dev

User-agent: *
Allow: /

# Sitemap location
Sitemap: https://kai-blog.pages.dev/sitemap.xml

# Disallow admin pages
Disallow: /admin/
Disallow: /api/
`)
})

// sitemap.xml - 動的に生成
app.get('/sitemap.xml', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT slug, published_at FROM posts WHERE status = 'published' ORDER BY published_at DESC`
    ).all()

    const today = new Date().toISOString().split('T')[0]
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kai-blog.pages.dev/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://kai-blog.pages.dev/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`

    for (const post of results as any[]) {
      const date = post.published_at ? post.published_at.split(' ')[0] : today
      sitemap += `
  <url>
    <loc>https://kai-blog.pages.dev/blog/${post.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    }

    sitemap += '\n</urlset>'

    return c.text(sitemap, 200, { 'Content-Type': 'application/xml' })
  } catch (e) {
    return c.text('Error generating sitemap', 500)
  }
})

// ==================== フロントエンド ====================

// 静的ファイル用のHTMLを返す（SPAルーティング対応）
app.get('*', async (c) => {
  const path = c.req.path
  
  // APIパスは除外
  if (path.startsWith('/api/')) {
    return c.json({ error: 'Not found' }, 404)
  }

  // メインHTML
  return c.html(getMainHTML())
})

function getMainHTML() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>乗杉 海 | Technology Journalist - AI・XR・半導体・宇宙技術の最新動向</title>
    
    <!-- Google Search Console Verification -->
    <meta name="google-site-verification" content="zQ_HPYVo9xsu-Oex1feWPnXKIqtoUF9P9UxNX4Xqq48" />
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="乗杉海（Kai Norisugi）のポートフォリオ＆テックブログ。innovaTopiaで活動するテクノロジージャーナリストとして、AI、XR/VR/AR、半導体、宇宙技術など先端分野の最新動向を発信。">
    <meta name="keywords" content="乗杉海,Kai Norisugi,テクノロジージャーナリスト,AI,XR,VR,AR,半導体,宇宙技術,メタバース,innovaTopia,テックライター">
    <meta name="author" content="乗杉 海 (Kai Norisugi)">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://kai-blog.pages.dev/">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://kai-blog.pages.dev/">
    <meta property="og:title" content="乗杉 海 | Technology Journalist">
    <meta property="og:description" content="AI、XR、半導体、宇宙技術など先端分野の最新動向を発信するテクノロジージャーナリストのポートフォリオ＆ブログ">
    <meta property="og:image" content="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80">
    <meta property="og:site_name" content="乗杉 海 Portfolio & Blog">
    <meta property="og:locale" content="ja_JP">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@Kai_tech_XR">
    <meta name="twitter:creator" content="@Kai_tech_XR">
    <meta name="twitter:title" content="乗杉 海 | Technology Journalist">
    <meta name="twitter:description" content="AI、XR、半導体、宇宙技術など先端分野の最新動向を発信するテクノロジージャーナリストのポートフォリオ＆ブログ">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80">
    
    <!-- Structured Data / JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "乗杉 海",
      "alternateName": "Kai Norisugi",
      "url": "https://kai-blog.pages.dev/",
      "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      "jobTitle": "Technology Journalist",
      "worksFor": {
        "@type": "Organization",
        "name": "innovaTopia"
      },
      "sameAs": [
        "https://x.com/Kai_tech_XR",
        "https://innovatopia.jp/author/kai/"
      ],
      "knowsAbout": ["AI", "XR", "VR", "AR", "半導体", "宇宙技術", "メタバース", "ロボティクス"]
    }
    </script>
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+JP:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/static/styles.css">
    <style>
        :root {
            --bg-dark: #0a0a0f;
            --bg-card: #12121a;
            --text-primary: #ffffff;
            --text-secondary: #8a8a9a;
            --accent: #00d4ff;
            --accent-dim: rgba(0, 212, 255, 0.15);
            --border: rgba(255, 255, 255, 0.08);
            --gradient-cyber: linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%);
            --error: #ff4757;
            --success: #2ed573;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', 'Noto Sans JP', sans-serif;
            background-color: var(--bg-dark);
            color: var(--text-primary);
            line-height: 1.7;
        }
        .cyber-grid {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: 
                linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
            background-size: 60px 60px;
            pointer-events: none;
            z-index: 0;
        }
        #app { position: relative; z-index: 1; min-height: 100vh; }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-size: 1rem;
            color: var(--text-secondary);
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="cyber-grid"></div>
    <div id="app">
        <div class="loading">
            <div class="spinner"></div>
        </div>
    </div>
    <script type="module" src="/static/app.js"></script>
</body>
</html>`
}

export default app
