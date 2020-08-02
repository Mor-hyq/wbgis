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
        <el-col :span="16">
          <el-form-item
            :label="mylang.equipmentName"
          >{{ eqName || form.asset_name }}</el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentNumber"
          >{{ eqNum || form.code }}</el-form-item>
        </el-col> -->
      </el-row>
      <div class="custom-divider" />
      <el-row :gutter="5">
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
            prop="weather"
            label="天气"
          >
            <el-input
              v-if="!isRead"
              v-model="form.weather"
              clearable
            />
            <span v-else class="read">{{ form.weather }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left"><span class="t-blue">5A7</span></el-divider>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="A7_actual_value"
            label="实测值"
            label-width="100px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.A7_actual_value"
              clearable
            />
            <span v-else class="read">{{ form.A7_actual_value }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="A7_compare"
            label="数值对比"
            label-width="100px"
          >
            <el-radio-group v-model="form.A7_compare">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="A7_deal"
        label="处理情况"
        label-width="100px"
      >
        <el-input
          v-if="!isRead"
          v-model="form.A7_deal"
          clearable
        />
        <span v-else class="read">{{ form.A7_deal }}</span>
      </el-form-item>
      <el-form-item
        prop="A7_remak"
        label="备注"
        label-width="100px"
      >
        <el-input
          v-model="form.A7_remak"
          type="textarea"
          :rows="3"
          clearable
        />
      </el-form-item>
      <el-divider content-position="left"><span class="t-blue">5A8</span></el-divider>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="A8_actual_value"
            label="实测值"
            label-width="100px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.A8_actual_value"
              clearable
            />
            <span v-else class="read">{{ form.A8_actual_value }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="A8_compare"
            label="数值对比"
            label-width="100px"
          >
            <el-radio-group v-model="form.A8_compare">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="A8_deal"
        label="处理情况"
        label-width="100px"
      >
        <el-input
          v-if="!isRead"
          v-model="form.A8_deal"
          clearable
        />
        <span v-else class="read">{{ form.A8_deal }}</span>
      </el-form-item>
      <el-form-item
        prop="A8_remak"
        label="备注"
        label-width="100px"
      >
        <el-input
          v-model="form.A8_remak"
          type="textarea"
          :rows="3"
          clearable
        />
      </el-form-item>
      <el-divider content-position="left"><span class="t-blue">5B7</span></el-divider>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="B7_actual_value"
            label="实测值"
            label-width="100px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.B7_actual_value"
              clearable
            />
            <span v-else class="read">{{ form.B7_actual_value }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="B7_compare"
            label="数值对比"
            label-width="100px"
          >
            <el-radio-group v-model="form.B7_compare">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="B7_deal"
        label="处理情况"
        label-width="100px"
      >
        <el-input
          v-if="!isRead"
          v-model="form.B7_deal"
          clearable
        />
        <span v-else class="read">{{ form.B7_deal }}</span>
      </el-form-item>
      <el-form-item
        prop="B7_remak"
        label="备注"
        label-width="100px"
      >
        <el-input
          v-model="form.B7_remak"
          type="textarea"
          :rows="3"
          clearable
        />
      </el-form-item>
      <el-divider content-position="left"><span class="t-blue">5B8</span></el-divider>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="B8_actual_value"
            label="实测值"
            label-width="100px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.B8_actual_value"
              clearable
            />
            <span v-else class="read">{{ form.B8_actual_value }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="B8_compare"
            label="数值对比"
            label-width="100px"
          >
            <el-radio-group v-model="form.B8_compare">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="B8_deal"
        label="处理情况"
        label-width="100px"
      >
        <el-input
          v-if="!isRead"
          v-model="form.B8_deal"
          clearable
        />
        <span v-else class="read">{{ form.B8_deal }}</span>
      </el-form-item>
      <el-form-item
        prop="B8_remak"
        label="备注"
        label-width="100px"
      >
        <el-input
          v-model="form.B8_remak"
          type="textarea"
          :rows="3"
          clearable
        />
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
        weather: '',
        A7_actual_value: '',
        A7_compare: 1,
        A7_deal: '',
        A7_remak: '',
        A8_actual_value: '',
        A8_compare: 1,
        A8_deal: '',
        A8_remak: '',
        B7_actual_value: '',
        B7_compare: 1,
        B7_deal: '',
        B7_remak: '',
        B8_actual_value: '',
        B8_compare: 1,
        B8_deal: '',
        B8_remak: ''
      },
      formRules: {
        check_mid: [
          { required: true, message: '请选择检查人员' }
        ],
        check_time: [
          { required: true, message: '请选择维护时间' }
        ],
        weather: [
          { required: true, message: '请填写天气状况' }
        ],
        A7_actual_value: [
          { required: true, message: '请填写实测值' }
        ],
        A7_compare: [
          { required: true, message: '请选择数值对比' }
        ],
        A7_deal: [
          { required: true, message: '请填写处理情况' }
        ],
        A8_actual_value: [
          { required: true, message: '请填写实测值' }
        ],
        A8_compare: [
          { required: true, message: '请选择数值对比' }
        ],
        A8_deal: [
          { required: true, message: '请填写处理情况' }
        ],
        B7_actual_value: [
          { required: true, message: '请填写实测值' }
        ],
        B7_compare: [
          { required: true, message: '请选择数值对比' }
        ],
        B7_deal: [
          { required: true, message: '请填写处理情况' }
        ],
        B8_actual_value: [
          { required: true, message: '请填写实测值' }
        ],
        B8_compare: [
          { required: true, message: '请选择数值对比' }
        ],
        B8_deal: [
          { required: true, message: '请填写处理情况' }
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
            weather: data.weather,
            equipment_name: data.equipment_name,
            code: data.code,
            asset_name: data.asset_name
          }
          if (data.value) {
            const valObj = JSON.parse(data.value)
            for (const k in valObj) {
              form[k] = valObj[k]
            }
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
      const value = {}
      for (const k in this.form) {
        if (k.indexOf('A7') >= 0 || k.indexOf('A8') >= 0 ||
        k.indexOf('B7') >= 0 || k.indexOf('B8') >= 0) {
          value[k] = this.form[k]
        }
      }
      const datas = {
        egi_period_id: this.eqId,
        check_mid: this.form.check_mid,
        check_time: this.form.check_time,
        weather: this.form.weather,
        value: JSON.stringify(value)
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
        weather: '',
        A7_actual_value: '',
        A7_compare: 1,
        A7_deal: '',
        A7_remak: '',
        A8_actual_value: '',
        A8_compare: 1,
        A8_deal: '',
        A8_remak: '',
        B7_actual_value: '',
        B7_compare: 1,
        B7_deal: '',
        B7_remak: '',
        B8_actual_value: '',
        B8_compare: 1,
        B8_deal: '',
        B8_remak: ''
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
