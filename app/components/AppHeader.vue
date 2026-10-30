
<script setup lang="ts">
type Theme = 'dark' | 'light'

const theme = useCookie<Theme>('portfolio-theme', {
  default: () => 'dark',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax',
})

const isDark = computed({
  get: () => theme.value === 'dark',
  set: (value: boolean) => {
    theme.value = value ? 'dark' : 'light'
  },
})

useHead(() => ({
  bodyAttrs: {
    class: isDark.value ? 'theme-dark' : 'theme-light',
  },
}))

function toggleTheme(event: MouseEvent) {
  const toggle = () => {
    isDark.value = !isDark.value
  }

  if (
      !import.meta.client ||
      !document.startViewTransition
  ) {
    toggle()
    return
  }

  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()

  document.documentElement.style.setProperty(
      '--theme-x',
      `${rect.left + rect.width / 2}px`,
  )

  document.documentElement.style.setProperty(
      '--theme-y',
      `${rect.top + rect.height / 2}px`,
  )

  document.startViewTransition(toggle)
}
</script>

<template>
  <header class="site-header">
    <NuxtLink to="/" class="logo" aria-label="Wishlist home">
      Wishlists<span>*</span>
    </NuxtLink>

    <button
        class="theme-toggle"
        type="button"
        aria-label="Wissel kleurthema"
        @click="toggleTheme"
    >
      {{ isDark ? '☾' : '☼' }}
    </button>
  </header>
</template>

<style scoped>
.site-header {
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.main-nav a:hover {
  color: var(--primary);
}

.theme-toggle {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  flex-shrink: 0;
  cursor: pointer;
  transition:
      background-color 200ms ease,
      color 200ms ease,
      border-color 200ms ease;
}

.theme-toggle:hover,
.theme-toggle:focus-visible {
  border-color: var(--text);
  background: var(--text);
  color: var(--background);
}

@media (max-width: 700px) {
  .site-header {
    min-height: 60px;
    gap: 12px;
  }

  .main-nav a {
    font-size: 10px;
  }
}

@media (max-width: 420px) {

  .theme-toggle {
    width: 32px;
    height: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle {
    transition: none;
  }
}
</style>