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
            prop="rated_flow_rate"
            label="额定流速(L/M)"
          >
            <el-input
              v-if="!isRead"
              v-model="form.rated_flow_rate"
              clearable
            />
            <span v-else class="read">{{ form.rated_flow_rate }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="flow_rate"
            label="流速(L/M)"
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
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            prop="rate"
            label="流速率"
          >
            <el-input
              v-if="!isRead"
              v-model="form.rate"
              clearable
            />
            <span v-else class="read">{{ form.rate }}</span>

          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="pressure"
            label="压差读数(Mpa)"
          >
            <el-input
              v-if="!isRead"
              v-model="form.pressure"
              clearable
            />
            <span v-else class="read">{{ form.pressure }}</span>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            prop="all_pressure"
            label="全流量压差"
          >
            <el-input
              v-if="!isRead"
              v-model="form.all_pressure"
              clearable
            />
            <span v-else class="read">{{ form.all_pressure }}</span>

          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="up_oil"
            label="自上次读数后输油量(L)"
          >
            <el-input
              v-if="!isRead"
              v-model="form.up_oil"
              clearable
            />
            <span v-else class="read">{{ form.up_oil }}</span>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            prop="oil"
            label="输油总数计量(L)"
          >
            <el-input
              v-if="!isRead"
              v-model="form.oil"
              clearable
            />
            <span v-else class="read">{{ form.oil }}</span>

          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="remark"
        label="备注"
      >
        <el-input
          v-model="form.remark"
          :rows="3"
          type="textarea"
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
        rated_flow_rate: '',
        flow_rate: '',
        rate: '',
        pressure: '',
        all_pressure: '',
        up_oil: '',
        oil: '',
        remark: ''
      },
      formRules: {
        check_mid: [
          { required: true, message: '请选择检查人员' }
        ],
        check_time: [
          { required: true, message: '请选择维护时间' }
        ],
        rated_flow_rate: [
          { required: true, message: '请填写额定流速' }
        ],
        flow_rate: [
          { required: true, message: '请填写流速' }
        ],
        rate: [
          { required: true, message: '请填写流速率' }
        ],
        pressure: [
          { required: true, message: '请填写压差读书' }
        ],
        all_pressure: [
          { required: true, message: '请填写全流量压差' }
        ],
        up_oil: [
          { required: true, message: '请填写自上次读数后输油量' }
        ],
        oil: [
          { required: true, message: '请填写输油总数计量' }
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
            remark: data.remark,
            rated_flow_rate: data.rated_flow_rate,
            flow_rate: data.flow_rate,
            rate: data.rate,
            pressure: data.pressure,
            all_pressure: data.all_pressure,
            up_oil: data.up_oil,
            oil: data.oil,
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
        rated_flow_rate: '',
        flow_rate: '',
        rate: '',
        pressure: '',
        all_pressure: '',
        up_oil: '',
        oil: '',
        remark: ''
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
