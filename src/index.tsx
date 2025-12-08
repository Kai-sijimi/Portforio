import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>乗杉 海 | Technology Journalist</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Noto+Sans+JP:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --base: #FFFFFF;
            --text: #1A1A1A;
            --accent: #6B7280;
            --border: #E5E7EB;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', 'Noto Sans JP', sans-serif;
            background-color: var(--base);
            color: var(--text);
            line-height: 1.7;
            font-weight: 300;
        }

        /* ========== Animations ========== */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            opacity: 0;
            animation: fadeIn 0.6s ease-out forwards;
        }

        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.3s; }

        /* ========== Navigation ========== */
        nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 1rem 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--border);
        }

        .logo {
            font-size: 0.9rem;
            font-weight: 400;
            color: var(--text);
            text-decoration: none;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }

        .nav-links a {
            color: var(--accent);
            text-decoration: none;
            font-size: 0.8rem;
            transition: color 0.2s ease;
        }

        .nav-links a:hover {
            color: var(--text);
        }

        /* ========== Hamburger Menu ========== */
        .hamburger {
            display: none;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            background: none;
            border: none;
            padding: 0;
        }

        .hamburger span {
            display: block;
            width: 100%;
            height: 1.5px;
            background: var(--text);
            transition: all 0.3s ease;
        }

        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Mobile Menu */
        .mobile-menu {
            display: none;
            position: fixed;
            top: 53px;
            left: 0;
            right: 0;
            background: var(--base);
            border-bottom: 1px solid var(--border);
            padding: 1.5rem;
            z-index: 99;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .mobile-menu.active {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        .mobile-menu a {
            display: block;
            padding: 0.75rem 0;
            color: var(--text);
            text-decoration: none;
            font-size: 0.9rem;
            border-bottom: 1px solid var(--border);
            transition: color 0.2s ease;
        }

        .mobile-menu a:last-child {
            border-bottom: none;
        }

        .mobile-menu a:hover {
            color: var(--accent);
        }

        /* ========== Hero Section ========== */
        .hero {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: auto;
            margin-top: 60px;
        }

        .hero-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 4rem 3rem;
        }

        .hero-label {
            font-size: 0.7rem;
            font-weight: 400;
            letter-spacing: 0.15em;
            color: var(--accent);
            margin-bottom: 1rem;
            text-transform: uppercase;
        }

        .hero-title {
            font-size: 2rem;
            font-weight: 400;
            letter-spacing: -0.01em;
            line-height: 1.3;
            margin-bottom: 0.25rem;
        }

        .hero-subtitle {
            font-size: 0.9rem;
            font-weight: 300;
            color: var(--accent);
            margin-bottom: 1.5rem;
        }

        .hero-description {
            font-size: 0.9rem;
            color: var(--accent);
            line-height: 1.9;
            margin-bottom: 2rem;
            max-width: 400px;
        }

        .hero-links {
            display: flex;
            gap: 1.5rem;
        }

        .hero-link {
            font-size: 0.8rem;
            color: var(--text);
            text-decoration: none;
            padding-bottom: 2px;
            border-bottom: 1px solid var(--text);
            transition: all 0.2s ease;
        }

        .hero-link:hover {
            color: var(--accent);
            border-color: var(--accent);
        }

        .hero-image {
            background-image: url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80');
            background-size: cover;
            background-position: center;
            filter: grayscale(20%);
            min-height: 400px;
        }

        /* ========== Section Styles ========== */
        section {
            padding: 5rem 3rem;
        }

        .section-label {
            font-size: 0.65rem;
            font-weight: 400;
            letter-spacing: 0.15em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 0.5rem;
        }

        .section-title {
            font-size: 1.25rem;
            font-weight: 400;
            margin-bottom: 2rem;
        }

        /* ========== About Section ========== */
        .about-section {
            background: #FAFAFA;
        }

        .about-wrapper {
            max-width: 800px;
        }

        .about-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
        }

        .about-text {
            font-size: 0.9rem;
            color: var(--accent);
            line-height: 1.9;
        }

        .about-quote {
            padding-left: 1.5rem;
            border-left: 2px solid var(--border);
            font-size: 0.9rem;
            color: var(--text);
            line-height: 1.8;
        }

        .about-stats {
            display: flex;
            gap: 3rem;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
        }

        .stat-number {
            font-size: 1.25rem;
            font-weight: 400;
            margin-bottom: 0.25rem;
        }

        .stat-label {
            font-size: 0.65rem;
            color: var(--accent);
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        /* ========== Expertise Section ========== */
        .expertise-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1px;
            background: var(--border);
            max-width: 1000px;
        }

        .expertise-item {
            background: var(--base);
            padding: 1.5rem;
        }

        .expertise-title {
            font-size: 0.85rem;
            font-weight: 400;
            margin-bottom: 0.5rem;
        }

        .expertise-desc {
            font-size: 0.75rem;
            color: var(--accent);
            line-height: 1.7;
        }

        /* ========== Works Section ========== */
        .works-section {
            background: #FAFAFA;
        }

        .works-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 1.5rem;
        }

        .works-header .section-title {
            margin-bottom: 0;
        }

        .works-more {
            font-size: 0.75rem;
            color: var(--accent);
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .works-more:hover {
            color: var(--text);
        }

        .works-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1px;
            background: var(--border);
            max-width: 900px;
        }

        .work-item {
            background: #FAFAFA;
            padding: 1.5rem;
            text-decoration: none;
            color: inherit;
            transition: background 0.2s ease;
        }

        .work-item:hover {
            background: var(--base);
        }

        .work-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }

        .work-category {
            font-size: 0.65rem;
            color: var(--accent);
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .work-date {
            font-size: 0.65rem;
            color: var(--accent);
        }

        .work-title {
            font-size: 0.85rem;
            font-weight: 400;
            line-height: 1.6;
        }

        /* ========== Contact Section ========== */
        .contact-wrapper {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            max-width: 800px;
        }

        .contact-text {
            font-size: 0.9rem;
            color: var(--accent);
            line-height: 1.8;
        }

        .contact-links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .contact-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            font-size: 0.85rem;
            color: var(--text);
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .contact-link:hover {
            color: var(--accent);
        }

        .contact-link span {
            font-size: 0.65rem;
            color: var(--accent);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            width: 2.5rem;
        }

        /* ========== Footer ========== */
        footer {
            padding: 1.5rem 3rem;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        footer p, footer a {
            font-size: 0.7rem;
            color: var(--accent);
        }

        footer a {
            text-decoration: none;
            transition: color 0.2s ease;
        }

        footer a:hover {
            color: var(--text);
        }

        /* ========== Responsive ========== */
        @media (max-width: 900px) {
            nav {
                padding: 1rem 1.5rem;
            }

            .nav-links {
                display: none;
            }

            .hamburger {
                display: flex;
            }

            .mobile-menu {
                display: block;
            }

            .hero {
                grid-template-columns: 1fr;
            }

            .hero-content {
                padding: 3rem 1.5rem;
            }

            .hero-image {
                min-height: 200px;
            }

            section {
                padding: 3rem 1.5rem;
            }

            .about-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            .about-stats {
                gap: 2rem;
            }

            .expertise-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .works-grid {
                grid-template-columns: 1fr;
            }

            .contact-wrapper {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            footer {
                padding: 1.5rem;
                flex-direction: column;
                gap: 0.5rem;
            }
        }

        @media (max-width: 600px) {
            .expertise-grid {
                grid-template-columns: 1fr;
            }

            .about-stats {
                flex-wrap: wrap;
            }
        }

        /* ========== Scroll Animation ========== */
        .reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease;
        }

        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <a href="#" class="logo">乗杉 海</a>
        <ul class="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#expertise">Expertise</a></li>
            <li><a href="#works">Works</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <button class="hamburger" aria-label="メニュー">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>

    <!-- Mobile Menu -->
    <div class="mobile-menu">
        <a href="#about">About</a>
        <a href="#expertise">Expertise</a>
        <a href="#works">Works</a>
        <a href="#contact">Contact</a>
    </div>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <p class="hero-label fade-in">Technology Journalist @ innovaTopia</p>
            <h1 class="hero-title fade-in delay-1">乗杉 海</h1>
            <p class="hero-subtitle fade-in delay-1">Kai Norisugi</p>
            <p class="hero-description fade-in delay-2">
                SF小説やゲームカルチャーをきっかけに、エンターテインメントとテクノロジーが交わる領域を探究。AI、XR、半導体、宇宙技術など先端分野の最新動向を発信しています。
            </p>
            <div class="hero-links fade-in delay-2">
                <a href="https://innovatopia.jp/author/kai/" target="_blank" class="hero-link">記事を読む</a>
                <a href="https://x.com/Kai_tech_XR" target="_blank" class="hero-link">X / Twitter</a>
            </div>
        </div>
        <div class="hero-image"></div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section">
        <div class="about-wrapper reveal">
            <p class="section-label">About</p>
            <h2 class="section-title">テクノロジーの未来を伝える</h2>
            <div class="about-grid">
                <div>
                    <p class="about-text">
                        innovaTopiaで活動するテクノロジーライターとして、AI、XR、半導体、宇宙技術など先端分野の最新動向を発信。Apple、Google、Meta、NVIDIAなど大手IT企業の動向から、スタートアップの革新的技術まで幅広くカバーしています。
                    </p>
                </div>
                <div>
                    <blockquote class="about-quote">
                        今起きている技術革新が、SF作品で描かれた未来とどう重なるのか。その視点から、複雑な技術を分かりやすく伝えることを心がけています。
                    </blockquote>
                </div>
            </div>
            <div class="about-stats">
                <div>
                    <div class="stat-number">500+</div>
                    <div class="stat-label">Articles</div>
                </div>
                <div>
                    <div class="stat-number">8</div>
                    <div class="stat-label">Tech Fields</div>
                </div>
                <div>
                    <div class="stat-number">2024</div>
                    <div class="stat-label">Active</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Expertise Section -->
    <section id="expertise">
        <p class="section-label reveal">Expertise</p>
        <h2 class="section-title reveal">専門分野</h2>
        <div class="expertise-grid reveal">
            <div class="expertise-item">
                <h3 class="expertise-title">AI / 人工知能</h3>
                <p class="expertise-desc">生成AI、LLM、AIエージェントの最新動向</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">XR / VR / AR</h3>
                <p class="expertise-desc">Vision Pro、Quest など空間コンピューティング</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">半導体技術</h3>
                <p class="expertise-desc">Apple M、NVIDIA GPU などチップ開発</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">宇宙技術</h3>
                <p class="expertise-desc">惑星防衛、宇宙探査ミッションの最新科学</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">ゲーム / エンタメ</h3>
                <p class="expertise-desc">Unreal Engine、ゲームAI開発</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">ロボティクス</h3>
                <p class="expertise-desc">外骨格、産業用ロボット、自律システム</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">セキュリティ</h3>
                <p class="expertise-desc">ランサムウェア、フォレンジック技術</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">ヘルスケア</h3>
                <p class="expertise-desc">AIとメンタルヘルス、VR療法</p>
            </div>
        </div>
    </section>

    <!-- Works Section -->
    <section id="works" class="works-section">
        <div class="works-header reveal">
            <div>
                <p class="section-label">Works</p>
                <h2 class="section-title">注目の記事</h2>
            </div>
            <a href="https://innovatopia.jp/author/kai/" target="_blank" class="works-more">すべて見る →</a>
        </div>
        <div class="works-grid reveal">
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
            <a href="https://innovatopia.jp/vrar/vrar-news/68902/" target="_blank" class="work-item">
                <div class="work-meta">
                    <span class="work-category">XR / 分析</span>
                    <span class="work-date">2025.10.17</span>
                </div>
                <h3 class="work-title">Apple Vision Pro、空間コンピューティングは６畳で成立するか？</h3>
            </a>
            <a href="https://innovatopia.jp/ai/ai-news/71098/" target="_blank" class="work-item">
                <div class="work-meta">
                    <span class="work-category">ゲーム AI</span>
                    <span class="work-date">2025.11.07</span>
                </div>
                <h3 class="work-title">Cygamesと東京藝術大学、ゲームAI開発ツール共同研究を開始</h3>
            </a>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact">
        <div class="contact-wrapper reveal">
            <div>
                <p class="section-label">Contact</p>
                <h2 class="section-title">お問い合わせ</h2>
                <p class="contact-text">
                    取材依頼、コラボレーション、その他のお問い合わせはお気軽にどうぞ。
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

    <!-- Footer -->
    <footer>
        <p>© 2025 乗杉 海</p>
        <a href="https://innovatopia.jp/" target="_blank">innovaTopia</a>
    </footer>

    <script>
        // Scroll reveal
        const revealElements = document.querySelectorAll('.reveal');

        const revealOnScroll = () => {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                if (elementTop < window.innerHeight - 60) {
                    element.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        window.addEventListener('load', revealOnScroll);

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                // Close mobile menu when link clicked
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const mobileMenu = document.querySelector('.mobile-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    </script>
</body>
</html>
  `)
})

export default app
