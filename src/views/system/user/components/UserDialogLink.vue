<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="dialog-custom"
    width="80%"
  >
    <role-index ref="role" is-components :selected-info="selectedInfo" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">{{ mylang.cancel }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUserDetail, giveUser } from '@/api/system'
import RoleIndex from '../../components/RoleIndex'
export default {
  name: 'UserDialogLink',
  components: {
    RoleIndex
  },
  data() {
    return {
      visible: false,
      editId: '',
      selectedInfo: [],
      dialogTitle: this.mylang.linkRole
    }
  },
  methods: {
    async getUserDetail() {
      try {
        const { code, data } = await getUserDetail({
          id: this.editId
        })
        if (code === 200) {
          this.selectedInfo = data.role || []
        }
      } catch (error) {
        //
      }
    },
    async giveUser(roleId) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await giveUser({
          id: this.editId,
          role_id: roleId
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
    show(option) {
      this.visible = true
      this.editId = option.editId || ''
      this.getUserDetail()
      this.$nextTick(() => {
        this.$refs.role.initTableData()
      })
    },
    hide() {
      this.visible = false
    },
    handleConfirm() {
      this.$confirm('确定保存吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const arr = [...this.$refs.role.confirmSelect()]
        const ids = arr.map(v => v.role_id).join()
        this.giveUser(ids)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
