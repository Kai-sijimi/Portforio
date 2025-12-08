// ==================== Blog SPA Application ====================

const API_BASE = '/api';
let currentUser = null;
let currentPath = window.location.pathname;

// ==================== Router ====================

const routes = {
  '/': renderBlogList,
  '/post/:slug': renderPostDetail,
  '/admin': redirectToLogin,
  '/admin/login': renderLogin,
  '/admin/dashboard': renderDashboard,
  '/admin/posts/new': renderPostEditor,
  '/admin/posts/:id/edit': renderPostEditor,
};

function matchRoute(path) {
  for (const [pattern, handler] of Object.entries(routes)) {
    const paramNames = [];
    const regexPattern = pattern.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    const regex = new RegExp(`^${regexPattern}$`);
    const match = path.match(regex);
    
    if (match) {
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { handler, params };
    }
  }
  return { handler: render404, params: {} };
}

function navigate(path, replace = false) {
  if (replace) {
    history.replaceState(null, '', path);
  } else {
    history.pushState(null, '', path);
  }
  currentPath = path;
  router();
}

async function router() {
  const path = window.location.pathname;
  currentPath = path;
  
  // 管理画面の認証チェック
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const auth = await checkAuth();
    if (!auth.authenticated) {
      navigate('/admin/login', true);
      return;
    }
    currentUser = auth.user;
  }

  const { handler, params } = matchRoute(path);
  await handler(params);
}

// ==================== API Helpers ====================

async function api(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });
  return response;
}

async function checkAuth() {
  try {
    const res = await api('/auth/me');
    return await res.json();
  } catch {
    return { authenticated: false };
  }
}

// ==================== Renderers ====================

function app() {
  return document.getElementById('app');
}

function renderLoading() {
  app().innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `;
}

function render404() {
  app().innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; padding: 2rem;">
      <h1 style="font-size: 4rem; background: var(--gradient-cyber); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">404</h1>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">ページが見つかりません</p>
      <a href="/" onclick="event.preventDefault(); navigate('/')" style="color: var(--accent); text-decoration: none;">← ホームに戻る</a>
    </div>
  `;
}

// ==================== Blog List ====================

async function renderBlogList() {
  renderLoading();
  
  try {
    const res = await api('/posts');
    const { posts } = await res.json();
    
    const featuredPost = posts.find(p => p.featured);
    const regularPosts = posts.filter(p => !p.featured);

    app().innerHTML = `
      <nav class="nav">
        <a href="/" class="logo">乗杉<span>_</span>海</a>
        <div class="nav-links">
          <a href="https://kai-sijimi.github.io/Portforio/" target="_blank">Portfolio</a>
          <a href="/admin/login" onclick="event.preventDefault(); navigate('/admin/login')">Admin</a>
        </div>
      </nav>
      
      <main class="blog-main">
        <header class="blog-header">
          <p class="label">BLOG</p>
          <h1>ブログ / 日記</h1>
          <p class="desc">テクノロジーに関する考察、日々の気づき、取材の裏話などを綴っています。</p>
        </header>

        ${featuredPost ? `
          <div class="featured">
            <a href="/post/${featuredPost.slug}" class="post-card featured-card" onclick="event.preventDefault(); navigate('/post/${featuredPost.slug}')">
              <span class="badge">★ Featured</span>
              <div class="meta">
                <span class="date">${formatDate(featuredPost.published_at)}</span>
                <span class="category">${featuredPost.category}</span>
              </div>
              <h2>${featuredPost.title}</h2>
              <p class="excerpt">${featuredPost.excerpt}</p>
              <div class="tags">${renderTags(featuredPost.tags)}</div>
            </a>
          </div>
        ` : ''}

        <div class="posts-list">
          ${regularPosts.map(post => `
            <a href="/post/${post.slug}" class="post-card" onclick="event.preventDefault(); navigate('/post/${post.slug}')">
              <div class="meta">
                <span class="date">${formatDate(post.published_at)}</span>
                <span class="category">${post.category}</span>
              </div>
              <h2>${post.title}</h2>
              <p class="excerpt">${post.excerpt}</p>
              <div class="tags">${renderTags(post.tags)}</div>
            </a>
          `).join('')}
        </div>

        ${posts.length === 0 ? `
          <div class="empty">
            <p>まだ記事がありません</p>
          </div>
        ` : ''}
      </main>

      <footer class="footer">
        <p>© 2025 乗杉 海</p>
      </footer>
    `;
  } catch (e) {
    app().innerHTML = `<div class="error">記事の読み込みに失敗しました</div>`;
  }
}

