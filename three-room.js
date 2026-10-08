/**
 * three-room.js - Three.js 360° Photorealistic Virtual Tour Engine
 * Phiên bản hoàn thiện cao cấp:
 * 1. Sảnh ngoài 3D chân thực với cánh cửa gỗ mạ vàng & biển số phòng phát sáng (P.301 / P.502).
 * 2. Thẻ từ thông minh: Click cửa -> Đèn LED ổ khóa đổi màu xanh, bíp thẻ từ, cửa mở kẽo kẹt mượt mà.
 * 3. Bước vào trong -> Camera lướt qua cửa vào giữa phòng.
 * 4. Toàn bộ không gian phòng là ẢNH CHỤP THỰC TẾ 360° PANORAMA 100% của khách sạn 5 sao!
 * 5. Tự động xoay 360° (Auto-Rotate), tạm dừng khi tương tác, tiếp tục sau khi rảnh tay.
 * 6. Điểm ghim 3D (3D Glowing Hotspot Rings) phát sáng trực tiếp trong không gian Three.js + Badges HTML.
 * 7. La bàn định hướng trực quan (Mini Compass / View Angle Radar) xoay theo góc nhìn thực tế.
 * 8. Chế độ Ngày ☀️ / Đêm 🌙 với ánh sáng nội thất đèn vàng ấm áp và âm thanh không gian resort du dương.
 */

