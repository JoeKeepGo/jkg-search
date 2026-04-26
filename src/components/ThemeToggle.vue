<template>
  <Button
    :title="label"
    :aria-label="label"
    variant="outline"
    size="icon"
    @click="toggle"
  >
    <Sun v-if="mode === 'light'" :size="16" />
    <Moon v-else-if="mode === 'dark'" :size="16" />
    <Monitor v-else :size="16" />
  </Button>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Monitor, Moon, Sun } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { applyTheme, cycleTheme, getStoredTheme, watchSystemTheme } from '@/lib/theme'

const mode = ref('system')
let stopWatching

const label = computed(() => {
  if (mode.value === 'light') return '切换主题：浅色'
  if (mode.value === 'dark') return '切换主题：深色'
  return '切换主题：跟随系统'
})

function setMode(nextMode) {
  const result = applyTheme(nextMode)
  mode.value = result.mode
}

function toggle() {
  setMode(cycleTheme(mode.value))
}

onMounted(() => {
  setMode(getStoredTheme())
  stopWatching = watchSystemTheme(() => {
    if (mode.value === 'system') setMode('system')
  })
})

onBeforeUnmount(() => {
  stopWatching?.()
})
</script>

