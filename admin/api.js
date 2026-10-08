import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Quản lý Phòng (Rooms)
export const roomsApi = {
  getAll: () => apiClient.get('/rooms'),
  get: (id) => apiClient.get(`/rooms/${id}`),
  create: (data) => apiClient.post('/rooms', data),
  update: (id, data) => apiClient.put(`/rooms/${id}`, data),
  delete: (id) => apiClient.delete(`/rooms/${id}`)
};

// Quản lý Không gian con (Scenes / Sub-rooms: Phòng tắm, Ban công...)
export const scenesApi = {
  create: (roomId, data) => apiClient.post(`/rooms/${roomId}/scenes`, data),
  update: (id, data) => apiClient.put(`/scenes/${id}`, data),
  delete: (id) => apiClient.delete(`/scenes/${id}`)
};

// Quản lý Điểm ghim 3D (Hotspots / Nội thất & Cổng portal)
export const hotspotsApi = {
  create: (sceneId, data) => apiClient.post(`/scenes/${sceneId}/hotspots`, data),
  update: (id, data) => apiClient.put(`/hotspots/${id}`, data),
  delete: (id) => apiClient.delete(`/hotspots/${id}`)
};

// Upload ảnh 360 Panorama & Ảnh đồ vật
export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default apiClient;
