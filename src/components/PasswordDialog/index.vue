<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    append-to-body
    custom-class="dialog-custom"
  >
    <el-form
      ref="dialogForms"
      :rules="formRules"
      :model="form"
      label-suffix=":"
      label-width="auto"
      :size="$btnSize"
      class="custom-class"
    >
      <el-form-item :label="`当前${mylang.account}`">
        <el-input v-model="name" disabled />
      </el-form-item>
      <el-form-item :label="mylang.oldPassword" prop="old_password">
        <el-input
          v-model="form.old_password"
          type="password"
          clearable
          autocomplete="new-password"
          auto-complete="new-password"
          :maxlength="150"
        />
      </el-form-item>
      <el-form-item :label="mylang.newPassword" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          clearable
          autocomplete="new-password"
          auto-complete="new-password"
          :maxlength="150"
        />
      </el-form-item>
      <el-form-item :label="mylang.confirmNewPassword" prop="password_confirm">
        <el-input
          v-model="form.password_confirm"
          type="password"
          clearable
          autocomplete="new-password"
          auto-complete="new-password"
          :maxlength="150"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updatePassword } from '@/api/system'
export default {
  name: 'PasswordDialog',
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (rule.required) {
        // 必填时的校验
        if (!this.form.password) {
          callback(new Error('请先输入密码'))
        } else if (value === '') {
          callback(new Error('请输入确认密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        // 非必填时校验
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
    return {
      visible: false,
      dialogTitle: '修改密码',
      form: {
        password: '',
        password_confirm: '',
        old_password: ''
      },
      formRules: {
        old_password: [
          { required: true, trigger: 'blur', message: `请填写旧${this.mylang.password}` }
        ],
        password: [
          { required: true, trigger: 'blur', message: `请填写新${this.mylang.password}` }
        ],
        password_confirm: [
          { required: true, trigger: 'blur', validator: validatePass2 }
        ]
      }
    }
  },
  methods: {
    show() {
      this.visible = true
    },
    hideDialog() {
      this.visible = false
    },
    handleConfirm() {
      this.$confirm('确定修改密码吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updatePassword()
      })
    },
    async updatePassword() {
      try {
        const { code } = await updatePassword({
          id: this.id,
          password: this.form.password,
          old_password: this.form.old_password
        })
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.hideDialog()
        }
      } catch (error) {
        //
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
