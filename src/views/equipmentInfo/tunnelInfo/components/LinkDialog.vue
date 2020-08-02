<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="dialog-custom"
    width="90%"
    @close="beforeClose"
  >
    <asset-list ref="assetlist" :equipment-id="equipId" is-components :selected-info="selectedInfo" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">{{ mylang.cancel }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { linkAsset } from '@/api/equipmentInfo'
import AssetList from './AssetList'
export default {
  name: 'LinkDialog',
  components: {
    AssetList
  },
  props: {
    pid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      equipId: '',
      selectedInfo: [],
      dialogTitle: ''
    }
  },
  methods: {
    hide() {
      this.visible = false
      this.$refs.assetlist.clearSelected()
    },
    show(options) {
      this.visible = true
      this.dialogTitle = options.title
      this.equipId = options.equipId
      this.$nextTick(() => {
        this.selectedInfo = options.selectedInfo
        this.$refs.assetlist.initTableData()
      })
    },
    async linkAsset(ids) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await linkAsset({
          asset_id: ids,
          pipe_id: this.pid
        })
        loading.close()
        if (code === 200) {
          this.$emit('confirm')
          this.hide()
        }
      } catch (error) {
        loading.close()
      }
    },
    handleConfirm() {
      const arr = [...this.$refs.assetlist.confirmSelect()]
      if (arr.length < 1) {
        this.$message({
          type: 'warning',
          message: '请选择要关联的设备'
        })
        return false
      }
      this.$confirm('确定要关联选中设备吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = arr.map(v => v.asset_id).join()
        this.linkAsset(ids)
      })
    },
    beforeClose() {
      if (this.$refs.assetlist) {
        this.$refs.assetlist.clearSearch()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
