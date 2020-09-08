<template>
  <div class="header">
    <div class="logo">
      <router-link to="/"><img class="img" :src="logo" alt=""></router-link>
    </div>
    <!-- 顶部导航 -->
    <top-nav v-if="isShowNav" class="top-nav" />
    <div v-else class="top-nav" />
    <!-- 用户信息 -->
    <navbar-info class="nav-info" />
  </div>
</template>

<script>
import { NavbarInfo, TopNav } from '@/layout/components'

export default {
  name: 'Header',
  components: {
    NavbarInfo,
    TopNav
  },
  props: {
    isShowNav: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      logo: require('@/assets/images/login/logo_text3.png')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: $headerHeight;
  background-image: url('../../assets/images/login/nav.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left bottom;
  display: flex;
  .logo {
    color: #f4f4f5;
    display: flex;
    align-items: center;
    padding-left: 20px;
    .img {
      display: block;
      height: 36px;
      object-fit: contain;
    }
    .icon {
      margin-left: 45px;
      font-size: 30px;
      color: #777;
      line-height: $headerHeight;
      &:hover {
        color: #428bca;
      }
    }
  }
  .top-nav {
    flex: 1;
    overflow: hidden;
    padding-right: 1px;
  }
  .nav-info {
    float: right;
  }
}
</style>
