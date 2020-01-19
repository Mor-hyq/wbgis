<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="dialog-custom"
    width="90%"
    @close="handleClose"
  >
    <equipment-list ref="equiplist" :pipe-id="pipeId" :equipment-id="equipId" is-components :selected-info="selectedInfo" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">{{ mylang.cancel }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import EquipmentList from './EquipmentList'
export default {
  name: 'LinkEquipment',
  components: {
    EquipmentList
  },
  data() {
    return {
      visible: false,
      equipId: '',
      pipeId: '',
      selectedInfo: [],
      dialogTitle: this.mylang.choose + this.mylang.equipment
    }
  },
  methods: {
    hide() {
      this.visible = false
    },
    show(options) {
      this.visible = true
      this.equipId = options.equipId
      this.pipeId = options.pipeId
      this.$nextTick(() => {
        this.selectedInfo = [...options.selectInfo]
        this.$refs.equiplist.initTableData()
      })
    },
    handleConfirm() {
      const arr = [...this.$refs.equiplist.confirmSelect()]
      this.$emit('confirm', { data: arr })
      this.hide()
    },
    handleClose() {
      this.$refs.equiplist.clearSelected()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
