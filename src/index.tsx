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
            line-height: 1.8;
            font-weight: 300;
            letter-spacing: 0.02em;
        }

        /* ========== Minimal Animations ========== */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            opacity: 0;
            animation: fadeIn 0.8s ease-out forwards;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }

        /* ========== Navigation ========== */
        nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            padding: 2rem 4rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
        }

        .logo {
            font-size: 0.875rem;
            font-weight: 400;
            color: var(--text);
            text-decoration: none;
            letter-spacing: 0.1em;
        }

        .nav-links {
            display: flex;
            gap: 3rem;
            list-style: none;
        }

        .nav-links a {
            color: var(--accent);
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 400;
            letter-spacing: 0.05em;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--text);
        }

        /* ========== Hero Section ========== */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 0 4rem;
            position: relative;
        }

        .hero-image {
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 100%;
            background-image: url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80');
            background-size: cover;
            background-position: center;
            filter: grayscale(30%);
            opacity: 0.9;
        }

        .hero-content {
            max-width: 540px;
            z-index: 1;
            padding: 8rem 0;
        }

        .hero-label {
            font-size: 0.75rem;
            font-weight: 400;
            letter-spacing: 0.2em;
            color: var(--accent);
            margin-bottom: 2rem;
            text-transform: uppercase;
        }

        .hero-title {
            font-size: 2.5rem;
            font-weight: 300;
            letter-spacing: -0.02em;
            line-height: 1.3;
            margin-bottom: 0.5rem;
        }

        .hero-subtitle {
            font-size: 1rem;
            font-weight: 300;
            color: var(--accent);
            margin-bottom: 3rem;
        }

        .hero-description {
            font-size: 0.95rem;
            color: var(--accent);
            line-height: 2;
            margin-bottom: 3rem;
        }

        .hero-links {
            display: flex;
            gap: 2rem;
        }

        .hero-link {
            font-size: 0.8rem;
            color: var(--text);
            text-decoration: none;
            letter-spacing: 0.05em;
            padding-bottom: 0.25rem;
            border-bottom: 1px solid var(--text);
            transition: all 0.3s ease;
        }

        .hero-link:hover {
            color: var(--accent);
            border-color: var(--accent);
        }

        /* ========== Section Styles ========== */
        section {
            padding: 10rem 4rem;
        }

        .section-label {
            font-size: 0.7rem;
            font-weight: 400;
            letter-spacing: 0.2em;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 1rem;
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 300;
            letter-spacing: -0.01em;
            margin-bottom: 4rem;
        }

        /* ========== About Section ========== */
        .about {
            max-width: 720px;
        }

        .about-text {
            font-size: 1rem;
            color: var(--accent);
            line-height: 2.2;
            margin-bottom: 2rem;
        }

        .about-quote {
            padding-left: 2rem;
            border-left: 1px solid var(--border);
            font-size: 0.95rem;
            color: var(--text);
            line-height: 2;
            margin: 3rem 0;
        }

        .about-stats {
            display: flex;
            gap: 6rem;
            margin-top: 4rem;
            padding-top: 4rem;
            border-top: 1px solid var(--border);
        }

        .stat-item {
            text-align: left;
        }

        .stat-number {
            font-size: 1.5rem;
            font-weight: 300;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 0.7rem;
            color: var(--accent);
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        /* ========== Expertise Section ========== */
        .expertise {
            background: var(--base);
        }

        .expertise-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1px;
            background: var(--border);
            max-width: 900px;
        }

        .expertise-item {
            background: var(--base);
            padding: 3rem;
        }

        .expertise-title {
            font-size: 0.95rem;
            font-weight: 400;
            margin-bottom: 1rem;
        }

        .expertise-desc {
            font-size: 0.85rem;
            color: var(--accent);
            line-height: 1.8;
        }

        /* ========== Works Section ========== */
        .works-image {
            width: 100%;
            height: 400px;
            background-image: url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1600&q=80');
            background-size: cover;
            background-position: center;
            filter: grayscale(40%);
            margin-bottom: 6rem;
        }

        .works-list {
            max-width: 720px;
        }

        .work-item {
            padding: 2.5rem 0;
            border-bottom: 1px solid var(--border);
            display: block;
            text-decoration: none;
            color: inherit;
            transition: opacity 0.3s ease;
        }

        .work-item:first-child {
            border-top: 1px solid var(--border);
        }

        .work-item:hover {
            opacity: 0.6;
        }

        .work-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
        }

        .work-category {
            font-size: 0.7rem;
            color: var(--accent);
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        .work-date {
            font-size: 0.7rem;
            color: var(--accent);
        }

        .work-title {
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.6;
        }

        /* ========== Contact Section ========== */
        .contact {
            max-width: 540px;
            padding-bottom: 12rem;
        }

        .contact-text {
            font-size: 0.95rem;
            color: var(--accent);
            line-height: 2;
            margin-bottom: 3rem;
        }

        .contact-links {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .contact-link {
            font-size: 0.85rem;
            color: var(--text);
            text-decoration: none;
            letter-spacing: 0.02em;
            display: inline-flex;
            align-items: center;
            gap: 1rem;
            transition: color 0.3s ease;
        }

        .contact-link:hover {
            color: var(--accent);
        }

        .contact-link span {
            font-size: 0.7rem;
            color: var(--accent);
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        /* ========== Footer ========== */
        footer {
            padding: 3rem 4rem;
            border-top: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        footer p {
            font-size: 0.7rem;
            color: var(--accent);
            letter-spacing: 0.05em;
        }

        footer a {
            color: var(--accent);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        footer a:hover {
            color: var(--text);
        }

        /* ========== Responsive ========== */
        @media (max-width: 968px) {
            nav {
                padding: 1.5rem 2rem;
            }

            .nav-links {
                display: none;
            }

            section {
                padding: 6rem 2rem;
            }

            .hero {
                padding: 0 2rem;
            }

            .hero-image {
                width: 100%;
                opacity: 0.3;
            }

            .hero-content {
                padding: 10rem 0 6rem;
            }

            .about-stats {
                flex-direction: column;
                gap: 2rem;
            }

            .expertise-list {
                grid-template-columns: 1fr;
            }

            footer {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }
        }

        /* ========== Scroll Animations ========== */
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
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
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-image"></div>
        <div class="hero-content">
            <p class="hero-label fade-in">Technology Journalist</p>
            <h1 class="hero-title fade-in delay-1">乗杉 海</h1>
            <p class="hero-subtitle fade-in delay-1">Kai Norisugi</p>
            <p class="hero-description fade-in delay-2">
                SF小説やゲームカルチャーをきっかけに、<br>
                エンターテインメントとテクノロジーが<br>
                交わる領域を探究しています。
            </p>
            <div class="hero-links fade-in delay-3">
                <a href="https://innovatopia.jp/author/kai/" target="_blank" class="hero-link">記事を読む</a>
                <a href="https://x.com/Kai_tech_XR" target="_blank" class="hero-link">X / Twitter</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about">
        <div class="about reveal">
            <p class="section-label">About</p>
            <h2 class="section-title">テクノロジーの未来を伝える</h2>
            <p class="about-text">
                innovaTopiaで活動するテクノロジーライターとして、
                AI、XR、半導体、宇宙技術など先端分野の最新動向を発信しています。
            </p>
            <blockquote class="about-quote">
                今起きている技術革新が、SF作品で描かれた未来と<br>
                どう重なるのか。その視点から、複雑な技術を<br>
                分かりやすく伝えることを心がけています。
            </blockquote>
            <p class="about-text">
                Apple、Google、Meta、NVIDIA など大手IT企業の動向から、
                スタートアップの革新的技術まで幅広くカバーしています。
            </p>
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
    </section>

    <!-- Expertise Section -->
    <section id="expertise" class="expertise">
        <p class="section-label reveal">Expertise</p>
        <h2 class="section-title reveal">専門分野</h2>
        <div class="expertise-list reveal">
            <div class="expertise-item">
                <h3 class="expertise-title">AI / 人工知能</h3>
                <p class="expertise-desc">生成AI、LLM、AIエージェントの最新動向と社会的インパクトを分析</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">XR / VR / AR</h3>
                <p class="expertise-desc">Apple Vision Pro、Meta Quest など空間コンピューティングの進化を追跡</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">半導体技術</h3>
                <p class="expertise-desc">Apple M シリーズ、NVIDIA GPU など AI 時代を支えるチップ開発</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">宇宙技術</h3>
                <p class="expertise-desc">恒星間天体、惑星防衛、宇宙探査ミッションに関する最新科学</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">ゲーム / エンタメ</h3>
                <p class="expertise-desc">Unreal Engine、ゲーム AI 開発などテクノロジーとエンタメの融合</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">ロボティクス</h3>
                <p class="expertise-desc">外骨格スーツ、産業用ロボット、人間の能力を拡張する技術</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">サイバーセキュリティ</h3>
                <p class="expertise-desc">ランサムウェア、データ漏洩、フォレンジック技術の課題</p>
            </div>
            <div class="expertise-item">
                <h3 class="expertise-title">ヘルスケアテック</h3>
                <p class="expertise-desc">AI とメンタルヘルス、VR 療法、デジタルヘルスの未来</p>
            </div>
        </div>
    </section>

    <!-- Works Section -->
    <section id="works">
        <div class="works-image"></div>
        <p class="section-label reveal">Works</p>
        <h2 class="section-title reveal">注目の記事</h2>
        <div class="works-list reveal">
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
        <div class="contact reveal">
            <p class="section-label">Contact</p>
            <h2 class="section-title">お問い合わせ</h2>
            <p class="contact-text">
                取材依頼、コラボレーション、<br>
                その他のお問い合わせはこちらから。
            </p>
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
        <p><a href="https://innovatopia.jp/" target="_blank">innovaTopia</a></p>
    </footer>

    <script>
        // Scroll reveal
        const revealElements = document.querySelectorAll('.reveal');

        const revealOnScroll = () => {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (elementTop < windowHeight - 80) {
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
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>
  `)
})

export default app
