<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { audioManager } from '../utils/audio'

const props = defineProps({
  modelValue: { type: Number, default: 150 },
  min: { type: Number, default: 10 },
  max: { type: Number, default: 200 },
  step: { type: Number, default: 5 }
})

const emit = defineEmits(['update:modelValue', 'change'])

const currentValue = ref(props.modelValue)
const isDragging = ref(false)
const isAnimating = ref(false)
const showSyncHint = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const scaleRef = ref(null)
const longPressTimer = ref(null)

const quickWeights = [
  { label: '单人', value: 15, tip: '单人标准 15g' },
  { label: '双人', value: 30, tip: '双人标准 30g' },
  { label: '多人', value: 150, tip: '多人标准 150g' }
]

const snapPoints = [15, 30, 150]
const circumference = 534
const startAngle = -135
const endAngle = 135
const totalAngle = endAngle - startAngle

const progress = computed(() => {
  const percentage = ((currentValue.value - props.min) / (props.max - props.min))
  return percentage * circumference
})

const currentZone = computed(() => {
  return currentValue.value <= 120 ? 'normal' : 'large'
})

const scaleMarks = computed(() => {
  const marks = []
  const totalMarks = 39
  for (let i = 0; i <= totalMarks; i++) {
    const angle = startAngle + (i / totalMarks) * totalAngle
    const percentage = i / totalMarks
    const value = Math.round(props.min + percentage * (props.max - props.min))
    const isMajor = i % 4 === 0
    const isSnapPoint = snapPoints.includes(value)
    marks.push({ angle, value, isMajor, isSnapPoint })
  }
  return marks
})

const handleMouseDown = (e) => {
  isDragging.value = true
  isAnimating.value = true
  updateValue(e)
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  updateValue(e)
}

const handleMouseUp = () => {
  isDragging.value = false
  isAnimating.value = false
  snapToNearestPoint()
  showSyncStatus()
}

const snapToNearestPoint = () => {
  const snapThreshold = 5
  for (const point of snapPoints) {
    if (Math.abs(currentValue.value - point) <= snapThreshold) {
      currentValue.value = point
      emit('update:modelValue', currentValue.value)
      emit('change', currentValue.value)
      audioManager.playClick()
      break
    }
  }
}

const updateValue = (e) => {
  if (!scaleRef.value) return
  const rect = scaleRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
  let degrees = (angle * 180 / Math.PI + 180) % 360
  degrees = 360 - degrees
  degrees = (degrees + 90) % 360
  const normalizedAngle = Math.max(startAngle, Math.min(endAngle, degrees - 90))
  const percentage = (normalizedAngle - startAngle) / totalAngle
  const rawValue = props.min + percentage * (props.max - props.min)
  const snappedValue = Math.round(rawValue / props.step) * props.step
  const clampedValue = Math.max(props.min, Math.min(props.max, snappedValue))
  
  if (clampedValue !== currentValue.value) {
    if (clampedValue > currentValue.value) audioManager.playAddGram()
    else audioManager.playSubtractGram()
    currentValue.value = clampedValue
    emit('update:modelValue', currentValue.value)
    emit('change', currentValue.value)
  }
}

const increaseValue = () => {
  const newValue = Math.min(props.max, currentValue.value + props.step)
  if (newValue !== currentValue.value) {
    audioManager.playAddGram()
    currentValue.value = newValue
    emit('update:modelValue', currentValue.value)
    emit('change', currentValue.value)
    showSyncStatus()
  } else if (currentValue.value >= props.max) {
    showLimitToast('最大 200g')
  }
}

const decreaseValue = () => {
  const newValue = Math.max(props.min, currentValue.value - props.step)
  if (newValue !== currentValue.value) {
    audioManager.playSubtractGram()
    currentValue.value = newValue
    emit('update:modelValue', currentValue.value)
    emit('change', currentValue.value)
    showSyncStatus()
  } else if (currentValue.value <= props.min) {
    showLimitToast('最小 10g')
  }
}

const startLongPress = (direction) => {
  longPressTimer.value = setInterval(() => {
    if (direction === 'increase') increaseValue()
    else decreaseValue()
  }, 100)
}

const stopLongPress = () => {
  if (longPressTimer.value) {
    clearInterval(longPressTimer.value)
    longPressTimer.value = null
  }
}

const setQuickWeight = (weight) => {
  audioManager.playClick()
  isAnimating.value = true
  setTimeout(() => {
    currentValue.value = weight
    emit('update:modelValue', currentValue.value)
    emit('change', currentValue.value)
    isAnimating.value = false
    showSyncStatus()
  }, 50)
}

const showSyncStatus = () => {
  showSyncHint.value = true
  setTimeout(() => { showSyncHint.value = false }, 1500)
}

const showLimitToast = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 1500)
}

watch(() => props.modelValue, (newVal) => {
  currentValue.value = newVal
})

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  stopLongPress()
})
</script>

