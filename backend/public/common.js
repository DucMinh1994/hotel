/**
 * common.js - Thư viện dùng chung (Shared Utilities, Sound & Room Registry)
 * Cung cấp:
 * 1. HotelRooms: Bộ quản lý & nạp dữ liệu các phòng riêng biệt
 * 2. SoundManager: Bộ tổng hợp âm thanh Web Audio API chất lượng cao dùng chung
 * 3. Formatters: Tiện ích định dạng tiền tệ, ngày tháng, sinh mã đặt phòng
 * 4. CompassHelper: Xác định tên hướng nhìn 360° theo phòng/khu vực
 */

// Đảm bảo không gian biến toàn cục
if (typeof window !== 'undefined') {
  window.ROOMS_DATA = window.ROOMS_DATA || {};
}

/**
 * =========================================================================
 * 1. HOTEL ROOMS REGISTRY & LAZY LOADER
 * =========================================================================
 */
const HotelRooms = {
  registry: (typeof window !== 'undefined' && window.ROOMS_DATA) ? window.ROOMS_DATA : {},

  register(id, data) {
    this.registry[id] = data;
    if (typeof window !== 'undefined') {
      window.ROOMS_DATA = this.registry;
    }
    return data;
  },

  get(id) {
    return this.registry[id];
  },

  has(id) {
    return !!this.registry[id];
  },

  getAll() {
    return this.registry;
  },

  /**
   * Tải dữ liệu phòng: Ưu tiên nạp động từ Laravel REST API (nếu đang chạy),
   * tự động chuyển sang nạp tệp room-${id}.js tĩnh khi offline hoặc trên server Vercel.
   */
  loadRoom(id) {
    if (this.has(id)) {
      return Promise.resolve(this.get(id));
    }
    if (typeof document === 'undefined') {
      return Promise.reject(new Error('Document is undefined in non-browser environment'));
    }

    const apiBase = (typeof window !== 'undefined' && window.HOTEL_API_BASE) || 'http://127.0.0.1:8000/api';
    const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 1200) : null;

    return fetch(`${apiBase}/rooms/${id}`, { signal: controller ? controller.signal : undefined })
      .then(res => {
        if (timeoutId) clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then(roomData => {
        if (roomData && roomData.id) {
          console.log(`[HotelRooms] Đã nạp phòng ${id} trực tiếp từ Laravel REST API.`);
          return this.register(id, roomData);
        }
        throw new Error('Dữ liệu API không đúng định dạng');
      })
      .catch(() => {
        if (timeoutId) clearTimeout(timeoutId);
        return new Promise((resolve, reject) => {
          const scriptId = `script-room-${id}`;
          if (document.getElementById(scriptId)) {
            let attempts = 0;
            const interval = setInterval(() => {
              attempts++;
              if (this.has(id)) {
                clearInterval(interval);
                resolve(this.get(id));
              } else if (attempts > 30) {
                clearInterval(interval);
                reject(new Error(`Timeout loading room ${id}`));
              }
            }, 50);
            return;
          }

          const script = document.createElement('script');
          script.id = scriptId;
          script.src = `room-${id}.js`;
          script.async = true;
          script.onload = () => {
            if (this.has(id)) {
              resolve(this.get(id));
            } else {
              reject(new Error(`Tệp room-${id}.js đã nạp nhưng không tìm thấy đăng ký dữ liệu phòng.`));
            }
          };
          script.onerror = () => reject(new Error(`Không thể nạp tệp room-${id}.js`));
          document.head.appendChild(script);
        });
      });
  }
};

/**
 * =========================================================================
 * 2. SOUND MANAGER (WEB AUDIO API SYNTHESIZER DÙNG CHUNG)
 * =========================================================================
 */
const SoundManager = {
  ctx: null,
  enabled: true,
  ambientOsc: null,
  ambientGain: null,

  getAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  },

  toggleSound() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopAmbient();
    }
    return this.enabled;
  },

  // Âm thanh tiếng mở/trượt cửa phòng & cửa ban công kính
  playDoor() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Tiếng trượt êm
      const bufferSize = ctx.sampleRate * 0.45;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.22);
      filter.frequency.exponentialRampToValueAtTime(180, now + 0.45);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.45);

      // 2. Tiếng chốt khóa cơ khí (Mechanical latch)
      setTimeout(() => {
        if (!this.enabled) return;
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(120, ctx.currentTime);
        clickOsc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.08);

        clickGain.gain.setValueAtTime(0.15, ctx.currentTime);
        clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start();
        clickOsc.stop(ctx.currentTime + 0.08);
      }, 140);
    } catch (e) {}
  },

  // Âm thanh chuông pha lê ngân nga khi chạm vào điểm ghim đồ vật
  playChime() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const freqs = [880, 1320, 1760];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        const delay = idx * 0.04;
        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.linearRampToValueAtTime(0.06 - idx * 0.015, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.6);
      });
    } catch (e) {}
  },

  // Âm thanh tiếng quẹt thẻ từ khách sạn thông minh (Smart RFID Keycard)
  playKeycard() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Beep 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1480, now);
      gain1.gain.setValueAtTime(0.1, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Beep 2 (Âm cao hơn xác nhận mở khóa thành công)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2200, now + 0.09);
      gain2.gain.setValueAtTime(0.12, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.22);
    } catch (e) {}
  },

  // Âm thanh chúc mừng khi hoàn tất đặt phòng
  playSuccess() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Đô - Mi - Sol - Đô cao

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.1;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.65);
      });
    } catch (e) {}
  },

  // Âm nền không gian phòng khách sạn ấm cúng (Subtle Ambient Warmth)
  startAmbient() {
    if (!this.enabled || this.ambientOsc) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      this.ambientOsc = ctx.createOscillator();
      this.ambientGain = ctx.createGain();
      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(130, now);

      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.015, now + 1.5);

      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(ctx.destination);
      this.ambientOsc.start();
    } catch (e) {}
  },

  stopAmbient() {
    try {
      if (this.ambientOsc && this.ambientGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          if (this.ambientOsc) {
            try { this.ambientOsc.stop(); } catch (e) {}
            this.ambientOsc.disconnect();
            this.ambientOsc = null;
            this.ambientGain = null;
          }
        }, 700);
      }
    } catch (e) {
      this.ambientOsc = null;
      this.ambientGain = null;
    }
  }
};

