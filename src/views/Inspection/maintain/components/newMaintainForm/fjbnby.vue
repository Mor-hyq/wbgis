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
      <el-row :gutter="25">
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentType"
          >{{ eqType }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentNumber"
          >{{ eqNum }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentName"
          >{{ eqName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="25">
        <el-col :span="8">
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
        <el-col :span="8">
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
        prop="valve_level"
        label="阀井水位"
      >
        <el-radio-group v-model="form.valve_level">
          <el-radio :label="1">正常</el-radio>
          <div style="display:inline-block;">
            <el-radio :label="2">异常</el-radio>
            <el-form-item
              v-if="form.valve_level === 2"
              prop="valve_level_text"
              style="display:inline-block;"
            >
              <el-input v-model="form.valve_level_text" clearable style="width:250px;" />
            </el-form-item>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="corrosion"
        label="腐蚀情况"
      >
        <el-radio-group v-model="form.corrosion">
          <el-radio :label="1">正常</el-radio>
          <div style="display:inline-block;">
            <el-radio :label="2">异常</el-radio>
            <el-form-item
              v-if="form.corrosion === 2"
              prop="corrosion_text"
              style="display:inline-block;"
            >
              <el-input v-model="form.corrosion_text" style="width:250px;" />
            </el-form-item>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="seal"
        label="密封情况"
      >
        <el-radio-group v-model="form.seal">
          <el-radio :label="1">正常</el-radio>
          <div style="display:inline-block;">
            <el-radio :label="2">异常</el-radio>
            <el-form-item
              v-if="form.seal === 2"
              prop="seal_text"
              style="display:inline-block;"
            >
              <el-input v-model="form.seal_text" style="width:250px;" />
            </el-form-item>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="smooth"
        label="润滑情况"
      >
        <el-radio-group v-model="form.smooth">
          <el-radio :label="1">正常</el-radio>
          <div style="display:inline-block;">
            <el-radio :label="2">异常</el-radio>
            <el-form-item
              v-if="form.smooth === 2"
              prop="smooth_text"
              style="display:inline-block;"
            >
              <el-input v-model="form.smooth_text" style="width:250px;" />
            </el-form-item>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="bolt"
        label="螺栓紧固情况"
      >
        <el-radio-group v-model="form.bolt">
          <el-radio :label="1">正常</el-radio>
          <div style="display:inline-block;">
            <el-radio :label="2">异常</el-radio>
            <el-form-item
              v-if="form.bolt === 2"
              prop="bolt_text"
              style="display:inline-block;"
            >
              <el-input v-model="form.bolt_text" style="width:250px;" />
            </el-form-item>
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
      { pattern: new RegExp(/^.*[^\d].*$/), trigger: 'blur', message: '填写信息有误' }
    ]
    return {
      form: {
        check_mid: '',
        check_time: '',
        valve_level: 1,
        valve_level_text: '',
        corrosion: 1,
        corrosion_text: '',
        seal: 1,
        seal_text: '',
        smooth: 1,
        smooth_text: '',
        bolt: 1,
        bolt_text: '',
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
        valve_level: [
          { required: true, message: '请选择阀井水位状态' }
        ],
        valve_level_text: abnormalRule,
        corrosion: [
          { required: true, message: '请选择腐蚀状态' }
        ],
        corrosion_text: abnormalRule,
        seal: [
          { required: true, message: '请选择密封状态' }
        ],
        seal_text: abnormalRule,
        smooth: [
          { required: true, message: '请选择润滑状态' }
        ],
        smooth_text: abnormalRule,
        bolt: [
          { required: true, message: '请选择螺栓紧固状态' }
        ],
        bolt_text: abnormalRule
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
            valve_level: +data.valve_level === 1 ? 1 : 2,
            valve_level_text: +data.valve_level !== 1 ? data.valve_level : '',
            corrosion: +data.corrosion === 1 ? 1 : 2,
            corrosion_text: +data.corrosion !== 1 ? data.corrosion : '',
            seal: +data.seal === 1 ? 1 : 2,
            seal_text: +data.seal !== 1 ? data.seal : '',
            smooth: +data.smooth === 1 ? 1 : 2,
            smooth_text: +data.smooth !== 1 ? data.smooth : '',
            bolt: +data.bolt === 1 ? 1 : 2,
            bolt_text: +data.bolt !== 1 ? data.bolt : ''
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
        valve_level: this.form.valve_level === 1 ? 1 : this.form.valve_level_text,
        corrosion: this.form.corrosion === 1 ? 1 : this.form.corrosion_text,
        seal: this.form.seal === 1 ? 1 : this.form.seal_text,
        smooth: this.form.smooth === 1 ? 1 : this.form.smooth_text,
        bolt: this.form.bolt === 1 ? 1 : this.form.bolt_text,
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
          this.uploadData()
        }
      })
    },
    resetForm() {
      const form = {
        check_mid: '',
        check_time: '',
        low_area: '',
        visual: 1,
        water_detector: 1,
        deal: '',
        deal_visual: 1,
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
