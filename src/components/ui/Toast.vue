<template>
  <div v-if="message" :class="cn('ui-toast', type === 'error' && 'ui-toast-error')">
    {{ message }}
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'

defineProps({
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'success'
  }
})
</script>

