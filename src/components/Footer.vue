<template>
  <footer class="page-footer">
    <div class="container">
      <div class="footer-content">
        <span class="footer-brand">COFFEE ONLINE</span>
        <span class="footer-copyright">© 2026 Coffee Online. All rights reserved.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.page-footer {
  background: var(--color-primary);
  padding: 24px 0;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.footer-brand {
  font-size: var(--fs-body);
  letter-spacing: 0.2em;
  color: rgba(200, 184, 168, 0.7);
  font-family: var(--font-display);
}

.footer-copyright {
  font-size: var(--fs-small);
  color: rgba(200, 184, 168, 0.5);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
