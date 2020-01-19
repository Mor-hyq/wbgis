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
            prop="team_place"
            :label="`${mylang.teamPlace}`"
          >
            <el-input v-model="form.team_place" clearable />
          </el-form-item>
          <el-form-item
            prop="number"
            :label="`${mylang.staffNumber}`"
          >
            <el-input v-model="form.number" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="leader"
            :label="`${mylang.leader}`"
          >
            <el-input v-model="form.leader" clearable />
          </el-form-item>
          <el-form-item
            prop="duty_phone"
            :label="`${mylang.dutyPhone}`"
          >
            <el-input v-model="form.duty_phone" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="unit"
            :label="mylang.unitName"
          >
            <el-input v-model="form.unit" clearable />
          </el-form-item>
          <el-form-item
            prop="response"
            :label="`${mylang.response}`"
          >
            <el-input v-model="form.response" clearable />
          </el-form-item>
          <el-form-item
            prop="name"
            :label="`${mylang.teamName}`"
          >
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item
            prop="phone"
            :label="`${mylang.leaderPhone}`"
          >
            <el-input v-model="form.phone" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="remark"
        :label="`${mylang.description}`"
      >
        <el-input v-model="form.remark" :rows="isRead ? '' : 5" type="textarea" />
      </el-form-item>
    </el-form>
    <div v-if="!isRead" style="margin-top:20px;">
      <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
      <el-button @click="goBack">{{ mylang.cancel }}</el-button>
    </div>
  </div>
</template>

<script>
import { validatePhone2Func } from '@/utils/validateFunc'
import { addFireTeam, editFireTeam, getFireTeamDetail } from '@/api/emergency'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'FireTeamComponentDetail',
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
        team_place: '',
        response: '',
        number: '',
        leader: '',
        phone: '',
        duty_phone: '',
        remark: ''
      },
      formRules: {
        order: [
          { required: true, message: `请输入${this.mylang.number}` }
        ],
        name: [
          { required: true, message: `请输入${this.mylang.teamName}` }
        ],
        unit: [
          { required: true, message: `请输入${this.mylang.unitName}` }
        ],
        team_place: [
          { required: true, message: `请输入${this.mylang.teamPlace}` }
        ],
        response: [
          { required: true, message: `请输入${this.mylang.response}` }
        ],
        number: [
          { required: true, message: `请输入${this.mylang.staffNumber}` }
        ],
        phone: [
          { required: false, trigger: 'blur', validator: validatePhone2Func, tips: '联系电话' }
        ],
        duty_phone: [
          { required: false, trigger: 'blur', validator: validatePhone2Func, tips: '联系电话' }
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
        const { code, data } = await getFireTeamDetail({ id: this.id })
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
        const { code } = await addFireTeam(this.form)
        loading.close()
        if (code === 200) {
          // this.$_deleteView({ name: 'FireTeam' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            // this.$router.push({
            //   name: 'FireTeam'
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
        const { code } = await editFireTeam({ id: this.id, ...this.form })
        loading.close()
        if (code === 200) {
          // this.$_deleteView({ name: 'FireTeam' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            // this.$router.push({
            //   name: 'FireTeam'
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
