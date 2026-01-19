<script>
import { User, View } from '@element-plus/icons-vue'

export default {
  name: 'Login',
  components: {
    User,
    View
  },
  data() {
    return {
      user: {
        userName: '',
        userPwd: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    goHome() {
      this.$router.push('/welcome')
    },
    login() {
      this.$refs.userForm.validate((res) => {
        // console.log(res)
        if (res) {
          this.$api.login(this.user).then(res => {
            // console.log(res)
            this.$store.commit('setUserInfo', res)
            this.$router.push("/welcome")
          })
        }
      })
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
      <el-form :model="user" :rules="rules" status-icon ref="userForm">
        <div class="title">登录</div>
        <el-form-item prop="userName">
          <el-input type="text" placeholder="请输入用户名" v-model="user.userName">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" placeholder="请输入密码" v-model="user.userPwd">
            <template #prefix>
              <el-icon>
                <View />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;

  .modal {
    width: 500px;
    padding: 35px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;

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