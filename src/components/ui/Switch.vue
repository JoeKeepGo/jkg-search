<template>
  <SwitchRoot
    :checked="modelValue"
    :class="cn('ui-switch', modelValue && 'ui-switch-checked', props.class)"
    @update:checked="$emit('update:modelValue', $event)"
  >
    <SwitchThumb class="ui-switch-thumb" />
  </SwitchRoot>
</template>

<script setup>
import { SwitchRoot, SwitchThumb } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  class: {
    type: [String, Array, Object],
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>

