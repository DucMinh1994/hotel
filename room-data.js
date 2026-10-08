/**
 * room-data.js - Bộ kết nối dữ liệu phòng (Backward Compatibility Bridge)
 * Dữ liệu chi tiết từng phòng đã được tách thành các tệp độc lập, nhẹ và dễ bảo trì:
 * - common.js: Thư viện tiện ích, quản lý phòng & âm thanh dùng chung (HotelRooms, SoundManager, HotelUtils)
 * - room-301.js: Cấu hình riêng biệt cho Phòng 301 (Suite, Ban Công, Phòng Tắm)
 * - room-502.js: Cấu hình riêng biệt cho Phòng 502 (Sky Lounge Hoàng Gia)
 */

if (typeof require !== 'undefined') {
  try {
    const r301 = require('./room-301.js');
    const r502 = require('./room-502.js');
    if (typeof HotelRooms !== 'undefined') {
      HotelRooms.register('301', r301);
      HotelRooms.register('502', r502);
    }
  } catch (e) {}
}

const ROOMS_DATA = (typeof HotelRooms !== 'undefined' && HotelRooms.getAll) 
  ? HotelRooms.getAll() 
  : ((typeof window !== 'undefined' && window.ROOMS_DATA) ? window.ROOMS_DATA : {});

if (typeof window !== 'undefined') {
  window.ROOMS_DATA = ROOMS_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  try {
    const r301 = require('./room-301.js');
    const r502 = require('./room-502.js');
    module.exports = { ROOMS_DATA: { '301': r301, '502': r502 } };
  } catch (e) {
    module.exports = { ROOMS_DATA };
  }
}
