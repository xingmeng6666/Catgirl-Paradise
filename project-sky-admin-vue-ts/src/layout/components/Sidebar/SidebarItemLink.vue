<template>
  <a v-if="isExternal(props.to)" :href="props.to" target="_blank" rel="noopener">
    <slot />
  </a>
  <slot v-else />
</template>

<script setup lang="ts">
import { isExternal } from '@/utils/validate'

defineOptions({ name: 'SidebarItemLink' })

const props = defineProps<{
  to: string
}>()
</script>
