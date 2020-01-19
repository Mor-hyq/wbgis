<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane lazy :label="mylang.emergencyPlan+'管理'" name="1">
        <plan-index ref="tab1" />
      </el-tab-pane>
      <el-tab-pane lazy :label="mylang.measurePlan+'管理'" name="2">
        <measure-index ref="tab2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PlanIndex from './components/PlanIndex'
import MeasureIndex from '../components/MeasureIndex'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'Plans',
  components: {
    PlanIndex,
    MeasureIndex
  },
  mixins: [deleteCache],
  data() {
    return {
      activeName: '1',
      activeTab: ['1']
    }
  },
  created() {
    this.$_deleteOtherView()
  },
  methods: {
    handleClick() {
      if (!this.activeTab.includes(this.activeName)) {
        this.activeTab.push(this.activeName)
        if (this.activeName === '2') {
          this.$nextTick(() => {
            this.$refs['tab' + this.activeName].initTableData()
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