// ==================== Post Detail ====================

async function renderPostDetail({ slug }) {
  renderLoading();
  
  try {
    const res = await api(`/posts/${slug}`);
    if (!res.ok) {
      render404();
      return;
    }
    
    const { post } = await res.json();
    
    app().innerHTML = `
      <nav class="nav">
        <a href="/" onclick="event.preventDefault(); navigate('/')" class="logo">乗杉<span>_</span>海</a>
        <div class="nav-links">
          <a href="https://kai-sijimi.github.io/Portforio/" target="_blank">Portfolio</a>
        </div>
      </nav>
      
      <article class="article">
        <header class="article-header">
          <a href="/" onclick="event.preventDefault(); navigate('/')" class="back-link">← ブログ一覧に戻る</a>
          <div class="meta">
            <span class="date">${formatDate(post.published_at)}</span>
            <span class="category">${post.category}</span>
          </div>
          <h1>${post.title}</h1>
          ${post.excerpt ? `<p class="lead">${post.excerpt}</p>` : ''}
          <div class="tags">${renderTags(post.tags)}</div>
        </header>
        
        <div class="content">
          ${renderMarkdown(post.content)}
        </div>
        
        <footer class="article-footer">
          <div class="share">
            <p class="share-title">Share this article</p>
            <div class="share-buttons">
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn">X</a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-btn">Facebook</a>
              <button onclick="navigator.clipboard.writeText(window.location.href); alert('URLをコピーしました')" class="share-btn">URLコピー</button>
            </div>
          </div>
        </footer>
      </article>

      <footer class="footer">
        <p>© 2025 乗杉 海</p>
      </footer>
    `;
  } catch (e) {
    render404();
  }
}

// ==================== Admin Login ====================

function redirectToLogin() {
  navigate('/admin/login', true);
}

