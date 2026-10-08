/**
 * functions.js - Common Utility Functions
 */

export function formatCurrency(value) {
  if (value === undefined || value === null) return '0₫';
  return Number(value).toLocaleString('vi-VN') + '₫';
}

export function roundCoord(value, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(Number(value) * factor) / factor;
}

export function resolvePanoramaUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Nếu là file cục bộ, dùng origin port 3000
  const origin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : 'http://localhost:3000';
  return `${origin}/${url.replace(/^\//, '')}`;
}

export const AVAILABLE_ICONS = [
  '🛏️', '📺', '🌊', '🛁', '🚪', '☕', '🛡️', '💡',
  '💼', '🍸', '🧴', '🧣', '🪞', '🛋️', '✨', '🏺', '🛣️'
];

export const HOTSPOT_TYPES = [
  { value: 'item', label: '📍 Đồ vật / Tiện nghi (Xem ảnh thật & thông số)' },
  { value: 'portal', label: '🚪 Cổng chuyển không gian (Vào Phòng tắm / Ban công)' },
  { value: 'back_portal', label: '↩️ Cổng quay lại (Về lại phòng ngủ chính)' }
];
