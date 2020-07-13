<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="isRead ? {} :formRules"
      label-suffix=":"
      :size="$btnSize"
      class="custom-class"
      :disabled="isRead"
      label-width="120px"
    >
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentType"
          >{{ eqType || form.equipment_name }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentName"
          >{{ eqName || form.asset_name }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentNumber"
          >{{ eqNum || form.code }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            prop="check_mid"
            label="检查人员"
          >
            <el-select
              v-model="form.check_mid"
              clearable
              filterable
            >
              <el-option
                v-for="item in memberOptions"
                :key="item.id"
                :value="item.id"
                :label="item.nickname"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="check_time"
            label="维护时间"
          >
            <el-date-picker
              v-model="form.check_time"
              prefix-icon="none"
              clearable
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="维护时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            prop="open_time"
            label="开启时间(s)"
          >
            <el-input
              v-if="!isRead"
              v-model="form.open_time"
              clearable
            />
            <span v-else class="read">{{ form.open_time }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="close_time"
            label="关闭时间(s)"
          >
            <el-input
              v-if="!isRead"
              v-model="form.close_time"
              clearable
            />
            <span v-else class="read">{{ form.close_time }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            prop="flow"
            label="流量(L)"
          >
            <el-input
              v-if="!isRead"
              v-model="form.flow"
              clearable
            />
            <span v-else class="read">{{ form.flow }}</span>

          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="flow_rate"
            label="流速(L/min)"
          >
            <el-input
              v-if="!isRead"
              v-model="form.flow_rate"
              clearable
            />
            <span v-else class="read">{{ form.flow_rate }}</span>

          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="usage"
        label="使用情况"
      >
        <el-input
          v-if="!isRead"
          v-model="form.usage"
          clearable
        />
        <span v-else class="read">{{ form.usage }}</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  saveMaintainRegister,
  getMaintainRegisterDetail
} from '@/api/inspection'
export default {
  props: {
    isRead: {
      type: Boolean,
      default: false
    },
    eqType: {
      type: String,
      default: ''
    },
    eqNum: {
      type: String,
      default: ''
    },
    eqName: {
      type: String,
      default: ''
    },
    eqId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      form: {
        check_mid: '',
        check_time: '',
        open_time: '',
        close_time: '',
        flow: '',
        flow_rate: '',
        usage: ''
      },
      formRules: {
        check_mid: [
          { required: true, message: '请选择检查人员' }
        ],
        check_time: [
          { required: true, message: '请选择维护时间' }
        ],
        open_time: [
          { required: true, message: '请填写开启时间' }
        ],
        close_time: [
          { required: true, message: '请填写关闭时间' }
        ],
        flow: [
          { required: true, message: '请填写流量' }
        ],
        flow_rate: [
          { required: true, message: '请填写流速' }
        ],
        usage: [
          { required: true, message: '请填写使用情况' }
        ]
      },
      memberOptions: []
    }
  },
  created() {
    this.getCheckMember()
  },
  mounted() {
    if (this.isRead) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      try {
        const { code, data } = await getMaintainRegisterDetail({ id: this.eqId })
        if (code === 200) {
          const form = {
            check_mid: data.check_member,
            check_time: data.check_time,
            open_time: data.open_time,
            close_time: data.close_time,
            flow: data.flow,
            flow_rate: data.flow_rate,
            usage: data.usage,
            equipment_name: data.equipment_name,
            code: data.code,
            asset_name: data.asset_name
          }
          this.form = form
        }
      } catch (error) {
        console.log(error)
      }
    },
    async uploadData() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const datas = {
        egi_period_id: this.eqId,
        ...this.form
      }
      try {
        const { code } = await saveMaintainRegister(datas)
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.resetForm()
          this.$emit('success')
        }
      } catch (error) {
        console.log(error)
        loading.close()
      }
    },
    validate(cb) {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 验证通过
          this.$confirm('确定保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.uploadData()
          })
        }
      })
    },
    resetForm() {
      const form = {
        check_mid: '',
        check_time: '',
        open_time: '',
        close_time: '',
        flow: '',
        flow_rate: '',
        usage: ''
      }
      this.form = form
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate()
      // })
    },
    getCheckMember() {
      if (this.$store.state.form.checkMember.length < 1) {
        this.$store.dispatch('form/setCheckMember').then(() => {
          this.memberOptions = this.$store.state.form.checkMember
        })
      } else {
        this.memberOptions = this.$store.state.form.checkMember
      }
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
