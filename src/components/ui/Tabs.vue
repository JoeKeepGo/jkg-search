<template>
  <TabsRoot :default-value="defaultValue" :model-value="modelValue" class="ui-tabs" @update:model-value="$emit('update:modelValue', $event)">
    <slot />
  </TabsRoot>
</template>

<script setup>
import { TabsRoot } from 'radix-vue'

defineProps({
  defaultValue: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: undefined
  }
})

defineEmits(['update:modelValue'])
</script>

