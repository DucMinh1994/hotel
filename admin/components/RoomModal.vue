<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">
          {{ isEdit ? '✏️ Chỉnh Sửa Phòng' : '➕ Thêm Phòng Khách Sạn Mới' }}
        </h2>
        <button class="modal-close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Số Phòng:</label>
          <input type="text" class="form-input" v-model="form.room_number" placeholder="301, 302...">
        </div>
        <div class="form-group">
          <label class="form-label">Tên Phòng:</label>
          <input type="text" class="form-input" v-model="form.name" placeholder="Deluxe Grand Ocean Suite...">
        </div>
      </div>

      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Giá Tiền (VND / đêm):</label>
          <input type="number" class="form-input" v-model="form.price">
        </div>
        <div class="form-group">
          <label class="form-label">Diện Tích:</label>
          <input type="text" class="form-input" v-model="form.area" placeholder="48 m²">
        </div>
      </div>

      <div class="form-row-2">
        <div class="form-group">
          <label class="form-label">Loại Giường:</label>
          <input type="text" class="form-input" v-model="form.bed_type" placeholder="1 Giường King-Size">
        </div>
        <div class="form-group">
          <label class="form-label">Tầm Nhìn (View):</label>
          <input type="text" class="form-input" v-model="form.view_type" placeholder="Hướng biển Panorama 180°">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Tagline (Khẩu hiệu giới thiệu):</label>
        <input type="text" class="form-input" v-model="form.tagline" placeholder="Không gian nghỉ dưỡng tiện nghi đẳng cấp...">
      </div>

      <div class="form-group">
        <label class="form-label">Ảnh Bìa Đại Diện:</label>
        <input type="text" class="form-input mb-1" v-model="form.room_image">
        <input type="file" @change="onFileChange" class="file-input">
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">Hủy</button>
        <button class="btn-gold" @click="onSubmit">Lưu Thông Tin</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { uploadApi } from '../api.js';
import eventBus from '../eventBus.js';

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'save']);

const form = reactive({
  room_number: '',
  name: '',
  short_name: '',
  price: 2500000,
  area: '48 m²',
  capacity: '2 Người lớn',
  bed_type: '1 Giường King-Size',
  view_type: 'Hướng biển Panorama',
  badge: 'Phòng Mới',
  tagline: '',
  room_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  panorama_360_url: 'hotel_room_preview.jpg'
});

watch(() => props.initialData, (val) => {
  if (val) Object.assign(form, val);
}, { immediate: true });

const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    eventBus.emit('toast', { message: 'Đang tải ảnh lên...', type: 'success' });
    const res = await uploadApi.uploadImage(file);
    form.room_image = res.data.url;
    eventBus.emit('toast', { message: 'Upload ảnh thành công!', type: 'success' });
  } catch (err) {
    eventBus.emit('toast', { message: 'Upload thất bại: ' + err.message, type: 'error' });
  }
};

const onSubmit = () => {
  emit('save', { ...form });
};
</script>

<style scoped>
.modal-title {
  font-family: var(--font-serif);
  font-size: 1.3rem;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.mb-1 {
  margin-bottom: 0.4rem;
}

.file-input {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;
  border-top: 1px solid var(--border-glass);
  padding-top: 1rem;
}
</style>
