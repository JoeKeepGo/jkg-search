<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <slot />
  </DialogRoot>
</template>

<script setup>
import { DialogRoot } from 'radix-vue'

defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:open'])
</script>

