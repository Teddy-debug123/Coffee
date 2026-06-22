<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  specs: { type: Array, default: () => [] },
  icon: { type: String, default: '' }
})
</script>

<template>
  <div class="feature-card">
    <div v-if="icon" class="feature-icon">{{ icon }}</div>
    <div class="feature-header">
      <h3 class="feature-title">{{ title }}</h3>
      <span v-if="subtitle" class="feature-subtitle">{{ subtitle }}</span>
    </div>
    <p v-if="description" class="feature-description">{{ description }}</p>
    <div v-if="specs.length" class="feature-specs">
      <div v-for="(spec, index) in specs" :key="index" class="spec-item">
        <span class="spec-label">{{ spec.label }}</span>
        <span class="spec-value">{{ spec.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
}

.feature-icon {
  font-size: 48px;
  line-height: 1;
}

.feature-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.feature-subtitle {
  font-size: 13px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.feature-description {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text);
  margin: 0;
}

.feature-specs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--color-line);
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-label {
  font-size: 12px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.spec-value {
  font-family: 'SF Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}
</style>
