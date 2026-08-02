<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item.path"
      >
        <span
          v-if="item.redirect === 'noredirect' || index === breadcrumbs.length-1"
          class="no-redirect"
        >{{ item.meta.title }}</span>
        <a
          v-else
          @click.prevent="handleLink(item)"
        >{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import pathToRegexp from 'path-to-regexp'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteRecordRaw, RouteLocation } from 'vue-router'

defineOptions({ name: 'Breadcrumb' })

const route = useRoute()
const router = useRouter()

const breadcrumbs = ref<RouteLocation['matched']>([])

function getBreadcrumb() {
  const matched = route.matched.filter(
    item => item.meta && item.meta.title
  )
  breadcrumbs.value = matched.filter(item => {
    return item.meta && item.meta.title && item.meta.breadcrumb !== false
  })
}

function pathCompile(path: string) {
  const { params } = route
  const toPath = pathToRegexp.compile(path)
  return toPath(params)
}

function handleLink(item: any) {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(pathCompile(path))
}

// Initial fetch
getBreadcrumb()

watch(
  () => route.path,
  () => {
    if (route.path.startsWith('/redirect/')) {
      return
    }
    getBreadcrumb()
  }
)
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
