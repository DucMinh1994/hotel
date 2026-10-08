<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" style="width: 500px;">
      <div class="modal-header">
        <h2 class="modal-title">
          ➕ Thêm Không Gian Con Tour 3D
        </h2>
        <button class="modal-close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="form-group">
        <label class="form-label">Mã Không Gian (Key):</label>
        <input type="text" class="form-input" v-model="form.scene_key" placeholder="bathroom, balcony, sauna...">
      </div>

      <div class="form-group">
        <label class="form-label">Tên Không Gian:</label>
        <input type="text" class="form-input" v-model="form.name" placeholder="Ban Công View Biển, Phòng Tắm Master...">
      </div>

      <div class="form-group">
        <label class="form-label">Tên Ngắn:</label>
        <input type="text" class="form-input" v-model="form.short_name" placeholder="Ban Công, Phòng Tắm...">
      </div>

      <div class="form-group">
        <label class="form-label">Ảnh Chụp 360° Panorama:</label>
        <input type="text" class="form-input mb-1" v-model="form.panorama_360_url" placeholder="balcony_preview.jpg hoặc URL...">
        <input type="file" @change="onFileChange" class="file-input">
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" @click="$emit('close')">Hủy</button>
        <button class="btn-gold" @click="onSubmit">Tạo Không Gian</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { uploadApi } from '../api.js';
import eventBus from '../eventBus.js';

const emit = defineEmits(['close', 'save']);

const form = reactive({
  scene_key: 'balcony_' + Date.now().toString().slice(-4),
  name: 'Ban Công View Biển',
  short_name: 'Ban Công',
  tagline: 'Không gian mở đón gió biển và ngắm cảnh',
  panorama_360_url: 'balcony_preview.jpg'
});

const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    eventBus.emit('toast', { message: 'Đang tải ảnh 360 lên...', type: 'success' });
    const res = await uploadApi.uploadImage(file);
    form.panorama_360_url = res.data.url;
    eventBus.emit('toast', { message: 'Upload ảnh 360 thành công!', type: 'success' });
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
  font-size: 1.25rem;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
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
