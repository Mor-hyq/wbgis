import { deleteCacheView, deleteOtherCacheView } from '@/utils/deleteCacheView'
export default {
  methods: {
    $_deleteView({ name, route } = {}) {
      // 删除某个路由缓存
      deleteCacheView({ name, route })
    },
    $_deleteOtherView() {
      // 删除当前路由外的其他路由缓存
      deleteOtherCacheView(this.$route)
    }
  }
}
