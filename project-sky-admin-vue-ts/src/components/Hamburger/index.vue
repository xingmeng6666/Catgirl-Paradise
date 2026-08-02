<template>
  <div :class="[{'is-active': isActive}]" @click="toggleClick">
    <svg width="20" height="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path d="M408 442h480a8 8 0 0 0 8-8v-56a8 8 0 0 0-8-8H408a8 8 0 0 0-8 8v56a8 8 0 0 0 8 8zm-8 204a8 8 0 0 0 8 8h480a8 8 0 0 0 8-8v-56a8 8 0 0 0-8-8H408a8 8 0 0 0-8 8v56zm504-486H120a8 8 0 0 0-8 8v56a8 8 0 0 0 8 8h784a8 8 0 0 0 8-8v-56a8 8 0 0 0-8-8zm0 632H120a8 8 0 0 0-8 8v56a8 8 0 0 0 8 8h784a8 8 0 0 0 8-8v-56a8 8 0 0 0-8-8z" fill="currentColor"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Hamburger' })

withDefaults(defineProps<{
  isActive?: boolean
}>(), {
  isActive: false
})

const emit = defineEmits<{
  toggleClick: []
}>()

function toggleClick() {
  emit('toggleClick')
}
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: middle;
}

.is-active {
  transform: rotate(180deg);
}
</style>
