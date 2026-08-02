<!--  -->
<template>
  <div class="empty-box">
    <div class="img-box">
      <img v-if="!isSearch"
           src="../../assets/table_empty.png"
           alt="">
      <img v-else
           src="../../assets/search_table_empty.png">
      <p class="empty-text">{{ !isSearch ? '这里空空如也~' : 'Sorry，木有找到您搜索的内容哦~' }}</p>
      <p class="empty-hint">{{ !isSearch ? '还没有数据哦，快去添加吧~' : '换个关键词试试吧~' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Empty' })

withDefaults(defineProps<{
  isSearch?: boolean
}>(), {
  isSearch: false
})
</script>
<style scoped lang="scss">
.empty-box {
  text-align: center;
  padding: 60px 0 80px;

  .img-box {
    img {
      width: 200px;
      height: auto;
      margin-bottom: 20px;
      opacity: 0.8;
    }
  }

  .empty-text {
    color: #5A5A6E;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .empty-hint {
    color: #B5B5C2;
    font-size: 13px;
  }
}
</style>
