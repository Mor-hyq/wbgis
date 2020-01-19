<template>
  <div :class="classObj" class="app-wrapper">
    <header-item />
    <div v-if="device==='mobile'&&sidebar.opened && isShowSide" class="drawer-bg" @click="handleClickOutside" />
    <sidebar v-if="isShowSide" class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView, marleft: !isShowSide}" class="main-container">
      <div v-if="isShowSide" :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main :class="{'gis': !isShowSide}" />
    </div>
    <el-backtop :visibility-height="500" title="回到顶部" />
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar } from './components'
import HeaderItem from '@/components/Header'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import { getWarinig } from '@/api/common'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    HeaderItem
  },
  mixins: [ResizeMixin],
  data() {
    return {
      isShowSide: true
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    $route(val) {
      this.addTags()
      if (val.name === 'GisIndex') {
        this.isShowSide = false
      } else {
        this.isShowSide = true
      }
    }
  },
  created() {
    this.getWarinigNumber()
  },
  mounted() {
    this.addTags()
    if (this.$route.name === 'GisIndex') {
      this.isShowSide = false
    }
  },
  methods: {
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    async getWarinigNumber() {
      try {
        const { code, data } = await getWarinig()
        if (code === 200) {
          this.$store.commit('app/SET_WARNING_NUM', data.length || 0)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    padding-top: $headerHeight;
    &.mobile.openSidebar {
      position: fixed;
      top: $headerHeight;
    }
  }
  .marleft {
    margin-left: 0!important;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 1200;
  }

  .fixed-header {
    position: fixed;
    top: $headerHeight;
    right: 0;
    z-index: 100;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .el-backtop {
    width: 46px;
    height: 46px;
    font-size: 40px;
    &:hover {
      background-color: #b3d8ff;
    }
  }
</style>
