<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
      <router-link v-if="index < breadcrumbList.length - 1" :to="item.path">
        {{ item.meta?.title }}
      </router-link>
      <span v-else>{{ item.meta?.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  computed: {
    breadcrumbList() {
      return this.$route.matched
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  line-height: 50px;
}
</style>