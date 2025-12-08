// ==================== Integrated Portfolio & Blog SPA ====================

const API_BASE = '/api';
let currentUser = null;
let currentPath = window.location.pathname;

// ==================== Router ====================

const routes = {
  '/': renderPortfolio,
  '/blog': renderBlogList,
  '/blog/:slug': renderPostDetail,
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
  
  // Admin auth check
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
  
  // Re-init animations after page render
  setTimeout(initAnimations, 100);
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

// ==================== Common Components ====================

function renderNav(activePage = '') {
  return `
    <nav>
      <a href="/" onclick="event.preventDefault(); navigate('/')" class="logo">乗杉<span>_</span>海</a>
      <ul class="nav-links">
        <li><a href="/#about" class="${activePage === 'home' ? 'active' : ''}">About</a></li>
        <li><a href="/#expertise">Expertise</a></li>
        <li><a href="/#works">Works</a></li>
        <li><a href="/blog" onclick="event.preventDefault(); navigate('/blog')" class="${activePage === 'blog' ? 'active' : ''}">Blog</a></li>
        <li><a href="/#contact">Contact</a></li>
      </ul>
      <button class="hamburger" aria-label="メニュー">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
    <div class="mobile-menu">
      <a href="/" onclick="event.preventDefault(); navigate('/'); closeMobileMenu()">Home</a>
      <a href="/#about">About</a>
      <a href="/#expertise">Expertise</a>
      <a href="/#works">Works</a>
      <a href="/blog" onclick="event.preventDefault(); navigate('/blog'); closeMobileMenu()">Blog</a>
      <a href="/#contact">Contact</a>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer>
      <p>&copy; 2025 乗杉 海</p>
      <a href="https://innovatopia.jp/" target="_blank">innovaTopia</a>
    </footer>
  `;
}

function renderBackground() {
  return `
    <canvas id="cyber-canvas"></canvas>
    <div class="cyber-grid"></div>
    <div class="cyber-glow glow-1"></div>
    <div class="cyber-glow glow-2"></div>
  `;
}

// ==================== Portfolio Page ====================

function renderPortfolio() {
  app().innerHTML = `
    ${renderBackground()}
    ${renderNav('home')}

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge fade-in">Technology Journalist @ innovaTopia</div>
        <h1 class="hero-title fade-in delay-1">乗杉 海</h1>
        <p class="hero-subtitle fade-in delay-1">Kai Norisugi</p>
        <p class="hero-description fade-in delay-2">
          SF小説やゲームカルチャーをきっかけに、エンターテインメントとテクノロジーが交わる領域を探究。AI、XR、半導体、宇宙技術など先端分野の最新動向を発信しています。
        </p>
        <div class="hero-links fade-in delay-3">
          <a href="https://innovatopia.jp/author/kai/" target="_blank" class="hero-link primary">記事を読む →</a>
          <a href="/blog" onclick="event.preventDefault(); navigate('/blog')" class="hero-link secondary">ブログ</a>
        </div>
      </div>
      <div class="hero-visual fade-in delay-2">
        <div class="hero-image-wrapper">
          <div class="hero-image-border"></div>
          <div class="hero-image-glow"></div>
          <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" alt="Cyber Technology" class="hero-image">
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section">
      <div class="section-header reveal">
        <p class="section-label">About</p>
        <h2 class="section-title">テクノロジーの未来を伝える</h2>
      </div>
      <div class="about-container reveal">
        <div class="about-image-wrapper">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" alt="Technology Circuit" class="about-image">
          <div class="about-image-overlay"></div>
        </div>
        <div class="about-content">
          <p class="about-text">
            innovaTopiaで活動するテクノロジーライターとして、AI、XR、半導体、宇宙技術など先端分野の最新動向を発信。Apple、Google、Meta、NVIDIAなど大手IT企業の動向から、スタートアップの革新的技術まで幅広くカバーしています。
          </p>
          <blockquote class="about-quote">
            "今起きている技術革新が、SF作品で描かれた未来とどう重なるのか。その視点から、複雑な技術を分かりやすく伝えることを心がけています。"
          </blockquote>
          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">Articles</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">8</div>
              <div class="stat-label">Tech Fields</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">2024</div>
              <div class="stat-label">Active</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section>
      <div class="section-header reveal">
        <p class="section-label">Skills</p>
        <h2 class="section-title">スキルスタック</h2>
      </div>
      <div class="skills-grid reveal">
        ${['Python', 'HTML', 'CSS', 'ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Stable Diffusion', 'Unity', 'Unreal Engine', 'Blender', 'Figma', 'Notion', 'WordPress', 'Google Analytics', 'SEO', 'SNS運用', '取材・インタビュー', '記事執筆', '編集', 'リサーチ', '英語文献読解', '英語スピーキング'].map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
    </section>

    <!-- Expertise Section -->
    <section id="expertise">
      <div class="section-header reveal">
        <p class="section-label">Expertise</p>
        <h2 class="section-title">専門分野</h2>
      </div>
      <div class="expertise-grid reveal">
        <div class="expertise-item">
          <div class="expertise-icon">🤖</div>
          <h3 class="expertise-title">AI / 人工知能</h3>
          <p class="expertise-desc">生成AI、LLM、AIエージェントの最新動向</p>
        </div>
        <div class="expertise-item">
          <div class="expertise-icon">🥽</div>
          <h3 class="expertise-title">XR / VR / AR</h3>
          <p class="expertise-desc">Vision Pro、Quest など空間コンピューティング</p>
        </div>
        <div class="expertise-item">
          <div class="expertise-icon">💎</div>
          <h3 class="expertise-title">半導体技術</h3>
          <p class="expertise-desc">Apple M、NVIDIA GPU などチップ開発</p>
        </div>
        <div class="expertise-item">
          <div class="expertise-icon">🚀</div>
          <h3 class="expertise-title">宇宙技術</h3>
          <p class="expertise-desc">惑星防衛、宇宙探査ミッションの最新科学</p>
        </div>
        <div class="expertise-item">
          <div class="expertise-icon">🎮</div>
          <h3 class="expertise-title">ゲーム / エンタメ</h3>
          <p class="expertise-desc">Unreal Engine、ゲームAI開発</p>
        </div>
        <div class="expertise-item">
          <div class="expertise-icon">🦾</div>
          <h3 class="expertise-title">ロボティクス</h3>
          <p class="expertise-desc">外骨格、産業用ロボット、自律システム</p>
        </div>
        <div class="expertise-item">
          <div class="expertise-icon">🔐</div>
          <h3 class="expertise-title">セキュリティ</h3>
          <p class="expertise-desc">ランサムウェア、フォレンジック技術</p>
        </div>
        <div class="expertise-item">
          <div class="expertise-icon">🏥</div>
          <h3 class="expertise-title">ヘルスケア</h3>
          <p class="expertise-desc">AIとメンタルヘルス、VR療法</p>
        </div>
      </div>
    </section>

    <!-- Works Section -->
    <section id="works" class="works-section">
      <div class="works-header reveal">
        <div class="section-header" style="margin-bottom: 0;">
          <p class="section-label">Works</p>
          <h2 class="section-title">注目の記事</h2>
        </div>
        <a href="https://innovatopia.jp/author/kai/" target="_blank" class="works-more">すべて見る →</a>
      </div>
      <div class="works-container reveal">
        <div class="works-image-wrapper">
          <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80" alt="AI Technology" class="works-image">
          <div class="works-image-overlay"></div>
          <div class="works-image-text">
            <h3>Latest Tech Coverage</h3>
            <p>AI、XR、半導体など最新テクノロジーを深掘り</p>
          </div>
        </div>
        <div class="works-grid">
          <a href="https://innovatopia.jp/vrar/vrar-news/73306/" target="_blank" class="work-item">
            <div class="work-meta">
              <span class="work-category">XR / 取材</span>
              <span class="work-date">2025.12.03</span>
            </div>
            <h3 class="work-title">XREAL、ARグラス単体で2D→3D変換を実現する「XREAL 1S」を発表</h3>
          </a>
          <a href="https://innovatopia.jp/vrar/vrar-news/72052/" target="_blank" class="work-item">
            <div class="work-meta">
              <span class="work-category">AI × XR</span>
              <span class="work-date">2025.11.21</span>
            </div>
            <h3 class="work-title">カラダが消える日——AIとXRが解体する「現実」の定義</h3>
          </a>
          <a href="https://innovatopia.jp/spacetechnology/spacetechnology-news/72875/" target="_blank" class="work-item">
            <div class="work-meta">
              <span class="work-category">宇宙技術</span>
              <span class="work-date">2025.11.27</span>
            </div>
            <h3 class="work-title">ハーバード大ローブ博士はなぜ、3I/ATLASを『母船』と呼び続けるのか</h3>
          </a>
          <a href="https://innovatopia.jp/ai/ai-news/71738/" target="_blank" class="work-item">
            <div class="work-meta">
              <span class="work-category">AI</span>
              <span class="work-date">2025.11.14</span>
            </div>
            <h3 class="work-title">Google DeepMind「SIMA 2」、Geminiを活用した仮想世界AIエージェント</h3>
          </a>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
      <div class="section-header reveal">
        <p class="section-label">Contact</p>
        <h2 class="section-title">お問い合わせ</h2>
      </div>
      <div class="contact-grid reveal">
        <div>
          <p class="contact-text">
            取材依頼、コラボレーション、その他のお問い合わせはお気軽にどうぞ。テクノロジーの未来について、一緒に探究しましょう。
          </p>
        </div>
        <div class="contact-links">
          <a href="https://x.com/Kai_tech_XR" target="_blank" class="contact-link">
            <span>X</span>
            @Kai_tech_XR
          </a>
          <a href="https://innovatopia.jp/author/kai/" target="_blank" class="contact-link">
            <span>Web</span>
            innovaTopia 著者ページ
          </a>
        </div>
      </div>
    </section>

    ${renderFooter()}
  `;
  
  initParticles();
  initMobileMenu();
}

// ==================== Blog List ====================

async function renderBlogList() {
  app().innerHTML = `
    ${renderBackground()}
    ${renderNav('blog')}
    <main class="blog-main">
      <div class="loading"><div class="spinner"></div></div>
    </main>
    ${renderFooter()}
  `;
  
  initParticles();
  initMobileMenu();
  
  try {
    const res = await api('/posts');
    const { posts } = await res.json();
    
    const featuredPost = posts.find(p => p.featured);
    const regularPosts = posts.filter(p => !p.featured);

    document.querySelector('.blog-main').innerHTML = `
      <header class="blog-header">
        <p class="section-label">BLOG</p>
        <h1 class="section-title" style="font-size: 2rem;">ブログ / 日記</h1>
        <p class="blog-desc">テクノロジーに関する考察、日々の気づき、取材の裏話などを綴っています。</p>
      </header>

      ${featuredPost ? `
        <div class="featured">
          <a href="/blog/${featuredPost.slug}" class="post-card featured-card" onclick="event.preventDefault(); navigate('/blog/${featuredPost.slug}')">
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
          <a href="/blog/${post.slug}" class="post-card" onclick="event.preventDefault(); navigate('/blog/${post.slug}')">
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
    `;
  } catch (e) {
    document.querySelector('.blog-main').innerHTML = `<div class="error">記事の読み込みに失敗しました</div>`;
  }
}

// ==================== Post Detail ====================

async function renderPostDetail({ slug }) {
  app().innerHTML = `
    ${renderBackground()}
    ${renderNav('blog')}
    <main class="blog-main">
      <div class="loading"><div class="spinner"></div></div>
    </main>
    ${renderFooter()}
  `;
  
  initParticles();
  initMobileMenu();
  
  try {
    const res = await api(`/posts/${slug}`);
    if (!res.ok) {
      render404();
      return;
    }
    
    const { post } = await res.json();
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(post.title);
    
    document.querySelector('.blog-main').innerHTML = `
      <article class="article">
        <header class="article-header">
          <a href="/blog" onclick="event.preventDefault(); navigate('/blog')" class="back-link">← ブログ一覧に戻る</a>
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
              <a href="https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}" target="_blank" class="share-btn twitter">X</a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" class="share-btn facebook">Facebook</a>
              <a href="https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}" target="_blank" class="share-btn linkedin">LinkedIn</a>
              <a href="https://social-plugins.line.me/lineit/share?url=${pageUrl}" target="_blank" class="share-btn line">LINE</a>
              <button onclick="navigator.clipboard.writeText(window.location.href); showToast('URLをコピーしました')" class="share-btn copy">URLコピー</button>
            </div>
          </div>
        </footer>
      </article>
    `;
  } catch (e) {
    render404();
  }
}

// ==================== Admin Pages ====================

function redirectToLogin() {
  navigate('/admin/login', true);
}

async function renderLogin() {
  const auth = await checkAuth();
  if (auth.authenticated) {
    navigate('/admin/dashboard', true);
    return;
  }

  app().innerHTML = `
    ${renderBackground()}
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
        
        <a href="/" onclick="event.preventDefault(); navigate('/')" class="back-link">← トップに戻る</a>
      </div>
    </div>
  `;

  initParticles();

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

async function renderDashboard() {
  app().innerHTML = `
    ${renderBackground()}
    <nav class="admin-nav">
      <div class="nav-left">
        <a href="/" onclick="event.preventDefault(); navigate('/')" class="logo">乗杉<span>_</span>海</a>
        <span class="admin-badge">ADMIN</span>
      </div>
      <div class="nav-right">
        <span class="user-info">👤 ${currentUser?.display_name || 'Admin'}</span>
        <button onclick="logout()" class="btn-logout">ログアウト</button>
      </div>
    </nav>
    <main class="admin-main">
      <div class="loading"><div class="spinner"></div></div>
    </main>
  `;

  initParticles();

  try {
    const [statsRes, postsRes] = await Promise.all([
      api('/admin/stats'),
      api('/admin/posts'),
    ]);

    const stats = await statsRes.json();
    const { posts } = await postsRes.json();

    document.querySelector('.admin-main').innerHTML = `
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
        <a href="/blog" onclick="event.preventDefault(); navigate('/blog')" class="btn-secondary">ブログを表示</a>
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
                <button onclick="window.open('/blog/${post.slug}', '_blank')" class="btn-icon" title="表示">👁️</button>
                <button onclick="deletePost(${post.id}, '${post.title.replace(/'/g, "\\'")}')" class="btn-icon delete" title="削除">🗑️</button>
              </div>
            </div>
          `).join('')}
          ${posts.length === 0 ? '<p class="empty">まだ記事がありません</p>' : ''}
        </div>
      </section>
    `;
  } catch (e) {
    document.querySelector('.admin-main').innerHTML = `<div class="error">データの読み込みに失敗しました</div>`;
  }
}

