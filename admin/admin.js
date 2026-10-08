/**
 * admin.js - Vue 3 Admin Studio Controller
 * Quản lý danh sách phòng, tích hợp Three.js 3D Tour Studio,
 * cho phép click trực quan trên ảnh 360 để lấy tọa độ đồ vật và lưu vào Laravel API.
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const { createApp, ref, reactive, computed, onMounted, nextTick } = Vue;

const app = createApp({
  setup() {
    const currentTab = ref('rooms'); // 'rooms' | 'studio'
    const loading = ref(false);
    const rooms = ref([]);
    const selectedRoom = ref(null);
    const selectedScene = ref(null);

    // Modals
    const showRoomModal = ref(false);
    const showSceneModal = ref(false);
    const isEditRoom = ref(false);

    // Toast
    const toast = reactive({ show: false, message: '', type: 'success' });
    const triggerToast = (msg, type = 'success') => {
      toast.message = msg;
      toast.type = type;
      toast.show = true;
      setTimeout(() => { toast.show = false; }, 3000);
    };

    // Room Form
    const roomForm = reactive({
      id: null,
      room_number: '',
      name: '',
      short_name: '',
      price: 2500000,
      area: '45 m²',
      capacity: '2 Người lớn',
      bed_type: '1 Giường King-Size',
      view_type: 'Hướng biển Panorama',
      badge: 'Phòng Mới',
      tagline: '',
      room_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      panorama_360_url: 'hotel_room_preview.jpg'
    });

    // Sub-Room (Scene) Form
    const sceneForm = reactive({
      scene_key: '',
      name: '',
      short_name: '',
      tagline: '',
      panorama_360_url: ''
    });

    // Hotspot Form
    const hotspotForm = reactive({
      id: null,
      item_key: '',
      name: '',
      short_name: '',
      category: 'Nội Thất & Tiện Nghi',
      icon: '📍',
      type: 'item', // 'item' | 'portal' | 'back_portal'
      target_room_key: '',
      image_url: '',
      position_x: 0,
      position_y: 0,
      position_z: -3.0,
      description: '',
      specsText: ''
    });

    const isCreatingHotspot = ref(false);

    const availableIcons = ['🛏️', '📺', '🌊', '🛁', '🚪', '☕', '🛡️', '💡', '💼', '🍸', '🧴', '🧣', '🪞', '🛋️', '✨', '🏺', '🛣️'];

    // ================= 1. GỌI LARAVEL REST API =================

    const fetchRooms = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`${API_BASE_URL}/rooms`);
        rooms.value = res.data;
        if (!selectedRoom.value && rooms.value.length > 0) {
          selectedRoom.value = rooms.value[0];
          if (selectedRoom.value.scenes && selectedRoom.value.scenes.length > 0) {
            selectedScene.value = selectedRoom.value.scenes[0];
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải phòng từ Laravel:', err);
        triggerToast('Không thể kết nối đến Laravel API. Hãy chắc chắn máy chủ đang chạy tại port 8000!', 'error');
      } finally {
        loading.value = false;
      }
    };

    const openCreateRoom = () => {
      isEditRoom.value = false;
      Object.assign(roomForm, {
        id: null,
        room_number: (300 + rooms.value.length + 1).toString(),
        name: `Phòng ${300 + rooms.value.length + 1} - Executive Sea Suite`,
        short_name: 'Sea Suite',
        price: 2600000,
        area: '50 m²',
        capacity: '2 Người lớn + 1 Trẻ em',
        bed_type: '1 Giường King-Size',
        view_type: 'Hướng biển Panorama',
        badge: 'Hạng Phòng Mới',
        tagline: 'Không gian nghỉ dưỡng tiện nghi đẳng cấp với view biển',
        room_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        panorama_360_url: 'hotel_room_preview.jpg'
      });
      showRoomModal.value = true;
    };

    const openEditRoom = (room) => {
      isEditRoom.value = true;
      Object.assign(roomForm, {
        id: room.id,
        room_number: room.room_number,
        name: room.name,
        short_name: room.short_name,
        price: room.price,
        area: room.area,
        capacity: room.capacity,
        bed_type: room.bed_type,
        view_type: room.view_type,
        badge: room.badge,
        tagline: room.tagline,
        room_image: room.room_image,
        panorama_360_url: room.panorama_360_url
      });
      showRoomModal.value = true;
    };

    const saveRoom = async () => {
      try {
        if (isEditRoom.value) {
          await axios.put(`${API_BASE_URL}/rooms/${roomForm.id}`, roomForm);
          triggerToast('Đã cập nhật thông tin phòng thành công!');
        } else {
          await axios.post(`${API_BASE_URL}/rooms`, roomForm);
          triggerToast('Đã thêm phòng mới vào hệ thống!');
        }
        showRoomModal.value = false;
        await fetchRooms();
      } catch (err) {
        triggerToast('Lỗi khi lưu phòng: ' + (err.response?.data?.message || err.message), 'error');
      }
    };

    const deleteRoom = async (room) => {
      if (!confirm(`Bạn có chắc chắn muốn xóa phòng ${room.room_number}?`)) return;
      try {
        await axios.delete(`${API_BASE_URL}/rooms/${room.id}`);
        triggerToast(`Đã xóa phòng ${room.room_number}`);
        await fetchRooms();
      } catch (err) {
        triggerToast('Lỗi khi xóa: ' + err.message, 'error');
      }
    };

    // ================= 2. QUẢN LÝ KHÔNG GIAN CON (SCENES / PORTALS) =================

    const openAddScene = () => {
      Object.assign(sceneForm, {
        scene_key: 'balcony_' + Date.now().toString().slice(-4),
        name: 'Ban Công View Biển',
        short_name: 'Ban Công',
        tagline: 'Không gian mở đón gió biển và ngắm phố đi bộ',
        panorama_360_url: 'balcony_preview.jpg'
      });
      showSceneModal.value = true;
    };

    const saveScene = async () => {
      if (!selectedRoom.value) return;
      try {
        await axios.post(`${API_BASE_URL}/rooms/${selectedRoom.value.id}/scenes`, sceneForm);
        triggerToast('Đã thêm không gian con mới!');
        showSceneModal.value = false;
        await fetchRooms();
        const updatedRoom = rooms.value.find(r => r.id === selectedRoom.value.id);
        if (updatedRoom) {
          selectedRoom.value = updatedRoom;
          selectedScene.value = updatedRoom.scenes[updatedRoom.scenes.length - 1];
          loadSceneInStudio(selectedScene.value);
        }
      } catch (err) {
        triggerToast('Lỗi khi thêm không gian: ' + err.message, 'error');
      }
    };

    // ================= 3. TRÌNH SOẠN THẢO 3D STUDIO & CHẤM ĐIỂM ĐỒ VẬT =================

    let studioScene = null;
    let studioCamera = null;
    let studioRenderer = null;
    let studioControls = null;
    let studioSphere = null;
    let hotspotMarkersGroup = new THREE.Group();
    let previewMarker = null;
    const textureLoader = new THREE.TextureLoader();

    const initStudio3D = () => {
      const canvasContainer = document.getElementById('studio-canvas-container');
      if (!canvasContainer) return;

      const width = canvasContainer.clientWidth;
      const height = canvasContainer.clientHeight;

      studioScene = new THREE.Scene();
      studioCamera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
      studioCamera.position.set(0, 0, 0.05);

      studioRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      studioRenderer.setSize(width, height);
      studioRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      studioRenderer.outputEncoding = THREE.sRGBEncoding;

      canvasContainer.innerHTML = '';
      canvasContainer.appendChild(studioRenderer.domElement);

      studioControls = new THREE.OrbitControls(studioCamera, studioRenderer.domElement);
      studioControls.enableDamping = true;
      studioControls.dampingFactor = 0.06;
      studioControls.rotateSpeed = -0.55; // Điều khiển xoay tự nhiên
      studioControls.enableZoom = true;
      studioControls.minDistance = 0.01;
      studioControls.maxDistance = 15;

      const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
      studioScene.add(ambLight);

      // Quả cầu 360 độ
      const sphereGeo = new THREE.SphereGeometry(25, 60, 40);
      sphereGeo.scale(-1, 1, 1);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
      studioSphere = new THREE.Mesh(sphereGeo, sphereMat);
      studioScene.add(studioSphere);

      studioScene.add(hotspotMarkersGroup);

      // Preview Marker (Điểm nhấp nháy khi vừa click)
      const prevGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const prevMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
      previewMarker = new THREE.Mesh(prevGeo, prevMat);
      previewMarker.visible = false;
      studioScene.add(previewMarker);

      // SỰ KIỆN CLICK CHUỘT TRỰC TIẾP LÊN ẢNH 360 ĐỂ LẤY TỌA ĐỘ
      studioRenderer.domElement.addEventListener('click', onStudioCanvasClick);

      window.addEventListener('resize', onStudioResize);

      animateStudio();

      if (selectedScene.value) {
        loadSceneInStudio(selectedScene.value);
      }
    };

    const onStudioResize = () => {
      const container = document.getElementById('studio-canvas-container');
      if (!container || !studioRenderer || !studioCamera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      studioCamera.aspect = w / h;
      studioCamera.updateProjectionMatrix();
      studioRenderer.setSize(w, h);
    };

    const animateStudio = () => {
      requestAnimationFrame(animateStudio);
      if (studioControls) studioControls.update();
      if (previewMarker && previewMarker.visible) {
        const s = 1 + Math.sin(Date.now() * 0.008) * 0.2;
        previewMarker.scale.set(s, s, s);
      }
      if (studioRenderer && studioScene && studioCamera) {
        studioRenderer.render(studioScene, studioCamera);
      }
    };

    // Hàm bắt sự kiện CLICK TRÊN ẢNH 360
    const onStudioCanvasClick = (e) => {
      if (!studioRenderer || !studioSphere) return;

      const rect = studioRenderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, studioCamera);

      // Kiểm tra xem có click trúng marker đã có hay không
      const hitMarkers = raycaster.intersectObjects(hotspotMarkersGroup.children, true);
      if (hitMarkers.length > 0) {
        const hit = hitMarkers[0].object;
        const hotspotData = hit.userData?.hotspot;
        if (hotspotData) {
          selectHotspotForEdit(hotspotData);
          return;
        }
      }

      // Nếu click vào mặt cầu ảnh 360 -> Tự động tính tọa độ điểm mới!
      const intersects = raycaster.intersectObject(studioSphere);
      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        // Chuẩn hóa vector hướng trên mặt cầu 3 mét
        const normalized = hitPoint.clone().normalize();
        const p = normalized.multiplyScalar(3.0);

        const x = Math.round(p.x * 100) / 100;
        const y = Math.round(p.y * 100) / 100;
        const z = Math.round(p.z * 100) / 100;

        // Điền tọa độ vào form
        hotspotForm.id = null;
        hotspotForm.position_x = x;
        hotspotForm.position_y = y;
        hotspotForm.position_z = z;
        hotspotForm.item_key = 'item_' + Date.now().toString().slice(-4);
        hotspotForm.name = 'Vật dụng mới';
        hotspotForm.short_name = 'Vật dụng';
        hotspotForm.description = 'Mô tả chi tiết đồ dùng tại vị trí vừa chọn.';

        isCreatingHotspot.value = true;

        // Hiện điểm marker nhấp nháy tại vị trí vừa bấm
        const markerPos = normalized.clone().multiplyScalar(21);
        previewMarker.position.copy(markerPos);
        previewMarker.visible = true;

        triggerToast(`Đã lấy tọa độ: (${x}, ${y}, ${z})! Mời bạn điền tên đồ vật.`);
      }
    };

    const loadSceneInStudio = (scene) => {
      if (!scene || !studioSphere) return;
      selectedScene.value = scene;

      // Nạp Texture ảnh 360
      let panoUrl = scene.panorama_360_url;
      // Nếu là tên file cục bộ thì ghép đường dẫn gốc
      if (panoUrl && !panoUrl.startsWith('http://') && !panoUrl.startsWith('https://')) {
        const origin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'http://localhost:3000';
        panoUrl = `${origin}/${panoUrl.replace(/^\//, '')}`;
      }

      textureLoader.load(panoUrl, (tex) => {
        tex.encoding = THREE.sRGBEncoding;
        studioSphere.material.map = tex;
        studioSphere.material.color.setHex(0xffffff);
        studioSphere.material.needsUpdate = true;
      }, undefined, () => {
        if (scene.panorama_fallback_url) {
          textureLoader.load(scene.panorama_fallback_url, (tex) => {
            tex.encoding = THREE.sRGBEncoding;
            studioSphere.material.map = tex;
            studioSphere.material.needsUpdate = true;
          });
        }
      });

      // Vẽ các Hotspot hiện có trong Scene
      renderStudioHotspots(scene.hotspots || []);
    };

    const renderStudioHotspots = (hotspots) => {
      // Xóa các marker cũ
      while (hotspotMarkersGroup.children.length > 0) {
        hotspotMarkersGroup.remove(hotspotMarkersGroup.children[0]);
      }
      previewMarker.visible = false;

      hotspots.forEach(h => {
        const group = new THREE.Group();
        group.userData = { hotspot: h };

        const dir = new THREE.Vector3(h.position_x, h.position_y, h.position_z).normalize();
        const pos = dir.clone().multiplyScalar(22);
        group.position.copy(pos);
        group.lookAt(0, 0, 0);

        const isPortal = h.type === 'portal' || h.type === 'back_portal';
        const color = isPortal ? 0x06b6d4 : 0xd4af37;

        // Vòng tròn phát sáng
        const ringGeo = new THREE.RingGeometry(0.4, 0.55, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.userData = { hotspot: h };
        group.add(ringMesh);

        // Tâm tròn trắng
        const coreGeo = new THREE.CircleGeometry(0.2, 24);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.userData = { hotspot: h };
        group.add(coreMesh);

        // Vùng bắt click vô hình rộng hơn
        const hitGeo = new THREE.CircleGeometry(1.2, 16);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        hitMesh.userData = { hotspot: h };
        group.add(hitMesh);

        hotspotMarkersGroup.add(group);
      });
    };

    const selectHotspotForEdit = (h) => {
      isCreatingHotspot.value = false;
      Object.assign(hotspotForm, {
        id: h.id,
        item_key: h.item_key,
        name: h.name,
        short_name: h.short_name,
        category: h.category,
        icon: h.icon,
        type: h.type,
        target_room_key: h.target_room_key,
        image_url: h.image_url,
        position_x: h.position_x,
        position_y: h.position_y,
        position_z: h.position_z,
        description: h.description,
        specsText: h.specs ? JSON.stringify(h.specs, null, 2) : ''
      });

      // Đặt camera nhìn về đồ vật này
      if (studioControls) {
        const dir = new THREE.Vector3(h.position_x, h.position_y, h.position_z).normalize();
        gsap.to(studioControls.target, {
          x: dir.x * 10,
          y: dir.y * 10,
          z: dir.z * 10,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    };

    const saveHotspot = async () => {
      if (!selectedScene.value) return;
      try {
        let specs = [];
        if (hotspotForm.specsText) {
          try { specs = JSON.parse(hotspotForm.specsText); } catch (e) {}
        }

        const payload = {
          ...hotspotForm,
          specs: specs
        };

        if (hotspotForm.id) {
          await axios.put(`${API_BASE_URL}/hotspots/${hotspotForm.id}`, payload);
          triggerToast('Đã cập nhật điểm ghim thành công!');
        } else {
          await axios.post(`${API_BASE_URL}/scenes/${selectedScene.value.id}/hotspots`, payload);
          triggerToast('Đã lưu điểm ghim mới vào Database!');
        }

        previewMarker.visible = false;
        await fetchRooms();
        const currentR = rooms.value.find(r => r.id === selectedRoom.value.id);
        if (currentR) {
          selectedRoom.value = currentR;
          const currentS = currentR.scenes.find(s => s.id === selectedScene.value.id);
          if (currentS) {
            selectedScene.value = currentS;
            renderStudioHotspots(currentS.hotspots || []);
          }
        }
      } catch (err) {
        triggerToast('Lỗi khi lưu điểm ghim: ' + err.message, 'error');
      }
    };

    const deleteHotspot = async () => {
      if (!hotspotForm.id) return;
      if (!confirm(`Xóa điểm ghim "${hotspotForm.name}"?`)) return;
      try {
        await axios.delete(`${API_BASE_URL}/hotspots/${hotspotForm.id}`);
        triggerToast('Đã xóa điểm ghim!');
        hotspotForm.id = null;
        await fetchRooms();
        const currentR = rooms.value.find(r => r.id === selectedRoom.value.id);
        if (currentR) {
          selectedRoom.value = currentR;
          const currentS = currentR.scenes.find(s => s.id === selectedScene.value.id);
          if (currentS) {
            selectedScene.value = currentS;
            renderStudioHotspots(currentS.hotspots || []);
          }
        }
      } catch (err) {
        triggerToast('Lỗi khi xóa: ' + err.message, 'error');
      }
    };

    const switchScene = (scene) => {
      selectedScene.value = scene;
      loadSceneInStudio(scene);
    };

    const openStudioForRoom = (room) => {
      selectedRoom.value = room;
      if (room.scenes && room.scenes.length > 0) {
        selectedScene.value = room.scenes[0];
      }
      currentTab.value = 'studio';
      nextTick(() => {
        if (!studioRenderer) {
          initStudio3D();
        } else {
          loadSceneInStudio(selectedScene.value);
          onStudioResize();
        }
      });
    };

    // Upload file ảnh
    const handleFileUpload = async (event, targetField) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        triggerToast('Đang upload ảnh lên máy chủ...');
        const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (targetField === 'room_image') roomForm.room_image = res.data.url;
        else if (targetField === 'scene_panorama') sceneForm.panorama_360_url = res.data.url;
        else if (targetField === 'hotspot_image') hotspotForm.image_url = res.data.url;
        triggerToast('Upload ảnh thành công!');
      } catch (err) {
        triggerToast('Upload thất bại: ' + err.message, 'error');
      }
    };

    onMounted(() => {
      fetchRooms();
    });

    return {
      currentTab,
      loading,
      rooms,
      selectedRoom,
      selectedScene,
      showRoomModal,
      showSceneModal,
      isEditRoom,
      roomForm,
      sceneForm,
      hotspotForm,
      isCreatingHotspot,
      availableIcons,
      toast,
      openCreateRoom,
      openEditRoom,
      saveRoom,
      deleteRoom,
      openAddScene,
      saveScene,
      switchScene,
      openStudioForRoom,
      saveHotspot,
      deleteHotspot,
      handleFileUpload
    };
  }
});

app.mount('#app');
