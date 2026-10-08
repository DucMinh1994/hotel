<template>
  <transition name="toast-fade">
    <div v-if="toast.show" class="admin-toast" :class="toast.type">
      <span class="toast-icon">{{ toast.type === 'error' ? '⚠️' : '✓' }}</span>
      <span class="toast-msg">{{ toast.message }}</span>
    </div>
  </transition>
</template>

<script setup>
import { useToast } from '../composables/useToast.js';

const { toast } = useToast();
</script>

<style scoped>
.admin-toast {
  position: fixed;
  top: 1.5rem;
  right: 2rem;
  z-index: 9999;
  backdrop-filter: blur(12px);
  color: #fff;
  padding: 0.85rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
}

.admin-toast.success {
  background: rgba(16, 185, 129, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.admin-toast.error {
  background: rgba(239, 68, 68, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
