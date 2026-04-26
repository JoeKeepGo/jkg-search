<template>
  <input :class="cn('ui-input', props.class)" v-bind="$attrs" />
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

