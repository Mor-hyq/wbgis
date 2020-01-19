<template>
  <div>
    <el-tabs v-model="active">
      <el-tab-pane label="统计分析" name="1">
        <charts />
      </el-tab-pane>
      <!-- <el-tab-pane label="统计报表" name="2">
        <chart-detail />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import Charts from './components/Charts'
// import ChartDetail from './components/ChartDetail'
export default {
  name: 'EquipmentStatus',
  components: {
    Charts
    // ChartDetail
  },
  data() {
    return {
      active: '1'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
