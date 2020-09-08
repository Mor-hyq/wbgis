<template>
  <div>
    <el-tabs v-model="active">
      <el-tab-pane label="统计分析" name="1">
        <charts />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Charts from './components/Charts'
export default {
  name: 'EquipmentStatus',
  components: {
    Charts
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
