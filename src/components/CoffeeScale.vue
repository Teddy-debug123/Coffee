<script setup>import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { audioManager } from '../utils/audio';
const props = defineProps({
 modelValue: {
 type: Number,
 default: 100
 },
 min: {
 type: Number,
 default: 10
 },
 max: {
 type: Number,
 default: 300
 },
 step: {
 type: Number,
 default: 1
 }
});
const emit = defineEmits(['update:modelValue', 'change']);
const currentValue = ref(props.modelValue);
const isDragging = ref(false);
const scaleRef = ref(null);
const circumference = 2 * Math.PI * 85;
const progress = computed(() => {
 return ((currentValue.value - props.min) / (props.max - props.min)) * circumference;
});
const percentage = computed(() => {
 return Math.round(((currentValue.value - props.min) / (props.max - props.min)) * 100);
});
const handleMouseDown = (e) => {
 isDragging.value = true;
 updateValue(e);
};
const handleMouseMove = (e) => {
 if (!isDragging.value)
 return;
 updateValue(e);
};
const handleMouseUp = () => {
 isDragging.value = false;
};
const updateValue = (e) => {
 if (!scaleRef.value)
 return;
 const rect = scaleRef.value.getBoundingClientRect();
 const centerX = rect.left + rect.width / 2;
 const centerY = rect.top + rect.height / 2;
 const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
 let degrees = (angle * 180 / Math.PI + 180) % 360;
 degrees = 360 - degrees;
 degrees = (degrees + 90) % 360;
 const value = Math.round((degrees / 270) * (props.max - props.min) + props.min);
 const clampedValue = Math.max(props.min, Math.min(props.max, value));
 if (clampedValue !== currentValue.value) {
 if (clampedValue > currentValue.value) {
 audioManager.playAddGram();
 }
 else {
 audioManager.playSubtractGram();
 }
 currentValue.value = clampedValue;
 emit('update:modelValue', currentValue.value);
 emit('change', currentValue.value);
 }
};
const increaseValue = () => {
 const newValue = Math.min(props.max, currentValue.value + props.step);
 if (newValue !== currentValue.value) {
 audioManager.playAddGram();
 currentValue.value = newValue;
 emit('update:modelValue', currentValue.value);
 emit('change', currentValue.value);
 }
};
const decreaseValue = () => {
 const newValue = Math.max(props.min, currentValue.value - props.step);
 if (newValue !== currentValue.value) {
 audioManager.playSubtractGram();
 currentValue.value = newValue;
 emit('update:modelValue', currentValue.value);
 emit('change', currentValue.value);
 }
};
watch(() => props.modelValue, (newVal) => {
 currentValue.value = newVal;
});
onMounted(() => {
 window.addEventListener('mousemove', handleMouseMove);
 window.addEventListener('mouseup', handleMouseUp);
});
onUnmounted(() => {
 window.removeEventListener('mousemove', handleMouseMove);
 window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div class="coffee-scale">
    <div class="scale-container" ref="scaleRef" @mousedown="handleMouseDown">
      <svg class="scale-svg" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="scaleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8B7355" />
            <stop offset="100%" stop-color="#3D2914" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle
          class="scale-track"
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="#F5F3EF"
          stroke-width="8"
          stroke-linecap="round"
        />
        
        <circle
          class="scale-progress"
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#scaleGradient)"
          stroke-width="8"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference - progress"
          transform="rotate(-135 100 100)"
          filter="url(#glow)"
        />
        
        <g class="scale-markers">
          <line
            v-for="i in 11"
            :key="i"
            :x1="100 + 72 * Math.cos((((i - 1) * 27 - 135) * Math.PI) / 180)"
            :y1="100 + 72 * Math.sin((((i - 1) * 27 - 135) * Math.PI) / 180)"
            :x2="100 + 80 * Math.cos((((i - 1) * 27 - 135) * Math.PI) / 180)"
            :y2="100 + 80 * Math.sin((((i - 1) * 27 - 135) * Math.PI) / 180)"
            stroke="#C4A77D"
            :stroke-width="i % 5 === 1 ? 2 : 1"
            :stroke-linecap="'round'"
          />
        </g>
      </svg>
      
      <div class="scale-center">
        <div class="value-display">
          <span class="value">{{ currentValue }}</span>
          <span class="unit">g</span>
        </div>
        <div class="percentage">{{ percentage }}%</div>
      </div>
      
      <div class="scale-hint">拖动圆环调节克数</div>
    </div>
    
    <div class="controls">
      <button class="control-btn decrease" @click="decreaseValue">
        −
      </button>
      <button class="control-btn increase" @click="increaseValue">
        +
      </button>
    </div>
  </div>
</template>

<style scoped>
.coffee-scale {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.scale-container {
  position: relative;
  width: 220px;
  height: 220px;
  cursor: pointer;
  user-select: none;
}

.scale-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.scale-track {
  transition: stroke 0.3s ease;
}

.scale-progress {
  transition: stroke-dashoffset 0.1s ease;
}

.scale-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.value-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.value {
  font-size: 3rem;
  font-weight: 300;
  color: #2D1F14;
  letter-spacing: -0.02em;
}

.unit {
  font-size: 1rem;
  color: #8B7355;
  margin-left: 0.25rem;
}

.percentage {
  font-size: 0.8rem;
  color: #8B7355;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
}

.scale-hint {
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: #8B7355;
  letter-spacing: 0.05em;
}

.controls {
  display: flex;
  gap: 1.5rem;
}

.control-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #E8E4DD;
  background: #fff;
  font-size: 1.5rem;
  color: #5C4033;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  border-color: #8B7355;
  color: #2D1F14;
  transform: scale(1.1);
}

.control-btn:active {
  transform: scale(0.95);
}
</style>