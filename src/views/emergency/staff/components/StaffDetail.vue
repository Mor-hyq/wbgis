<template>
  <div>
    <el-form
      ref="form"
      :rules="isRead ? {} :formRules"
      :model="form"
      label-suffix=":"
      label-width="auto"
      :size="$btnSize"
      class="custom-class"
      style="padding-top:5px;"
      :disabled="isRead"
    >
      <el-row :gutter="25">
        <el-col :span="12">
          <el-form-item
            prop="order"
            :label="mylang.number"
          >
            <el-input v-model="form.order" :readonly="isRead || isEdit" clearable />
          </el-form-item>
          <el-form-item
            prop="unit"
            :label="`${mylang.unitName}`"
          >
            <el-input v-model="form.unit" clearable />
          </el-form-item>
          <el-form-item
            prop="commander"
            :label="`${mylang.commander}`"
          >
            <el-input v-model="form.commander" clearable />
          </el-form-item>
          <el-form-item
            prop="position"
            :label="`${mylang.position}`"
          >
            <el-input v-model="form.position" clearable />
          </el-form-item>
          <el-form-item
            prop="phone"
            :label="`${mylang.phone}`"
          >
            <el-input v-model="form.phone" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="name"
            :label="mylang.realName"
          >
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item
            prop="emerge_place"
            :label="`${mylang.emergePlace}`"
          >
            <el-input v-model="form.emerge_place" clearable />
          </el-form-item>
          <el-form-item
            prop="response"
            :label="`${mylang.response}`"
          >
            <el-input v-model="form.response" clearable />
          </el-form-item>
          <el-form-item
            prop="office_phone"
            :label="`${mylang.officePhone}`"
          >
            <el-input v-model="form.office_phone" clearable />
          </el-form-item>
          <el-form-item
            prop="home_phone"
            :label="mylang.homePhone"
          >
            <el-input v-model="form.home_phone" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="!isRead" style="margin-top:20px;">
      <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
      <el-button @click="goBack">{{ mylang.cancel }}</el-button>
    </div>
  </div>
</template>

<script>
import { validatePhone2Func } from '@/utils/validateFunc'
import { addStaff, editStaff, getStaffDetail } from '@/api/emergency'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'StaffDetail',
  mixins: [deleteCache],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        order: '',
        name: '',
        unit: '',
        emerge_place: '',
        commander: '',
        response: '',
        position: '',
        office_phone: '',
        phone: '',
        home_phone: ''
      },
      formRules: {
        order: [
          { required: true, message: `请输入${this.mylang.number}` }
        ],
        name: [
          { required: true, message: `请输入${this.mylang.realName}` }
        ],
        unit: [
          { required: true, message: `请输入${this.mylang.unitName}` }
        ],
        emerge_place: [
          { required: true, message: `请输入${this.mylang.emergePlace}` }
        ],
        commander: [
          { required: true, message: `请输入${this.mylang.commander}` }
        ],
        response: [
          { required: true, message: `请输入${this.mylang.response}` }
        ],
        position: [
          { required: true, message: `请输入${this.mylang.position}` }
        ],
        phone: [
          { required: false, trigger: 'blur', validator: validatePhone2Func, tips: '联系号码' }
        ],
        home_phone: [
          { required: false, trigger: 'blur', validator: validatePhone2Func, tips: this.mylang.homePhone }
        ]
      },
      id: this.$route.query.id || ''
    }
  },
  created() {
    if (this.isEdit || this.isRead) {
      this.getDetail()
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              // 编辑提交
              this.handleEdit()
            } else {
              // 创建提交
              this.handleCreate()
            }
          })
        }
      })
    },
    async getDetail() {
      try {
        const { code, data } = await getStaffDetail({ id: this.id })
        if (code === 200) {
          this.form = { ...this.form, ...data }
        }
      } catch (error) {
        //
      }
    },
    async handleCreate() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addStaff(this.form)
        loading.close()
        if (code === 200) {
          // this.$_deleteView({ name: 'Staff' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            // this.$router.push({
            //   name: 'Staff'
            // })
            this.goBack()
          }, 500)
          this.$store.commit('app/TOGGLE_UPDATE', true)
        }
      } catch (error) {
        loading.close()
      }
    },
    async handleEdit() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editStaff({ id: this.id, ...this.form })
        loading.close()
        if (code === 200) {
          // this.$_deleteView({ name: 'Staff' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            // this.$router.push({
            //   name: 'Staff'
            // })
            this.goBack()
          }, 500)
          this.$store.commit('app/TOGGLE_UPDATE', true)
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