async function renderLogin() {
  // 既にログイン済みならダッシュボードへ
  const auth = await checkAuth();
  if (auth.authenticated) {
    navigate('/admin/dashboard', true);
    return;
  }

  app().innerHTML = `
    <div class="login-page">
      <div class="login-box">
        <div class="login-header">
          <div class="login-icon">👤</div>
          <h1>管理者ログイン</h1>
          <p>ブログ投稿・編集のためのログイン</p>
        </div>
        
        <div id="error-msg" class="error-msg"></div>
        
        <form id="login-form">
          <div class="form-group">
            <label>ユーザーID</label>
            <input type="text" id="username" placeholder="IDを入力" required>
          </div>
          <div class="form-group">
            <label>パスワード</label>
            <input type="password" id="password" placeholder="パスワードを入力" required>
          </div>
          <div class="remember">
            <input type="checkbox" id="remember">
            <label for="remember">ログイン状態を保持する</label>
          </div>
          <button type="submit" class="btn-primary" id="login-btn">ログイン</button>
        </form>
        
        <a href="/" onclick="event.preventDefault(); navigate('/')" class="back-link">← ブログに戻る</a>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    const errorMsg = document.getElementById('error-msg');
    
    btn.disabled = true;
    btn.textContent = 'ログイン中...';
    errorMsg.textContent = '';

    try {
      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: document.getElementById('username').value,
          password: document.getElementById('password').value,
          remember: document.getElementById('remember').checked,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        currentUser = data.user;
        navigate('/admin/dashboard');
      } else {
        errorMsg.textContent = data.error || 'ログインに失敗しました';
        btn.disabled = false;
        btn.textContent = 'ログイン';
      }
    } catch {
      errorMsg.textContent = 'エラーが発生しました';
      btn.disabled = false;
      btn.textContent = 'ログイン';
    }
  });
}

// ==================== Admin Dashboard ====================

async function renderDashboard() {
  renderLoading();

  try {
    const [statsRes, postsRes] = await Promise.all([
      api('/admin/stats'),
      api('/admin/posts'),
    ]);

    const stats = await statsRes.json();
    const { posts } = await postsRes.json();

    app().innerHTML = `
      <nav class="admin-nav">
        <div class="nav-left">
          <a href="/admin/dashboard" class="logo">乗杉<span>_</span>海</a>
          <span class="admin-badge">ADMIN</span>
        </div>
        <div class="nav-right">
          <span class="user-info">👤 ${currentUser?.display_name || 'Admin'}</span>
          <button onclick="logout()" class="btn-logout">ログアウト</button>
        </div>
      </nav>
      
      <main class="admin-main">
        <header class="page-header">
          <h1>ダッシュボード</h1>
          <p>ブログ記事の管理・投稿を行います</p>
        </header>

        <div class="stats-grid">
          <div class="stat-card">
            <p class="label">公開記事</p>
            <p class="value">${stats.published || 0}</p>
          </div>
          <div class="stat-card">
            <p class="label">下書き</p>
            <p class="value">${stats.drafts || 0}</p>
          </div>
        </div>

        <div class="actions">
          <a href="/admin/posts/new" onclick="event.preventDefault(); navigate('/admin/posts/new')" class="btn-primary">＋ 新規記事を作成</a>
          <a href="/" target="_blank" class="btn-secondary">ブログを表示</a>
        </div>

        <section class="posts-section">
          <h2>記事一覧</h2>
          <div class="admin-posts-list">
            ${posts.map(post => `
              <div class="admin-post-item">
                <div class="post-info">
                  <h3>${post.title}</h3>
                  <div class="meta">
                    <span>${formatDate(post.updated_at)}</span>
                    <span>${post.category}</span>
                    <span class="status ${post.status}">${post.status === 'published' ? '公開中' : '下書き'}</span>
                  </div>
                </div>
                <div class="post-actions">
                  <button onclick="navigate('/admin/posts/${post.id}/edit')" class="btn-icon" title="編集">✏️</button>
                  <button onclick="window.open('/post/${post.slug}', '_blank')" class="btn-icon" title="表示">👁️</button>
                  <button onclick="deletePost(${post.id}, '${post.title.replace(/'/g, "\\'")}')" class="btn-icon delete" title="削除">🗑️</button>
                </div>
              </div>
            `).join('')}
            ${posts.length === 0 ? '<p class="empty">まだ記事がありません</p>' : ''}
          </div>
        </section>
      </main>
    `;
  } catch (e) {
    app().innerHTML = `<div class="error">データの読み込みに失敗しました</div>`;
  }
}

// ==================== Post Editor ====================

async function renderPostEditor({ id }) {
  renderLoading();

  let post = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'テック考察',
    tags: '',
    status: 'draft',
    featured: false,
  };

  const isEdit = !!id;

  if (isEdit) {
    try {
      const res = await api(`/admin/posts/${id}`);
      if (!res.ok) {
        render404();
        return;
      }
      const data = await res.json();
      post = data.post;
    } catch {
      render404();
      return;
    }
  }

  app().innerHTML = `
    <nav class="admin-nav">
      <div class="nav-left">
        <a href="/admin/dashboard" onclick="event.preventDefault(); navigate('/admin/dashboard')" class="logo">乗杉<span>_</span>海</a>
        <span class="admin-badge">ADMIN</span>
      </div>
      <div class="nav-right">
        <button onclick="logout()" class="btn-logout">ログアウト</button>
      </div>
    </nav>
    
    <main class="editor-main">
      <header class="editor-header">
        <a href="/admin/dashboard" onclick="event.preventDefault(); navigate('/admin/dashboard')" class="back-link">← ダッシュボードに戻る</a>
        <h1>${isEdit ? '記事を編集' : '新規記事を作成'}</h1>
      </header>

      <div id="editor-msg" class="editor-msg"></div>

      <form id="post-form" class="editor-form">
        <div class="form-row">
          <div class="form-group flex-1">
            <label>タイトル *</label>
            <input type="text" id="title" value="${escapeHtml(post.title)}" placeholder="記事のタイトル" required>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group flex-1">
            <label>スラッグ (URL) *</label>
            <input type="text" id="slug" value="${escapeHtml(post.slug)}" placeholder="2025-12-08-article-title" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group flex-1">
            <label>抜粋</label>
            <textarea id="excerpt" rows="2" placeholder="記事の要約（一覧に表示されます）">${escapeHtml(post.excerpt || '')}</textarea>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>カテゴリ</label>
            <select id="category">
              <option value="テック考察" ${post.category === 'テック考察' ? 'selected' : ''}>テック考察</option>
              <option value="日記" ${post.category === '日記' ? 'selected' : ''}>日記</option>
              <option value="レビュー" ${post.category === 'レビュー' ? 'selected' : ''}>レビュー</option>
              <option value="お知らせ" ${post.category === 'お知らせ' ? 'selected' : ''}>お知らせ</option>
            </select>
          </div>
          <div class="form-group">
            <label>タグ（カンマ区切り）</label>
            <input type="text" id="tags" value="${escapeHtml(post.tags || '')}" placeholder="AI,XR,メタバース">
          </div>
        </div>

        <div class="form-group">
          <label>本文 * (Markdown対応)</label>
          <textarea id="content" rows="20" placeholder="記事の本文をMarkdownで入力..." required>${escapeHtml(post.content)}</textarea>
        </div>

        <div class="form-row options">
          <label class="checkbox">
            <input type="checkbox" id="featured" ${post.featured ? 'checked' : ''}>
            Featured記事にする
          </label>
          <div class="form-group">
            <label>ステータス</label>
            <select id="status">
              <option value="draft" ${post.status === 'draft' ? 'selected' : ''}>下書き</option>
              <option value="published" ${post.status === 'published' ? 'selected' : ''}>公開</option>
            </select>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" onclick="navigate('/admin/dashboard')" class="btn-secondary">キャンセル</button>
          <button type="submit" class="btn-primary" id="save-btn">${isEdit ? '更新する' : '作成する'}</button>
        </div>
      </form>
    </main>
  `;

  // Auto-generate slug from title
  document.getElementById('title').addEventListener('input', (e) => {
    const slugInput = document.getElementById('slug');
    if (!isEdit && !slugInput.value) {
      const date = new Date().toISOString().split('T')[0];
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      slugInput.value = `${date}-${slug}`;
    }
  });

  document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-btn');
    const msg = document.getElementById('editor-msg');
    
    btn.disabled = true;
    btn.textContent = '保存中...';
    msg.textContent = '';
    msg.className = 'editor-msg';

    const postData = {
      title: document.getElementById('title').value,
      slug: document.getElementById('slug').value,
      content: document.getElementById('content').value,
      excerpt: document.getElementById('excerpt').value,
      category: document.getElementById('category').value,
      tags: document.getElementById('tags').value,
      status: document.getElementById('status').value,
      featured: document.getElementById('featured').checked,
    };

    try {
      const res = await api(isEdit ? `/admin/posts/${id}` : '/admin/posts', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (res.ok) {
        msg.textContent = isEdit ? '記事を更新しました' : '記事を作成しました';
        msg.className = 'editor-msg success';
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      } else {
        msg.textContent = data.error || '保存に失敗しました';
        msg.className = 'editor-msg error';
        btn.disabled = false;
        btn.textContent = isEdit ? '更新する' : '作成する';
      }
    } catch {
      msg.textContent = 'エラーが発生しました';
      msg.className = 'editor-msg error';
      btn.disabled = false;
      btn.textContent = isEdit ? '更新する' : '作成する';
    }
  });
}

// ==================== Actions ====================

async function logout() {
  await api('/auth/logout', { method: 'POST' });
  currentUser = null;
  navigate('/admin/login');
}

async function deletePost(id, title) {
  if (!confirm(`「${title}」を削除しますか？この操作は取り消せません。`)) {
    return;
  }

  try {
    const res = await api(`/admin/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      renderDashboard();
    } else {
      alert('削除に失敗しました');
    }
  } catch {
    alert('エラーが発生しました');
  }
}

// ==================== Helpers ====================

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function renderTags(tags) {
  if (!tags) return '';
  return tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('');
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderMarkdown(text) {
  if (!text) return '';
  
  // Simple markdown rendering
  return text
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Lists
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)\n(?!<li>)/g, '<ul>$1</ul>\n')
    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-3]>)/g, '$1')
    .replace(/(<\/h[1-3]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>)/g, '$1')
    .replace(/(<\/ul>)<\/p>/g, '$1')
    .replace(/<p>(<blockquote>)/g, '$1')
    .replace(/(<\/blockquote>)<\/p>/g, '$1');
}

// Make functions available globally
window.navigate = navigate;
window.logout = logout;
window.deletePost = deletePost;

// ==================== Initialize ====================

window.addEventListener('popstate', router);
router();
