<template>
  <aside class="studio-sidebar">
    <div class="sidebar-title">
      <span>{{ hotspot.id ? '✏️ Chỉnh Sửa Điểm Ghim' : '📍 Thêm Điểm Ghim Đồ Vật' }}</span>
      <span v-if="hotspot.id" class="id-tag">ID: #{{ hotspot.id }}</span>
    </div>

    <div class="form-group">
      <label class="form-label">Tọa Độ 3D Đã Chấm (Tự động từ Click):</label>
      <div class="coords-row">
        <div class="coords-box">X: {{ hotspot.position_x }}</div>
        <div class="coords-box">Y: {{ hotspot.position_y }}</div>
        <div class="coords-box">Z: {{ hotspot.position_z }}</div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Tên Đồ Vật / Thiết Bị:</label>
      <input type="text" class="form-input" v-model="hotspot.name" placeholder="Ví dụ: Giường Ngủ King, Smart TV...">
    </div>

    <div class="form-group">
      <label class="form-label">Tên Ngắn (Gắn trên Nhãn):</label>
      <input type="text" class="form-input" v-model="hotspot.short_name" placeholder="Ví dụ: Giường King, TV...">
    </div>

    <div class="form-group">
      <label class="form-label">Icon Đại Diện:</label>
      <div class="icon-pills">
        <span class="icon-pill" 
              v-for="ico in availableIcons" 
              :key="ico"
              :class="{ active: hotspot.icon === ico }"
              @click="hotspot.icon = ico">
          {{ ico }}
        </span>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Phân Loại Điểm Ghim:</label>
      <select class="form-select" v-model="hotspot.type">
        <option v-for="t in hotspotTypes" :key="t.value" :value="t.value">
          {{ t.label }}
        </option>
      </select>
    </div>

    <!-- Nếu là Portal: Cho phép chọn không gian đích -->
    <div class="form-group" v-if="hotspot.type === 'portal'">
      <label class="form-label">Chuyển Sang Không Gian Nào:</label>
      <select class="form-select" v-model="hotspot.target_room_key">
        <option value="">-- Chọn không gian đích --</option>
        <option value="bathroom">🛁 Phòng Tắm Master En-suite</option>
        <option value="balcony">🌊 Ban Công Panorama View Biển</option>
        <option v-for="sc in scenes" :key="sc.id" :value="sc.scene_key">
          {{ sc.name }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label class="form-label">Ảnh Chụp Thực Tế Đồ Vật:</label>
      <input type="text" class="form-input mb-1" v-model="hotspot.image_url" placeholder="URL ảnh hoặc chọn file...">
      <input type="file" @change="onFileChange" class="file-input">
    </div>

    <div class="form-group">
      <label class="form-label">Mô Tả Chi Tiết:</label>
      <textarea class="form-textarea" rows="3" v-model="hotspot.description" placeholder="Mô tả tiêu chuẩn 5 sao của đồ vật..."></textarea>
    </div>

    <div class="sidebar-actions">
      <button class="btn-gold flex-1" @click="$emit('save')">
        <span>💾</span> {{ hotspot.id ? 'Cập Nhật' : 'Lưu Điểm Ghim' }}
      </button>
      <button v-if="hotspot.id" class="btn-danger" @click="$emit('delete')">
        <span>🗑️</span> Xóa
      </button>
    </div>
  </aside>
</template>

<script setup>
import { AVAILABLE_ICONS, HOTSPOT_TYPES } from '../functions.js';
import { uploadApi } from '../api.js';
import eventBus from '../eventBus.js';

const props = defineProps({
  hotspot: {
    type: Object,
    required: true
  },
  scenes: {
    type: Array,
    default: () => []
  }
});

defineEmits(['save', 'delete']);

const availableIcons = AVAILABLE_ICONS;
const hotspotTypes = HOTSPOT_TYPES;

const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    eventBus.emit('toast', { message: 'Đang tải ảnh đồ vật lên...', type: 'success' });
    const res = await uploadApi.uploadImage(file);
    props.hotspot.image_url = res.data.url;
    eventBus.emit('toast', { message: 'Upload ảnh thành công!', type: 'success' });
  } catch (err) {
    eventBus.emit('toast', { message: 'Upload thất bại: ' + err.message, type: 'error' });
  }
};
</script>

<style scoped>
.id-tag {
  font-size: 0.75rem;
  color: var(--gold-light);
  font-weight: 600;
}

.mb-1 {
  margin-bottom: 0.4rem;
}

.file-input {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.sidebar-actions {
  margin-top: auto;
  display: flex;
  gap: 0.6rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-glass);
}

.flex-1 {
  flex: 1;
}
</style>
