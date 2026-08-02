<!--  -->
<template>
  <div class="input-auto-complete">
    <el-input
      v-model="input"
      :placeholder="placeholder"
      style="width: 250px"
      clearable
      @clear="init"
      @keyup.enter="init"
    >
      <template #prefix>
        <i
          class="el-input__icon el-icon-search"
          style="cursor: pointer"
          @click="init"
        />
      </template>
    </el-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ name: 'InputAutoComplete' })

const props = withDefaults(defineProps<{
  data?: Array<any>
  placeholder?: string
  ObKey?: string
}>(), {
  data: () => [],
  placeholder: '',
  ObKey: 'name'
})

const emit = defineEmits<{
  init: [value: any]
}>()

const input = ref<any>('')

function init() {
  emit('init', input.value)
}
</script>
<style scoped>
.input-auto-complete {
  display: inline-block;
}
</style>
