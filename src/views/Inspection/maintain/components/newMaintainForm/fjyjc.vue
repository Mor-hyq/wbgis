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
      label-width="100px"
    >
      <el-row :gutter="10">
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
            label="检查时间"
          >
            <el-date-picker
              v-model="form.check_time"
              prefix-icon="none"
              clearable
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="检查时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="valve"
        label="阀室/阀门"
      >
        <el-radio-group v-model="form.valve">
          <el-radio :label="1">正常</el-radio>
          <div class="inline-radio">
            <el-radio :label="2">异常</el-radio>
            <template v-if="!isRead">
              <el-form-item
                v-if="form.valve === 2"
                prop="valve_text"
              >
                <el-input v-model="form.valve_text" clearable style="width:250px;" />
              </el-form-item>
            </template>
            <template v-else>
              <span v-if="form.valve === 2" class="read">
                {{ form.valve_text }}
              </span>
            </template>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="leakage"
        label="渗漏"
      >
        <el-radio-group v-model="form.leakage">
          <el-radio :label="1">正常</el-radio>
          <div class="inline-radio">
            <el-radio :label="2">异常</el-radio>
            <template v-if="!isRead">
              <el-form-item
                v-if="form.leakage === 2"
                prop="leakage_text"
              >
                <el-input v-model="form.leakage_text" style="width:250px;" />
              </el-form-item>
            </template>
            <template v-else>
              <span v-if="form.leakage === 2" class="read">
                {{ form.leakage_text }}
              </span>
            </template>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="stag_water"
        label="积水/油"
      >
        <el-radio-group v-model="form.stag_water">
          <el-radio :label="1">正常</el-radio>
          <div class="inline-radio">
            <el-radio :label="2">异常</el-radio>
            <template v-if="!isRead">
              <el-form-item
                v-if="form.stag_water === 2"
                prop="stag_water_text"
              >
                <el-input v-model="form.stag_water_text" style="width:250px;" />
              </el-form-item>
            </template>
            <template v-else>
              <span v-if="form.stag_water === 2" class="read">
                {{ form.stag_water_text }}
              </span>
            </template>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="clean"
        label="洁净"
      >
        <el-radio-group v-model="form.clean">
          <el-radio :label="1">正常</el-radio>
          <div class="inline-radio">
            <el-radio :label="2">异常</el-radio>
            <template v-if="!isRead">
              <el-form-item
                v-if="form.clean === 2"
                prop="clean_text"
              >
                <el-input v-model="form.clean_text" style="width:250px;" />
              </el-form-item>
            </template>
            <template v-else>
              <span v-if="form.clean === 2" class="read">
                {{ form.clean_text }}
              </span>
            </template>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="cover"
        label="井盖"
      >
        <el-radio-group v-model="form.cover">
          <el-radio :label="1">正常</el-radio>
          <div class="inline-radio">
            <el-radio :label="2">异常</el-radio>
            <template v-if="!isRead">
              <el-form-item
                v-if="form.cover === 2"
                prop="cover_text"
              >
                <el-input v-model="form.cover_text" style="width:250px;" />
              </el-form-item>
            </template>
            <template v-else>
              <span v-if="form.cover === 2" class="read">
                {{ form.cover_text }}
              </span>
            </template>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="abnormal_deal"
        label="异常处理"
      >
        <el-input
          v-model="form.abnormal_deal"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
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
    const abnormalRule = [
      { required: true, message: '请填写异常原因' },
      { pattern: new RegExp(/^.*[^\d].*$/), trigger: 'blur', message: '不能填写纯数字' }
    ]
    return {
      form: {
        check_mid: '',
        check_time: '',
        valve: 1,
        valve_text: '',
        leakage: 1,
        leakage_text: '',
        stag_water: 1,
        stag_water_text: '',
        clean: 1,
        clean_text: '',
        cover: 1,
        cover_text: '',
        abnormal_deal: '',
        remark: ''
      },
      formRules: {
        check_mid: [
          { required: true, message: '请选择检查人员' }
        ],
        check_time: [
          { required: true, message: '请选择维护时间' }
        ],
        valve: [
          { required: true, message: '请选择阀室/阀门状态' }
        ],
        valve_text: abnormalRule,
        leakage: [
          { required: true, message: '请选择渗漏状态' }
        ],
        leakage_text: abnormalRule,
        stag_water: [
          { required: true, message: '请选择积水/油状态' }
        ],
        stag_water_text: abnormalRule,
        clean: [
          { required: true, message: '请选择洁净状态' }
        ],
        clean_text: abnormalRule,
        cover: [
          { required: true, message: '请选择井盖状态' }
        ],
        cover_text: abnormalRule
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
            abnormal_deal: data.abnormal_deal,
            valve: +data.valve === 1 ? 1 : 2,
            valve_text: +data.valve !== 1 ? data.valve : '',
            leakage: +data.leakage === 1 ? 1 : 2,
            leakage_text: +data.leakage !== 1 ? data.leakage : '',
            stag_water: +data.stag_water === 1 ? 1 : 2,
            stag_water_text: +data.stag_water !== 1 ? data.stag_water : '',
            clean: +data.clean === 1 ? 1 : 2,
            clean_text: +data.clean !== 1 ? data.clean : '',
            cover: +data.cover === 1 ? 1 : 2,
            cover_text: +data.cover !== 1 ? data.cover : '',
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
        check_mid: this.form.check_mid,
        check_time: this.form.check_time,
        valve: this.form.valve === 1 ? 1 : this.form.valve_text,
        leakage: this.form.leakage === 1 ? 1 : this.form.leakage_text,
        stag_water: this.form.stag_water === 1 ? 1 : this.form.stag_water_text,
        clean: this.form.clean === 1 ? 1 : this.form.clean_text,
        cover: this.form.cover === 1 ? 1 : this.form.cover_text,
        abnormal_deal: this.form.abnormal_deal,
        remark: this.form.remark
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
        valve: 1,
        valve_text: '',
        leakage: 1,
        leakage_text: '',
        stag_water: 1,
        stag_water_text: '',
        clean: 1,
        clean_text: '',
        cover: 1,
        cover_text: '',
        abnormal_deal: '',
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
