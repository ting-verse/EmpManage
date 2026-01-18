<script>
export default {
  name: 'Login',
  methods: {
    goHome() {
      this.$router.push('/welcome')
    }
  }
}
</script>

<template>
  <div>
    <h1>登录页</h1>
    <div @click="goHome">返回首页</div>button>
  </div>
</template>