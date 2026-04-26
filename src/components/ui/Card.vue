<template>
  <div :class="cn('ui-card', props.class)">
    <slot />
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: [String, Array, Object],
    default: ''
  }
})
</script>

