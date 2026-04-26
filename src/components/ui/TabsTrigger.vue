<template>
  <TabsTrigger :value="value" :class="cn('ui-tabs-trigger', props.class)">
    <slot />
  </TabsTrigger>
</template>

<script setup>
import { TabsTrigger } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  class: {
    type: [String, Array, Object],
    default: ''
  }
})
</script>

