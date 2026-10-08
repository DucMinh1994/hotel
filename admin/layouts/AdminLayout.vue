<template>
  <div class="admin-wrapper">
    <!-- Toast Notification -->
    <ToastNotification />

    <!-- ================= NAVBAR ================= -->
    <header class="admin-navbar">
      <div class="brand-wrap">
        <div class="brand-icon">👑</div>
        <div>
          <div class="brand-title">LUMIÈRE ADMIN</div>
          <div class="brand-sub">Vue 3 SPA & Laravel REST API</div>
        </div>
      </div>

      <div class="nav-tabs-wrap">
        <router-link to="/rooms" class="nav-tab-btn" active-class="active">
          <span>🏨</span> Quản Lý Phòng Khách Sạn
        </router-link>
        <router-link to="/studio" class="nav-tab-btn" active-class="active">
          <span>🌐</span> 3D Virtual Tour Studio
        </router-link>
      </div>

      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <a href="http://127.0.0.1:8000/bookings" target="_blank" class="nav-tab-btn" style="border: 1px solid rgba(212,175,55,0.3); color: var(--gold-light);" title="Xem danh sách đặt phòng bên Backend">
          <span>📋</span> Đặt Phòng (Backend)
        </a>
        <a href="http://127.0.0.1:8000/room-360" target="_blank" class="nav-tab-btn" style="border: 1px solid rgba(6,182,212,0.3); color: #38bdf8;" title="Xem chi tiết 360 độ bên Backend">
          <span>👁️</span> Xem 360° (Backend)
        </a>
        <div class="header-status">
          <div class="pulse-dot"></div>
          <span>API Online</span>
        </div>
      </div>
    </header>

    <!-- Main Router View -->
    <router-view />
  </div>
</template>

<script setup>
import ToastNotification from '../components/ToastNotification.vue';
</script>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
