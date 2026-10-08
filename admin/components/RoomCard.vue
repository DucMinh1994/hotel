<template>
  <div class="room-card">
    <div class="room-card-img-wrap">
      <img :src="room.room_image" :alt="room.name" class="room-card-img">
      <div class="room-card-badge">P.{{ room.room_number }}</div>
      <div class="room-card-price">{{ room.price_formatted || formatCurrency(room.price) }}</div>
    </div>

    <div class="room-card-body">
      <h3 class="room-card-title">{{ room.name }}</h3>
      <p class="room-card-tagline">{{ room.tagline || 'Căn suite tiện nghi 5 sao sang trọng' }}</p>

      <div class="scenes-heading">Các không gian tour 3D:</div>
      <div class="scenes-pills">
        <span class="scene-pill" v-for="sc in room.scenes" :key="sc.id">
          <span>{{ sc.scene_key === 'bathroom' ? '🛁' : (sc.scene_key.includes('balcony') ? '🌊' : '🛏️') }}</span>
          <span>{{ sc.short_name || sc.name }} ({{ sc.hotspots?.length || 0 }} điểm)</span>
        </span>
      </div>

      <div class="room-card-footer">
        <button class="btn-gold btn-sm" @click="$emit('open-studio', room)">
          <span>🌐</span> Soạn Tour 3D
        </button>
        <div class="actions-group">
          <button class="btn-secondary btn-icon" title="Chỉnh sửa thông tin" @click="$emit('edit', room)">
            <span>✏️</span>
          </button>
          <button class="btn-danger btn-icon" title="Xóa phòng" @click="$emit('delete', room)">
            <span>🗑️</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '../functions.js';

defineProps({
  room: {
    type: Object,
    required: true
  }
});

defineEmits(['open-studio', 'edit', 'delete']);
</script>

<style scoped>
.scenes-heading {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.btn-sm {
  padding: 0.5rem 0.9rem;
  font-size: 0.8rem;
}

.btn-icon {
  padding: 0.5rem 0.8rem;
}

.actions-group {
  display: flex;
  gap: 0.4rem;
}
</style>
