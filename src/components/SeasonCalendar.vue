<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ season: null, date: null }) }
})
const emit = defineEmits(['update:modelValue', 'change'])

const seasons = [
  { id: 'spring', name: '春季', months: [3, 4, 5], color: '#9AB87D', bgColor: 'rgba(154, 184, 125, 0.15)', tip: '春季：3–5月，主打清新花香豆' },
  { id: 'summer', name: '夏季', months: [6, 7, 8], color: '#E8B495', bgColor: 'rgba(232, 180, 149, 0.15)', tip: '夏季：6–8月，主打清爽果酸浅烘豆' },
  { id: 'autumn', name: '秋季', months: [9, 10, 11], color: '#C4A35A', bgColor: 'rgba(196, 163, 90, 0.15)', tip: '秋季：9–11月，主打坚果焦糖中度烘焙' },
  { id: 'winter', name: '冬季', months: [12, 1, 2], color: '#B8C4C4', bgColor: 'rgba(184, 196, 196, 0.15)', tip: '冬季：12–2月，主打浓郁巧克力深烘豆' }
]

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const today = new Date()

const selectedSeason = ref(props.modelValue.season)
const selectedDate = ref(props.modelValue.date ? new Date(props.modelValue.date) : null)
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

const minYear = 2024
const maxYear = 2027
const minMonth = 0
const maxMonth = 11

const isPrevDisabled = computed(() => {
  return currentYear.value === minYear && currentMonth.value === minMonth
})

const isNextDisabled = computed(() => {
  return currentYear.value === maxYear && currentMonth.value === maxMonth
})

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const getSeasonForDate = (year, month, day) => {
  const m = month + 1
  return seasons.find(s => s.months.includes(m))
}

const calendarDays = computed(() => {
  const days = []
  for (let i = 0; i < firstDayOfMonth.value; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth.value; i++) {
    const date = new Date(currentYear.value, currentMonth.value, i)
    const season = getSeasonForDate(currentYear.value, currentMonth.value, i)
    days.push({
      date: i,
      isToday: i === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear(),
      isSelected: selectedDate.value && i === selectedDate.value.getDate() && currentMonth.value === selectedDate.value.getMonth() && currentYear.value === selectedDate.value.getFullYear(),
      season,
      seasonColor: season?.bgColor || 'transparent',
      seasonTextColor: season?.color || 'inherit'
    })
  }
  return days
})

const selectedSeasonData = computed(() => {
  return seasons.find(s => s.id === selectedSeason.value)
})

const emitChange = () => {
  const value = { 
    season: selectedSeason.value, 
    date: selectedDate.value ? selectedDate.value.toISOString().split('T')[0] : null 
  }
  emit('update:modelValue', value)
  emit('change', value)
}

const selectSeason = (seasonId) => {
  selectedSeason.value = selectedSeason.value === seasonId ? null : seasonId
  if (selectedSeason.value) {
    const season = seasons.find(s => s.id === seasonId)
    if (season) {
      const targetMonth = season.months[0] - 1
      currentMonth.value = targetMonth
      if (targetMonth < currentMonth.value) {
        currentYear.value--
      } else if (targetMonth > currentMonth.value) {
        currentYear.value++
      }
      currentMonth.value = targetMonth
    }
  }
  emitChange()
}

const selectDate = (day) => {
  if (!day) return
  selectedDate.value = new Date(currentYear.value, currentMonth.value, day.date)
  if (day.season) {
    selectedSeason.value = day.season.id
  }
  emitChange()
}

