<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="dialog-custom"
    append-to-body
    :close-on-click-modal="false"
    @closed="hideClose"
  >
    <set-authority
      ref="authority"
      :is-edit="isEdit"
      :is-read="isRead"
      :expand-all="false"
      :module-ids="moduleIds"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">{{ mylang.cancel }}</el-button>
      <el-button v-if="!isRead" type="primary" @click="handleConfirm">{{ mylang.save }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { giveRole } from '@/api/system'
import SetAuthority from './SetAuthority'
export default {
  name: 'AuthorityDialog',
  components: {
    SetAuthority
  },
  props: {
    isRead: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    moduleIds: {
      type: String,
      default: ''
    },
    dialogTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      editId: ''
    }
  },
  methods: {
    show(option = {}) {
      this.visible = true
      this.editId = option.editId || ''
    },
    hide() {
      this.visible = false
    },
    hideClose() {
      this.$refs.authority.resetChecked()
      this.$emit('update:moduleIds', '')
    },
    handleConfirm() {
      this.$confirm('确定保存吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const moduleIds = this.$refs.authority.confirmRole()
        this.giveRole({ id: this.editId, rules: moduleIds })
      })
    },
    async giveRole({
      id = '',
      rules = ''
    } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await giveRole({
          id, rules
        })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.hide()
          this.editId = ''
          this.$emit('confirm')
        }
      } catch (error) {
        loading.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
