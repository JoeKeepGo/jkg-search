<template>
  <TabsList :class="cn('ui-tabs-list', props.class)">
    <slot />
  </TabsList>
</template>

<script setup>
import { TabsList } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: [String, Array, Object],
    default: ''
  }
})
</script>

