import { reactive, onMounted, onUnmounted } from 'vue';
import eventBus from '../eventBus.js';

export function useToast() {
  const toast = reactive({
    show: false,
    message: '',
    type: 'success'
  });

  let timer = null;

  const showToast = (message, type = 'success') => {
    if (timer) clearTimeout(timer);
    toast.message = message;
    toast.type = type;
    toast.show = true;
    timer = setTimeout(() => {
      toast.show = false;
    }, 3200);
  };

  const onBusToast = (payload) => {
    showToast(payload.message, payload.type);
  };

  onMounted(() => {
    eventBus.on('toast', onBusToast);
  });

  onUnmounted(() => {
    eventBus.off('toast', onBusToast);
    if (timer) clearTimeout(timer);
  });

  return {
    toast,
    showToast
  };
}