const prevMonth = () => {
  if (isPrevDisabled.value) return
  if (currentMonth.value === 0) {
    currentYear.value--
    currentMonth.value = 11
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (isNextDisabled.value) return
  if (currentMonth.value === 11) {
    currentYear.value++
    currentMonth.value = 0
  } else {
    currentMonth.value++
  }
}

const goToToday = () => {
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
  selectedDate.value = today
  const season = getSeasonForDate(today.getFullYear(), today.getMonth(), today.getDate())
  if (season) {
    selectedSeason.value = season.id
  }
  emitChange()
}

watch(() => props.modelValue, (newVal) => {
  selectedSeason.value = newVal.season
  selectedDate.value = newVal.date ? new Date(newVal.date) : null
}, { deep: true })
</script>

<template>
  <div class="season-calendar">
    <div class="seasons-row">
      <button 
        v-for="season in seasons" 
        :key="season.id" 
        class="season-btn" 
        :class="{ active: selectedSeason === season.id }"
        :style="{ '--season-color': season.color, '--season-bg': season.bgColor }"
        @click="selectSeason(season.id)"
      >
        <span class="season-name">{{ season.name }}</span>
        <span class="season-months">({{ season.months.join('–') }}月)</span>
        <span class="season-tip">{{ season.tip }}</span>
      </button>
    </div>
    
    <div class="calendar-container">
      <div class="calendar-header">
        <button 
          class="nav-btn" 
          :class="{ disabled: isPrevDisabled }"
          @click="prevMonth"
        >‹</button>
        <div class="month-year-wrapper">
          <span class="month-year">{{ currentYear }}年 {{ currentMonth + 1 }}月</span>
          <button class="today-btn" @click="goToToday">今日</button>
        </div>
        <button 
          class="nav-btn" 
          :class="{ disabled: isNextDisabled }"
          @click="nextMonth"
        >›</button>
      </div>
      
      <div class="weekdays">
        <span v-for="day in weekdays" :key="day" class="weekday">{{ day }}</span>
      </div>
      
      <div class="calendar-grid">
        <button 
          v-for="(day, index) in calendarDays" 
          :key="index" 
          class="day-btn" 
          :class="{ 
            'is-today': day?.isToday, 
            'is-selected': day?.isSelected, 
            'empty': !day,
            'has-season': day?.season
          }"
          :style="{ '--day-season-bg': day?.seasonColor || 'transparent' }"
          @click="selectDate(day)"
        >
          <span v-if="day?.date" class="day-date">{{ day.date }}</span>
          <span v-if="day?.isToday" class="today-dot"></span>
        </button>
      </div>
    </div>
    
    <div v-if="selectedSeasonData || selectedDate" class="selection-summary">
      <div v-if="selectedSeasonData" class="summary-item">
        <span class="label">季节</span>
        <span class="value" :style="{ color: selectedSeasonData.color }">
          {{ selectedSeasonData.name }}限定豆
        </span>
      </div>
      <div v-if="selectedDate" class="summary-item">
        <span class="label">日期</span>
        <span class="value">{{ selectedDate.toLocaleDateString('zh-CN') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.season-calendar {
  padding: var(--card-padding);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.seasons-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.season-btn {
  position: relative;
  padding: 10px 8px;
  border-radius: 999px;
  background: rgba(200, 184, 168, 0.12);
  color: var(--color-text);
  font-size: var(--fs-small);
  font-weight: 500;
  border: 1.5px solid transparent;
  transition: all 0.25s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.season-btn:hover {
  background: rgba(200, 184, 168, 0.2);
  border-color: rgba(58, 40, 27, 0.1);
}

.season-btn.active {
  background: var(--season-bg);
  border-color: var(--season-color);
  color: var(--season-color);
  font-weight: 600;
}

.season-name {
  font-size: 14px;
}

.season-months {
  font-size: 11px;
  opacity: 0.7;
}

.season-tip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: var(--color-primary);
  color: #fff;
  font-size: 12px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.season-btn:hover .season-tip {
  opacity: 1;
}

.season-tip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--color-primary);
}

.calendar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(200, 184, 168, 0.12);
  color: var(--color-primary);
  font-size: 18px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover:not(.disabled) {
  background: rgba(200, 184, 168, 0.25);
}

.nav-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.month-year-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.month-year {
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--color-primary);
}

.today-btn {
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(200, 184, 168, 0.12);
  color: var(--color-muted);
  font-size: 12px;
  transition: all 0.2s ease;
}

.today-btn:hover {
  background: rgba(200, 184, 168, 0.25);
  color: var(--color-primary);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin-bottom: 8px;
}

.weekday {
  font-size: 13px;
  color: var(--color-muted);
  text-align: center;
  padding: 8px 0;
  font-weight: 500;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  flex: 1;
}

.day-btn {
  aspect-ratio: 1;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-btn:hover:not(.empty) {
  background: rgba(200, 184, 168, 0.2);
  border-color: rgba(200, 184, 168, 0.3);
}

.day-btn.empty {
  opacity: 0;
  cursor: default;
}

.day-btn.has-season {
  background: var(--day-season-bg);
}

.day-btn.is-today {
  border-color: var(--color-primary);
  background: rgba(58, 40, 27, 0.05);
}

.day-btn.is-selected {
  background: var(--color-primary);
  color: #fff;
}

.day-date {
  z-index: 1;
}

.today-dot {
  position: absolute;
  bottom: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-primary);
}

.day-btn.is-selected .today-dot {
  background: #fff;
}

.selection-summary {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px dashed var(--color-line);
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: var(--fs-small);
  color: var(--color-muted);
}

.value {
  font-size: var(--fs-body);
  color: var(--color-primary);
  font-weight: 600;
}
</style>