import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kai | Technology Journalist</title>
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

        .hero-subtitle {
            font-size: 0.875rem;
            font-weight: 500;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--gray-500);
            margin-bottom: 1.5rem;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.2s forwards;
        }

        .hero-title {
            font-size: clamp(3rem, 8vw, 5.5rem);
            font-weight: 700;
            letter-spacing: -0.03em;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out 0.4s forwards;
        }

        .hero-description {
            font-size: 1.25rem;
            color: var(--gray-600);
            max-width: 600px;
            line-height: 1.8;
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
            background: linear-gradient(135deg, var(--gray-300), var(--gray-400));
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 6rem;
            color: var(--gray-500);
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

        .work-content h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
        }

        .work-content p {
            color: var(--gray-600);
            font-size: 0.95rem;
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

        .contact-email {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--black);
            text-decoration: none;
            position: relative;
            display: inline-block;
        }

        .contact-email::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--black);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }

        .contact-email:hover::after {
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
        <a href="#" class="logo">Kai</a>
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
            <p class="hero-subtitle">Technology Journalist & Content Creator</p>
            <h1 class="hero-title">Kai</h1>
            <p class="hero-description">
                AI、XR、半導体、ロボティクス、メタバースなど先端技術分野の最新動向を分析・発信。
                テクノロジーの「今」と「未来」を架橋する情報発信者として活動しています。
            </p>
            <div class="hero-line"></div>
            <div class="hero-cta">
                <a href="#works" class="btn btn-primary">View Works</a>
                <a href="#contact" class="btn btn-secondary">Get in Touch</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="about-content">
            <div class="about-image reveal-left">
                <div class="about-image-placeholder">K</div>
            </div>
            <div class="about-text reveal-right">
                <div class="section-header">
                    <p class="section-label">About Me</p>
                    <h2 class="section-title">テクノロジーの潮流を<br>わかりやすく伝える</h2>
                </div>
                <p>
                    Innovatopiaメディアで活躍するテクノロジージャーナリストとして、
                    AI（人工知能）、XR/VR/AR、半導体技術、ロボティクス、モビリティ、
                    メタバース、ヘルスケアテックなど、最先端テクノロジー分野における
                    幅広い専門知識を持っています。
                </p>
                <p>
                    速報性と分析の深さを兼ね備えた執筆スタイルで、Apple、Google、Meta、
                    Microsoft、Samsungなど大手IT企業の製品発表、戦略転換、技術革新を
                    詳細に追跡しています。
                </p>
                <div class="about-stats">
                    <div class="stat-item">
                        <div class="stat-number">500+</div>
                        <div class="stat-label">Articles</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">10+</div>
                        <div class="stat-label">Years Exp.</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">100K+</div>
                        <div class="stat-label">Readers</div>
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
                <p>生成AI、機械学習、大規模言語モデル（LLM）の最新動向と社会的インパクトを分析</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🥽</div>
                <h3>XR / VR / AR</h3>
                <p>Apple Vision Pro、Meta Quest、空間コンピューティングの市場動向と技術進化を追跡</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">💾</div>
                <h3>半導体技術</h3>
                <p>次世代チップ開発競争、製造プロセスの進化、AI向け専用プロセッサの動向</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🦾</div>
                <h3>ロボティクス</h3>
                <p>産業用ロボット、ヒューマノイド、自律システムの技術革新と実用化</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🌐</div>
                <h3>メタバース</h3>
                <p>仮想空間プラットフォーム、デジタルツイン、Web3技術の融合と展望</p>
            </div>
            <div class="expertise-card reveal">
                <div class="expertise-icon">🏥</div>
                <h3>ヘルスケアテック</h3>
                <p>デジタルヘルス、遠隔医療、AIを活用した診断支援システムの最前線</p>
            </div>
        </div>
    </section>

    <!-- Works Section -->
    <section id="works">
        <div class="section-header" style="max-width: 1200px; margin: 0 auto;">
            <p class="section-label">Featured Works</p>
            <h2 class="section-title">注目の記事・コンテンツ</h2>
        </div>
        <div class="works-grid">
            <div class="work-card reveal">
                <div class="work-image">📱</div>
                <div class="work-content">
                    <p class="work-category">AI / Device</p>
                    <h3>Apple Vision Pro 完全解説</h3>
                    <p>空間コンピューティングの幕開け。Apple初のXRデバイスの技術とビジョンを徹底分析</p>
                </div>
            </div>
            <div class="work-card reveal">
                <div class="work-image">🧠</div>
                <div class="work-content">
                    <p class="work-category">AI / Analysis</p>
                    <h3>生成AIの現在地と未来</h3>
                    <p>ChatGPT、Gemini、Claudeなど主要AIの比較と、次世代AIがもたらす社会変革</p>
                </div>
            </div>
            <div class="work-card reveal">
                <div class="work-image">⚡</div>
                <div class="work-content">
                    <p class="work-category">Semiconductor</p>
                    <h3>半導体戦争の最前線</h3>
                    <p>NVIDIA、AMD、Intelの覇権争いと、AI時代を制するチップ開発競争の全貌</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="contact-content reveal">
            <p class="section-label">Contact</p>
            <h2>Let's Connect</h2>
            <p>取材依頼、コラボレーション、お問い合わせなど、お気軽にご連絡ください。</p>
            <a href="mailto:kai@example.com" class="contact-email">kai@example.com</a>
            <div class="social-links">
                <a href="#" class="social-link" aria-label="Twitter">𝕏</a>
                <a href="#" class="social-link" aria-label="LinkedIn">in</a>
                <a href="#" class="social-link" aria-label="GitHub">⌘</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <p>&copy; 2024 Kai. All rights reserved.</p>
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
            card.style.transitionDelay = \`\${index * 0.15}s\`;
        });
    </script>
</body>
</html>
  `)
})

export default app
