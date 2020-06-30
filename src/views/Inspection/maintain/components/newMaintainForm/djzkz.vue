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
          >{{ eqType }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentName"
          >{{ eqName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentNumber"
          >{{ eqNum }}</el-form-item>
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
      <el-form-item
        prop="high_area"
        label="地井区域"
      >
        <el-input
          v-if="!isRead"
          v-model="form.high_area"
          clearable
        />
        <span v-else class="read">{{ form.high_area }}</span>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            prop="leakage"
            label="渗漏"
          >
            <el-radio-group v-model="form.leakage">
              <el-radio
                :label="1"
              >合格</el-radio>
              <el-radio
                :label="2"
              >不合格</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="clean"
            label="清洁"
          >
            <el-radio-group v-model="form.clean">
              <el-radio
                :label="1"
              >合格</el-radio>
              <el-radio
                :label="2"
              >不合格</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            prop="pilot_valve"
            label="先导阀"
          >
            <el-radio-group v-model="form.pilot_valve">
              <el-radio
                :label="1"
              >合格</el-radio>
              <el-radio
                :label="2"
              >不合格</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="line"
            label="内衬"
          >
            <el-radio-group v-model="form.line">
              <el-radio
                :label="1"
              >合格</el-radio>
              <el-radio
                :label="2"
              >不合格</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-form-item
            prop="cover"
            label="井盖"
          >
            <el-radio-group v-model="form.cover">
              <el-radio
                :label="1"
              >合格</el-radio>
              <el-radio
                :label="2"
              >不合格</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="tether"
            label="系链"
          >
            <el-radio-group v-model="form.tether">
              <el-radio
                :label="1"
              >合格</el-radio>
              <el-radio
                :label="2"
              >不合格</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="deal"
        label="处理过程"
      >
        <el-input
          v-model="form.deal"
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
    return {
      form: {
        check_mid: '',
        check_time: '',
        high_area: '',
        leakage: 1,
        clean: 1,
        pilot_valve: 1,
        line: 1,
        cover: 1,
        tether: 1,
        deal: '',
        remark: ''
      },
      formRules: {
        check_mid: [
          { required: true, message: '请选择检查人员' }
        ],
        check_time: [
          { required: true, message: '请选择维护时间' }
        ],
        high_area: [
          { required: true, message: '请填写地井区域' }
        ],
        leakage: [
          { required: true, message: '请选择渗漏选项' }
        ],
        clean: [
          { required: true, message: '请选择清洁选项' }
        ],
        pilot_valve: [
          { required: true, message: '请选择先导阀选项' }
        ],
        line: [
          { required: true, message: '请选择内衬选项' }
        ],
        cover: [
          { required: true, message: '请选择井盖选项' }
        ],
        tether: [
          { required: true, message: '请选择系链选项' }
        ],
        deal: [
          { required: true, message: '请填写处理过程' }
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
            high_area: data.high_area,
            leakage: +data.leakage,
            clean: +data.clean,
            pilot_valve: +data.pilot_valve,
            line: +data.line,
            cover: +data.cover,
            tether: +data.tether,
            deal: data.deal,
            remark: data.remark
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
        high_area: '',
        leakage: 1,
        clean: 1,
        pilot_valve: 1,
        line: 1,
        cover: 1,
        tether: 1,
        deal: '',
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
