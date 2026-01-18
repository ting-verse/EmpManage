<script>
export default {
  name: 'Login',
  methods: {
    goHome() {
      this.$router.push('/welcome')
    }
  },
  mounted() {
    // this.$request({
    //   method: 'get',
    //   url: '/login',
    //   data: {
    //     name: 'jason'
    //   }
    // }).then(res => {
    //   console.log(res)
    // })
    this.$request.get('/login', {
      name: 'jason'
    }, { mock: true }).then(res => {
      console.log(res)
    })
  }
}
</script>

<template>
  <div>
    <h1>登录页</h1>
    <div @click="goHome">返回首页</div>button>
  </div>
</template>