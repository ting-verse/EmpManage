<template>
  <div class="tree-menu-wrapper">
    <template v-for="menu in userMenu">
      <el-sub-menu 
        v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1"
        :key="`submenu-${menu._id}`"
        :index="menu.path">
        <template #title>
          <i :class="menu.icon"></i>
          <span>{{ menu.menuName }}</span>
        </template>
        <tree-menu :userMenu="menu.children"></tree-menu>
      </el-sub-menu>
      <el-menu-item 
        v-else-if="menu.menuType == 1" 
        :key="`menuitem-${menu._id}`"
        :index="menu.path">
        {{ menu.menuName }}
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import { Setting } from '@element-plus/icons-vue'

export default {
  name: 'TreeMenu',
  components: {
    Setting
  },
  props: {
    userMenu: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>
.tree-menu-wrapper {
  display: contents;
}
</style>