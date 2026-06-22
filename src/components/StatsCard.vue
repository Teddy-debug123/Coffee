<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { MapLocation, Coffee, Star, Clock } from '@element-plus/icons-vue'

const props = defineProps({
  value: { type: [Number, String], required: true },
  label: { type: String, required: true },
  unit: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '#4A3C31' },
  index: { type: Number, default: 0 },
  animated: { type: Boolean, default: false }
})

const displayValue = ref(0)
const isHovered = ref(false)

const iconComponents = {
  map: MapLocation,
  coffee: Coffee,
  star: Star,
  clock: Clock
}

const IconComponent = computed(() => iconComponents[props.icon] || Coffee)

const animateValue = (target) => {
  const isPercent = String(target).includes('%')
  const targetNum = parseFloat(String(target).replace('%', ''))
  const duration = 1500
  const startTime = performance.now()
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    displayValue.value = Math.round(targetNum * easeProgress)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      displayValue.value = targetNum
    }
  }
  
  requestAnimationFrame(animate)
}

const formatValue = () => {
  const raw = props.value
  if (String(raw).includes('%')) {
    return displayValue.value + '%'
  }
  if (String(raw).includes('+')) {
    return displayValue.value + '+'
  }
  return displayValue.value
}

watch(() => props.animated, (newVal) => {
  if (newVal) {
    animateValue(props.value)
  }
})

watch(() => props.value, (newVal) => {
  if (props.animated) {
    animateValue(newVal)
  }
})

onMounted(() => {
  displayValue.value = parseFloat(String(props.value).replace(/[^0-9.]/g, '')) || 0
  if (props.animated) {
    animateValue(props.value)
  }
})
</script>

<template>
  <div 
    class="stats-card" 
    :class="{ hovered: isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="stats-content">
      <div class="stats-icon-wrapper">
        <component :is="IconComponent" :size="24" />
      </div>
      <div class="stats-info">
        <div class="stats-main">
          <span class="stat-value stats-value" :style="{ color }">{{ formatValue() }}</span>
          <span v-if="unit && !label.includes('小时内发货')" class="stats-unit">{{ unit }}</span>
          <span v-if="label.includes('小时内发货')" class="stats-unit">{{ label }}</span>
        </div>
        <span v-if="!label.includes('小时内发货')" class="stats-label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(184, 169, 153, 0.3);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(245, 240, 232, 0);
  animation: breathe 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes breathe {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.3; }
}

.stats-card:hover,
.stats-card.hovered {
  transform: translateY(-3px);
  background: rgba(248, 243, 235, 0.95);
  border-color: rgba(58, 40, 27, 0.2);
  box-shadow: 0 8px 24px rgba(58, 40, 27, 0.08);
}

.stats-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.stats-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(184, 169, 153, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7A6B5D;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.stats-card:hover .stats-icon-wrapper,
.stats-card.hovered .stats-icon-wrapper {
  transform: scale(1.1);
  color: #59473A;
  background: rgba(184, 169, 153, 0.25);
}

.stats-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stats-main {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.stats-value {
  font-size: 40px;
  font-weight: 700;
  font-family: 'SF Mono', 'Monaco', monospace;
  letter-spacing: -0.02em;
  line-height: 1;
  transition: color 0.3s ease;
}

.stats-card:hover .stats-value,
.stats-card.hovered .stats-value {
  color: #3A281B !important;
}

.stats-unit {
  font-size: 15px;
  color: #7A6B5D;
  font-weight: 500;
}

.stats-label {
  font-size: 13px;
  color: #998C7E;
  font-weight: 400;
}

@media (max-width: 768px) {
  .stats-card {
    padding: 20px;
  }
  
  .stats-value {
    font-size: 32px;
  }
  
  .stats-unit {
    font-size: 13px;
  }
  
  .stats-icon-wrapper {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .stats-content {
    gap: 12px;
  }
  
  .stats-value {
    font-size: 28px;
  }
  
  .stats-unit {
    font-size: 12px;
  }
  
  .stats-label {
    font-size: 12px;
  }
}
</style>
