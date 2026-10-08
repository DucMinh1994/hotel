/**
 * textures.js - Procedural Canvas Texture Generator for Three.js
 * Tạo texture chất lượng cao, màu sắc rực rỡ, chi tiết sắc nét 
 * bằng HTML5 Canvas trực tiếp (không phụ thuộc ảnh ngoài, không lỗi CORS).
 */

const TextureGenerator = {
  // 1. Gỗ lót sàn sang trọng (Sàn gỗ xương cá / tấm lớn bóng đẹp)
  createWoodFloor(dark = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const baseColor = dark ? '#2e2622' : '#8c5e3c';
    const plankColor2 = dark ? '#3b312b' : '#a36f48';
    const plankColor3 = dark ? '#241d1a' : '#774f32';

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 1024, 1024);

    const plankH = 128;
    for (let y = 0; y < 1024; y += plankH) {
      const offsetX = (y / plankH) % 2 === 0 ? 0 : 256;
      for (let x = -256; x < 1280; x += 512) {
        const rand = Math.random();
        ctx.fillStyle = rand > 0.6 ? plankColor2 : (rand > 0.3 ? baseColor : plankColor3);
        ctx.fillRect(x + offsetX, y, 512, plankH);

        // Vân gỗ
        ctx.fillStyle = dark ? 'rgba(15, 12, 10, 0.25)' : 'rgba(50, 30, 15, 0.2)';
        for (let i = 0; i < 15; i++) {
          const gy = y + Math.random() * plankH;
          ctx.fillRect(x + offsetX, gy, 512, 1 + Math.random() * 2);
        }

        // Rãnh chỉ ron giữa các thanh gỗ
        ctx.strokeStyle = dark ? '#15110f' : '#3d2516';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + offsetX, y, 512, plankH);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  },

  // 2. Thảm dệt phòng ngủ (Rug Pattern)
  createRugTexture(pattern = 'deluxe') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (pattern === 'deluxe') {
      // Tông màu be vương giả & viền vàng kim
      ctx.fillStyle = '#262930';
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#343842';
      ctx.fillRect(20, 20, 472, 472);

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 4;
      for (let i = 50; i <= 200; i += 50) {
        ctx.strokeRect(i, i, 512 - i * 2, 512 - i * 2);
      }
    } else {
      // Tông sapphire đêm hoàng gia
      ctx.fillStyle = '#10212e';
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#193448';
      ctx.fillRect(20, 20, 472, 472);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      for (let r = 60; r <= 220; r += 50) {
        ctx.beginPath();
        ctx.arc(256, 256, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Vân sợi thảm dệt nổi
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let x = 0; x < 512; x += 6) {
      for (let y = 0; y < 512; y += 6) {
        if (Math.random() > 0.4) ctx.fillRect(x, y, 3, 3);
      }
    }

    const tex = new THREE.CanvasTexture(canvas); tex.needsUpdate = true; return tex;
  },

  // 3. Đá cẩm thạch Calacatta Marble (Bàn trà / Mặt tủ)
  createMarbleTexture(dark = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = dark ? '#1c1f26' : '#f5f3ee';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = dark ? '#d4af37' : '#9e968d';
    ctx.lineWidth = 3;

    for (let i = 0; i < 6; i++) {
      ctx.globalAlpha = 0.35 + Math.random() * 0.3;
      ctx.beginPath();
      let sx = Math.random() * 512;
      let sy = 0;
      ctx.moveTo(sx, sy);
      while (sy < 512) {
        sx += (Math.random() - 0.5) * 60;
        sy += 30 + Math.random() * 40;
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    const tex = new THREE.CanvasTexture(canvas); tex.needsUpdate = true; return tex;
  },

  // 4. Biển số phòng mạ vàng trên cửa (ROOM 301 / ROOM 502) - Cực kỳ rõ nét & sáng rực rỡ
  createRoomSignTexture(roomNumber, roomType) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Nền kim loại đồng thau vàng bóng sang trọng
    const grad = ctx.createLinearGradient(0, 0, 1024, 512);
    grad.addColorStop(0, '#2b2111');
    grad.addColorStop(0.3, '#5c451f');
    grad.addColorStop(0.5, '#7a5d2a');
    grad.addColorStop(0.8, '#4a3717');
    grad.addColorStop(1, '#1e160a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Khung viền mạ vàng kép
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 14;
    ctx.strokeRect(24, 24, 976, 464);

    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 4;
    ctx.strokeRect(46, 46, 932, 420);

    // Tên thương hiệu khách sạn
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e6c364';
    ctx.font = 'bold 36px "Cinzel", "Times New Roman", serif';
    ctx.fillText('LUMIÈRE GRAND HOTEL', 512, 110);

    // Đường kẻ vàng
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(250, 135);
    ctx.lineTo(774, 135);
    ctx.stroke();

    // Số phòng to khổng lồ phát sáng
    ctx.shadowColor = '#ffe066';
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 170px "Cinzel", "Times New Roman", serif';
    ctx.fillText(roomNumber, 512, 290);
    ctx.shadowBlur = 0;

    // Loại phòng
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(roomType.toUpperCase(), 512, 380);

    // 5 sao vàng
    ctx.fillStyle = '#ffe066';
    ctx.font = '36px sans-serif';
    ctx.fillText('★ ★ ★ ★ ★', 512, 445);

    const tex = new THREE.CanvasTexture(canvas); tex.needsUpdate = true; return tex;
  },

  // 5. Cánh cửa gỗ vân sang trọng
  createDoorWoodTexture(dark = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    const base = dark ? '#1c1815' : '#4a2d18';
    const grainDark = dark ? '#0d0a08' : '#2b170a';
    const grainLight = dark ? '#2d2621' : '#663e22';

    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 1024, 2048);

    // Dải vân gỗ tự nhiên sắc nét
    for (let x = 0; x < 1024; x += 4) {
      ctx.fillStyle = Math.random() > 0.5 ? grainDark : grainLight;
      ctx.globalAlpha = 0.25 + Math.random() * 0.35;
      ctx.fillRect(x, 0, 2 + Math.random() * 5, 2048);
    }
    ctx.globalAlpha = 1.0;

    // Khung nẹp gỗ dập nổi
    ctx.strokeStyle = '#0a0806';
    ctx.lineWidth = 16;
    ctx.strokeRect(20, 20, 984, 2008);

    // Vẽ các ô pano dập nổi viền chỉ vàng kim loại sang trọng
    const drawPanel = (y, h, label) => {
      // Bóng đổ chìm
      ctx.fillStyle = dark ? '#120f0d' : '#301c0f';
      ctx.fillRect(80, y, 864, h);

      // Nẹp viền vàng kim loại dập nổi PVD
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 8;
      ctx.strokeRect(80, y, 864, h);

      // Viền trong tinh tế
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(98, y + 18, 828, h - 36);

      // Vân lõi trong ô pano
      const innerGrad = ctx.createLinearGradient(80, y, 944, y + h);
      innerGrad.addColorStop(0, dark ? '#191512' : '#3d2514');
      innerGrad.addColorStop(0.5, dark ? '#221c18' : '#52321b');
      innerGrad.addColorStop(1, dark ? '#15110e' : '#382212');
      ctx.fillStyle = innerGrad;
      ctx.fillRect(104, y + 24, 816, h - 48);

      if (label) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#d4af37';
        ctx.font = 'bold 36px "Cinzel", serif';
        ctx.fillText(label, 512, y + h / 2 + 12);
      }
    };

    drawPanel(120, 800, 'LUMIÈRE SUITE');
    drawPanel(1040, 880, 'PRIVÉ');

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  },

  // 6. Màn hình TV Smart (Trang chào mừng khách sạn)
  createTVScreenTexture(roomNumber) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 576;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 1024, 576);
    grad.addColorStop(0, '#0a1628');
    grad.addColorStop(0.5, '#122646');
    grad.addColorStop(1, '#08101e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 576);

    ctx.fillStyle = '#d4af37';
    ctx.fillRect(60, 50, 8, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Cinzel", serif';
    ctx.textAlign = 'left';
    ctx.fillText('LUMIÈRE RESORT & SPA', 85, 95);

    ctx.fillStyle = '#d4af37';
    ctx.font = '22px sans-serif';
    ctx.fillText('HÂN HẠNH ĐÓN TIẾP QUÝ KHÁCH', 85, 128);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '300 48px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Kính Chào Quý Khách', 512, 270);

    ctx.font = 'bold 72px "Cinzel", serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(`PHÒNG ${roomNumber}`, 512, 355);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(60, 460, 904, 75);

    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.textAlign = 'left';
    ctx.fillText('📶 Wi-Fi: Lumiere_5G (Miễn phí)', 90, 506);
    ctx.fillText('🌡️ Nhiệt độ phòng: 22°C', 450, 506);
    ctx.fillText('🕒 16:45 | Nắng Đẹp 28°C', 750, 506);

    const tex = new THREE.CanvasTexture(canvas); tex.needsUpdate = true; return tex;
  },

  // 7. Cảnh nhìn qua cửa sổ Panorama (Hoàng hôn biển / Đêm thành phố rực rỡ)
  createPanoramaTexture(isNight = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (!isNight) {
      // Hoàng hôn biển rực rỡ
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 680);
      skyGrad.addColorStop(0, '#1a3359');
      skyGrad.addColorStop(0.35, '#764366');
      skyGrad.addColorStop(0.65, '#e06536');
      skyGrad.addColorStop(0.9, '#f9a838');
      skyGrad.addColorStop(1, '#ffefa0');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 2048, 680);

      // Mặt trời hoàng hôn
      ctx.beginPath();
      ctx.arc(1024, 600, 110, 0, Math.PI * 2);
      ctx.fillStyle = '#fffbe8';
      ctx.shadowColor = '#f9a838';
      ctx.shadowBlur = 50;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Biển phản chiếu hoàng hôn
      const seaGrad = ctx.createLinearGradient(0, 680, 0, 1024);
      seaGrad.addColorStop(0, '#d15d2a');
      seaGrad.addColorStop(0.4, '#6b2d3e');
      seaGrad.addColorStop(1, '#1b2a3f');
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, 680, 2048, 344);

      // Vệt sáng lấp lánh trên sóng biển
      ctx.fillStyle = 'rgba(255, 245, 180, 0.6)';
      for (let y = 690; y < 1000; y += 6) {
        const spread = (y - 680) * 1.8;
        ctx.fillRect(1024 - spread / 2 + (Math.random() - 0.5) * 30, y, spread * (0.3 + Math.random() * 0.4), 2.5);
      }
    } else {
      // Đêm đô thị ngàn sao & các tòa tháp rực rỡ
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 720);
      skyGrad.addColorStop(0, '#050a14');
      skyGrad.addColorStop(0.6, '#0f1d36');
      skyGrad.addColorStop(1, '#1a2e54');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, 2048, 720);

      // Các vì sao lấp lánh
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 500; i++) {
        const sx = Math.random() * 2048;
        const sy = Math.random() * 550;
        ctx.globalAlpha = 0.4 + Math.random() * 0.6;
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.globalAlpha = 1.0;

      // Mặt trăng sáng
      ctx.beginPath();
      ctx.arc(1600, 180, 48, 0, Math.PI * 2);
      ctx.fillStyle = '#fffce0';
      ctx.shadowColor = '#fffce0';
      ctx.shadowBlur = 40;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Skyline các tòa nhà chọc trời
      let bx = 0;
      while (bx < 2048) {
        const bw = 60 + Math.random() * 90;
        const bh = 180 + Math.random() * 320;
        const btop = 720 - bh;
        ctx.fillStyle = '#08101c';
        ctx.fillRect(bx, btop, bw, bh);

        // Đèn cửa sổ các tòa nhà
        ctx.fillStyle = Math.random() > 0.4 ? '#fde047' : '#38bdf8';
        for (let wy = btop + 16; wy < 700; wy += 18) {
          for (let wx = bx + 8; wx < bx + bw - 8; wx += 14) {
            if (Math.random() > 0.3) {
              ctx.globalAlpha = 0.6 + Math.random() * 0.4;
              ctx.fillRect(wx, wy, 6, 8);
            }
          }
        }
        bx += bw + 8;
      }
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = '#050c18';
      ctx.fillRect(0, 720, 2048, 304);
    }

    const tex = new THREE.CanvasTexture(canvas); tex.needsUpdate = true; return tex;
  }
};
