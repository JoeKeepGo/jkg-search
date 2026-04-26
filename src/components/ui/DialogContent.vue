<template>
  <DialogPortal>
    <DialogOverlay class="ui-dialog-overlay" />
    <DialogContent :class="cn('ui-dialog-content', props.class)">
      <slot />
    </DialogContent>
  </DialogPortal>
</template>

<script setup>
import { DialogContent, DialogOverlay, DialogPortal } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: [String, Array, Object],
    default: ''
  }
})
</script>

