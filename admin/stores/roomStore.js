import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { roomsApi, scenesApi, hotspotsApi } from '../api.js';
import eventBus from '../eventBus.js';

export const useRoomStore = defineStore('room', () => {
  const rooms = ref([]);
  const loading = ref(false);
  const selectedRoom = ref(null);
  const selectedScene = ref(null);

  const selectedRoomId = computed({
    get: () => selectedRoom.value?.id || '',
    set: (id) => {
      const found = rooms.value.find(r => r.id == id);
      if (found) {
        selectRoom(found);
      }
    }
  });

  const fetchRooms = async () => {
    loading.value = true;
    try {
      const res = await roomsApi.getAll();
      rooms.value = res.data;
      if (!selectedRoom.value && rooms.value.length > 0) {
        selectRoom(rooms.value[0]);
      } else if (selectedRoom.value) {
        const updated = rooms.value.find(r => r.id === selectedRoom.value.id);
        if (updated) {
          selectRoom(updated, selectedScene.value?.id);
        }
      }
      return rooms.value;
    } catch (err) {
      console.error('Lỗi fetch rooms:', err);
      eventBus.emit('toast', { message: 'Không thể kết nối đến Laravel API (Port 8000)!', type: 'error' });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const selectRoom = (room, preferredSceneId = null) => {
    selectedRoom.value = room;
    if (room && room.scenes && room.scenes.length > 0) {
      if (preferredSceneId) {
        selectedScene.value = room.scenes.find(s => s.id === preferredSceneId) || room.scenes[0];
      } else {
        selectedScene.value = room.scenes[0];
      }
    } else {
      selectedScene.value = null;
    }
  };

  const selectScene = (scene) => {
    selectedScene.value = scene;
  };

  const createRoom = async (roomData) => {
    const res = await roomsApi.create(roomData);
    eventBus.emit('toast', { message: 'Đã tạo phòng mới thành công!', type: 'success' });
    await fetchRooms();
    return res.data;
  };

  const updateRoom = async (id, roomData) => {
    const res = await roomsApi.update(id, roomData);
    eventBus.emit('toast', { message: 'Đã cập nhật phòng thành công!', type: 'success' });
    await fetchRooms();
    return res.data;
  };

  const deleteRoom = async (id) => {
    await roomsApi.delete(id);
    eventBus.emit('toast', { message: 'Đã xóa phòng!', type: 'success' });
    await fetchRooms();
  };

  const createScene = async (roomId, sceneData) => {
    const res = await scenesApi.create(roomId, sceneData);
    eventBus.emit('toast', { message: 'Đã thêm không gian con!', type: 'success' });
    await fetchRooms();
    return res.data;
  };

  const saveHotspot = async (sceneId, hotspotData) => {
    let res;
    if (hotspotData.id) {
      res = await hotspotsApi.update(hotspotData.id, hotspotData);
      eventBus.emit('toast', { message: 'Đã cập nhật điểm ghim!', type: 'success' });
    } else {
      res = await hotspotsApi.create(sceneId, hotspotData);
      eventBus.emit('toast', { message: 'Đã lưu điểm ghim mới vào Database!', type: 'success' });
    }
    await fetchRooms();
    return res.data;
  };

  const deleteHotspot = async (id) => {
    await hotspotsApi.delete(id);
    eventBus.emit('toast', { message: 'Đã xóa điểm ghim!', type: 'success' });
    await fetchRooms();
  };

  return {
    rooms,
    loading,
    selectedRoom,
    selectedScene,
    selectedRoomId,
    fetchRooms,
    selectRoom,
    selectScene,
    createRoom,
    updateRoom,
    deleteRoom,
    createScene,
    saveHotspot,
    deleteHotspot
  };
});
