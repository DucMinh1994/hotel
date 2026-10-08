<template>
  <main class="admin-container">
    <div class="rooms-header">
      <div>
        <h1 class="page-title">
          <span>🏨</span> Quản Lý Danh Sách Phòng
        </h1>
        <p class="page-subtitle">
          Dữ liệu phòng được quản lý bằng Pinia Store và đồng bộ với Laravel RESTful API
        </p>
      </div>
      <button class="btn-gold" @click="openCreate">
        <span>➕</span> Thêm Phòng Mới
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="roomStore.loading" class="loading-box">
      Đang nạp dữ liệu từ Laravel API...
    </div>

    <!-- Rooms Grid -->
    <div v-else class="rooms-grid">
      <RoomCard 
        v-for="room in roomStore.rooms" 
        :key="room.id" 
        :room="room"
        @open-studio="goToStudio"
        @edit="openEdit"
        @delete="onDelete"
      />
    </div>

    <!-- Modal Thêm / Sửa Phòng -->
    <RoomModal 
      v-if="showModal"
      :is-edit="isEdit"
      :initial-data="editingRoom"
      @close="showModal = false"
      @save="onSaveRoom"
    />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoomStore } from '../stores/roomStore.js';
import RoomCard from '../components/RoomCard.vue';
import RoomModal from '../components/RoomModal.vue';

const router = useRouter();
const roomStore = useRoomStore();

const showModal = ref(false);
const isEdit = ref(false);
const editingRoom = ref({});

const openCreate = () => {
  isEdit.value = false;
  editingRoom.value = {
    room_number: (300 + roomStore.rooms.length + 1).toString(),
    name: `Phòng ${300 + roomStore.rooms.length + 1} - Executive Sea Suite`,
    short_name: 'Sea Suite',
    price: 2600000,
    area: '50 m²',
    capacity: '2 Người lớn + 1 Trẻ em',
    bed_type: '1 Giường King-Size',
    view_type: 'Hướng biển Panorama',
    badge: 'Hạng Phòng Mới',
    tagline: 'Không gian nghỉ dưỡng tiện nghi đẳng cấp với view biển',
    room_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    panorama_360_url: 'hotel_room_preview.jpg'
  };
  showModal.value = true;
};

const openEdit = (room) => {
  isEdit.value = true;
  editingRoom.value = { ...room };
  showModal.value = true;
};

const onSaveRoom = async (formData) => {
  if (isEdit.value) {
    await roomStore.updateRoom(editingRoom.value.id, formData);
  } else {
    await roomStore.createRoom(formData);
  }
  showModal.value = false;
};

const onDelete = async (room) => {
  if (!confirm(`Bạn có chắc chắn muốn xóa phòng ${room.room_number}?`)) return;
  await roomStore.deleteRoom(room.id);
};

const goToStudio = (room) => {
  roomStore.selectRoom(room);
  router.push(`/studio/${room.id}`);
};
</script>

<style scoped>
.page-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.loading-box {
  text-align: center;
  padding: 4rem;
  color: var(--gold-light);
  font-weight: 600;
}
</style>
