<template>
  <div>
    <el-container>
      <el-aside class="asset-aside" width="180px" :style="asideStyle">
        <data-type ref="dataType" @checkChange="checkChange" />
      </el-aside>
      <el-main class="asset-main">
        <data-manage ref="datamanage" :type-id="typeId" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DataType from './components/DataType'
import DataManage from './components/DataManage'
export default {
  name: 'TechnologyInfo',
  components: {
    DataType,
    DataManage
  },
  data() {
    return {
      activeName: '1',
      typeId: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device'
    ]),
    asideStyle() {
      const style = {}
      if (this.device === 'mobile') {
        style.left = '20px'
      } else {
        if (this.sidebar.opened) {
          style.left = '216px'
        } else {
          style.left = '60px'
        }
      }
      return style
    }
  },
  methods: {
    checkChange(data) {
      this.typeId = data.data
    }
  }
}
</script>

<style lang="scss" scoped>
$height: 80vh;
.asset-aside {
  position: fixed;
    top: 120px;
    left: 20px;
    height: $height;
}
.asset-main {
  margin-left: 180px;
}
</style>
