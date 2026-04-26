<template>
  <TabsContent :value="value" :class="cn('ui-tabs-content', props.class)">
    <slot />
  </TabsContent>
</template>

<script setup>
import { TabsContent } from 'radix-vue'
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

