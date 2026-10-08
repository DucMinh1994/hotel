<template>
  <main class="admin-container" style="padding-top: 1rem;">
    <div class="studio-layout">
      
      <!-- Left: 3D Viewport & Toolbar -->
      <div class="studio-main">
        <div class="studio-toolbar">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <select class="form-select room-select" v-model="roomStore.selectedRoomId">
              <option v-for="r in roomStore.rooms" :key="r.id" :value="r.id">
                P.{{ r.room_number }} - {{ r.name }}
              </option>
            </select>

            <div class="scene-selector-group" v-if="roomStore.selectedRoom?.scenes">
              <button 
                class="scene-tab" 
                v-for="sc in roomStore.selectedRoom.scenes" 
                :key="sc.id"
                :class="{ active: roomStore.selectedScene?.id === sc.id }"
                @click="onSwitchScene(sc)">
                <span>{{ sc.scene_key === 'bathroom' ? '🛁' : (sc.scene_key.includes('balcony') ? '🌊' : '🛏️') }}</span>
                <span>{{ sc.short_name || sc.name }}</span>
              </button>
            </div>
          </div>

          <button class="btn-secondary btn-sm" @click="showSceneModal = true">
            <span>➕</span> Thêm Không Gian Con
          </button>
        </div>

        <!-- 3D Canvas Box -->
        <div class="studio-viewport-wrap">
          <div class="viewport-hint">
            <span>💡</span>
            <span>Kéo chuột để xoay 360° | <strong>Click chuột trực tiếp lên vị trí đồ vật trên ảnh</strong> để lấy tọa độ</span>
          </div>
          <div class="viewport-crosshair"></div>
          <div ref="canvasContainer" class="canvas-box"></div>
        </div>
      </div>

      <!-- Right: Hotspot Inspector Sidebar -->
      <HotspotSidebar 
        :hotspot="activeHotspot"
        :scenes="roomStore.selectedRoom?.scenes || []"
        @save="onSaveHotspot"
        @delete="onDeleteHotspot"
      />

    </div>

    <!-- Modal Thêm Không Gian Con (Scene) -->
    <SceneModal 
      v-if="showSceneModal"
      @close="showSceneModal = false"
      @save="onSaveScene"
    />
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useRoomStore } from '../stores/roomStore.js';
import { useThreeTour } from '../composables/useThreeTour.js';
import HotspotSidebar from '../components/HotspotSidebar.vue';
import SceneModal from '../components/SceneModal.vue';
import eventBus from '../eventBus.js';

const route = useRoute();
const roomStore = useRoomStore();
const { initTour, loadScene, focusHotspot, destroy } = useThreeTour();

const canvasContainer = ref(null);
const showSceneModal = ref(false);

const activeHotspot = reactive({
  id: null,
  item_key: '',
  name: 'Giường King Cao Cấp',
  short_name: 'Giường King',
  category: 'Nội Thất & Tiện Nghi',
  icon: '🛏️',
  type: 'item',
  target_room_key: '',
  image_url: '',
  position_x: 0,
  position_y: 0,
  position_z: -3.0,
  description: 'Nệm cao su non nhập khẩu êm ái, mang lại giấc ngủ sâu.',
  specs: ['Nệm lò xo túi độc lập 30cm', 'Ga trải cotton Ai Cập 800TC']
});

onMounted(async () => {
  if (roomStore.rooms.length === 0) {
    await roomStore.fetchRooms();
  }

  // Nếu có roomId trên URL params
  if (route.params.roomId) {
    const found = roomStore.rooms.find(r => r.id == route.params.roomId || r.room_number == route.params.roomId);
    if (found) {
      roomStore.selectRoom(found);
    }
  }

  nextTick(() => {
    if (canvasContainer.value) {
      initTour(canvasContainer.value, {
        onPointPick: ({ x, y, z }) => {
          activeHotspot.id = null;
          activeHotspot.position_x = x;
          activeHotspot.position_y = y;
          activeHotspot.position_z = z;
          activeHotspot.item_key = 'item_' + Date.now().toString().slice(-4);
          activeHotspot.name = 'Vật dụng mới';
          activeHotspot.short_name = 'Vật dụng';
          activeHotspot.description = 'Mô tả chi tiết đồ dùng tại vị trí vừa chọn.';
          eventBus.emit('toast', { 
            message: `Đã trích xuất tọa độ 3D: (${x}, ${y}, ${z})!`, 
            type: 'success' 
          });
        },
        onMarkerSelect: (h) => {
          Object.assign(activeHotspot, {
            id: h.id,
            item_key: h.item_key,
            name: h.name,
            short_name: h.short_name,
            category: h.category,
            icon: h.icon,
            type: h.type,
            target_room_key: h.target_room_key,
            image_url: h.image_url,
            position_x: h.position_x,
            position_y: h.position_y,
            position_z: h.position_z,
            description: h.description,
            specs: h.specs || []
          });
          focusHotspot(h);
        }
      });

      if (roomStore.selectedScene) {
        loadScene(roomStore.selectedScene);
      }
    }
  });
});

watch(() => roomStore.selectedScene, (newScene) => {
  if (newScene) {
    loadScene(newScene);
  }
});

const onSwitchScene = (scene) => {
  roomStore.selectScene(scene);
};

const onSaveScene = async (sceneData) => {
  if (!roomStore.selectedRoom) return;
  await roomStore.createScene(roomStore.selectedRoom.id, sceneData);
  showSceneModal.value = false;
};

const onSaveHotspot = async () => {
  if (!roomStore.selectedScene) {
    eventBus.emit('toast', { message: 'Vui lòng chọn một không gian trước khi lưu điểm ghim!', type: 'error' });
    return;
  }
  await roomStore.saveHotspot(roomStore.selectedScene.id, activeHotspot);
};

const onDeleteHotspot = async () => {
  if (!activeHotspot.id) return;
  if (!confirm(`Xóa điểm ghim "${activeHotspot.name}"?`)) return;
  await roomStore.deleteHotspot(activeHotspot.id);
  activeHotspot.id = null;
};

onUnmounted(() => {
  destroy();
});
</script>

<style scoped>
.room-select {
  width: 240px;
  font-weight: 700;
}

.btn-sm {
  font-size: 0.8rem;
}

.canvas-box {
  width: 100%;
  height: 100%;
}
</style>
