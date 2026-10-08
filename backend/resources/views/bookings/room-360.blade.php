@extends('layouts.app')

@section('title', 'Xem Chi Tiết 360° ' . $currentRoom->name . ' | Lumière Hotel')

@section('styles')
<style>
  .tour-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 1.5rem;
    height: calc(100vh - 120px);
    min-height: 600px;
  }

  /* Main Viewport Box */
  .viewport-panel {
    background: #000;
    border: 1px solid var(--border-glass);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  }

  .viewport-header {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 20;
    pointer-events: none;
  }
  .viewport-header > * { pointer-events: auto; }

  .room-dropdown {
    background: rgba(11, 15, 25, 0.85);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: var(--gold-light);
    font-weight: 700;
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .scenes-bar {
    position: absolute;
    bottom: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(11, 15, 25, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-glass);
    padding: 0.4rem;
    border-radius: 16px;
    display: flex;
    gap: 0.5rem;
    z-index: 20;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }
  .scene-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-weight: 600;
    font-size: 0.85rem;
    padding: 0.5rem 1.1rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .scene-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
  .scene-btn.active {
    background: rgba(212, 175, 55, 0.25);
    color: var(--gold-light);
    border: 1px solid rgba(212, 175, 55, 0.4);
  }

  .canvas-container {
    width: 100%;
    height: 100%;
    cursor: grab;
  }
  .canvas-container:active { cursor: grabbing; }

  /* Floating Tools */
  .floating-tools {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
    z-index: 20;
  }
  .tool-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(11, 15, 25, 0.85);
    border: 1px solid var(--border-glass);
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    backdrop-filter: blur(10px);
  }
  .tool-btn:hover { background: var(--gold-primary); color: #000; }

  /* Sidebar Details */
  .info-sidebar {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 20px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    backdrop-filter: blur(16px);
  }

  .room-title-lg {
    font-family: var(--font-serif);
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: #fff;
  }
  .room-price-lg {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--gold-light);
    margin-bottom: 1rem;
  }
  .room-specs-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    background: rgba(0,0,0,0.3);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .spec-item {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
  .spec-item strong {
    display: block;
    color: #fff;
    font-size: 0.88rem;
  }

  /* Hotspot Inspector Card */
  .hotspot-card {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 14px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }
  .hotspot-card-img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 1024px) {
    .tour-layout { grid-template-columns: 1fr; height: auto; }
    .viewport-panel { height: 500px; }
  }
</style>
@endsection

@section('content')
<div class="tour-layout">
  
  <!-- 3D Panorama Viewport -->
  <div class="viewport-panel">
    
    <!-- Top Floating Header -->
    <div class="viewport-header">
      <select class="room-dropdown" onchange="window.location.href = '/room-360/' + this.value">
        @foreach($rooms as $r)
          <option value="{{ $r->id }}" {{ $r->id === $currentRoom->id ? 'selected' : '' }}>
            P.{{ $r->room_number }} - {{ $r->name }} ({{ number_format($r->price, 0, ',', '.') }}₫)
          </option>
        @endforeach
      </select>
    </div>

    <!-- Floating Tools -->
    <div class="floating-tools">
      <button class="tool-btn" id="btn-autorotate" title="Bật/Tắt tự xoay 360°">🔄</button>
      <button class="tool-btn" id="btn-fullscreen" title="Toàn màn hình">⛶</button>
    </div>

    <!-- 3D Three.js Canvas Container -->
    <div id="three-container" class="canvas-container"></div>

    <!-- Thanh chuyển đổi không gian con (Scenes) -->
    <div class="scenes-bar">
      @foreach($currentRoom->scenes as $idx => $sc)
        <button class="scene-btn {{ $idx === 0 ? 'active' : '' }}" 
                data-scene-id="{{ $sc->id }}"
                data-pano="{{ $sc->panorama_360_url }}"
                onclick="switchScene('{{ $sc->id }}', this)">
          <span>{{ $sc->scene_key === 'bathroom' ? '🛁' : (str_contains($sc->scene_key, 'balcony') ? '🌊' : '🛏️') }}</span>
          <span>{{ $sc->short_name ?: $sc->name }}</span>
        </button>
      @endforeach
    </div>

  </div>

  <!-- Thông Tin Phòng & Đặt Phòng Nhanh -->
  <aside class="info-sidebar">
    <div style="font-size: 0.75rem; color: var(--gold-light); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
      PHÒNG {{ $currentRoom->room_number }} • TIÊU CHUẨN 5 SAO
    </div>
    <h1 class="room-title-lg">{{ $currentRoom->name }}</h1>
    <div class="room-price-lg">{{ $currentRoom->price_formatted ?: number_format($currentRoom->price, 0, ',', '.') . '₫' }} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 400;">/ đêm</span></div>

    <!-- Thông Số Phòng -->
    <div class="room-specs-list">
      <div class="spec-item">
        <span>Diện tích:</span>
        <strong>{{ $currentRoom->area }}</strong>
      </div>
      <div class="spec-item">
        <span>Sức chứa:</span>
        <strong>{{ $currentRoom->capacity }}</strong>
      </div>
      <div class="spec-item">
        <span>Loại giường:</span>
        <strong>{{ $currentRoom->bed_type }}</strong>
      </div>
      <div class="spec-item">
        <span>Tầm nhìn:</span>
        <strong>{{ $currentRoom->view_type }}</strong>
      </div>
    </div>

    <!-- Khối Thông Tin Đồ Vật Được Click (Hotspot Inspector) -->
    <div id="hotspot-info-box" class="hotspot-card">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
        <span id="hotspot-icon" style="font-size: 1.3rem;">💡</span>
        <strong id="hotspot-title" style="color: var(--gold-light); font-size: 0.95rem;">Chọn đồ vật trên ảnh 360°</strong>
      </div>
      <img id="hotspot-img" src="" class="hotspot-card-img" style="display: none;">
      <p id="hotspot-desc" style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
        Rê chuột và click trực tiếp vào các điểm tròn phát sáng trên ảnh 360° để xem ảnh chụp thật và thông số đồ vật.
      </p>
    </div>

    <!-- Nút Đặt Phòng Trực Tiếp -->
    <button class="btn-gold" style="width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.95rem; margin-top: auto;" onclick="openBookingFrom360()">
      <span>⚡</span> Đặt Căn Suite Này Ngay
    </button>
  </aside>

