<template>
  <div class="ui-table-wrap">
    <table :class="cn('ui-table', props.class)">
      <slot />
    </table>
  </div>
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

