/**
 * app.js - Main Application Controller
 * Quản lý toàn bộ tương tác giao diện người dùng, tích hợp Three.js Viewer,
 * điều khiển chuyển động mở cửa, bước vào trong, đổi phòng & đặt phòng khách sạn.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Biến lưu trữ Three.js Room Viewer
  let roomViewer = null;
  let activeRoomId = '301';

  // Các phần tử DOM chính của Modal 3D
  const modal3D = document.getElementById('room3d-modal');
  const btnClose3D = document.getElementById('btn-close-3d');
  const modalRoomTitle = document.getElementById('modal-room-title');
  const modalRoomStatusText = document.getElementById('modal-room-status-text');
  const modalStatusDot = document.getElementById('modal-status-dot');
  const modalPriceTag = document.getElementById('modal-price-tag');
  
  const switchRoom301 = document.getElementById('switch-room-301');
  const switchRoom502 = document.getElementById('switch-room-502');
  
  const btnToggleAutoRotate = document.getElementById('btn-toggle-autorotate');
  const btnToggleFullscreen = document.getElementById('btn-toggle-fullscreen');
  const btnToggleDayNight = document.getElementById('btn-toggle-daynight');
  const daynightIcon = document.getElementById('daynight-icon');
  
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const soundIcon = document.getElementById('sound-icon');
  const btnShowHelp = document.getElementById('btn-show-help');

  const guidanceBanner = document.getElementById('guidance-banner');
  const guidanceText = document.getElementById('guidance-text');
  const guidanceActionBtn = document.getElementById('guidance-action-btn');

  const panoLoadingBadge = document.getElementById('pano-loading-badge');
  const panoLoadingText = document.getElementById('pano-loading-text');
  const panoBarFill = document.getElementById('pano-bar-fill');

  const zoomControls = document.getElementById('zoom-controls');
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomReset = document.getElementById('btn-zoom-reset');
  const btnZoomOut = document.getElementById('btn-zoom-out');

  const compassWidget = document.getElementById('compass-widget');
  const compassNeedle = document.getElementById('compass-needle');
  const compassLabel = document.getElementById('compass-label');

  const bottomDock = document.getElementById('bottom-dock');
  const hotspotsLayer = document.getElementById('hotspots-layer');

  const inspectionDrawer = document.getElementById('inspection-drawer');
  const drawerItemCat = document.getElementById('drawer-item-cat');
  const drawerItemName = document.getElementById('drawer-item-name');
  const drawerItemDesc = document.getElementById('drawer-item-desc');
  const drawerItemSpecs = document.getElementById('drawer-item-specs');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerBackBtn = document.getElementById('drawer-back-btn');

  // Booking Modal DOM
  const bookingModal = document.getElementById('booking-modal');
  const bookModalClose = document.getElementById('book-modal-close');
  const bookingForm = document.getElementById('hotel-booking-form');
  const bookFormRoomName = document.getElementById('book-form-room-name');
  const bookTotalPrice = document.getElementById('book-total-price');
  const bookingFormState = document.getElementById('booking-form-state');
  const bookingSuccessState = document.getElementById('booking-success-state');
  const succCloseBtn = document.getElementById('succ-close-btn');

  // ================= 1. KHỞI TẠO THREE.JS 3D VIEWER =================

  function initViewer() {
    if (roomViewer) return;

    roomViewer = new Room3DViewer('three-canvas-container', {
      onRoomLoaded: (roomData) => {
        activeRoomId = roomData.id;
        modalRoomTitle.textContent = roomData.name;
        modalPriceTag.textContent = roomData.priceFormatted;

        // Cập nhật nút chuyển phòng đang active
        if (switchRoom301) switchRoom301.classList.toggle('active', roomData.id === '301');
        if (switchRoom502) switchRoom502.classList.toggle('active', roomData.id === '502');

        // Cập nhật icon ngày/đêm
        const isNight = roomViewer ? roomViewer.isNight : !!roomData.theme?.isNightDefault;
        if (daynightIcon) daynightIcon.textContent = isNight ? '🌙' : '☀️';

        // Tạo các nút Hotspots HTML trong phòng
        renderHotspots(roomData.items);
        // Đồng bộ các nút trên thanh Dock phía dưới tương ứng với từng phòng
        renderBottomDock(roomData);
      },

      onStateChange: (state) => {
        handleStateChange(state);
      },

      onSelectItem: (item) => {
        handleSelectItem(item);
      },

      onBeforeSceneTransition: (targetSubRoom) => {
        const overlay = document.getElementById('scene-transition-overlay');
        const overlayText = document.getElementById('scene-transition-text');
        const overlaySub = document.getElementById('scene-transition-sub');
        if (overlay) {
          if (targetSubRoom === 'balcony') {
            if (overlayText) overlayText.innerHTML = '<span>🌊</span> Đang mở cửa kính bước ra ban công...';
            if (overlaySub) overlaySub.textContent = 'Ban Công Riêng Panorama - Tầm Nhìn Biển Xanh & Đại Lộ Phía Dưới';
          } else if (targetSubRoom === 'bathroom' || (!targetSubRoom && !roomViewer?.currentSubRoom)) {
            if (overlayText) overlayText.innerHTML = '<span>🛁</span> Đang mở cửa bước vào phòng tắm...';
            if (overlaySub) overlaySub.textContent = 'Phòng Tắm Master En-Suite Đá Cẩm Thạch 5 Sao';
          } else {
            if (overlayText) overlayText.innerHTML = '<span>🚪</span> Đang mở cửa quay lại phòng ngủ...';
            if (overlaySub) overlaySub.textContent = 'Deluxe Grand Ocean Suite 301';
          }
          overlay.classList.add('fading');
        }
      },

      onAfterSceneTransition: () => {
        const overlay = document.getElementById('scene-transition-overlay');
        if (overlay) {
          setTimeout(() => {
            overlay.classList.remove('fading');
          }, 240);
        }
      },

      onSubRoomChange: (subRoom) => {
        handleSubRoomChange(subRoom);
      },

      onUpdateHotspots: (positions) => {
        updateHotspotsDOM(positions);
      },

      onUpdateCompass: (angleDeg) => {
        if (compassNeedle) {
          compassNeedle.style.transform = `rotate(${angleDeg}deg)`;
        }
        if (compassLabel) {
          compassLabel.textContent = (typeof HotelUtils !== 'undefined')
            ? HotelUtils.getCompassHeading(angleDeg, activeRoomId, roomViewer?.currentSubRoom)
            : 'Toàn Cảnh 360°';
        }
      },

      onLoadingProgress: (percent, isDone) => {
        if (!panoLoadingBadge) return;
        if (isDone) {
          if (panoBarFill) panoBarFill.style.width = '100%';
          if (panoLoadingText) panoLoadingText.textContent = 'Toàn cảnh 360° 4K đã sẵn sàng!';
          setTimeout(() => {
            panoLoadingBadge.style.display = 'none';
          }, 800);
        } else {
          panoLoadingBadge.style.display = 'flex';
          if (panoBarFill) panoBarFill.style.width = `${percent}%`;
          if (panoLoadingText) panoLoadingText.textContent = `Đang tải toàn cảnh 360° 4K... ${percent}%`;
        }
      }
    });
  }

  // ================= 2. QUẢN LÝ TRẠNG THÁI (NGOÀI CỬA -> TRONG PHÒNG) =================

  function handleStateChange(state) {
    if (!guidanceBanner) return;
    guidanceBanner.classList.remove('interactive');

    if (state === 'corridor') {
      // Đang ở ngoài hành lang
      if (modalRoomStatusText) modalRoomStatusText.textContent = 'Đang ở ngoài sảnh - Cửa phòng đang đóng';
      if (modalStatusDot) {
        modalStatusDot.style.background = '#eab308';
        modalStatusDot.style.boxShadow = '0 0 10px #eab308';
      }

      guidanceBanner.style.display = 'flex';
      if (guidanceText) guidanceText.innerHTML = `<span>👉</span> Nhấp chuột vào cánh cửa gỗ để quẹt thẻ mở phòng P.${activeRoomId}`;
      if (guidanceActionBtn) {
        guidanceActionBtn.style.display = 'inline-block';
        guidanceActionBtn.innerHTML = '<span>🔑 Mở Cửa Phòng</span>';
        guidanceActionBtn.onclick = () => {
          if (roomViewer) roomViewer.openDoor();
        };
      }

      if (bottomDock) bottomDock.style.display = 'none';
      if (zoomControls) zoomControls.style.display = 'none';
      if (compassWidget) compassWidget.style.display = 'none';
      if (inspectionDrawer) inspectionDrawer.classList.remove('open');
      if (hotspotsLayer) hotspotsLayer.style.display = 'none';

    } else if (state === 'opening') {
      // Đang quẹt thẻ & mở cửa
      if (modalRoomStatusText) modalRoomStatusText.textContent = 'Đang mở cửa...';
      if (guidanceText) guidanceText.innerHTML = `<span>🔑</span> Đang quẹt thẻ từ & mở khóa cánh cửa vào trong...`;
      if (guidanceActionBtn) guidanceActionBtn.style.display = 'none';

    } else if (state === 'door_opened') {
      // Cửa đã mở - Đang tự động bước vào trong
      if (modalRoomStatusText) modalRoomStatusText.textContent = 'Cửa đã mở - Đang tự động bước vào trong...';
      if (modalStatusDot) {
        modalStatusDot.style.background = '#10b981';
        modalStatusDot.style.boxShadow = '0 0 10px #10b981';
      }

      if (guidanceText) guidanceText.innerHTML = `<span>🚪</span> Cửa phòng đã mở! Đang tự động bước vào bên trong...`;
      if (guidanceActionBtn) guidanceActionBtn.style.display = 'none';

    } else if (state === 'inside') {
      // Đã bước vào trong phòng
      if (modalRoomStatusText) modalRoomStatusText.textContent = 'Bên trong không gian phòng nghỉ 5 sao';
      if (modalStatusDot) {
        modalStatusDot.style.background = '#38bdf8';
        modalStatusDot.style.boxShadow = '0 0 10px #38bdf8';
      }

      guidanceBanner.style.display = 'flex';
      if (guidanceText) guidanceText.innerHTML = `<span>🔍</span> Kéo chuột để xoay 360° | Nhấp vào các điểm vàng hoặc đồ vật để xem chi tiết`;
      if (guidanceActionBtn) guidanceActionBtn.style.display = 'none';

      // Hiện thanh công cụ dock, zoom controls, compass & các điểm Hotspots
      if (bottomDock) bottomDock.style.display = 'flex';
      if (zoomControls) zoomControls.style.display = 'flex';
      if (compassWidget) compassWidget.style.display = 'flex';
      if (hotspotsLayer) hotspotsLayer.style.display = 'block';

      // Đặt nút Toàn cảnh là active
      setActiveDockButton('overview');
    }
  }

  // ================= 3. QUẢN LÝ HOTSPOTS VÀ THÔNG TIN ĐỒ VẬT =================

  function renderHotspots(items) {
    if (!hotspotsLayer) return;
    hotspotsLayer.innerHTML = '';
    items.forEach(item => {
      const badge = document.createElement('div');
      const isPortal = !!item.isPortal || !!item.isBackPortal;
      badge.className = `hotspot-badge ${isPortal ? 'portal-badge' : ''}`;
      badge.id = `hotspot-${item.id}`;
      const label = item.shortName || item.name;
      const portalArrow = item.isPortal ? ' ↗' : (item.isBackPortal ? ' ↖' : '');
      badge.innerHTML = `
        <span class="hotspot-pulse"></span>
        <span>${item.icon} ${label}${portalArrow}</span>
      `;
      badge.onclick = (e) => {
        e.stopPropagation();
        if (roomViewer) roomViewer.focusItem(item.id);
      };
      hotspotsLayer.appendChild(badge);
    });
  }

  function renderBottomDock(roomData) {
    if (!bottomDock) return;
    bottomDock.innerHTML = '';

    const overviewBtn = document.createElement('button');
    overviewBtn.className = 'dock-btn active';
    overviewBtn.setAttribute('data-action', 'overview');
    overviewBtn.innerHTML = '<span>👁️ Toàn Cảnh</span>';
    overviewBtn.onclick = () => { if (roomViewer) roomViewer.resetToOverview(); };
    bottomDock.appendChild(overviewBtn);

    const doorBtn = document.createElement('button');
    doorBtn.className = 'dock-btn';
    doorBtn.setAttribute('data-action', 'door');
    doorBtn.innerHTML = '<span>🚪 Sảnh Ngoài</span>';
    doorBtn.onclick = () => { if (roomViewer) roomViewer.resetToCorridorView(); };
    bottomDock.appendChild(doorBtn);

    roomData.items.forEach(item => {
      const btn = document.createElement('button');
      const isPortal = !!item.isPortal || !!item.isBackPortal;
      btn.className = `dock-btn ${isPortal ? 'portal-btn' : ''}`;
      btn.setAttribute('data-action', 'item');
      btn.setAttribute('data-item', item.id);
      const label = item.shortName || item.name;
      const portalArrow = item.isPortal ? ' ↗' : (item.isBackPortal ? ' ↖' : '');
      btn.innerHTML = `<span>${item.icon} ${label}${portalArrow}</span>`;
      btn.onclick = () => { if (roomViewer) roomViewer.focusItem(item.id); };
      bottomDock.appendChild(btn);
    });
  }

  function renderSubRoomDock(subRoom) {
    if (!bottomDock) return;
    bottomDock.innerHTML = '';

    const isBalcony = subRoom.id === 'balcony';

    // Nút quay lại phòng ngủ chính (Portal Button)
    const backBtn = document.createElement('button');
    backBtn.className = 'dock-btn portal-btn';
    backBtn.setAttribute('data-action', 'exit-subroom');
    backBtn.innerHTML = '<span>🚪 Về Phòng Ngủ</span>';
    backBtn.onclick = () => { if (roomViewer) roomViewer.exitSubRoom(); };
    bottomDock.appendChild(backBtn);

    // Nút góc nhìn toàn cảnh phòng tắm / ban công
    const overviewBtn = document.createElement('button');
    overviewBtn.className = 'dock-btn active';
    overviewBtn.setAttribute('data-action', 'overview');
    const overviewTitle = isBalcony ? '🌊 Toàn Cảnh Ban Công' : '👁️ Toàn Cảnh Tắm';
    overviewBtn.innerHTML = `<span>${overviewTitle}</span>`;
    overviewBtn.onclick = () => { if (roomViewer) roomViewer.resetToOverview(); };
    bottomDock.appendChild(overviewBtn);

    // Các thiết bị / điểm cảnh quan trong subRoom
    subRoom.items.forEach(item => {
      if (item.isBackPortal) return; // Nút về phòng ngủ đã ở đầu dock
      const btn = document.createElement('button');
      btn.className = 'dock-btn';
      btn.setAttribute('data-action', 'item');
      btn.setAttribute('data-item', item.id);
      const label = item.shortName || item.name;
      btn.innerHTML = `<span>${item.icon} ${label}</span>`;
      btn.onclick = () => { if (roomViewer) roomViewer.focusItem(item.id); };
      bottomDock.appendChild(btn);
    });
  }

  function handleSubRoomChange(subRoom) {
    if (subRoom) {
      const isBalcony = subRoom.id === 'balcony';

      // Cập nhật tiêu đề & trạng thái
      if (modalRoomTitle) {
        modalRoomTitle.textContent = `${subRoom.name} - Suite 301`;
      }
      if (modalRoomStatusText) {
        modalRoomStatusText.textContent = isBalcony
          ? 'Đang đứng tại ban công riêng - Trực diện view biển & đường phố'
          : 'Bên trong phòng tắm En-suite riêng biệt';
      }
      if (modalStatusDot) {
        modalStatusDot.style.background = isBalcony ? '#06b6d4' : '#38bdf8';
        modalStatusDot.style.boxShadow = isBalcony ? '0 0 10px #06b6d4' : '0 0 10px #38bdf8';
      }

      // Guidance Banner
      if (guidanceBanner) {
        guidanceBanner.style.display = 'flex';
        guidanceBanner.classList.add('interactive');
      }
      if (guidanceText) {
        guidanceText.innerHTML = isBalcony
          ? '<span>🌊</span> <strong>Ban Công View Biển:</strong> Ngắm toàn cảnh vịnh biển xanh vô cực và phố đi bộ phía dưới'
          : '<span>🛁</span> <strong>Phòng Tắm 5 Sao:</strong> Bấm vào các điểm tròn hoặc xoay 360° để kiểm tra thiết bị';
      }
      if (guidanceActionBtn) {
        guidanceActionBtn.style.display = 'inline-block';
        guidanceActionBtn.innerHTML = '<span>🚪 Quay Lại Phòng Ngủ</span>';
        guidanceActionBtn.onclick = () => {
          if (roomViewer) roomViewer.exitSubRoom();
        };
      }

      // Đóng drawer nếu đang mở
      if (inspectionDrawer) inspectionDrawer.classList.remove('open');

      // Tạo các nút Hotspots HTML trong subRoom
      renderHotspots(subRoom.items);

      // Cập nhật Bottom Dock hiển thị các đồ vật subRoom
      renderSubRoomDock(subRoom);

    } else {
      // Quay trở lại phòng ngủ chính
      const roomData = roomViewer ? roomViewer.roomData : (ROOMS_DATA[activeRoomId] || ROOMS_DATA['301']);
      if (modalRoomTitle) {
        modalRoomTitle.textContent = roomData.name;
      }
      if (modalRoomStatusText) {
        modalRoomStatusText.textContent = 'Bên trong không gian phòng nghỉ 5 sao';
      }
      if (modalStatusDot) {
        modalStatusDot.style.background = '#38bdf8';
        modalStatusDot.style.boxShadow = '0 0 10px #38bdf8';
      }

      if (guidanceBanner) {
        guidanceBanner.style.display = 'flex';
        guidanceBanner.classList.remove('interactive');
      }
      if (guidanceText) {
        guidanceText.innerHTML = '<span>🔍</span> Kéo chuột để xoay 360° | Nhấp vào các điểm vàng hoặc đồ vật để xem chi tiết';
      }
      if (guidanceActionBtn) {
        guidanceActionBtn.style.display = 'none';
      }

      if (inspectionDrawer) inspectionDrawer.classList.remove('open');

      // Khôi phục hotspots và dock của phòng ngủ chính
      renderHotspots(roomData.items);
      renderBottomDock(roomData);
    }
  }

  function updateHotspotsDOM(positions) {
    Object.keys(positions).forEach(id => {
      const badge = document.getElementById(`hotspot-${id}`);
      if (badge) {
        const pos = positions[id];
        if (pos.visible) {
          badge.style.display = 'flex';
          badge.style.left = `${pos.x}px`;
          badge.style.top = `${pos.y}px`;
        } else {
          badge.style.display = 'none';
        }
      }
    });
  }

  function handleSelectItem(item) {
    if (!inspectionDrawer) return;

    if (!item) {
      inspectionDrawer.classList.remove('open');
      setActiveDockButton('overview');
      document.querySelectorAll('.hotspot-badge').forEach(b => b.classList.remove('active'));
      return;
    }

    // Làm nổi bật điểm ghim Hotspot đang chọn với vòng sáng
    document.querySelectorAll('.hotspot-badge').forEach(b => b.classList.remove('active'));
    const activeBadge = document.getElementById(`hotspot-${item.id}`);
    if (activeBadge) {
      activeBadge.classList.add('active');
    }

    // Cập nhật nội dung Drawer chi tiết
    if (drawerItemCat) drawerItemCat.textContent = item.category.toUpperCase();
    if (drawerItemName) drawerItemName.textContent = `${item.icon} ${item.name}`;
    if (drawerItemDesc) drawerItemDesc.textContent = item.description;

    // Hiển thị danh sách thông số kỹ thuật
    if (drawerItemSpecs) {
      drawerItemSpecs.innerHTML = '';
      if (item.specs && item.specs.length > 0) {
        item.specs.forEach(s => {
          const itemRow = document.createElement('div');
          itemRow.className = 'drawer-spec-item';
          itemRow.innerHTML = `
            <span class="spec-key">${s.key}</span>
            <span class="spec-val">${s.val}</span>
          `;
          drawerItemSpecs.appendChild(itemRow);
        });
      }
    }

    // Cập nhật ảnh chụp thật của sản phẩm
    const drawerPhotoWrap = document.getElementById('drawer-photo-wrap');
    const drawerItemImg = document.getElementById('drawer-item-img');
    if (drawerPhotoWrap && drawerItemImg) {
      if (item.image) {
        drawerPhotoWrap.style.display = 'block';
        drawerItemImg.src = item.image;
        drawerItemImg.alt = `Ảnh thật ${item.name}`;
      } else {
        drawerPhotoWrap.style.display = 'none';
      }
    }

    // Cập nhật nút bấm hành động của Drawer
    const drawerActionBtn = document.getElementById('drawer-action-btn');
    if (drawerActionBtn) {
      if (item.isPortal) {
        const portalText = item.targetRoom === 'balcony'
          ? '<span>🌊 Mở Cửa Trượt Ra Ban Công →</span>'
          : '<span>🛁 Mở Cửa Bước Vào Phòng Tắm →</span>';
        drawerActionBtn.innerHTML = portalText;
        drawerActionBtn.onclick = () => {
          if (roomViewer) roomViewer.enterSubRoom(item.targetRoom || 'bathroom');
        };
      } else if (item.isBackPortal || item.id === 'back_to_bedroom' || item.id === 'back_to_bedroom_from_balcony') {
        drawerActionBtn.innerHTML = '<span>🚪 Quay Lại Phòng Ngủ</span>';
        drawerActionBtn.onclick = () => {
          if (roomViewer) roomViewer.exitSubRoom();
        };
      } else {
        drawerActionBtn.innerHTML = '<span>⚡ Đặt Phòng Này</span>';
        drawerActionBtn.onclick = () => {
          openBookingModal(activeRoomId);
        };
      }
    }

    // Mở Drawer trượt vào
    inspectionDrawer.classList.add('open');
    setActiveDockButton('item', item.id);
  }

  function setActiveDockButton(action, itemId = null) {
    if (!bottomDock) return;
    const dockButtons = bottomDock.querySelectorAll('.dock-btn');
    dockButtons.forEach(btn => {
      const btnAction = btn.getAttribute('data-action');
      const btnItem = btn.getAttribute('data-item');

      if (action === 'overview' && btnAction === 'overview') {
        btn.classList.add('active');
      } else if (action === 'item' && btnAction === 'item' && btnItem === itemId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // ================= 4. SỰ KIỆN MỞ / ĐÓNG MODAL 3D =================

  function openRoom3D(roomId = '301') {
    modal3D.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (!roomViewer) {
      initViewer();
    }
    
    if (roomViewer) {
      roomViewer.loadRoom(roomId);
      roomViewer.onWindowResize();
      setTimeout(() => {
        if (roomViewer) roomViewer.onWindowResize();
      }, 120);
    }
  }

  function closeRoom3D() {
    modal3D.classList.remove('active');
    document.body.style.overflow = '';
    if (inspectionDrawer) inspectionDrawer.classList.remove('open');
    if (roomViewer) {
      roomViewer.stopAmbientSound();
    }
  }

  // Nút mở 3D từ các thẻ phòng
  document.querySelectorAll('.btn-open-3d').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomId = e.currentTarget.getAttribute('data-room') || '301';
      openRoom3D(roomId);
    });
  });

  // Nút mở nhanh từ hero
  const heroQuickBtn = document.getElementById('hero-quick-3d-btn');
  if (heroQuickBtn) {
    heroQuickBtn.addEventListener('click', () => openRoom3D('301'));
  }

  // Nút đóng 3D
  if (btnClose3D) {
    btnClose3D.addEventListener('click', closeRoom3D);
  }

  // ================= 5. SỰ KIỆN THANH CÔNG CỤ TRONG 3D =================

  // Chuyển đổi giữa Phòng 301 và Phòng 502
  if (switchRoom301) {
    switchRoom301.addEventListener('click', () => {
      if (roomViewer && activeRoomId !== '301') {
        roomViewer.loadRoom('301');
      }
    });
  }

  if (switchRoom502) {
    switchRoom502.addEventListener('click', () => {
      if (roomViewer && activeRoomId !== '502') {
        roomViewer.loadRoom('502');
      }
    });
  }

  // Bật / Tắt Tự động xoay 360° (Auto Rotate)
  if (btnToggleAutoRotate) {
    btnToggleAutoRotate.addEventListener('click', () => {
      if (roomViewer) {
        const isRotating = roomViewer.toggleAutoRotate();
        btnToggleAutoRotate.classList.toggle('active', isRotating);
      }
    });
  }

  // Toàn màn hình (Fullscreen)
  if (btnToggleFullscreen) {
    btnToggleFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (modal3D.requestFullscreen) modal3D.requestFullscreen();
        else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  // Đổi chế độ Ngày ☀️ / Đêm 🌙
  if (btnToggleDayNight) {
    btnToggleDayNight.addEventListener('click', () => {
      if (roomViewer) {
        const isNight = roomViewer.toggleDayNight();
        if (daynightIcon) daynightIcon.textContent = isNight ? '🌙' : '☀️';
      }
    });
  }

  // Bật / Tắt âm thanh
  if (btnToggleSound) {
    btnToggleSound.addEventListener('click', () => {
      if (roomViewer) {
        roomViewer.soundEnabled = !roomViewer.soundEnabled;
        if (!roomViewer.soundEnabled) {
          roomViewer.stopAmbientSound();
        } else if (roomViewer.state === 'inside') {
          roomViewer.startAmbientSound();
        }
        if (soundIcon) soundIcon.textContent = roomViewer.soundEnabled ? '🔊' : '🔇';
      }
    });
  }

  // Nút Zoom In / Zoom Out / Reset View
  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      if (roomViewer) roomViewer.zoomIn();
    });
  }
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      if (roomViewer) roomViewer.zoomOut();
    });
  }
  if (btnZoomReset) {
    btnZoomReset.addEventListener('click', () => {
      if (roomViewer) roomViewer.resetToOverview();
    });
  }

  // Nút Hướng dẫn
  if (btnShowHelp) {
    btnShowHelp.addEventListener('click', () => {
      alert(
        "💡 HƯỚNG DẪN TRẢI NGHIỆM VIRTUAL TOUR 360° LUMIÈRE:\n\n" +
        "1. NGOÀI CỬA: Nhấp chuột vào cánh cửa để quẹt thẻ từ mở khóa phòng.\n" +
        "2. BƯỚC VÀO: Nhấp vào nút 'Bước Vào Trong' để camera đưa bạn vào trung tâm phòng.\n" +
        "3. XOAY 360°: Kéo chuột để tự do khám phá toàn cảnh. Nhấp nút 🔄 để bật/tắt tự động xoay.\n" +
        "4. XEM ĐỒ VẬT: Nhấp vào các điểm tròn vàng (Hotspots) hoặc bấm trên thanh dock dưới để zoom cận cảnh và xem ảnh chụp thật 100%.\n" +
        "5. PHÓNG TO: Lăn chuột hoặc sử dụng cụm nút (+ / − / 🎯) bên phải màn hình.\n" +
        "6. NGÀY / ĐÊM: Bấm nút ☀️/🌙 trên thanh trên cùng để chuyển đổi ánh sáng."
      );
    });
  }

  // Đóng Drawer chi tiết
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', () => {
      if (roomViewer) roomViewer.resetToOverview();
    });
  }
  if (drawerBackBtn) {
    drawerBackBtn.addEventListener('click', () => {
      if (roomViewer) roomViewer.resetToOverview();
    });
  }

  // Các nút trên thanh Dock phía dưới (Event delegation hỗ trợ cả dock phòng ngủ và dock phòng tắm động)
  if (bottomDock) {
    bottomDock.addEventListener('click', (e) => {
      const btn = e.target.closest('.dock-btn');
      if (!btn || !roomViewer) return;

      const action = btn.getAttribute('data-action');
      const item = btn.getAttribute('data-item');

      if (action === 'overview') {
        roomViewer.resetToOverview();
      } else if (action === 'door') {
        roomViewer.resetToCorridorView();
      } else if (action === 'exit-subroom') {
        roomViewer.exitSubRoom();
      } else if (action === 'item' && item) {
        roomViewer.focusItem(item);
      }
    });
  }

  // Phím tắt bàn phím (Keyboard Shortcuts)
  window.addEventListener('keydown', (e) => {
    if (!modal3D.classList.contains('active')) return;

    if (e.key === 'Escape') {
      if (inspectionDrawer && inspectionDrawer.classList.contains('open')) {
        if (roomViewer) roomViewer.resetToOverview();
      } else {
        closeRoom3D();
      }
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (roomViewer) {
        const isRot = roomViewer.toggleAutoRotate();
        if (btnToggleAutoRotate) btnToggleAutoRotate.classList.toggle('active', isRot);
      }
    } else if (e.key === '+' || e.key === '=') {
      if (roomViewer) roomViewer.zoomIn();
    } else if (e.key === '-' || e.key === '_') {
      if (roomViewer) roomViewer.zoomOut();
    } else if (e.key === 'f' || e.key === 'F') {
      if (btnToggleFullscreen) btnToggleFullscreen.click();
    }
  });

  // ================= 6. FORM ĐẶT PHÒNG KHÁCH SẠN =================

  function openBookingModal(roomId = '301') {
    const data = (typeof HotelRooms !== 'undefined' && HotelRooms.get(roomId)) || (typeof ROOMS_DATA !== 'undefined' && ROOMS_DATA[roomId]) || ROOMS_DATA['301'];
    if (bookFormRoomName) bookFormRoomName.textContent = data.name;
    
    // Tạm tính 3 đêm
    const totalCalc = (typeof HotelUtils !== 'undefined') ? HotelUtils.formatPrice(data.price * 3) : ((data.price * 3).toLocaleString('vi-VN') + '₫');
    if (bookTotalPrice) bookTotalPrice.textContent = totalCalc;

    if (bookingFormState) bookingFormState.style.display = 'block';
    if (bookingSuccessState) bookingSuccessState.style.display = 'none';
    if (bookingModal) bookingModal.classList.add('active');
  }

  function closeBookingModal() {
    if (bookingModal) bookingModal.classList.remove('active');
  }

  // Các nút kích hoạt đặt phòng
  document.querySelectorAll('.btn-book-room-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rId = e.currentTarget.getAttribute('data-room') || '301';
      openBookingModal(rId);
    });
  });

  document.querySelectorAll('.btn-book-current-room').forEach(btn => {
    btn.addEventListener('click', () => {
      openBookingModal(activeRoomId);
    });
  });

  const navBookBtn = document.getElementById('nav-book-btn');
  if (navBookBtn) {
    navBookBtn.addEventListener('click', () => openBookingModal(activeRoomId));
  }

  if (bookModalClose) {
    bookModalClose.addEventListener('click', closeBookingModal);
  }

  // Xử lý nộp form đặt phòng
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const custName = document.getElementById('cust-name')?.value || 'Quý khách';
      const checkin = document.getElementById('book-checkin')?.value || '15/10/2026';
      const checkout = document.getElementById('book-checkout')?.value || '18/10/2026';
      const room = (typeof HotelRooms !== 'undefined' && HotelRooms.get(activeRoomId)) || (typeof ROOMS_DATA !== 'undefined' && ROOMS_DATA[activeRoomId]) || ROOMS_DATA['301'];

      // Hiển thị biên lai thành công
      const succCust = document.getElementById('succ-cust-name');
      const succRoom = document.getElementById('succ-room-name');
      const succDates = document.getElementById('succ-dates');
      const succTotal = document.getElementById('succ-total');
      const succCode = document.getElementById('succ-booking-code');

      if (succCust) succCust.textContent = custName;
      if (succRoom) succRoom.textContent = room.name;
      if (succDates) succDates.textContent = `${checkin} → ${checkout} (3 đêm)`;
      if (succTotal) succTotal.textContent = (typeof HotelUtils !== 'undefined') ? HotelUtils.formatPrice(room.price * 3) : ((room.price * 3).toLocaleString('vi-VN') + '₫');
      
      const randomCode = (typeof HotelUtils !== 'undefined') ? HotelUtils.generateBookingCode(room.roomNumber) : `LUM-${room.roomNumber}-${Math.floor(1000 + Math.random() * 9000)}`;
      if (succCode) succCode.textContent = randomCode;

      if (typeof SoundManager !== 'undefined') {
        SoundManager.playSuccess();
      }

      if (bookingFormState) bookingFormState.style.display = 'none';
      if (bookingSuccessState) bookingSuccessState.style.display = 'block';
    });
  }

  if (succCloseBtn) {
    succCloseBtn.addEventListener('click', closeBookingModal);
  }

  // ================= 7. XỬ LÝ PHÓNG TO ẢNH THẬT (LIGHTBOX) =================
  const imageLightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const btnZoomPhoto = document.getElementById('btn-zoom-photo');
  const drawerItemImg = document.getElementById('drawer-item-img');

  function openLightbox(src, captionText) {
    if (!imageLightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = captionText || 'Ảnh chụp thực tế sản phẩm';
    imageLightbox.classList.add('active');
  }

  function closeLightbox() {
    if (imageLightbox) imageLightbox.classList.remove('active');
  }

  if (btnZoomPhoto) {
    btnZoomPhoto.addEventListener('click', () => {
      if (drawerItemImg && drawerItemImg.src) {
        const title = document.getElementById('drawer-item-name')?.textContent || 'Sản phẩm';
        openLightbox(drawerItemImg.src, `Ảnh thực tế: ${title}`);
      }
    });
  }

  if (drawerItemImg) {
    drawerItemImg.addEventListener('click', () => {
      const title = document.getElementById('drawer-item-name')?.textContent || 'Sản phẩm';
      openLightbox(drawerItemImg.src, `Ảnh thực tế: ${title}`);
    });
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (imageLightbox) {
    imageLightbox.addEventListener('click', (e) => {
      if (e.target === imageLightbox) closeLightbox();
    });
  }
});
