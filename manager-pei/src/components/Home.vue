<script>
import { Setting, User, Document, Menu, Location,Fold } from '@element-plus/icons-vue'
export default {
  name: 'Home',
  components: {
    Setting,
    User,
    Document,
    Menu,
    Location,
    Fold
  }
}
</script>

<template>
  <div class="basic-layout">
    <div class="nav-side">
      <div class="logo">
        <img src="../assets/images/logo.png" alt="logo">
        <span>Manager</span>
      </div>
      <!-- 菜单部分 -->
      <el-menu default-active="2" class="nav-menu" background-color="#001529" text-color="#fff" :collapse="false" router>
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
    <div class="content-right">
      <div class="nav-top">
        <div class="nav-left">
          <Fold class="menu-fold" />
          <div class="bread">面包屑</div>
        </div>
        <div class="user-info">admin</div>
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
    overflow-y: auto;
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
        .menu-fold {
          width: 25px;
          height: 25px;
          cursor: pointer;
          margin-right: 15px;
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
  }
}
</style>