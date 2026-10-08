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

      <div class="header-status">
        <div class="pulse-dot"></div>
        <span>Laravel API: Online (Port 8000)</span>
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
