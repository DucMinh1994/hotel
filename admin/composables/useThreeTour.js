import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { roundCoord, resolvePanoramaUrl } from '../functions.js';

export function useThreeTour() {
  let scene = null;
  let camera = null;
  let renderer = null;
  let controls = null;
  let panoSphere = null;
  let markersGroup = new THREE.Group();
  let previewMarker = null;
  let animFrameId = null;
  const textureLoader = new THREE.TextureLoader();

  let onPointPickCb = null;
  let onMarkerSelectCb = null;

  const initTour = (containerElement, { onPointPick, onMarkerSelect } = {}) => {
    if (!containerElement) return;

    onPointPickCb = onPointPick;
    onMarkerSelectCb = onMarkerSelect;

    const width = containerElement.clientWidth || 800;
    const height = containerElement.clientHeight || 500;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.05);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (THREE.SRGBColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    containerElement.innerHTML = '';
    containerElement.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = -0.55;
    controls.enableZoom = true;
    controls.minDistance = 0.01;
    controls.maxDistance = 15;

    const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambLight);

    // Quả cầu 360 độ
    const sphereGeo = new THREE.SphereGeometry(25, 60, 40);
    sphereGeo.scale(-1, 1, 1);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
    panoSphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(panoSphere);

    scene.add(markersGroup);

    // Preview Marker khi bấm click chọn điểm
    const prevGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const prevMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
    previewMarker = new THREE.Mesh(prevGeo, prevMat);
    previewMarker.visible = false;
    scene.add(previewMarker);

    // Event listeners
    renderer.domElement.addEventListener('click', onCanvasClick);
    window.addEventListener('resize', handleResize);

    animate();
  };

  const handleResize = () => {
    if (!renderer || !camera || !renderer.domElement.parentElement) return;
    const container = renderer.domElement.parentElement;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  const animate = () => {
    animFrameId = requestAnimationFrame(animate);
    if (controls) controls.update();
    if (previewMarker && previewMarker.visible) {
      const s = 1 + Math.sin(Date.now() * 0.008) * 0.2;
      previewMarker.scale.set(s, s, s);
    }
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  };

  const onCanvasClick = (e) => {
    if (!renderer || !panoSphere || !camera) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // 1. Kiểm tra click trúng marker đã có
    const hitMarkers = raycaster.intersectObjects(markersGroup.children, true);
    if (hitMarkers.length > 0) {
      const hit = hitMarkers[0].object;
      const hotspotData = hit.userData?.hotspot;
      if (hotspotData && onMarkerSelectCb) {
        onMarkerSelectCb(hotspotData);
        return;
      }
    }

    // 2. Click vào quả cầu 360 -> Tính toán tọa độ 3D
    const intersects = raycaster.intersectObject(panoSphere);
    if (intersects.length > 0) {
      const hitPoint = intersects[0].point;
      const normalized = hitPoint.clone().normalize();
      const p = normalized.multiplyScalar(3.0);

      const x = roundCoord(p.x, 2);
      const y = roundCoord(p.y, 2);
      const z = roundCoord(p.z, 2);

      // Đặt marker nhấp nháy tại vị trí vừa bấm
      const markerPos = normalized.clone().multiplyScalar(21);
      previewMarker.position.copy(markerPos);
      previewMarker.visible = true;

      if (onPointPickCb) {
        onPointPickCb({ x, y, z, normalized });
      }
    }
  };

  const loadScene = (sceneData) => {
    if (!sceneData || !panoSphere) return;

    const panoUrl = resolvePanoramaUrl(sceneData.panorama_360_url);

    textureLoader.load(panoUrl, (tex) => {
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      panoSphere.material.map = tex;
      panoSphere.material.color.setHex(0xffffff);
      panoSphere.material.needsUpdate = true;
    }, undefined, () => {
      if (sceneData.panorama_fallback_url) {
        textureLoader.load(sceneData.panorama_fallback_url, (tex) => {
          panoSphere.material.map = tex;
          panoSphere.material.color.setHex(0xffffff);
          panoSphere.material.needsUpdate = true;
        });
      }
    });

    renderHotspots(sceneData.hotspots || []);
  };

  const renderHotspots = (hotspots) => {
    while (markersGroup.children.length > 0) {
      markersGroup.remove(markersGroup.children[0]);
    }
    if (previewMarker) previewMarker.visible = false;

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

      // Vùng click rộng hơn
      const hitGeo = new THREE.CircleGeometry(1.2, 16);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData = { hotspot: h };
      group.add(hitMesh);

      markersGroup.add(group);
    });
  };

  const focusHotspot = (h) => {
    if (!controls) return;
    const dir = new THREE.Vector3(h.position_x, h.position_y, h.position_z).normalize();
    gsap.to(controls.target, {
      x: dir.x * 10,
      y: dir.y * 10,
      z: dir.z * 10,
      duration: 0.6,
      ease: 'power2.out'
    });
  };

  const destroy = () => {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    window.removeEventListener('resize', handleResize);
    if (renderer && renderer.domElement) {
      renderer.domElement.removeEventListener('click', onCanvasClick);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.innerHTML = '';
      }
      renderer.dispose();
    }
  };

  return {
    initTour,
    loadScene,
    renderHotspots,
    focusHotspot,
    handleResize,
    destroy
  };
}