class Room3DViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    this.currentRoomId = '301';
    this.roomData = ROOMS_DATA['301'];
    this.currentSubRoom = null;
    this.activeItems = this.roomData.items;
    
    // Trạng thái: 'corridor' -> 'opening' -> 'door_opened' -> 'inside'
    this.state = 'corridor';
    this.isDoorOpen = false;
    this.soundEnabled = true;
    this.isNight = false;
    this.autoRotateEnabled = true;
    this.userInteracting = false;
    this.idleTimer = null;

    // Three.js primitives
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 3D Objects & Groups
    this.corridorGroup = new THREE.Group();
    this.roomInteriorGroup = new THREE.Group();
    this.hotspots3DGroup = new THREE.Group();
    this.doorPivot = null;
    this.doorMesh = null;
    this.doorHandle = null;
    this.ledLockMesh = null;
    this.panoSphere = null;

    // Lights
    this.ambientLight = null;
    this.roomWarmLights = [];
    this.corridorLights = [];

    this.animationFrameId = null;
    this.audioCtx = null;
    this.ambientOscNodes = [];
    this.ambientGainNode = null;
    this.textureLoader = new THREE.TextureLoader();

    this.init();
  }

  init() {
    this.initAudio();
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupControls();
    this.setupEvents();
    
    // Tải phòng mặc định
    this.loadRoom(this.currentRoomId);

    this.animate();
  }

  // ================= 1. HỆ THỐNG ÂM THANH WEB AUDIO API =================

  initAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    } catch (e) {
      console.warn('Web Audio not supported', e);
    }
  }

  resumeAudio() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Tiếng bíp quẹt thẻ từ mở khóa cửa khách sạn
  playKeycardBeep() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.resumeAudio();

    const now = this.audioCtx.currentTime;
    [1760, 2637].forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.07);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.07);
    });
  }

  // Tiếng cạch ổ khóa cơ học & kẽo kẹt mở cửa gỗ
  playDoorSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.resumeAudio();

    const now = this.audioCtx.currentTime;
    
    // Tiếng cạch cơ khí
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);

    // Tiếng kẽo kẹt gỗ mở
    setTimeout(() => {
      if (!this.audioCtx) return;
      const t = this.audioCtx.currentTime;
      const oscCreak = this.audioCtx.createOscillator();
      const gainCreak = this.audioCtx.createGain();
      oscCreak.type = 'sawtooth';
      oscCreak.frequency.setValueAtTime(150, t);
      oscCreak.frequency.linearRampToValueAtTime(185, t + 0.35);
      oscCreak.frequency.linearRampToValueAtTime(120, t + 0.7);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, t);

      gainCreak.gain.setValueAtTime(0.08, t);
      gainCreak.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

      oscCreak.connect(filter);
      filter.connect(gainCreak);
      gainCreak.connect(this.audioCtx.destination);
      oscCreak.start(t);
      oscCreak.stop(t + 0.75);
    }, 110);
  }

  // Tiếng chuông pha lê khi bước vào phòng hoặc chọn đồ vật
  playChimeSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.resumeAudio();

    const now = this.audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.1, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.6);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.6);
    });
  }

  // Âm thanh nền không gian resort du dương (sóng biển nhẹ nhàng hoặc nhạc lounge êm dịu)
  startAmbientSound() {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.stopAmbientSound();
    this.resumeAudio();

    try {
      this.ambientGainNode = this.audioCtx.createGain();
      this.ambientGainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.ambientGainNode.gain.linearRampToValueAtTime(0.05, this.audioCtx.currentTime + 2.5);
      this.ambientGainNode.connect(this.audioCtx.destination);

      // Hòa âm 3 nốt ấm áp thư giãn phong cách Luxury Penthouse
      const notes = this.currentRoomId === '301' ? [220, 330, 440] : [196, 293.66, 392];
      notes.forEach(freq => {
        const osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        const filter = this.audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

        osc.connect(filter);
        filter.connect(this.ambientGainNode);
        osc.start();
        this.ambientOscNodes.push(osc);
      });
    } catch (e) {
      console.warn('Ambient sound error', e);
    }
  }

  stopAmbientSound() {
    if (this.ambientGainNode && this.audioCtx) {
      this.ambientGainNode.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.8);
      setTimeout(() => {
        this.ambientOscNodes.forEach(node => {
          try { node.stop(); node.disconnect(); } catch (e) {}
        });
        this.ambientOscNodes = [];
      }, 850);
    } else {
      this.ambientOscNodes.forEach(node => {
        try { node.stop(); node.disconnect(); } catch (e) {}
      });
      this.ambientOscNodes = [];
    }
  }

  // ================= 2. THIẾT LẬP SCENE, CAMERA, CONTROLS =================

  setupRenderer() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';

    this.container.appendChild(this.renderer.domElement);
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0f17);

    // Ánh sáng môi trường tổng
    this.ambientLight = new THREE.AmbientLight(0xfff7ed, 0.95);
    this.scene.add(this.ambientLight);

    // Thêm các nhóm vào cảnh
    this.scene.add(this.corridorGroup);
    this.scene.add(this.roomInteriorGroup);
    this.scene.add(this.hotspots3DGroup);
  }

  setupCamera() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 100);
    this.camera.position.set(0, 1.45, 5.0);
    this.camera.lookAt(0, 1.45, 3.2);
  }

  setupControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.rotateSpeed = -0.38; // Chuẩn xoay mượt mà ảo ảnh thực tế 360°
    this.controls.enableZoom = true;
    this.controls.minDistance = 0.05;
    this.controls.maxDistance = 15.0; // Cho phép camera di chuyển 3D vật lý linh hoạt
    this.controls.target.set(0, 1.5, 3.2);
    this.controls.enabled = false;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 0.45;
  }

  setupEvents() {
    window.addEventListener('resize', () => this.onWindowResize());

    const dom = this.renderer.domElement;
    dom.addEventListener('pointermove', (e) => this.onPointerMove(e));
    dom.addEventListener('click', (e) => this.onClick(e));

    // Nhận biết tương tác để tạm dừng & khôi phục Auto-Rotate
    const handleInteractStart = () => {
      this.userInteracting = true;
      if (this.controls) this.controls.autoRotate = false;
      if (this.idleTimer) clearTimeout(this.idleTimer);
    };

    const handleInteractEnd = () => {
      this.userInteracting = false;
      if (this.idleTimer) clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        if (!this.userInteracting && this.autoRotateEnabled && this.state === 'inside') {
          if (this.controls) this.controls.autoRotate = true;
        }
      }, 3500);
    };

    dom.addEventListener('pointerdown', handleInteractStart);
    dom.addEventListener('pointerup', handleInteractEnd);
    dom.addEventListener('wheel', () => {
      handleInteractStart();
      handleInteractEnd();
    }, { passive: true });
  }

  onWindowResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.updateHotspotPositions();
  }

  onPointerMove(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.state === 'corridor') {
      if (this.doorMesh) {
        const intersects = this.raycaster.intersectObject(this.doorMesh, true);
        this.renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
      }
    } else if (this.state === 'door_opened') {
      this.renderer.domElement.style.cursor = 'pointer';
    } else if (this.state === 'inside') {
      // Kiểm tra raycast với điểm Hotspot 3D
      const hitHotspots = this.raycaster.intersectObjects(this.hotspots3DGroup.children, true);
      if (hitHotspots.length > 0) {
        this.renderer.domElement.style.cursor = 'pointer';
      } else {
        this.renderer.domElement.style.cursor = this.userInteracting ? 'grabbing' : 'grab';
      }
    }
  }

  onClick(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    if (this.state === 'corridor') {
      let isDoorClicked = false;
      if (this.doorMesh) {
        const intersects = this.raycaster.intersectObject(this.doorMesh, true);
        if (intersects.length > 0) isDoorClicked = true;
      }
      
      const planeZ32 = new THREE.Plane(new THREE.Vector3(0, 0, 1), -3.2);
      const targetPt = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(planeZ32, targetPt)) {
        if (Math.abs(targetPt.x) < 1.15 && targetPt.y > 0 && targetPt.y < 2.7) {
          isDoorClicked = true;
        }
      }

      if (isDoorClicked) {
        this.openDoor();
      }
    } else if (this.state === 'door_opened') {
      this.walkIntoRoom();
    } else if (this.state === 'inside') {
      // Click trực tiếp vào 3D Hotspot Ring
      const hitHotspots = this.raycaster.intersectObjects(this.hotspots3DGroup.children, true);
      if (hitHotspots.length > 0) {
        let obj = hitHotspots[0].object;
        while (obj && !obj.userData?.itemId && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.itemId) {
          this.focusItem(obj.userData.itemId);
        }
      }
    }
  }

  // ================= 3. TẢI DỮ LIỆU PHÒNG & THIẾT LẬP =================

  loadRoom(roomId) {
    this.currentRoomId = roomId;
    this.roomData = ROOMS_DATA[roomId] || ROOMS_DATA['301'];
    this.currentSubRoom = null;
    this.activeItems = this.roomData.items;
    this.isDoorOpen = false;
    this.state = 'corridor';
    this.isNight = !!this.roomData.theme?.isNightDefault;

    // Xóa vật thể cũ
    this.clearGroup(this.corridorGroup);
    this.clearGroup(this.roomInteriorGroup);
    this.clearGroup(this.hotspots3DGroup);

    if (this.panoSphere) {
      this.scene.remove(this.panoSphere);
      if (this.panoSphere.geometry) this.panoSphere.geometry.dispose();
      if (this.panoSphere.material) this.panoSphere.material.dispose();
      this.panoSphere = null;
    }

    // 1. Xây dựng sảnh ngoài & cánh cửa 3D
    this.buildCorridor();

    // 2. Xây dựng hình cầu 360° ảnh thật với fallback lập tức
    this.build360PhotoSphere();

    // 3. Xây dựng điểm ghim Hotspot 3D trực quan
    this.build3DHotspots();

    // 4. Đưa camera về vị trí sảnh ngoài
    this.resetToCorridorView();

    // 5. Cập nhật ánh sáng theo chế độ ngày/đêm của phòng
    this.applyDayNightLighting();

    if (typeof this.options.onRoomLoaded === 'function') {
      this.options.onRoomLoaded(this.roomData);
    }
    if (typeof this.options.onStateChange === 'function') {
      this.options.onStateChange(this.state);
    }
  }

  clearGroup(group) {
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
  }

  // ================= 4. SẢNH NGOÀI 3D & CỬA GỖ MẠ VÀNG =================

  buildCorridor() {
    const isDarkSuite = this.roomData.id === '502';
    this.corridorLights = [];

    // Sàn sảnh ngoài
    const floorGeo = new THREE.PlaneGeometry(6, 6);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isDarkSuite ? 0x222630 : 0x42342a,
      roughness: 0.35
    });
    const corridorFloor = new THREE.Mesh(floorGeo, floorMat);
    corridorFloor.rotation.x = -Math.PI / 2;
    corridorFloor.position.set(0, 0, 5.5);
    this.corridorGroup.add(corridorFloor);

    // Thảm nhung đón khách sang trọng
    const runnerGeo = new THREE.PlaneGeometry(1.8, 5.5);
    const runnerMat = new THREE.MeshStandardMaterial({
      color: isDarkSuite ? 0x0f2e46 : 0x821c24,
      roughness: 0.8
    });
    const runner = new THREE.Mesh(runnerGeo, runnerMat);
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, 0.008, 5.5);
    this.corridorGroup.add(runner);

    // Trần sảnh
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshStandardMaterial({ color: 0x1a1e26, roughness: 0.9 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 3.4, 5.5);
    this.corridorGroup.add(ceiling);

    // Tường 2 bên hành lang
    const sideWallGeo = new THREE.BoxGeometry(0.2, 3.4, 5.5);
    const sideWallMat = new THREE.MeshStandardMaterial({ color: 0x242934, roughness: 0.7 });
    
    const leftWall = new THREE.Mesh(sideWallGeo, sideWallMat);
    leftWall.position.set(-3.0, 1.7, 5.5);
    this.corridorGroup.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, sideWallMat);
    rightWall.position.set(3.0, 1.7, 5.5);
    this.corridorGroup.add(rightWall);

    // Bức tường chính diện (Z = 3.2)
    const wallMat = new THREE.MeshStandardMaterial({
      color: isDarkSuite ? 0x181f2b : 0x332822,
      roughness: 0.6
    });
    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 0.25), wallMat);
    wallLeft.position.set(-1.85, 1.7, 3.2);
    this.corridorGroup.add(wallLeft);

    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 0.25), wallMat);
    wallRight.position.set(1.85, 1.7, 3.2);
    this.corridorGroup.add(wallRight);

    const wallTop = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.85, 0.25), wallMat);
    wallTop.position.set(0, 2.975, 3.2);
    this.corridorGroup.add(wallTop);

    // Khung bao cửa mạ viền vàng óng (Khung rỗng 3 cạnh: Trái, Phải, Trên)
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x16120e, roughness: 0.25, metalness: 0.3 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.15, metalness: 0.9 });

    // Cột khung trái
    const postLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.56, 0.16), frameMat);
    postLeft.position.set(-0.63, 1.28, 3.24);
    this.corridorGroup.add(postLeft);

    const trimLeft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.56, 0.04), goldTrimMat);
    trimLeft.position.set(-0.58, 1.28, 3.32);
    this.corridorGroup.add(trimLeft);

    // Cột khung phải
    const postRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.56, 0.16), frameMat);
    postRight.position.set(0.63, 1.28, 3.24);
    this.corridorGroup.add(postRight);

    const trimRight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.56, 0.04), goldTrimMat);
    trimRight.position.set(0.58, 1.28, 3.32);
    this.corridorGroup.add(trimRight);

    // Xà ngang trên
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.1, 0.16), frameMat);
    lintel.position.set(0, 2.51, 3.24);
    this.corridorGroup.add(lintel);

    const trimTop = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.02, 0.04), goldTrimMat);
    trimTop.position.set(0, 2.47, 3.32);
    this.corridorGroup.add(trimTop);

    // Biển số phòng mạ vàng phát sáng rực rỡ
    const signGeo = new THREE.BoxGeometry(0.7, 0.35, 0.05);
    const signTex = TextureGenerator.createRoomSignTexture(this.roomData.roomNumber, this.roomData.shortName);
    const signMat = new THREE.MeshStandardMaterial({
      map: signTex,
      roughness: 0.2,
      metalness: 0.7,
      emissive: new THREE.Color(0xd4af37),
      emissiveIntensity: 0.4
    });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, 2.58, 3.34);
    this.corridorGroup.add(signMesh);

    // Đèn rọi biển số phòng
    const signLight = new THREE.PointLight(0xfff0c4, 2.2, 3.5);
    signLight.position.set(0, 2.75, 3.7);
    this.corridorGroup.add(signLight);
    this.corridorLights.push(signLight);

    // 2 Đèn hắt tường vàng sang trọng
    [-1.6, 1.6].forEach(x => {
      const sconceBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.28),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 })
      );
      sconceBase.position.set(x, 2.0, 3.38);
      this.corridorGroup.add(sconceBase);

      const sconceLight = new THREE.PointLight(0xffb84d, 1.8, 4.5);
      sconceLight.position.set(x, 2.0, 3.5);
      this.corridorGroup.add(sconceLight);
      this.corridorLights.push(sconceLight);
    });

    const corridorCeilingLight = new THREE.PointLight(0xfff2d4, 1.9, 6.0);
    corridorCeilingLight.position.set(0, 3.2, 4.8);
    this.corridorGroup.add(corridorCeilingLight);
    this.corridorLights.push(corridorCeilingLight);

    // CÁNH CỬA GỖ MỞ ĐƯỢC
    this.doorPivot = new THREE.Group();
    this.doorPivot.position.set(-0.58, 0, 3.24);

    const doorGeo = new THREE.BoxGeometry(1.16, 2.48, 0.08);
    const doorTex = TextureGenerator.createDoorWoodTexture(isDarkSuite);
    const doorMat = new THREE.MeshStandardMaterial({
      map: doorTex,
      roughness: 0.3,
      metalness: 0.08
    });
    this.doorMesh = new THREE.Mesh(doorGeo, doorMat);
    this.doorMesh.name = 'doorMesh';
    this.doorMesh.position.set(0.58, 1.24, 0);
    this.doorMesh.castShadow = true;
    this.doorMesh.receiveShadow = true;

    // Tay nắm cửa & Ổ khóa quẹt thẻ từ khách sạn
    const handleGroup = new THREE.Group();
    handleGroup.position.set(1.02, 1.15, 0.05);

    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.26, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 })
    );
    handleGroup.add(plate);

    const lever = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.025, 0.05),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 })
    );
    lever.position.set(0.05, -0.02, 0.025);
    handleGroup.add(lever);

    // Đèn LED thẻ từ (Cyan lúc chờ, Xanh lục khi mở khóa)
    this.ledLockMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    this.ledLockMesh.position.set(0, 0.08, 0.015);
    handleGroup.add(this.ledLockMesh);

    this.doorHandle = handleGroup;
    this.doorMesh.add(handleGroup);
    this.doorPivot.add(this.doorMesh);
    this.corridorGroup.add(this.doorPivot);
  }

  // ================= 5. HÌNH CẦU 360° ẢNH THỰC TẾ & TẢI NHANH =================

  build360PhotoSphere() {
    const sphereGeo = new THREE.SphereGeometry(25, 64, 48);
    sphereGeo.scale(-1, 1, 1); // Lộn mặt trong để nhìn từ tâm quả cầu

    // Tạo ngay texture dự phòng procedural chất lượng cao (Không bao giờ bị màn hình đen)
    const fallbackTex = TextureGenerator.createPanoramaTexture(this.isNight);
    fallbackTex.encoding = THREE.sRGBEncoding;

    const sphereMat = new THREE.MeshBasicMaterial({
      map: fallbackTex
    });

    this.panoSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.panoSphere.position.set(0, 0, 0);
    this.panoSphere.visible = false;
    this.scene.add(this.panoSphere);

    // Tải ảnh chụp 360° Panorama thực tế (ưu tiên file nội bộ, dự phòng CDN)
    const panoUrl = this.roomData.panorama360Url;
    if (panoUrl) {
      if (typeof this.options.onLoadingProgress === 'function') {
        this.options.onLoadingProgress(35, false);
      }

      const applyTexture = (texture) => {
        texture.encoding = THREE.sRGBEncoding;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        if (!this.loadedTextures) this.loadedTextures = {};
        this.loadedTextures[panoUrl] = texture;
        if (this.panoSphere && this.panoSphere.material) {
          this.panoSphere.material.map = texture;
          this.panoSphere.material.needsUpdate = true;
        }
        if (typeof this.options.onLoadingProgress === 'function') {
          this.options.onLoadingProgress(100, true);
        }
        if (this.renderer) this.renderer.render(this.scene, this.camera);

        // Tải trước texture của các phòng vệ tinh (như phòng tắm) để khi bấm vào là chuyển cảnh tức thì
        if (this.roomData.subRooms) {
          Object.values(this.roomData.subRooms).forEach(sub => {
            if (sub.panorama360Url && (!this.loadedTextures || !this.loadedTextures[sub.panorama360Url])) {
              this.textureLoader.load(sub.panorama360Url, (subTex) => {
                subTex.encoding = THREE.sRGBEncoding;
                subTex.generateMipmaps = true;
                subTex.minFilter = THREE.LinearMipmapLinearFilter;
                if (!this.loadedTextures) this.loadedTextures = {};
                this.loadedTextures[sub.panorama360Url] = subTex;
              });
            }
          });
        }
      };

      this.textureLoader.load(
        panoUrl,
        (loadedTexture) => {
          applyTexture(loadedTexture);
        },
        (xhr) => {
          if (xhr.lengthComputable && typeof this.options.onLoadingProgress === 'function') {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            this.options.onLoadingProgress(percent, false);
          }
        },
        (err) => {
          if (this.roomData.panorama360FallbackUrl && panoUrl !== this.roomData.panorama360FallbackUrl) {
            console.log('Thử tải ảnh dự phòng PolyHaven:', this.roomData.panorama360FallbackUrl);
            this.textureLoader.load(
              this.roomData.panorama360FallbackUrl,
              applyTexture,
              undefined,
              (fallbackErr) => {
                console.warn('Lỗi tải ảnh 360 ngoài mạng, tiếp tục dùng texture canvas:', fallbackErr);
                if (typeof this.options.onLoadingProgress === 'function') {
                  this.options.onLoadingProgress(100, true);
                }
              }
            );
          } else {
            console.warn('Lỗi tải ảnh 360, tiếp tục dùng texture canvas:', err);
            if (typeof this.options.onLoadingProgress === 'function') {
              this.options.onLoadingProgress(100, true);
            }
          }
        }
      );
    }
  }

  // ================= 6. ĐIỂM GHIM 3D (3D HOTSPOT RINGS) =================

  build3DHotspots() {
    this.buildHotspotsFromItems(this.activeItems || this.roomData.items);
  }

  buildHotspotsFromItems(items) {
    this.clearGroup(this.hotspots3DGroup);

    items.forEach(item => {
      const markerGroup = new THREE.Group();
      markerGroup.userData = { itemId: item.id, item: item };

      // Hướng định vị chính xác trên mặt cầu (bán kính 22m gần mặt trong quả cầu 25m)
      const dir = new THREE.Vector3(item.position.x, item.position.y, item.position.z).normalize();
      const markerPos = dir.clone().multiplyScalar(22);
      markerGroup.position.copy(markerPos);
      markerGroup.lookAt(0, 0, 0);

      // Điểm liên kết cửa phòng (Portal / Cửa phòng tắm hoặc Cửa quay lại phòng ngủ)
      const isPortal = !!item.isPortal || !!item.isBackPortal;
      const ringColor = isPortal ? 0x38bdf8 : 0xd4af37;

      // Vòng tròn phát sáng ngoài
      const ringGeo = new THREE.RingGeometry(0.42, 0.58, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      markerGroup.add(ringMesh);

      // Điểm ngọc tâm phát sáng
      const coreGeo = new THREE.CircleGeometry(0.22, 24);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      markerGroup.add(coreMesh);

      // Vùng tương tác click rộng rãi (Invisible hit circle)
      const hitGeo = new THREE.CircleGeometry(1.2, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { itemId: item.id, item: item };
      markerGroup.add(hitMesh);

      this.hotspots3DGroup.add(markerGroup);
    });

    this.hotspots3DGroup.visible = this.state === 'inside';
  }

  // ================= 7. CHUYỂN ĐỘNG & TƯƠNG TÁC =================

  resetToCorridorView() {
    this.state = 'corridor';
    this.isDoorOpen = false;
    this.currentSubRoom = null;
    this.activeItems = this.roomData.items;
    this.controls.enabled = false;
    this.controls.autoRotate = false;

    this.stopAmbientSound();

    this.corridorGroup.visible = true;
    if (this.panoSphere) this.panoSphere.visible = false;
    this.hotspots3DGroup.visible = false;

    if (this.doorPivot) {
      this.doorPivot.rotation.y = 0;
    }
    if (this.ledLockMesh) {
      this.ledLockMesh.material.color.setHex(0x00f0ff);
    }

    this.camera.fov = 58;
    this.camera.updateProjectionMatrix();

    this.camera.position.set(0, 1.45, 5.0);
    this.controls.target.set(0, 1.45, 3.2);
    this.camera.lookAt(0, 1.45, 3.2);

    if (typeof this.options.onStateChange === 'function') {
      this.options.onStateChange(this.state);
    }
  }

  // 1. Mở cửa phòng (Door swing) & Tự động bước vào phòng
  openDoor(onComplete) {
    if (this.isDoorOpen || !this.doorPivot) return;
    this.isDoorOpen = true;

    // Âm thanh quẹt thẻ & đèn xanh sáng
    this.playKeycardBeep();
    if (this.ledLockMesh) {
      this.ledLockMesh.material.color.setHex(0x00ff88);
    }

    if (typeof this.options.onStateChange === 'function') {
      this.options.onStateChange('opening');
    }

    setTimeout(() => {
      this.playDoorSound();

      gsap.to(this.doorPivot.rotation, {
        y: -Math.PI * 0.58,
        duration: 1.25,
        ease: 'power2.out',
        onComplete: () => {
          this.state = 'door_opened';
          if (typeof this.options.onStateChange === 'function') {
            this.options.onStateChange(this.state);
          }
          if (typeof onComplete === 'function') {
            onComplete();
          } else {
            // Tự động bước vào trong phòng ngay khi cánh cửa mở ra xong, không cần bấm thêm!
            setTimeout(() => {
              this.walkIntoRoom();
            }, 80);
          }
        }
      });
    }, 200);
  }

  // 2. Bước vào trong không gian ảnh thật 360°
  walkIntoRoom(onComplete) {
    if (!this.isDoorOpen) {
      this.openDoor(() => this.walkIntoRoom(onComplete));
      return;
    }

    this.state = 'inside';
    this.controls.enabled = false;

    this.playChimeSound();
    this.startAmbientSound();

    const timeline = gsap.timeline({
      onComplete: () => {
        // Ẩn sảnh ngoài, hiện toàn cảnh 360 độ
        this.corridorGroup.visible = false;
        if (this.panoSphere) this.panoSphere.visible = true;
        this.hotspots3DGroup.visible = true;

        this.camera.position.set(0, 0, 0.05);
        this.controls.target.set(0, 0, -1);
        this.controls.enabled = true;
        this.controls.autoRotate = this.autoRotateEnabled;

        if (typeof this.options.onStateChange === 'function') {
          this.options.onStateChange(this.state);
        }
        if (typeof onComplete === 'function') onComplete();
      }
    });

    // Camera lướt qua cửa vào giữa phòng
    timeline.to(this.camera.position, {
      x: 0,
      y: 1.5,
      z: 3.1,
      duration: 1.5,
      ease: 'power2.in'
    }, 0);
  }

  // 3. Zoom & Xoay camera mượt mà vào đồ vật (360 Panoramic Precision View)
  focusItem(itemId) {
    const items = this.activeItems || this.roomData.items;
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (this.state !== 'inside') {
      this.walkIntoRoom(() => this.focusItem(itemId));
      return;
    }

    // Nếu nhấp vào cửa chuyển sang phòng tắm
    if (item.isPortal && item.targetRoom) {
      this.enterSubRoom(item.targetRoom);
      return;
    }

    // Nếu nhấp vào cửa quay lại phòng ngủ
    if (item.isBackPortal || item.id === 'back_to_bedroom') {
      this.exitSubRoom();
      return;
    }

    this.playChimeSound();

    if (this.controls) {
      this.controls.autoRotate = false;
    }

    // Vector hướng chuẩn hóa của đồ vật trong không gian 3D
    const targetDir = new THREE.Vector3(item.position.x, item.position.y, item.position.z).normalize();
    const lookTarget = targetDir.clone().multiplyScalar(10);
    const centerCamPos = new THREE.Vector3(0, 0, 0.05);

    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.controls.target);
    gsap.killTweensOf(this.camera);

    const travelTimeline = gsap.timeline({
      onComplete: () => {
        if (this.controls) {
          this.controls.target.copy(lookTarget);
          this.controls.update();
        }
      }
    });

    // Giữ camera tại tâm phòng (0, 0, 0.05) để tránh méo hình quả cầu 360
    travelTimeline.to(this.camera.position, {
      x: centerCamPos.x,
      y: centerCamPos.y,
      z: centerCamPos.z,
      duration: 1.0,
      ease: 'power2.inOut'
    }, 0);

    // Xoay góc nhìn camera thẳng vào tâm điểm đồ vật
    travelTimeline.to(this.controls.target, {
      x: lookTarget.x,
      y: lookTarget.y,
      z: lookTarget.z,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (this.controls) this.controls.update();
      }
    }, 0);

    // Phóng to tiêu cự camera (FOV từ 58 xuống 32) để chiêm ngưỡng cận cảnh cực nét
    travelTimeline.to(this.camera, {
      fov: 32,
      duration: 1.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.camera.updateProjectionMatrix();
      }
    }, 0);

    if (typeof this.options.onSelectItem === 'function') {
      this.options.onSelectItem(item);
    }
  }

  // 3b. Mở cửa & Bước vào phòng tắm riêng (Sub-room Virtual Tour Navigation)
  // 3b. Mở cửa & Bước vào phòng tắm riêng (Sub-room Virtual Tour Navigation)
  enterSubRoom(subRoomKey = 'bathroom') {
    if (this.state !== 'inside') {
      this.walkIntoRoom(() => this.enterSubRoom(subRoomKey));
      return;
    }
    const subRoom = this.roomData.subRooms?.[subRoomKey];
    if (!subRoom) return;

    this.currentSubRoom = subRoomKey;
    this.playDoorSound();

    if (typeof this.options.onBeforeSceneTransition === 'function') {
      this.options.onBeforeSceneTransition(subRoomKey);
    }

    // Camera di chuyển nhẹ hướng về cửa phòng tắm trước khi mở
    const itemBath = this.roomData.items.find(i => i.id === 'bath');
    if (itemBath) {
      const bathDir = new THREE.Vector3(itemBath.position.x, itemBath.position.y, itemBath.position.z).normalize();
      gsap.to(this.controls.target, {
        x: bathDir.x * 10,
        y: bathDir.y * 10,
        z: bathDir.z * 10,
        duration: 0.35,
        ease: 'power2.out'
      });
    }

    setTimeout(() => {
      // 1. Tải ảnh chụp 360° của phòng tắm
      const applyTexture = (tex) => {
        tex.encoding = THREE.sRGBEncoding;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        if (this.panoSphere && this.panoSphere.material) {
          this.panoSphere.material.map = tex;
          this.panoSphere.material.needsUpdate = true;
        }
        if (this.renderer) this.renderer.render(this.scene, this.camera);
      };

      if (!this.loadedTextures) this.loadedTextures = {};
      if (this.loadedTextures[subRoom.panorama360Url]) {
        applyTexture(this.loadedTextures[subRoom.panorama360Url]);
      } else {
        this.textureLoader.load(subRoom.panorama360Url, (tex) => {
          this.loadedTextures[subRoom.panorama360Url] = tex;
          applyTexture(tex);
        }, undefined, () => {
          if (subRoom.panorama360FallbackUrl) {
            this.textureLoader.load(subRoom.panorama360FallbackUrl, applyTexture);
          }
        });
      }

      // 2. Cập nhật danh sách điểm ghim của phòng tắm
      this.activeItems = subRoom.items;
      this.buildHotspotsFromItems(subRoom.items);

      // 3. Đặt camera nhìn vào bồn tắm & lavabo
      this.camera.position.set(0, 0, 0.05);
      const initTarget = subRoom.initialTarget || { x: -2.57, y: -1.54, z: -0.11 };
      this.controls.target.set(initTarget.x * 3, initTarget.y * 3, initTarget.z * 3);
      this.camera.fov = 58;
      this.camera.updateProjectionMatrix();
      if (this.controls) this.controls.update();

      this.playChimeSound();

      if (typeof this.options.onSubRoomChange === 'function') {
        this.options.onSubRoomChange(subRoom);
      }
      if (typeof this.options.onAfterSceneTransition === 'function') {
        this.options.onAfterSceneTransition();
      }
    }, 380);
  }

  // 3c. Quay trở lại phòng ngủ chính từ phòng tắm
  exitSubRoom() {
    if (!this.currentSubRoom) return;
    this.currentSubRoom = null;
    this.playDoorSound();

    if (typeof this.options.onBeforeSceneTransition === 'function') {
      this.options.onBeforeSceneTransition('bedroom');
    }

    setTimeout(() => {
      // 1. Tải lại ảnh 360 phòng ngủ
      const applyTexture = (tex) => {
        tex.encoding = THREE.sRGBEncoding;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        if (this.panoSphere && this.panoSphere.material) {
          this.panoSphere.material.map = tex;
          this.panoSphere.material.needsUpdate = true;
        }
        if (this.renderer) this.renderer.render(this.scene, this.camera);
      };

      if (!this.loadedTextures) this.loadedTextures = {};
      if (this.loadedTextures[this.roomData.panorama360Url]) {
        applyTexture(this.loadedTextures[this.roomData.panorama360Url]);
      } else {
        this.textureLoader.load(this.roomData.panorama360Url, (tex) => {
          this.loadedTextures[this.roomData.panorama360Url] = tex;
          applyTexture(tex);
        });
      }

      // 2. Khôi phục lại các điểm ghim phòng ngủ
      this.activeItems = this.roomData.items;
      this.buildHotspotsFromItems(this.roomData.items);

      // 3. Đặt góc nhìn nhìn ra giường ngủ chính
      this.camera.position.set(0, 0, 0.05);
      this.controls.target.set(0, 0, -1);
      this.camera.fov = 58;
      this.camera.updateProjectionMatrix();
      if (this.controls) this.controls.update();

      this.playChimeSound();

      if (typeof this.options.onSubRoomChange === 'function') {
        this.options.onSubRoomChange(null);
      }
      if (typeof this.options.onAfterSceneTransition === 'function') {
        this.options.onAfterSceneTransition();
      }
    }, 380);
  }

  // 4. Quay lại góc nhìn toàn cảnh phòng 360 (Mở rộng góc nhìn FOV 58)
  resetToOverview() {
    if (this.state !== 'inside') return;

    gsap.killTweensOf(this.camera.position);
    gsap.killTweensOf(this.controls.target);
    gsap.killTweensOf(this.camera);

    const currentDir = new THREE.Vector3();
    this.camera.getWorldDirection(currentDir);
    const returnTarget = currentDir.clone().multiplyScalar(10);

    const resetTimeline = gsap.timeline({
      onComplete: () => {
        if (this.controls) {
          this.controls.target.copy(returnTarget);
          if (this.autoRotateEnabled) {
            this.controls.autoRotate = true;
          }
          this.controls.update();
        }
      }
    });

    resetTimeline.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 0.05,
      duration: 0.85,
      ease: 'power2.out'
    }, 0);

    resetTimeline.to(this.controls.target, {
      x: returnTarget.x,
      y: returnTarget.y,
      z: returnTarget.z,
      duration: 0.85,
      ease: 'power2.out',
      onUpdate: () => {
        if (this.controls) this.controls.update();
      }
    }, 0);

    resetTimeline.to(this.camera, {
      fov: 58,
      duration: 0.85,
      ease: 'power2.out',
      onUpdate: () => {
        this.camera.updateProjectionMatrix();
      }
    }, 0);

    if (typeof this.options.onSelectItem === 'function') {
      this.options.onSelectItem(null);
    }
  }

  // 5. Điều khiển phóng to / thu nhỏ linh hoạt
  zoomIn() {
    this.setFov(this.camera.fov - 8);
  }

  zoomOut() {
    this.setFov(this.camera.fov + 8);
  }

  setFov(targetFov) {
    const clampedFov = Math.max(25, Math.min(75, targetFov));
    gsap.to(this.camera, {
      fov: clampedFov,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => {
        this.camera.updateProjectionMatrix();
      }
    });
  }

  // 6. Bật / Tắt Tự động xoay 360° (Auto-Rotate)
  toggleAutoRotate() {
    this.autoRotateEnabled = !this.autoRotateEnabled;
    if (this.controls && this.state === 'inside') {
      this.controls.autoRotate = this.autoRotateEnabled;
    }
    return this.autoRotateEnabled;
  }

  // 7. Chuyển đổi Ngày ☀️ / Đêm 🌙
  toggleDayNight() {
    this.isNight = !this.isNight;
    this.applyDayNightLighting();
    return this.isNight;
  }

  applyDayNightLighting() {
    if (this.isNight) {
      // Đêm: Ánh sáng êm dịu, ấm cúng
      if (this.ambientLight) this.ambientLight.intensity = 0.8;
      if (this.panoSphere && this.panoSphere.material) {
        this.panoSphere.material.color.setHex(0xa6b1c4);
      }
      this.corridorLights.forEach(light => { light.intensity = 1.2; });
    } else {
      // Ngày: Ánh sáng rực rỡ chan hòa
      if (this.ambientLight) this.ambientLight.intensity = 1.8;
      if (this.panoSphere && this.panoSphere.material) {
        this.panoSphere.material.color.setHex(0xffffff);
      }
      this.corridorLights.forEach(light => { light.intensity = 2.0; });
    }
  }

  // Đồng bộ vị trí ghim Hotspot HTML & La bàn radar trên màn hình
  updateHotspotPositions() {
    if (typeof this.options.onUpdateHotspots === 'function') {
      const positions = {};
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      const camDir = new THREE.Vector3();
      this.camera.getWorldDirection(camDir);

      const currentItems = this.activeItems || this.roomData.items;
      currentItems.forEach(item => {
        const itemDir = new THREE.Vector3(item.position.x, item.position.y, item.position.z).normalize();
        const dot = itemDir.dot(camDir);

        // Marker vị trí trong không gian 3D
        const pos3d = itemDir.clone().multiplyScalar(18);
        pos3d.project(this.camera);

        const isVisible = dot > 0.15 && pos3d.z < 1.0;
        const x = (pos3d.x * 0.5 + 0.5) * width;
        const y = (-(pos3d.y * 0.5) + 0.5) * height;

        positions[item.id] = { x, y, visible: isVisible && this.state === 'inside' };
      });

      this.options.onUpdateHotspots(positions);
    }

    // Cập nhật la bàn định hướng
    if (typeof this.options.onUpdateCompass === 'function') {
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      const angleRad = Math.atan2(dir.x, -dir.z);
      const angleDeg = THREE.MathUtils.radToDeg(angleRad);
      this.options.onUpdateCompass(angleDeg);
    }
  }

  // Vòng lặp Render chính
  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.controls && this.controls.enabled) {
      this.controls.update();
    }

    // Hiệu ứng thở nhẹ nhàng cho các điểm ghim 3D
    if (this.state === 'inside' && this.hotspots3DGroup.visible) {
      const scaleVal = 1 + Math.sin(Date.now() * 0.005) * 0.08;
      this.hotspots3DGroup.children.forEach(marker => {
        marker.scale.set(scaleVal, scaleVal, scaleVal);
      });
      this.updateHotspotPositions();
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.stopAmbientSound();
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