/**
 * =========================================================================
 * 3. TIỆN ÍCH ĐỊNH DẠNG & TÍNH TOÁN DÙNG CHUNG (FORMATTERS & HELPERS)
 * =========================================================================
 */
const HotelUtils = {
  // Định dạng tiền tệ VND chuẩn khách sạn 5 sao
  formatPrice(num) {
    if (typeof num !== 'number') num = Number(num) || 0;
    return num.toLocaleString('vi-VN') + '₫';
  },

  // Tính tổng tiền lưu trú theo số đêm
  calculateStayTotal(pricePerNight, nights = 3) {
    return pricePerNight * nights;
  },

  // Sinh mã đặt phòng ngẫu nhiên chuyên nghiệp
  generateBookingCode(roomNumber = '301') {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `LUM-${roomNumber}-${randomSuffix}`;
  },

  /**
   * Tính toán tên phương hướng la bàn tương tác theo góc quay 360°
   */
  getCompassHeading(angleDeg, activeRoomId = '301', currentSubRoom = null) {
    const normalized = (angleDeg % 360 + 360) % 360;

    // 1. Đang đứng ở Ban Công
    if (currentSubRoom === 'balcony') {
      if (normalized >= 315 || normalized < 45) return 'Hướng Vịnh Biển Vô Cực';
      if (normalized >= 45 && normalized < 115) return 'Hướng Đại Lộ & Phố Phía Dưới';
      if (normalized >= 115 && normalized < 210) return 'Hướng Cửa Vào Lại Phòng';
      if (normalized >= 210 && normalized < 280) return 'Hướng Bàn Ghế Ban Công';
      return 'Hướng Lan Can Kính Ban Công';
    }

    // 2. Đang ở bên trong Phòng Tắm En-suite
    if (currentSubRoom === 'bathroom') {
      if (normalized >= 320 || normalized < 35) return 'Hướng Cửa Về Phòng Ngủ';
      if (normalized >= 35 && normalized < 85) return 'Hướng Giá Treo Khăn Khách Sạn';
      if (normalized >= 85 && normalized < 140) return 'Hướng Cabin Tắm Kính & Sen Cây';
      if (normalized >= 140 && normalized < 210) return 'Hướng Bàn Lavabo & Tiện Nghi';
      return 'Hướng Bồn Tắm Nằm Thư Giãn';
    }

    // 3. Phòng ngủ Deluxe Grand Ocean Suite 301
    if (activeRoomId === '301') {
      if (normalized >= 345 || normalized < 35) return 'Hướng Giường Ngủ King-Size';
      if (normalized >= 35 && normalized < 65) return 'Hướng Tab Đầu Giường';
      if (normalized >= 65 && normalized < 105) return 'Hướng Cửa Phòng Tắm';
      if (normalized >= 105 && normalized < 160) return 'Hướng Cửa Chính Ra Vào';
      if (normalized >= 160 && normalized < 195) return 'Hướng Bàn Làm Việc';
      if (normalized >= 195 && normalized < 215) return 'Hướng Smart TV 65"';
      if (normalized >= 215 && normalized < 245) return 'Hướng Quầy Mini Bar';
      if (normalized >= 245 && normalized < 285) return 'Hướng Ghế Bành Thư Giãn';
      return 'Hướng Cửa Kính Ban Công View Biển';
    }

    // 4. Phòng khách Sky Lounge 502
    if (activeRoomId === '502') {
      if (normalized >= 340 || normalized < 35) return 'Hướng Sofa Lounge & Bàn Trà';
      if (normalized >= 35 && normalized < 100) return 'Hướng Đèn Chùm Hoàng Gia';
      if (normalized >= 100 && normalized < 170) return 'Hướng Lối Vào Suite';
      if (normalized >= 170 && normalized < 225) return 'Hướng Ghế Bành Vintage';
      if (normalized >= 225 && normalized < 275) return 'Hướng Tủ Credenza & Hoa';
      return 'Hướng Cửa Sổ Vòm & Rèm Yếm';
    }

    return 'Toàn Cảnh 360°';
  }
};

// Đăng ký toàn cục
if (typeof window !== 'undefined') {
  window.HotelRooms = HotelRooms;
  window.SoundManager = SoundManager;
  window.HotelUtils = HotelUtils;
}

// Hỗ trợ môi trường Module/Node.js nếu cần
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HotelRooms, SoundManager, HotelUtils };
}