</div>

<!-- Modal Đặt Phòng Nhanh từ 360 -->
<div id="quickBookModal" class="modal-backdrop" onclick="if(event.target === this) closeQuickBook()">
  <div class="modal-box">
    <div class="modal-header">
      <h2 style="font-family: var(--font-serif); font-size: 1.25rem;">
        ⚡ Đặt Phòng P.{{ $currentRoom->room_number }} - {{ $currentRoom->name }}
      </h2>
      <button onclick="closeQuickBook()" style="background:none; border:none; color:#fff; font-size:1.2rem; cursor:pointer;">✕</button>
    </div>

    <form action="{{ route('bookings.store') }}" method="POST">
      @csrf
      <input type="hidden" name="room_id" value="{{ $currentRoom->id }}">

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Tên Quý Khách:</label>
          <input type="text" name="customer_name" class="form-input" required placeholder="Nguyễn Văn A">
        </div>
        <div class="form-group">
          <label class="form-label">Số Điện Thoại:</label>
          <input type="text" name="customer_phone" class="form-input" required placeholder="0901234567">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Email Xác Nhận:</label>
        <input type="email" name="customer_email" class="form-input" placeholder="khachhang@gmail.com">
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Ngày Nhận Phòng (Check-in):</label>
          <input type="date" name="check_in_date" class="form-input" required value="{{ date('Y-m-d') }}">
        </div>
        <div class="form-group">
          <label class="form-label">Ngày Trả Phòng (Check-out):</label>
          <input type="date" name="check_out_date" class="form-input" required value="{{ date('Y-m-d', strtotime('+1 day')) }}">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Yêu Cầu Đặc Biệt (Tùy chọn):</label>
        <textarea name="special_requests" class="form-textarea" rows="2" placeholder="Ví dụ: Rượu vang chào đón, setup tuần trăng mật..."></textarea>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-glass);">
        <button type="button" class="btn-action" style="padding: 0.6rem 1.2rem;" onclick="closeQuickBook()">Hủy</button>
        <button type="submit" class="btn-gold">Xác Nhận Đặt Căn Suite</button>
      </div>
    </form>
  </div>
</div>
@endsection

@section('scripts')
<!-- Three.js CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

