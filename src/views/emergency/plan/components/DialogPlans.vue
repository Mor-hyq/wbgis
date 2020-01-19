<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      custom-class="custom-dialog"
      @close="handleClose"
    >
      <staff-index v-if="componentName === 'staff'" ref="staff" is-dialog :selected-info="selectedInfo" />
      <cars-index v-if="componentName === 'car'" ref="car" is-dialog :selected-info="selectedInfo" />
      <cooperation-index v-if="componentName === 'cooperation'" ref="cooperation" is-dialog :selected-info="selectedInfo" />
      <fire-team-index v-if="componentName === 'fireTeam'" ref="fireTeam" is-dialog :selected-info="selectedInfo" />
      <supply-index v-if="componentName === 'supply'" ref="supply" is-dialog :selected-info="selectedInfo" />
      <measure-index v-if="componentName === 'measure'" ref="measure" is-dialog :selected-info="selectedInfo" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide">{{ mylang.cancel }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import StaffIndex from '../../components/StaffIndex'
import CarsIndex from '../../components/CarsIndex'
import CooperationIndex from '../../components/CooperationIndex'
import FireTeamIndex from '../../components/FireTeamIndex'
import MeasureIndex from '../../components/MeasureIndex'
import SupplyIndex from '../../components/SupplyIndex'
export default {
  name: 'DialogPlans',
  components: {
    StaffIndex,
    CarsIndex,
    CooperationIndex,
    FireTeamIndex,
    MeasureIndex,
    SupplyIndex
  },
  data() {
    return {
      dialogVisible: false,
      componentName: '',
      dialogTitle: '',
      selectedInfo: []
    }
  },
  methods: {
    show(option) {
      this.dialogVisible = true
      this.componentName = option.component === 'sendto' ? 'staff' : option.component
      this.dialogTitle = option.title
      this.$nextTick(() => {
        // 设置选中信息
        this.selectedInfo = [...option.selectedInfo]
        // 初始化弹窗表格数据
        this.$refs[this.componentName].initTableData()
      })
    },
    hide() {
      this.dialogVisible = false
    },
    handleConfirm() {
      const arr = [...this.$refs[this.componentName].confirmSelect()]
      this.$emit('confirm', { data: arr })
      this.hide()
    },
    handleClose() {
      this.$refs[this.componentName].clearSelected()
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 15px;
 /deep/ .custom-dialog {
     .el-dialog__header {
         padding: $padding $padding 5px;
         .el-dialog__headerbtn {
             top: $padding;
             right: $padding;
         }
     }
    .el-dialog__body {
        padding: 0 $padding $padding;
        max-height: 60vh;
        overflow: auto;
    }
}
</style>
