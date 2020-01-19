<template>
  <div class="top-menu-item">
    <template v-if="!item.children">
      <app-link :to="item.path">
        <template v-if="isExternal(item.path)">
          <el-menu-item :index="item.path+random">{{ item.name }}</el-menu-item>
        </template>
        <el-menu-item v-else :index="item.path">{{ item.name }}</el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else :index="item.path" :popper-class="popperClass">
      <template slot="title">{{ item.name }}</template>
      <topbar-item
        v-for="child in item.children"
        :key="child.path+child.name"
        :item="child"
        :nums="nums"
      />
    </el-submenu>
  </div>
</template>

<script>
import AppLink from '../Sidebar/Link'
import { isExternal } from '@/utils/validate'

export default {
  name: 'TopbarItem',
  components: {
    AppLink
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    nums: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      isExternal,
      random: 0
    }
  },
  computed: {
    popperClass() {
      const num = this.nums > 3 ? 3 : this.nums
      return `top-submenu-item top-submenu-width${num}`
    }
  },
  mounted() {
    this.random = Math.random()
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.top-menu-item {
    display: inline-block;
    max-width: 160px;
}

.top-submenu-item .top-menu-item {
    display: block;
    .el-menu-item {
      height: 45px;
      line-height: 45px;
    }
}
.top-submenu-item .el-menu-item {
    &.is-active,
    &:hover {
      color: $menuActiveText!important;
      border-bottom: $subMenuHover 3px solid!important;
      background-color: $menuHover!important;
    }
}
</style>
<style lang="scss">
  .el-menu--horizontal.top-submenu-item {
    &.top-submenu-width1 {
      .el-menu--popup {
        width: 160px;
      }
    }
    &.top-submenu-width2 {
      .el-menu--popup {
        width: 320px;
      }
    }
    &.top-submenu-width3 {
      .el-menu--popup {
        width: 480px;
      }
    }
    .el-menu--popup {
      display: flex;
      max-height: 460px;
      flex-wrap: wrap;
      overflow-y: auto;
      min-width: 160px;
      .top-menu-item {
        flex: 0 0 160px;
      }
    }
  }
</style>
