import { reactive } from 'vue';

const bus = reactive(new Map());

export const eventBus = {
  emit(event, data) {
    if (!bus.has(event)) return;
    bus.get(event).forEach(callback => callback(data));
  },

  on(event, callback) {
    if (!bus.has(event)) {
      bus.set(event, []);
    }
    bus.get(event).push(callback);
  },

  off(event, callback) {
    if (!bus.has(event)) return;
    if (!callback) {
      bus.delete(event);
      return;
    }
    const callbacks = bus.get(event).filter(cb => cb !== callback);
    bus.set(event, callbacks);
  }
};

export default eventBus;
