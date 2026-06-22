<script setup>
import { computed } from 'vue'

const props = defineProps({
  origins: { type: Array, default: () => [] }
})

const emit = defineEmits(['origin-click'])

const handlePointClick = (origin) => {
  emit('origin-click', origin)
}
</script>

<template>
  <div class="world-map-container">
    <img src="/map.jpg" alt="Coffee Origins Map" class="world-map-image" loading="lazy" />
    <div 
      v-for="origin in origins" 
      :key="origin.id" 
      class="origin-point"
      :style="{ left: origin.x + '%', top: origin.y + '%' }"
      @click="handlePointClick(origin)"
    >
      <div class="point-marker"></div>
      <div class="point-tooltip">{{ origin.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.world-map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.world-map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.origin-point {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
}

.point-marker {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #8B5A2B;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, background 0.3s ease;
}

.origin-point:hover .point-marker {
  transform: scale(1.5);
  background: #A67C52;
}

.point-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background: rgba(45, 31, 20, 0.9);
  color: #fff;
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  margin-bottom: 8px;
  pointer-events: none;
}

.point-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: rgba(45, 31, 20, 0.9);
}

.origin-point:hover .point-tooltip {
  opacity: 1;
  visibility: visible;
}
</style>