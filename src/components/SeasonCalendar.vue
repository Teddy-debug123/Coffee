<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ season: null, date: null })
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const seasons = [
  { id: 'spring', name: '春季', months: [3, 4, 5], color: '#8B9A6D' },
  { id: 'summer', name: '夏季', months: [6, 7, 8], color: '#C4A77D' },
  { id: 'autumn', name: '秋季', months: [9, 10, 11], color: '#8B6914' },
  { id: 'winter', name: '冬季', months: [12, 1, 2], color: '#A8A8A8' }
]

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const currentDate = new Date()
const selectedSeason = ref(props.modelValue.season)
const selectedDate = ref(props.modelValue.date ? new Date(props.modelValue.date) : null)
const currentMonth = ref(currentDate.getMonth())
const currentYear = ref(currentDate.getFullYear())

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const calendarDays = computed(() => {
  const days = []
  for (let i = 0; i < firstDayOfMonth.value; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth.value; i++) {
    days.push({
      date: i,
      isToday: i === currentDate.getDate() && 
               currentMonth.value === currentDate.getMonth() && 
               currentYear.value === currentDate.getFullYear(),
      isSelected: selectedDate.value && 
                  i === selectedDate.value.getDate() && 
                  currentMonth.value === selectedDate.value.getMonth() && 
                  currentYear.value === selectedDate.value.getFullYear()
    })
  }
  return days
})

const selectedSeasonData = computed(() => {
  return seasons.find(s => s.id === selectedSeason.value)
})

const selectSeason = (seasonId) => {
  selectedSeason.value = selectedSeason.value === seasonId ? null : seasonId
  emitChange()
}

const selectDate = (day) => {
  if (!day) return
  selectedDate.value = new Date(currentYear.value, currentMonth.value, day.date)
  emitChange()
}

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const emitChange = () => {
  const value = {
    season: selectedSeason.value,
    date: selectedDate.value ? selectedDate.value.toISOString().split('T')[0] : null
  }
  emit('update:modelValue', value)
  emit('change', value)
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
        :style="{ '--season-color': season.color }"
        @click="selectSeason(season.id)"
      >
        {{ season.name }}
      </button>
    </div>
    
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="nav-btn" @click="prevMonth">‹</button>
        <span class="month-year">
          {{ currentYear }}年 {{ currentMonth + 1 }}月
        </span>
        <button class="nav-btn" @click="nextMonth">›</button>
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
            'empty': !day
          }"
          @click="selectDate(day)"
        >
          {{ day?.date }}
        </button>
      </div>
    </div>
    
    <div v-if="selectedSeasonData || selectedDate" class="selection-summary">
      <div class="summary-item" v-if="selectedSeasonData">
        <span class="label">季节</span>
        <span class="value" :style="{ color: selectedSeasonData.color }">
          {{ selectedSeasonData.name }}限定豆
        </span>
      </div>
      <div class="summary-item" v-if="selectedDate">
        <span class="label">日期</span>
        <span class="value">{{ selectedDate.toLocaleDateString('zh-CN') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.season-calendar {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(45, 31, 20, 0.06);
}

.seasons-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.season-btn {
  flex: 1;
  background: #F5F3EF;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #6B5B4F;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.season-btn:hover {
  background: #E8E4DD;
}

.season-btn.active {
  background: var(--season-color);
  color: #fff;
}

.calendar-container {
  margin-bottom: 1.5rem;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.nav-btn {
  background: none;
  border: none;
  color: #5C4033;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #F5F3EF;
}

.month-year {
  font-size: 1rem;
  font-weight: 500;
  color: #2D1F14;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-size: 0.75rem;
  color: #8B7355;
  padding: 0.5rem;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.day-btn {
  aspect-ratio: 1;
  background: none;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #5C4033;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-btn:hover:not(.empty) {
  background: #F5F3EF;
}

.day-btn.empty {
  cursor: default;
  opacity: 0;
}

.day-btn.is-today {
  background: #F5E6D3;
  color: #5C4033;
}

.day-btn.is-selected {
  background: #2D1F14;
  color: #fff;
}

.selection-summary {
  display: flex;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #F5F3EF;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-item .label {
  font-size: 0.7rem;
  color: #8B7355;
  letter-spacing: 0.05em;
}

.summary-item .value {
  font-size: 0.9rem;
  color: #2D1F14;
  font-weight: 500;
}
</style>