async function renderPostEditor({ id }) {
  app().innerHTML = `
    ${renderBackground()}
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
      <div class="loading"><div class="spinner"></div></div>
    </main>
  `;

  initParticles();

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

  document.querySelector('.editor-main').innerHTML = `
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
  `;

  // Auto-generate slug
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

function render404() {
  app().innerHTML = `
    ${renderBackground()}
    ${renderNav()}
    <div class="page-404">
      <h1>404</h1>
      <p>ページが見つかりません</p>
      <a href="/" onclick="event.preventDefault(); navigate('/')">← トップに戻る</a>
    </div>
    ${renderFooter()}
  `;
  initParticles();
  initMobileMenu();
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

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// ==================== Helpers ====================

function app() {
  return document.getElementById('app');
}

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
  return text
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)\n(?!<li>)/g, '<ul>$1</ul>\n')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
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

// ==================== Animations ====================

function initAnimations() {
  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < window.innerHeight - 80) {
        element.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();
}

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}

function closeMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger) hamburger.classList.remove('active');
  if (mobileMenu) mobileMenu.classList.remove('active');
}

// ==================== Cyber Particles ====================

function initParticles() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.7 ? '#7b2cbf' : '#00d4ff';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 150) {
        const force = (150 - distance) / 150;
        this.x -= dx * force * 0.02;
        this.y -= dy * force * 0.02;
      }

      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Clear existing particles
  particles = [];
  const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (120 - distance) / 120 * 0.15;
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  // Cancel previous animation if exists
  if (window.particleAnimationId) {
    cancelAnimationFrame(window.particleAnimationId);
  }
  window.particleAnimationId = animationId;
  
  animate();
}

// ==================== Global Functions ====================

window.navigate = navigate;
window.logout = logout;
window.deletePost = deletePost;
window.showToast = showToast;
window.closeMobileMenu = closeMobileMenu;

// ==================== Initialize ====================

window.addEventListener('popstate', router);
router();
