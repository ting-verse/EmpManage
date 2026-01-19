<script>
import { Setting, Document, Fold, Bell, ArrowDown } from '@element-plus/icons-vue'
export default {
  name: 'Home',
  components: {
    Setting,
    Document,
    Fold,
    Bell,
    ArrowDown
  },
  data() {
    return {
      userInfo: {
        userName: 'Ting',
        userEmail: 'admin@example.com'
      },
      isCollapse: false,
      userMenu:[],
      noticeCount: 0
    }
  },
  methods: {
    handleLogout(key) {
      if (key == "email") return
      this.$store.commit('clearUserInfo')
      this.userInfo = null
      this.$router.push('/login')
    },
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    async getNoticeCount() {
      const res = await this.$api.noticeCount()
      this.noticeCount = res
    },
    async getMenuList() {
      const res = await this.$api.menuList()
      this.userMenu = res
    }
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
  }
}
</script>

<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <div class="logo">
        <img src="../assets/images/logo.png" alt="logo">
        <span>Manager</span>
      </div>
      <!-- 菜单部分 -->
      <el-menu default-active="2" class="nav-menu" background-color="#001529" text-color="#fff" :collapse="isCollapse"
        router>
        <el-sub-menu index="1">
          <template #title>
            <Setting class="menu-setting" />
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">用户管理</el-menu-item>
          <el-menu-item index="1-2">菜单管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <Document class="menu-setting" />
            <span>审批管理</span>
          </template>
          <el-menu-item index="2-1">休假管理</el-menu-item>
          <el-menu-item index="2-2">自我审批</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <Fold class="menu-fold" @click="toggle" />
          <div class="bread">面包屑</div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="noticeCount > 0 ? true : false" class="user-badge">
            <el-icon>
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.basic-layout {
  position: relative;

  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    transition: width 0.5s;

    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;

      img {
        margin: 0 15px;
        width: 32px;
        height: 32px;
      }
    }

    .nav-menu {
      border: none;
      height: calc(100vh - 50px);

      .menu-setting {
        width: 20px;
        height: 20px;
        margin: 0 15px;
      }
    }

    &.fold {
      width: 64px;
    }

    &.unfold {
      width: 200px;
    }
  }

  .content-right {
    margin-left: 200px;

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      border-bottom: 1px solid #eef0f3;

      .nav-left {
        display: flex;
        align-items: center;
        z-index: 1000;

        .menu-fold {
          width: 25px;
          height: 25px;
          cursor: pointer;
          margin-right: 15px;
        }
      }

      .user-info {
        .user-badge {
          line-height: 30px;
          cursor: pointer;
        }

        .user-link {
          cursor: pointer;
          color: #409eff
        }
      }
    }

    .wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);

      .main-page {
        height: 100%;
        background-color: #fff;
      }
    }

    &.fold {
      margin-left: 64px;
    }

    &.unfold {
      margin-left: 200px;
    }
  }
}
</style>