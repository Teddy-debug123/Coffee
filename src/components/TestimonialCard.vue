<script setup>
defineProps({
  name: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, default: 5 },
  content: { type: String, required: true },
  image: { type: String, default: '' }
})
</script>

<template>
  <div class="testimonial-card">
    <div class="testimonial-rating">
      <span class="rating-value">[ {{ rating }}/5 ]</span>
    </div>
    <blockquote class="testimonial-content">
      "{{ content }}"
    </blockquote>
    <div class="testimonial-author">
      <span class="author-name">{{ name }}</span>
      <span class="author-role">{{ role }}</span>
    </div>
    <img v-if="image" :src="image" :alt="name" class="testimonial-image" loading="lazy" />
  </div>
</template>

<style scoped>
.testimonial-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--color-surface);
  border-radius: 16px;
  border: 1px solid var(--color-line);
  position: relative;
}

.testimonial-rating {
  align-self: flex-start;
}

.rating-value {
  font-family: 'SF Mono', monospace;
  font-size: 12px;
  color: var(--color-primary);
  letter-spacing: 0.1em;
}

.testimonial-content {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text);
  font-style: italic;
  margin: 0;
  quotes: none;
}

.testimonial-content::before,
.testimonial-content::after {
  content: '"';
  color: var(--color-secondary);
  font-size: 24px;
}

.testimonial-author {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

.author-role {
  font-size: 12px;
  color: var(--color-muted);
}

.testimonial-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: auto;
  align-self: flex-end;
}
</style>
