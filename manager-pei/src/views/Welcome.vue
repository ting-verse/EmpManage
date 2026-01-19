<script>
export default {
  name: 'Welcome'
}
</script>

<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">公司内部员工管理系统</div>
      <div class="desc">Vue3 + ElementPlus + Node.js + MongoDB</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<style lang="scss" scoped>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .content {
    position: relative;
    bottom: 40px;
    text-align: center;
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
    .desc {
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 110px;
    background-image: url('../assets/images/welcome.png');
    width:371px;
    height:425px;
  }
}
</style>