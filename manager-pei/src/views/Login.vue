<script>
export default {
  name: 'Login',
  methods: {
    goHome() {
      this.$router.push('/welcome')
    }
  },
  mounted() {
    this.$request.get('/login', {
      name: 'jason'
    }, { mock: true }).then(res => {
      console.log(res)
    })  
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form>
        <div class="title">登录</div>
        <el-form-item>
          <el-input type="text" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item >
          <el-input type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" >
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:#f9fcff;
  width: 100vw,;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 35px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 3px  #c7c9cb4d;
    .title {
      font-size: 35px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 20px;
    }
    .btn-login {
      width: 100%;
      height: 40px;
      border-radius: 5px;
      background-color: #409EFF;
      color: #fff;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      border: none;
    }
  }
}
</style>