<template>
  <component :is="as" :class="buttonClass" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const props = defineProps({
  as: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'default'
  },
  class: {
    type: [String, Array, Object],
    default: ''
  }
})

const variants = cva('ui-button', {
  variants: {
    variant: {
      default: 'ui-button-default',
      secondary: 'ui-button-secondary',
      outline: 'ui-button-outline',
      ghost: 'ui-button-ghost',
      destructive: 'ui-button-destructive'
    },
    size: {
      default: 'ui-button-md',
      sm: 'ui-button-sm',
      icon: 'ui-button-icon'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

const buttonClass = computed(() => cn(variants({ variant: props.variant, size: props.size }), props.class))
</script>

