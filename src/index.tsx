import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>乗杉 海 | Technology Journalist @ innovaTopia</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --black: #0a0a0a;
            --white: #fafafa;
            --gray-100: #f5f5f5;
            --gray-200: #e5e5e5;
            --gray-300: #d4d4d4;
            --gray-400: #a3a3a3;
            --gray-500: #737373;
            --gray-600: #525252;
            --gray-700: #404040;
            --gray-800: #262626;
            --gray-900: #171717;
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
            background-color: var(--white);
            color: var(--black);
            line-height: 1.7;
            overflow-x: hidden;
        }

        /* ========== Animations ========== */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-60px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(60px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes scaleIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes lineExpand {
            from { width: 0; }
            to { width: 80px; }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
        }

        .animate-slideInLeft {
            animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slideInRight {
            animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-scaleIn {
            animation: scaleIn 0.6s ease-out forwards;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .delay-6 { animation-delay: 0.6s; }

        /* Initially hidden for animation */
        .animate-on-scroll {
            opacity: 0;
        }

        .animate-on-scroll.visible {
            opacity: 1;
        }

        /* ========== Navigation ========== */
        nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 1.5rem 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(250, 250, 250, 0.9);
            backdrop-filter: blur(20px);
            transition: all 0.3s ease;
        }

        nav.scrolled {
            padding: 1rem 3rem;
            box-shadow: 0 1px 0 var(--gray-200);
        }

        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            color: var(--black);
            text-decoration: none;
        }

        .logo-sub {
            font-size: 0.7rem;
            font-weight: 400;
            color: var(--gray-500);
            display: block;
            letter-spacing: 0.05em;
        }

        .nav-links {
            display: flex;
            gap: 2.5rem;
            list-style: none;
        }

        .nav-links a {
            color: var(--gray-600);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            position: relative;
            transition: color 0.3s ease;
        }

        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--black);
            transition: width 0.3s ease;
        }

        .nav-links a:hover {
            color: var(--black);
        }

        .nav-links a:hover::after {
            width: 100%;
        }

        /* ========== Hero Section ========== */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 8rem 3rem 4rem;
            position: relative;
            overflow: hidden;
        }

        .hero-content {
            max-width: 800px;
            z-index: 1;
        }

        .hero-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: var(--black);
            color: var(--white);
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.1em;
            border-radius: 4px;
            margin-bottom: 1.5rem;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.1s forwards;
        }

        .hero-subtitle {
            font-size: 0.875rem;
            font-weight: 500;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--gray-500);
            margin-bottom: 1rem;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.2s forwards;
        }

        .hero-title {
            font-size: clamp(2.5rem, 7vw, 4.5rem);
            font-weight: 700;
            letter-spacing: -0.03em;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.4s forwards;
        }

        .hero-title-en {
            font-size: clamp(1rem, 3vw, 1.5rem);
            font-weight: 400;
            color: var(--gray-500);
            margin-top: 0.5rem;
        }

        .hero-description {
            font-size: 1.15rem;
            color: var(--gray-600);
            max-width: 600px;
            line-height: 1.9;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.6s forwards;
        }

        .hero-line {
            width: 0;
            height: 2px;
            background: var(--black);
            margin: 2.5rem 0;
            animation: lineExpand 1s ease-out 0.8s forwards;
        }

        .hero-cta {
            display: flex;
            gap: 1rem;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 1s forwards;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 2rem;
            font-size: 0.9rem;
            font-weight: 600;
            text-decoration: none;
            border-radius: 4px;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
        }

        .btn-primary {
            background: var(--black);
            color: var(--white);
        }

        .btn-primary:hover {
            background: var(--gray-800);
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary {
            background: transparent;
            color: var(--black);
            border: 2px solid var(--black);
        }

        .btn-secondary:hover {
            background: var(--black);
            color: var(--white);
        }

        /* Hero Background Animation */
        .hero-bg {
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 100%;
            opacity: 0.03;
            pointer-events: none;
        }

        .hero-bg-circle {
            position: absolute;
            border: 1px solid var(--black);
            border-radius: 50%;
            animation: pulse 4s ease-in-out infinite;
        }

        .hero-bg-circle:nth-child(1) {
            width: 400px;
            height: 400px;
            top: 20%;
            right: 10%;
            animation-delay: 0s;
        }

        .hero-bg-circle:nth-child(2) {
            width: 300px;
            height: 300px;
            top: 40%;
            right: 25%;
            animation-delay: 0.5s;
        }

        .hero-bg-circle:nth-child(3) {
            width: 200px;
            height: 200px;
            top: 55%;
            right: 5%;
            animation-delay: 1s;
        }

        /* ========== Section Styles ========== */
        section {
            padding: 8rem 3rem;
        }

        .section-header {
            margin-bottom: 4rem;
        }

        .section-label {
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--gray-500);
            margin-bottom: 1rem;
        }

        .section-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 700;
            letter-spacing: -0.02em;
        }

        /* ========== About Section ========== */
        .about {
            background: var(--gray-100);
        }

        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }

        .about-image {
            position: relative;
        }

        .about-image-placeholder {
            width: 100%;
            aspect-ratio: 4/5;
            background: linear-gradient(135deg, var(--gray-800), var(--black));
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: var(--white);
        }

        .about-image-placeholder .initial {
            font-size: 5rem;
            font-weight: 700;
            line-height: 1;
        }

        .about-image-placeholder .media-name {
            font-size: 0.9rem;
            margin-top: 1rem;
            letter-spacing: 0.1em;
            color: var(--gray-400);
        }

        .about-image::before {
            content: '';
            position: absolute;
            top: -20px;
            left: -20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid var(--black);
            border-radius: 8px;
            z-index: -1;
        }

        .about-text h3 {
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
        }

        .about-text p {
            color: var(--gray-600);
            margin-bottom: 1.5rem;
            font-size: 1.05rem;
        }

        .about-highlight {
            background: var(--white);
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid var(--black);
            margin: 1.5rem 0;
        }

        .about-highlight p {
            margin: 0;
            font-style: italic;
            color: var(--gray-700);
        }

        .about-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-top: 2.5rem;
            padding-top: 2.5rem;
            border-top: 1px solid var(--gray-300);
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 0.8rem;
            color: var(--gray-500);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        /* ========== Expertise Section ========== */
        .expertise {
            background: var(--black);
            color: var(--white);
        }

        .expertise .section-label {
            color: var(--gray-500);
        }

        .expertise-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .expertise-card {
            padding: 2.5rem;
            border: 1px solid var(--gray-800);
            border-radius: 8px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }

        .expertise-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--gray-900), transparent);
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .expertise-card:hover {
            border-color: var(--gray-600);
            transform: translateY(-8px);
        }

        .expertise-card:hover::before {
            opacity: 1;
        }

        .expertise-icon {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
        }

        .expertise-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            position: relative;
            z-index: 1;
        }

        .expertise-card p {
            color: var(--gray-400);
            font-size: 0.95rem;
            line-height: 1.7;
            position: relative;
            z-index: 1;
        }

        /* ========== Works Section ========== */
        .works-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .work-card {
            background: var(--white);
            border: 1px solid var(--gray-200);
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.4s ease;
            text-decoration: none;
            color: inherit;
            display: block;
        }

        .work-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1);
        }

        .work-image {
            width: 100%;
            aspect-ratio: 16/10;
            background: linear-gradient(135deg, var(--gray-200), var(--gray-300));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            position: relative;
            overflow: hidden;
        }

        .work-image::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--black);
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        .work-card:hover .work-image::after {
            opacity: 0.1;
        }

        .work-content {
            padding: 2rem;
        }

        .work-category {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--gray-500);
            margin-bottom: 0.75rem;
        }

        .work-date {
            font-size: 0.75rem;
            color: var(--gray-400);
            margin-left: 1rem;
        }

        .work-content h3 {
            font-size: 1.15rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            line-height: 1.4;
        }

        .work-content p {
            color: var(--gray-600);
            font-size: 0.9rem;
            line-height: 1.6;
        }

        .work-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--black);
        }

        .work-link::after {
            content: '→';
            transition: transform 0.3s ease;
        }

        .work-card:hover .work-link::after {
            transform: translateX(4px);
        }

        /* ========== Contact Section ========== */
        .contact {
            background: var(--gray-100);
            text-align: center;
        }

        .contact-content {
            max-width: 600px;
            margin: 0 auto;
        }

        .contact h2 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 700;
            margin-bottom: 1.5rem;
        }

        .contact p {
            color: var(--gray-600);
            font-size: 1.1rem;
            margin-bottom: 2.5rem;
        }

        .contact-links {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
        }

        .contact-link {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--black);
            text-decoration: none;
            position: relative;
            display: inline-block;
            padding: 0.5rem 0;
        }

        .contact-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--black);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }

        .contact-link:hover::after {
            transform: scaleX(1);
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 3rem;
        }

        .social-link {
            width: 50px;
            height: 50px;
            border: 2px solid var(--gray-300);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--gray-600);
            text-decoration: none;
            font-size: 1.25rem;
            transition: all 0.3s ease;
        }

        .social-link:hover {
            background: var(--black);
            border-color: var(--black);
            color: var(--white);
            transform: translateY(-4px);
        }

        /* ========== Footer ========== */
        footer {
            background: var(--black);
            color: var(--gray-500);
            padding: 3rem;
            text-align: center;
        }

        footer p {
            font-size: 0.875rem;
        }

        footer a {
            color: var(--gray-400);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        footer a:hover {
            color: var(--white);
        }

        /* ========== Responsive ========== */
        @media (max-width: 968px) {
            nav {
                padding: 1rem 1.5rem;
            }

            .nav-links {
                display: none;
            }

            section {
                padding: 5rem 1.5rem;
            }

            .hero {
                padding: 6rem 1.5rem 3rem;
            }

            .about-content {
                grid-template-columns: 1fr;
                gap: 3rem;
            }

            .about-image {
                max-width: 400px;
                margin: 0 auto;
            }

            .works-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 600px) {
            .hero-cta {
                flex-direction: column;
            }

            .btn {
                justify-content: center;
            }

            .about-stats {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }

            .expertise-grid {
                grid-template-columns: 1fr;
            }
        }

        /* ========== Scroll Animation Styles ========== */
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }

        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }

        .reveal-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: all 0.8s ease;
        }

        .reveal-left.active {
            opacity: 1;
            transform: translateX(0);
        }

        .reveal-right {
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.8s ease;
        }

        .reveal-right.active {
            opacity: 1;
            transform: translateX(0);
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <a href="#" class="logo">
            乗杉 海
            <span class="logo-sub">@ innovaTopia</span>
        </a>
        <ul class="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#expertise">Expertise</a></li>
            <li><a href="#works">Works</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-bg">
            <div class="hero-bg-circle"></div>
            <div class="hero-bg-circle"></div>
            <div class="hero-bg-circle"></div>
        </div>
        <div class="hero-content">
            <span class="hero-badge">innovaTopia ライター</span>
            <p class="hero-subtitle">Technology Journalist & Content Creator</p>
            <h1 class="hero-title">
                乗杉 海
                <span class="hero-title-en">Kai Norisugi</span>
            </h1>
            <p class="hero-description">
                SF小説やゲームカルチャーをきっかけに、エンターテインメントとテクノロジーが交わる領域を探究。
                AI、XR、半導体、宇宙技術など先端分野の最新動向を、innovaTopiaで発信しています。
            </p>
            <div class="hero-line"></div>
            <div class="hero-cta">
                <a href="https://innovatopia.jp/author/kai/" target="_blank" class="btn btn-primary">記事一覧を見る</a>
                <a href="#contact" class="btn btn-secondary">Get in Touch</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="about-content">
            <div class="about-image reveal-left">
                <div class="about-image-placeholder">
                    <span class="initial">海</span>
                    <span class="media-name">innovaTopia</span>
                </div>
            </div>
            <div class="about-text reveal-right">
                <div class="section-header">
                    <p class="section-label">About Me</p>
                    <h2 class="section-title">テクノロジーの未来を<br>わかりやすく伝える</h2>
                </div>
                <p>
                    SF作品が描く未来社会や、ビデオゲームが創り出す仮想世界から着想を得て、
                    現実のテクノロジーがどのように進化し、私たちの生活を変えていくのかを探究しています。
                </p>
                <div class="about-highlight">
                    <p>
                        「今起きている技術革新が、SF作品で描かれた未来とどう重なるのか」
                        ——その視点から、複雑な技術トピックを読者に分かりやすく伝えることを心がけています。
                    </p>
                </div>
                <p>
                    Apple、Google、Meta、Microsoft、Samsung、NVIDIAなど大手IT企業の製品発表から、
                    スタートアップの革新的技術、宇宙探査の最新動向まで幅広くカバーしています。
                </p>
                <div class="about-stats">
                    <div class="stat-item">
                        <div class="stat-number">500+</div>
                        <div class="stat-label">Articles</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">8+</div>
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

    <!-- Expertise Section -->
    <section id="expertise" class="expertise">
        <div class="section-header" style="max-width: 1200px; margin: 0 auto;">
            <p class="section-label">Expertise</p>
            <h2 class="section-title">専門分野</h2>
        </div>
        <div class="expertise-grid">
            <div class="expertise-card reveal">
                <div class="expertise-icon">🤖</div>
                <h3>AI / 人工知能</h3>
                <p>生成AI、LLM、AIエージェントの最新動向。Meta AI、Grok、Gemini、OpenAIの技術革新と社会的インパクトを分析</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🥽</div>
                <h3>XR / VR / AR</h3>
                <p>Apple Vision Pro、Meta Quest、Galaxy XR、XREAL。空間コンピューティングと没入型体験の進化を追跡</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">💾</div>
                <h3>半導体技術</h3>
                <p>Apple Mシリーズ、NVIDIA GPU、次世代プロセス技術。AI時代を支えるチップ開発競争の最前線</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🚀</div>
                <h3>宇宙技術</h3>
                <p>恒星間天体3I/ATLAS、惑星防衛、宇宙探査ミッション。人類の宇宙進出に関する最新科学</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🎮</div>
                <h3>ゲーム & エンタメ</h3>
                <p>Unreal Engine、ゲームAI開発、Steam/PlayStation。テクノロジーとエンターテインメントの融合</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🦾</div>
                <h3>ロボティクス</h3>
                <p>外骨格スーツ、産業用ロボット、自律システム。人間の能力を拡張する技術革新</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🔐</div>
                <h3>サイバーセキュリティ</h3>
                <p>ランサムウェア攻撃、データ漏洩、フォレンジック技術。デジタル時代のセキュリティ課題</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🏥</div>
                <h3>ヘルスケアテック</h3>
                <p>AIとメンタルヘルス、VR療法、デジタルヘルス。テクノロジーが変える医療の未来</p>
            </div>
        </div>
    </section>

    <!-- Works Section -->
    <section id="works">
        <div class="section-header" style="max-width: 1200px; margin: 0 auto;">
            <p class="section-label">Featured Works</p>
            <h2 class="section-title">注目の記事</h2>
        </div>
        <div class="works-grid">
            <a href="https://innovatopia.jp/vrar/vrar-news/73306/" target="_blank" class="work-card reveal">
                <div class="work-image">🥽</div>
                <div class="work-content">
                    <p class="work-category">XR / 取材記事<span class="work-date">2025.12.03</span></p>
                    <h3>【取材】XREAL、ARグラス単体で2D→3D変換を実現する「XREAL 1S」を発表</h3>
                    <p>67,980円で革新的機能を搭載。空間コンピューティングチップ「XREAL X1」によるリアルタイム3D変換技術を解説</p>
                    <span class="work-link">記事を読む</span>
                </div>
            </a>
            <a href="https://innovatopia.jp/vrar/vrar-news/72052/" target="_blank" class="work-card reveal">
                <div class="work-image">👤</div>
                <div class="work-content">
                    <p class="work-category">AI × XR<span class="work-date">2025.11.21</span></p>
                    <h3>カラダが消える日——AIとXRが解体する「現実」の定義</h3>
                    <p>製造業の安全教育、医療現場の手術支援、企業研修で実際の成果を創出するXRとAIの融合を考察</p>
                    <span class="work-link">記事を読む</span>
                </div>
            </a>
            <a href="https://innovatopia.jp/spacetechnology/spacetechnology-news/72875/" target="_blank" class="work-card reveal">
                <div class="work-image">🛸</div>
                <div class="work-content">
                    <p class="work-category">宇宙技術<span class="work-date">2025.11.27</span></p>
                    <h3>『現代のガリレオ』と呼ばれた男の孤独——ハーバード大ローブ博士はなぜ、3I/ATLASを『母船』と呼び続けるのか</h3>
                    <p>恒星間天体3I/ATLASをめぐる科学論争と、異端の科学者の挑戦を追う</p>
                    <span class="work-link">記事を読む</span>
                </div>
            </a>
            <a href="https://innovatopia.jp/ai/ai-news/71738/" target="_blank" class="work-card reveal">
                <div class="work-image">🧠</div>
                <div class="work-content">
                    <p class="work-category">AI<span class="work-date">2025.11.14</span></p>
                    <h3>Google DeepMind「SIMA 2」、Geminiを活用した仮想世界AIエージェント</h3>
                    <p>ゲーム世界で自律的に行動するAIエージェントの進化と、その技術的意義を解説</p>
                    <span class="work-link">記事を読む</span>
                </div>
            </a>
            <a href="https://innovatopia.jp/vrar/vrar-news/68902/" target="_blank" class="work-card reveal">
                <div class="work-image">🍎</div>
                <div class="work-content">
                    <p class="work-category">XR / 分析<span class="work-date">2025.10.17</span></p>
                    <h3>Apple Vision Pro、空間コンピューティングは６畳で成立するか？</h3>
                    <p>発売1年半で見えた日本の住空間との最適解。狭小住宅でのVision Pro活用法を考察</p>
                    <span class="work-link">記事を読む</span>
                </div>
            </a>
            <a href="https://innovatopia.jp/ai/ai-news/71098/" target="_blank" class="work-card reveal">
                <div class="work-image">🎮</div>
                <div class="work-content">
                    <p class="work-category">ゲームAI<span class="work-date">2025.11.07</span></p>
                    <h3>Cygamesと東京藝術大学、ゲームAI開発ツール共同研究を開始</h3>
                    <p>LLM活用でNPC制御を革新。エンターテインメントとAIの融合の最前線</p>
                    <span class="work-link">記事を読む</span>
                </div>
            </a>
        </div>
        <div style="text-align: center; margin-top: 3rem;">
            <a href="https://innovatopia.jp/author/kai/" target="_blank" class="btn btn-secondary">すべての記事を見る →</a>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="contact-content reveal">
            <p class="section-label">Contact</p>
            <h2>Let's Connect</h2>
            <p>取材依頼、コラボレーション、お問い合わせなど、お気軽にご連絡ください。</p>
            <div class="contact-links">
                <a href="https://innovatopia.jp/author/kai/" target="_blank" class="contact-link">innovaTopia 著者ページ</a>
            </div>
            <div class="social-links">
                <a href="#" class="social-link" aria-label="Twitter">𝕏</a>
                <a href="#" class="social-link" aria-label="LinkedIn">in</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>&copy; 2025 乗杉 海 / Kai Norisugi. All rights reserved.</p>
        <p style="margin-top: 0.5rem;">
            <a href="https://innovatopia.jp/" target="_blank">innovaTopia</a> ライター
        </p>
    </footer>

    <script>
        // Navigation scroll effect
        const nav = document.querySelector('nav');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Scroll reveal animation
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

        const revealOnScroll = () => {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (elementTop < windowHeight - 100) {
                    element.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        window.addEventListener('load', revealOnScroll);

        // Smooth scroll for navigation links
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

        // Staggered animation for expertise cards
        const expertiseCards = document.querySelectorAll('.expertise-card');
        expertiseCards.forEach((card, index) => {
            card.style.transitionDelay = \`\${index * 0.1}s\`;
        });

        // Staggered animation for work cards
        const workCards = document.querySelectorAll('.work-card');
        workCards.forEach((card, index) => {
            card.style.transitionDelay = \`\${index * 0.1}s\`;
        });
    </script>
</body>
</html>
  `)
})

export default app
