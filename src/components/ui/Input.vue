<template>
  <input
    :value="modelValue"
    :class="cn('ui-input', props.class)"
    v-bind="$attrs"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  class: {
    type: [String, Array, Object],
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
