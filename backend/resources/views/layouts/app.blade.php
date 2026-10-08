<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>@yield('title', 'Quản Lý Đặt Phòng & Xem Chi Tiết 360° | Lumière Hotel')</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-dark: #070a10;
      --bg-card: rgba(15, 23, 42, 0.75);
      --bg-card-hover: rgba(30, 41, 59, 0.85);
      --border-glass: rgba(255, 255, 255, 0.1);
      --gold-primary: #d4af37;
      --gold-light: #fef08a;
      --gold-gradient: linear-gradient(135deg, #fef08a 0%, #d4af37 50%, #996515 100%);
      --cyan-primary: #06b6d4;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-serif: 'Cinzel', serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg-dark);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Top Navigation */
    .top-nav {
      height: 70px;
      background: rgba(11, 15, 25, 0.88);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-glass);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .brand-icon {
      font-size: 1.5rem;
      background: rgba(212, 175, 55, 0.15);
      padding: 0.35rem 0.6rem;
      border-radius: 12px;
      border: 1px solid rgba(212, 175, 55, 0.3);
    }
    .brand-title {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 2px;
      background: var(--gold-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .brand-sub {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(0, 0, 0, 0.35);
      padding: 0.3rem;
      border-radius: 12px;
      border: 1px solid var(--border-glass);
    }
    .nav-link {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.5rem 1.1rem;
      border-radius: 8px;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .nav-link:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }
    .nav-link.active {
      background: rgba(212, 175, 55, 0.2);
      color: var(--gold-light);
      border: 1px solid rgba(212, 175, 55, 0.35);
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .btn-portal {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .btn-portal:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .btn-gold {
      background: var(--gold-gradient);
      color: #0b0f19;
      font-weight: 700;
      font-size: 0.85rem;
      border: none;
      padding: 0.55rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-gold:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.35);
    }

    /* Container */
    .main-content {
      flex: 1;
      padding: 2rem;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
    }

    /* Flash Message */
    .flash-alert {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 0.85rem 1.25rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
    }

    @media (max-width: 900px) {
      .top-nav { padding: 0 1rem; flex-wrap: wrap; height: auto; padding: 0.75rem 1rem; gap: 0.75rem; }
      .nav-links { order: 3; width: 100%; justify-content: center; }
      .main-content { padding: 1rem; }
    }
  </style>

  @yield('styles')
</head>
<body>

  <!-- Top Navigation Bar -->
  <header class="top-nav">
    <a href="{{ route('dashboard') }}" class="brand-wrap">
      <div class="brand-icon">👑</div>
      <div>
        <div class="brand-title">LUMIÈRE HOTEL</div>
        <div class="brand-sub">Hệ Thống Quản Trị & Đặt Phòng 360°</div>
      </div>
    </a>

    <nav class="nav-links">
      <a href="{{ route('bookings.index') }}" class="nav-link {{ request()->routeIs('bookings.*') || request()->routeIs('dashboard') ? 'active' : '' }}">
        <span>📋</span> Quản Lý Đặt Phòng
      </a>
      <a href="{{ route('room.360') }}" class="nav-link {{ request()->routeIs('room.360') ? 'active' : '' }}">
        <span>🌐</span> Xem Chi Tiết Phòng 360°
      </a>
    </nav>

    <div class="nav-right">
      <a href="http://localhost:3001/" target="_blank" class="btn-portal" title="Mở Studio quản lý Vue 3 trên port 3001">
        <span>⚡</span> Vue 3 Admin Studio
      </a>
      <a href="http://localhost:3000/" target="_blank" class="btn-portal" title="Mở trang chủ đặt phòng khách hàng">
        <span>🏨</span> Website Khách Hàng
      </a>
    </div>
  </header>

  <!-- Flash Messages -->
  <main class="main-content">
    @if(session('success'))
      <div class="flash-alert">
        <span>✓</span>
        <span>{{ session('success') }}</span>
      </div>
    @endif

    @yield('content')
  </main>

  @yield('scripts')
</body>
</html>
