<template>
  <div>
    <div
      v-if="!props.item.meta || !props.item.meta.hidden"
      :class="['menu-wrapper', 'full-mode', { 'first-level': props.isFirstLevel }]"
    >
      <template v-if="theOnlyOneChild && !theOnlyOneChild.children">
        <sidebar-item-link
          v-if="theOnlyOneChild.meta"
          :to="resolvePath(theOnlyOneChild.path)"
        >
          <el-menu-item
            :index="resolvePath(theOnlyOneChild.path)"
            :class="{ 'submenu-title-noDropdown': props.isFirstLevel }"
          >
            <i
              v-if="theOnlyOneChild.meta.icon"
              class="iconfont"
              :class="theOnlyOneChild.meta.icon"
            />
            <template #title>
              <span v-if="theOnlyOneChild.meta.title">{{
                theOnlyOneChild.meta.title
              }}</span>
            </template>
          </el-menu-item>
        </sidebar-item-link>
      </template>
      <el-sub-menu v-else :index="resolvePath(props.item.path)" teleported>
        <template #title>
          <i
            v-if="props.item.meta && props.item.meta.icon"
            class="iconfont"
            :class="props.item.meta.icon"
          />
          <span v-if="props.item.meta && props.item.meta.title">{{
            props.item.meta.title
          }}</span>
        </template>
        <template v-if="props.item.children">
          <sidebar-item
            v-for="child in props.item.children"
            :key="child.path"
            :item="child"
            :is-collapse="props.isCollapse"
            :is-first-level="false"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
        </template>
      </el-sub-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'

defineOptions({ name: 'SidebarItem' })

const props = withDefaults(
  defineProps<{
    item: any
    isCollapse?: boolean
    isFirstLevel?: boolean
    basePath?: string
  }>(),
  {
    isCollapse: false,
    isFirstLevel: true,
    basePath: '',
  }
)

const userStore = useUserStore()

const roles = computed(() => userStore.roles)

const showingChildNumber = computed(() => {
  if (props.item.children) {
    const showingChildren = props.item.children.filter((item: any) => {
      if (item.meta && item.meta.hidden) {
        return false
      }
      return true
    })
    return showingChildren.length
  }
  return 0
})

const theOnlyOneChild = computed(() => {
  if (showingChildNumber.value > 0) {
    return null
  }
  if (props.item.children) {
    for (const child of props.item.children) {
      if (!child.meta || !child.meta.hidden) {
        return child
      }
    }
  }
  // If there is no children, return itself with path removed,
  // because this.basePath already contains item's path information
  return { ...props.item, path: '' }
})

function resolvePath(routePath: string) {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  if (!routePath) return props.basePath || '/'
  const base = props.basePath || ''
  let fullPath = ''
  if (base.endsWith('/') || routePath.startsWith('/')) {
    fullPath = base + routePath
  } else {
    fullPath = base + '/' + routePath
  }
  // 确保始终返回绝对路径
  return fullPath.startsWith('/') ? fullPath : '/' + fullPath
}
</script>