<template>
  <div class="coffee-scale">
    <div class="scale-container" ref="scaleRef" @mousedown="handleMouseDown">
      <svg class="scale-svg" viewBox="0 0 220 220">
        <defs>
          <linearGradient id="scaleGradientNormal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E8E0D5" />
            <stop offset="100%" stop-color="#D4C4B0" />
          </linearGradient>
          <linearGradient id="scaleGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C8B8A8" />
            <stop offset="100%" stop-color="#8B7355" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle class="scale-track" cx="110" cy="110" r="85" fill="none" stroke="#F5F3EF" stroke-width="8" stroke-linecap="round" stroke-dasharray="534" stroke-dashoffset="178" transform="rotate(-135 110 110)" />
        
        <circle class="scale-track-large" cx="110" cy="110" r="85" fill="none" stroke="#E8E0D5" stroke-width="8" stroke-linecap="round" stroke-dasharray="534" stroke-dashoffset="320" transform="rotate(45 110 110)" />
        
        <circle class="scale-progress" cx="110" cy="110" r="85" fill="none" :stroke="currentZone === 'normal' ? 'url(#scaleGradientNormal)' : 'url(#scaleGradientLarge)'" stroke-width="8" stroke-linecap="round" stroke-dasharray="534" :stroke-dashoffset="534 - progress" transform="rotate(-135 110 110)" filter="url(#glow)" />
        
        <g class="scale-markers">
          <g v-for="mark in scaleMarks" :key="mark.value">
            <line :x1="110 + 72 * Math.cos((mark.angle * Math.PI) / 180)" :y1="110 + 72 * Math.sin((mark.angle * Math.PI) / 180)" :x2="110 + (mark.isMajor ? 82 : 77) * Math.cos((mark.angle * Math.PI) / 180)" :y2="110 + (mark.isMajor ? 82 : 77) * Math.sin((mark.angle * Math.PI) / 180)" :stroke="mark.isSnapPoint ? '#3A281B' : '#C8B8A8'" :stroke-width="mark.isMajor ? 2 : (mark.isSnapPoint ? 1.5 : 0.8)" stroke-linecap="round" />
            <text v-if="mark.isMajor" :x="110 + 62 * Math.cos((mark.angle * Math.PI) / 180)" :y="110 + 62 * Math.sin((mark.angle * Math.PI) / 180)" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="#8B7355" font-weight="500">{{ mark.value }}</text>
          </g>
        </g>
      </svg>
      
      <div class="scale-center">
        <div class="value-display" :class="{ animating: isAnimating }">
          <span class="value">{{ currentValue }}</span>
          <span class="unit">g</span>
        </div>
      </div>
      
      <div class="scale-range">可调范围：10-200g</div>
    </div>
    
    <div class="quick-weights">
      <button v-for="weight in quickWeights" :key="weight.value" class="quick-btn" :class="{ active: currentValue === weight.value }" @click="setQuickWeight(weight.value)">
        <span class="btn-text">{{ weight.label }}</span>
        <span class="btn-tip">{{ weight.tip }}</span>
      </button>
    </div>
    
    <div class="controls">
      <button class="control-btn decrease" :disabled="currentValue <= props.min" @click="decreaseValue" @mousedown="startLongPress('decrease')" @mouseup="stopLongPress" @mouseleave="stopLongPress">-</button>
      <span class="step-label">单次 5g</span>
      <button class="control-btn increase" :disabled="currentValue >= props.max" @click="increaseValue" @mousedown="startLongPress('increase')" @mouseup="stopLongPress" @mouseleave="stopLongPress">+</button>
    </div>
    
    <Transition name="fade">
      <div v-if="showSyncHint" class="sync-hint">已同步至快捷方案</div>
    </Transition>
    
    <Transition name="toast">
      <div v-if="showToast" class="scale-toast">{{ toastMessage }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.coffee-scale {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 32px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(58, 40, 27, 0.06);
  border: 1px solid var(--color-line);
  min-width: 280px;
}

.scale-container {
  position: relative;
  width: 200px;
  height: 200px;
  cursor: pointer;
  user-select: none;
}

.scale-svg {
  width: 100%;
  height: 100%;
}

.scale-progress {
  transition: stroke-dashoffset 0.15s ease-out, stroke 0.3s ease;
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
  transition: transform 0.2s ease;
}

.value-display.animating {
  transform: scale(1.08);
}

.value {
  font-size: 3rem;
  font-weight: 700;
  font-family: var(--font-display);
  color: var(--color-primary);
  letter-spacing: -0.02em;
  line-height: 1;
}

.unit {
  font-size: 1.25rem;
  color: var(--color-secondary);
  margin-left: 4px;
  font-weight: 500;
}

.scale-range {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: var(--color-muted);
  white-space: nowrap;
}

.quick-weights {
  display: flex;
  gap: 12px;
}

.quick-btn {
  position: relative;
  padding: 10px 20px;
  border-radius: 999px;
  background: rgba(200,184,168,.12);
  color: var(--color-text);
  font-size: var(--fs-small);
  font-weight: 500;
  border: 1.5px solid transparent;
  transition: all 0.25s ease;
  cursor: pointer;
}

.quick-btn:hover {
  background: rgba(200,184,168,.2);
  border-color: rgba(58,40,27,.1);
}

.quick-btn.active {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 12px rgba(58, 40, 27, 0.2);
}

.quick-btn .btn-tip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 10px;
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.quick-btn:hover .btn-tip {
  opacity: 1;
}

.quick-btn .btn-tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--color-primary);
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid rgba(58,40,27,.12);
  background: #fff;
  font-size: 1.5rem;
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background: rgba(200,184,168,.15);
  border-color: var(--color-secondary);
  transform: scale(1.08);
}

.control-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.step-label {
  font-size: 11px;
  color: var(--color-muted);
}

.sync-hint {
  font-size: 12px;
  color: var(--color-muted);
  margin-top: -8px;
}

.scale-toast {
  position: fixed;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background: rgba(58, 40, 27, 0.85);
  color: #fff;
  font-size: 13px;
  border-radius: 999px;
  z-index: 1000;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