<script>
  // Dữ liệu toàn bộ phòng & scenes được truyền trực tiếp từ Laravel Controller
  const ROOM_DATA = @json($currentRoom);
  let activeScene = ROOM_DATA.scenes && ROOM_DATA.scenes.length > 0 ? ROOM_DATA.scenes[0] : null;

  let scene, camera, renderer, controls, sphere;
  let markersGroup = new THREE.Group();
  let isAutoRotate = true;

  function init3D() {
    const container = document.getElementById('three-container');
    const w = container.clientWidth;
    const h = container.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 1000);
    camera.position.set(0, 0, 0.05);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 0.6;
    controls.rotateSpeed = -0.5;

    // Quả cầu 360 độ
    const sphereGeo = new THREE.SphereGeometry(25, 60, 40);
    sphereGeo.scale(-1, 1, 1);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    scene.add(markersGroup);

    // Bắt sự kiện Click lên Hotspot
    renderer.domElement.addEventListener('click', onCanvasClick);
    window.addEventListener('resize', onResize);

    if (activeScene) {
      loadPanoTexture(activeScene);
    }

    animate();
  }

  function resolveUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return 'http://localhost:3000/' + url.replace(/^\//, '');
  }

  function loadPanoTexture(sceneObj) {
    const loader = new THREE.TextureLoader();
    const url = resolveUrl(sceneObj.panorama_360_url);

    loader.load(url, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      sphere.material.map = tex;
      sphere.material.color.setHex(0xffffff);
      sphere.material.needsUpdate = true;
    });

    renderHotspots(sceneObj.hotspots || []);
  }

  function renderHotspots(hotspots) {
    while (markersGroup.children.length > 0) {
      markersGroup.remove(markersGroup.children[0]);
    }

    hotspots.forEach(h => {
      const group = new THREE.Group();
      group.userData = { hotspot: h };

      const dir = new THREE.Vector3(h.position_x, h.position_y, h.position_z).normalize();
      const pos = dir.clone().multiplyScalar(22);
      group.position.copy(pos);
      group.lookAt(0, 0, 0);

      const isPortal = h.type === 'portal' || h.type === 'back_portal';
      const color = isPortal ? 0x06b6d4 : 0xd4af37;

      const ringGeo = new THREE.RingGeometry(0.4, 0.55, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.userData = { hotspot: h };
      group.add(ring);

      const coreGeo = new THREE.CircleGeometry(0.2, 24);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.userData = { hotspot: h };
      group.add(core);

      const hitGeo = new THREE.CircleGeometry(1.2, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hit = new THREE.Mesh(hitGeo, hitMat);
      hit.userData = { hotspot: h };
      group.add(hit);

      markersGroup.add(group);
    });
  }

  function onCanvasClick(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(markersGroup.children, true);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const h = hit.userData?.hotspot;
      if (h) {
        // Nếu là Portal: Chuyển sang không gian đích!
        if (h.type === 'portal' || h.type === 'back_portal') {
          const targetKey = h.target_room_key || (h.type === 'back_portal' ? 'main' : 'bathroom');
          const foundScene = ROOM_DATA.scenes.find(s => s.scene_key === targetKey || (targetKey === 'main' && s.is_main));
          if (foundScene) {
            const btn = document.querySelector(`[data-scene-id="${foundScene.id}"]`);
            switchScene(foundScene.id, btn);
          }
          return;
        }

        // Hiển thị thông tin đồ vật lên Sidebar
        document.getElementById('hotspot-icon').textContent = h.icon || '📍';
        document.getElementById('hotspot-title').textContent = h.name;
        document.getElementById('hotspot-desc').textContent = h.description || 'Tiện nghi đẳng cấp trong căn suite.';

        const imgEl = document.getElementById('hotspot-img');
        if (h.image_url) {
          imgEl.src = h.image_url;
          imgEl.style.display = 'block';
        } else {
          imgEl.style.display = 'none';
        }
      }
    }
  }

  function switchScene(sceneId, btnElement) {
    const found = ROOM_DATA.scenes.find(s => s.id == sceneId);
    if (!found) return;

    activeScene = found;
    loadPanoTexture(found);

    document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
  }

  function onResize() {
    const container = document.getElementById('three-container');
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Điều khiển
  document.getElementById('btn-autorotate').addEventListener('click', () => {
    isAutoRotate = !isAutoRotate;
    controls.autoRotate = isAutoRotate;
  });

  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    const panel = document.querySelector('.viewport-panel');
    if (!document.fullscreenElement) {
      panel.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // Modal Đặt phòng
  function openBookingFrom360() {
    document.getElementById('quickBookModal').classList.add('open');
  }
  function closeQuickBook() {
    document.getElementById('quickBookModal').classList.remove('open');
  }

  // Khởi động khi tải xong
  window.addEventListener('DOMContentLoaded', init3D);
</script>
@endsection
