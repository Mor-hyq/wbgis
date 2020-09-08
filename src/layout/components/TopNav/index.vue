<template>
  <div>
    <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
      <el-menu
        :default-active="activeIndex"
        background-color="transparent"
        :text-color="variables.menuText"
        mode="horizontal"
      >
        <topbar-item
          v-for="route in topbar_menu"
          :key="route.path+route.name"
          :item="route"
          :nums="colNums"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import { mapGetters } from 'vuex'
import TopbarItem from './TopbarItem'
import config from '@/config'

export default {
  components: {
    TopbarItem
  },
  data() {
    return {
      columnNums: 11 // 更多模块中一列显示导航个数
    }
  },
  computed: {
    ...mapGetters([
      'fetchPermissionList',
      'userInfo'
    ]),
    variables() {
      return variables
    },
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap
    },
    topbar_menu() {
      // 本地展示顶部路由与线上不同
      if (config.mode === 'local') {
        const OVERINDEX = 6
        const newArr = []
        // 通过fetchPermissionList获取到角色的路由 生成顶部路由表
        this.fetchPermissionList.forEach((item, index) => {
          const obj = {
            name: (item.meta && item.meta.title) || item.path,
            path: item.path
          }
          if (index < OVERINDEX) {
            newArr.push(obj)
          } else {
            if (index === OVERINDEX) {
              const o = {
                name: '更多功能模块',
                path: '1',
                children: []
              }
              newArr.push(o)
            }
            newArr[OVERINDEX].children.push(obj)
          }
        })
        return newArr
      } else {
      // 顶部导航 非更多模块
        const topArr = []
        // 顶部导航 更多模块
        const topMoreArr = []
        // 通过fetchPermissionList获取到角色的路由 生成顶部路由表
        this.fetchPermissionList.forEach((item, index) => {
          const obj = {
            name: (item.meta && item.meta.title) || item.name,
            path: item.path
          }
          if (item.is_shortcut === 0) {
            topArr.push(obj)
          }
        })
        let newArr = []
        if (topMoreArr.length > 0) {
          newArr = [...topArr, {
            name: '更多功能模块',
            path: '1',
            children: [...topMoreArr]
          }]
        } else {
          newArr = [...topArr]
        }
        return newArr
      }
    },
    activeIndex() {
      const route = this.$route
      const { path } = route.matched[0]
      return path
    },
    colNums() {
      // 本地开发模式
      if (config.mode === 'local') {
        return 6
      }

      const length = this.topbar_menu[this.topbar_menu.length - 1].children ? this.topbar_menu[this.topbar_menu.length - 1].children.length : 0
      const num = Math.ceil(length / this.columnNums)
      return num
    }
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40
      const $scrollWrapper = this.scrollWrapper
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
#app .el-menu--horizontal /deep/ .el-submenu .el-submenu__title {
    padding: 0 20px!important;
  }
.el-menu--horizontal /deep/ {
  display: flex;
  justify-content: flex-end;
  .el-menu-item,
  .el-submenu {
    &.is-active,
    &:hover {
      color: $menuActiveText!important;
      // border-bottom: $subMenuHover 3px solid!important;
      background-color: $menuHover!important;
    }
  }
  .el-submenu.is-active .el-submenu__title {
    color: inherit;
    border: inherit;
    // background-color: inherit!important;
  }
}
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    /deep/ {
      .el-scrollbar__bar {
        bottom: 0px;
      }
      .el-scrollbar__wrap {
        // width: calc(100% + 18px);
        height: 100%;
      }
    }
}
@media screen and (max-width: 1150px) {
  .el-menu--horizontal /deep/ {
    justify-content: flex-start;
  }
}
</style>
