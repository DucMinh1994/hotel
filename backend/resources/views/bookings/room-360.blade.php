@extends('layouts.app')

@section('title', 'Trải Nghiệm Chi Tiết 360° ' . $currentRoom->name . ' | Lumière Hotel')

@section('styles')
<link rel="stylesheet" href="/style.css">
<style>
  body { overflow-x: hidden; }
  
  /* Chế độ nhúng 3D Viewer toàn màn hình sang trọng ngay bên trong trang Backend */
  .room3d-modal.backend-embedded {
    position: relative !important;
    width: 100% !important;
    height: calc(100vh - 120px) !important;
    min-height: 720px !important;
    border-radius: 20px !important;
    overflow: hidden !important;
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
    border: 1px solid var(--border-glass) !important;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7) !important;
  }

  .room3d-modal.backend-embedded .modal-top-bar {
    position: absolute !important;
    top: 1rem !important;
    left: 1rem !important;
    right: 1rem !important;
  }

  .room3d-modal.backend-embedded #btn-close-3d {
    display: none !important;
  }
</style>
@endsection

@section('content')
  <!-- =========================================================
       3D FULLSCREEN ROOM EXPERIENCE (CHÍNH XÁC NHƯ BẢN PORT 3000)
       ========================================================= -->
  <div class="room3d-modal backend-embedded active" id="room3d-modal">
    <!-- WebGL Canvas Container -->
    <div id="three-canvas-container"></div>

    <!-- 3D Hotspot Badges Container -->
    <div id="hotspots-layer"></div>

    <!-- Scene Transition Overlay (Chuyển cảnh bước vào phòng tắm / ra ban công) -->
    <div class="scene-transition-overlay" id="scene-transition-overlay">
      <div class="pano-spinner" style="width: 28px; height: 28px; border-width: 3px; border-top-color: #38bdf8;"></div>
      <div class="transition-text" id="scene-transition-text">
        <span>🛁</span> Đang mở cửa bước vào phòng tắm...
      </div>
      <div class="transition-sub" id="scene-transition-sub">Phòng Tắm Master En-Suite Đá Cẩm Thạch 5 Sao</div>
    </div>

    <!-- Top Navigation Bar -->
    <div class="modal-top-bar">
      <!-- Left: Room Info Pill -->
      <div class="top-bar-left">
        <div class="glass-pill">
          <span class="room-status-dot" id="modal-status-dot"></span>
          <div>
            <div class="room-badge-3d" id="modal-room-title">Phòng 301 - Deluxe Ocean Suite</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);" id="modal-room-status-text">Đang ở ngoài sảnh</div>
          </div>
        </div>
      </div>

      <!-- Center: Switch Between Room 301 & Room 502 -->
      <div class="top-bar-center">
        <div class="room-switcher-group">
          <button class="switcher-btn active" id="switch-room-301" data-room="301">
            <span>🚪 P.301 - Deluxe Suite</span>
          </button>
          <button class="switcher-btn" id="switch-room-502" data-room="502">
            <span>👑 P.502 - Royal Sky Suite</span>
          </button>
        </div>
      </div>

      <!-- Right: Controls -->
      <div class="top-bar-right" style="display: flex; gap: 0.75rem;">
        <!-- Auto Rotate 360 -->
        <button class="tool-btn active" id="btn-toggle-autorotate" title="Tự động xoay 360°">
          <span id="autorotate-icon">🔄</span>
        </button>

        <!-- Fullscreen Toggle -->
        <button class="tool-btn" id="btn-toggle-fullscreen" title="Toàn màn hình">
          <span>⛶</span>
        </button>

        <!-- Day / Night Toggle -->
        <button class="tool-btn" id="btn-toggle-daynight" title="Đổi chế độ Ánh sáng Ngày / Đêm">
          <span id="daynight-icon">☀️</span>
        </button>

        <!-- Sound Toggle -->
        <button class="tool-btn" id="btn-toggle-sound" title="Bật / Tắt Âm thanh hiệu ứng">
          <span id="sound-icon">🔊</span>
        </button>

        <!-- Help Info -->
        <button class="tool-btn" id="btn-show-help" title="Hướng dẫn sử dụng">
          <span>❓</span>
        </button>
      </div>
    </div>

    <!-- Center Guidance Banner -->
    <div class="guidance-banner" id="guidance-banner">
      <div class="guidance-text" id="guidance-text">
        <span>👉</span> Nhấp chuột vào cánh cửa để mở phòng
      </div>
      <button class="guidance-btn" id="guidance-action-btn" style="display: none;">
        <span>Bước Vào Trong →</span>
      </button>
    </div>

    <!-- 360 Loading Badge -->
    <div class="pano-loading-badge" id="pano-loading-badge" style="display: none;">
      <div class="pano-spinner"></div>
      <span id="pano-loading-text">Đang tải toàn cảnh 360° 4K...</span>
      <div class="pano-bar-track"><div class="pano-bar-fill" id="pano-bar-fill"></div></div>
    </div>

    <!-- Floating Zoom Controls -->
    <div class="modal-zoom-controls" id="zoom-controls" style="display: none;">
      <button class="zoom-btn" id="btn-zoom-in" title="Phóng to">+</button>
      <button class="zoom-btn" id="btn-zoom-reset" title="Góc nhìn chuẩn">🎯</button>
      <button class="zoom-btn" id="btn-zoom-out" title="Thu nhỏ">−</button>
    </div>

    <!-- Mini Compass / Radar Widget -->
    <div class="modal-compass-widget" id="compass-widget" style="display: none;">
      <div class="compass-dial" id="compass-dial">
        <span class="compass-mark mark-n">B</span>
        <span class="compass-mark mark-e">Đ</span>
        <span class="compass-mark mark-s">N</span>
        <span class="compass-mark mark-w">T</span>
        <div class="compass-needle" id="compass-needle"></div>
      </div>
      <div class="compass-label" id="compass-label">Góc nhìn 360°</div>
    </div>

    <!-- Bottom Quick Navigation Dock -->
    <div class="modal-bottom-dock" id="bottom-dock" style="display: none;">
      <button class="dock-btn active" data-action="overview">
        <span>👁️ Toàn Cảnh</span>
      </button>
      <button class="dock-btn" data-action="door">
        <span>🚪 Cửa Vào</span>
      </button>
      <button class="dock-btn" data-action="item" data-item="bed">
        <span>🛏️ Giường Ngủ</span>
      </button>
      <button class="dock-btn" data-action="item" data-item="tv">
        <span>📺 Smart TV</span>
      </button>
      <button class="dock-btn" data-action="item" data-item="armchair">
        <span>🛋️ Ghế Thư Giãn</span>
      </button>
      <button class="dock-btn" data-action="item" data-item="minibar">
        <span>🍸 Mini Bar</span>
      </button>
      <button class="dock-btn window-dock-btn portal-btn" data-action="item" data-item="window">
        <span>🌊 Ban Công View ↗</span>
      </button>
      <button class="dock-btn bath-dock-btn portal-btn" data-action="item" data-item="bath">
        <span>🛁 Phòng Tắm ↗</span>
      </button>
      <button class="dock-btn desk-dock-btn" data-action="item" data-item="desk" style="display: none;">
        <span>💼 Bàn Làm Việc</span>
      </button>
    </div>

    <!-- Side Product Inspection Drawer -->
    <aside class="inspection-drawer" id="inspection-drawer">
      <div class="drawer-header">
        <div>
          <div class="drawer-cat-badge" id="drawer-item-cat">NỘI THẤT CAO CẤP</div>
          <h3 class="drawer-title" id="drawer-item-name">Tên đồ vật</h3>
        </div>
        <button class="drawer-close" id="drawer-close-btn">✕</button>
      </div>

      <!-- Real High-Res Photo of the Item -->
      <div class="drawer-photo-wrap" id="drawer-photo-wrap">
        <img id="drawer-item-img" src="" alt="Ảnh thật chụp đồ vật" class="drawer-photo-img">
        <span class="drawer-photo-tag">📸 ẢNH CHỤP THỰC TẾ 100%</span>
        <button class="drawer-photo-zoom-btn" id="btn-zoom-photo" title="Phóng to ảnh chất lượng cao">🔍 Phóng to</button>
      </div>

      <p class="drawer-desc" id="drawer-item-desc">Mô tả chi tiết đồ vật...</p>

      <div class="drawer-specs-title">THÔNG SỐ & TIÊU CHUẨN</div>
      <div class="drawer-specs-list" id="drawer-item-specs"></div>

      <div class="drawer-actions">
        <button class="btn-outline" style="flex: 1;" id="drawer-back-btn">
          <span>Quay lại toàn cảnh</span>
        </button>
        <button class="btn-primary" style="flex: 1;" id="drawer-action-btn">
          <span>Đặt phòng này</span>
        </button>
      </div>
    </aside>

    <!-- Floating Booking CTA in 3D View -->
    <div class="floating-book-cta" id="floating-book-cta">
      <div class="glass-pill" style="padding: 0.5rem 1.2rem;">
        <span style="font-size: 0.8rem; color: var(--text-muted);">Giá phòng:</span>
        <strong style="color: var(--gold-light); font-size: 1.1rem;" id="modal-price-tag">2.850.000₫</strong>
        <span style="font-size: 0.8rem; color: var(--text-muted);">/đêm</span>
      </div>
      <button class="btn-primary btn-book-current-room">
        <span>⚡ Đặt Phòng Ngay</span>
      </button>
    </div>
  </div>

  <!-- =========================================================
       BOOKING FORM MODAL (TÍCH HỢP LƯU VÀO LARAVEL DATABASE)
       ========================================================= -->
  <div class="booking-modal-backdrop" id="booking-modal">
    <div class="booking-card">
      <!-- FORM STATE -->
      <div id="booking-form-state">
        <div class="booking-header">
          <div>
            <h3 class="booking-title">Đặt Phòng Khách Sạn</h3>
            <div class="booking-room-pill" id="book-form-room-name">Phòng 301 - Deluxe Grand Ocean Suite</div>
          </div>
          <button class="drawer-close" id="book-modal-close">✕</button>
        </div>

        <form class="booking-form" id="hotel-booking-form">
          <div class="form-row">
            <div class="form-group">
              <label>Họ và Tên Khách Hàng *</label>
              <input type="text" id="cust-name" placeholder="Nguyễn Văn A" required>
            </div>
            <div class="form-group">
              <label>Số Điện Thoại *</label>
              <input type="tel" id="cust-phone" placeholder="0912 345 678" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ngày Nhận Phòng (Check-in)</label>
              <input type="date" id="book-checkin" value="{{ date('Y-m-d') }}" required>
            </div>
            <div class="form-group">
              <label>Ngày Trả Phòng (Check-out)</label>
              <input type="date" id="book-checkout" value="{{ date('Y-m-d', strtotime('+3 days')) }}" required>
            </div>
          </div>

          <div class="form-group">
            <label>Yêu Cầu Đặc Biệt (Tùy chọn)</label>
            <textarea id="cust-notes" rows="2" placeholder="Ví dụ: Chuẩn bị hoa tươi kỷ niệm, tầng cao, check-in sớm..."></textarea>
          </div>

          <div class="booking-summary-box">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Tổng thanh toán tạm tính (3 đêm):</div>
              <div class="summary-total" id="book-total-price">8.550.000₫</div>
            </div>
            <div style="text-align: right; font-size: 0.8rem; color: #10b981;">
              ✓ Miễn phí hủy phòng trước 24h <br>
              ✓ Bao gồm ăn sáng 5 sao
            </div>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; padding: 1rem; margin-top: 0.5rem;">
            <span>Xác Nhận Giữ Phòng Ngay</span>
          </button>
        </form>
      </div>

      <!-- SUCCESS RECEIPT STATE -->
      <div id="booking-success-state" style="display: none;">
        <div class="booking-success-box">
          <div class="success-icon">✓</div>
          <h3 class="booking-title" style="margin-bottom: 0.5rem;">Đặt Phòng Thành Công!</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Cảm ơn quý khách <strong id="succ-cust-name" style="color: #fff;">Nguyễn Văn A</strong>. Đơn đặt phòng đã được lưu vào hệ thống Backend.
          </p>

          <div class="booking-code" id="succ-booking-code">LUM-301-8924</div>

          <div class="drawer-specs-list" style="margin: 1.5rem 0; text-align: left;">
            <div class="drawer-spec-item">
              <span class="spec-key">Hạng phòng:</span>
              <span class="spec-val" id="succ-room-name">Phòng 301 - Deluxe Grand Ocean Suite</span>
            </div>
            <div class="drawer-spec-item">
              <span class="spec-key">Thời gian lưu trú:</span>
              <span class="spec-val" id="succ-dates">15/10/2026 - 18/10/2026 (3 đêm)</span>
            </div>
            <div class="drawer-spec-item">
              <span class="spec-key">Tổng chi phí:</span>
              <span class="spec-val" style="color: var(--gold-light);" id="succ-total">8.550.000₫</span>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <a href="{{ route('bookings.index') }}" class="btn-outline" style="flex: 1; text-align: center; text-decoration: none; padding: 0.75rem;">
              <span>📋 Đến Quản Lý Đặt Phòng</span>
            </a>
            <button class="btn-primary" id="succ-close-btn" style="flex: 1;">
              <span>Tiếp Tục Trải Nghiệm 3D</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Lightbox Phóng To Ảnh Thật -->
  <div class="lightbox-backdrop" id="image-lightbox">
    <div class="lightbox-content">
      <button class="lightbox-close" id="lightbox-close-btn">✕</button>
      <img id="lightbox-img" src="" alt="Ảnh chi tiết sản phẩm">
      <div class="lightbox-caption" id="lightbox-caption">Ảnh chụp thực tế đồ vật 100%</div>
    </div>
  </div>
@endsection

@section('scripts')
  <!-- CDN Dependencies -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

  <!-- 3D Hotel Engine Của Bản Port 3000 -->
  <script src="/common.js"></script>
  <script src="/textures.js"></script>
  <script src="/three-room.js"></script>
  <script src="/room-301.js"></script>
  <script src="/room-502.js"></script>
  <script src="/app.js"></script>

  <script>
    // Tự động khởi động ngay phòng 3D chuẩn xác
    window.addEventListener('DOMContentLoaded', () => {
      const targetRoom = '{{ $currentRoom->room_number ?? "301" }}';
      setTimeout(() => {
        if (typeof window.openRoom3D === 'function') {
          window.openRoom3D(targetRoom);
        } else {
          const btn = document.getElementById('switch-room-' + targetRoom);
          if (btn) btn.click();
        }
      }, 150);
    });
  </script>
@endsection
