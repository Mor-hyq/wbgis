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
      <el-row :gutter="10">
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
      </el-row>
      <div class="custom-divider" />
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
        prop="ground_area"
        label="地井阀区域"
      >
        <span class="read">{{ form.ground_area }}</span>
      </el-form-item>
      <el-form-item
        prop="check"
        label="检查情况"
      >
        <el-radio-group v-model="form.check">
          <el-radio :label="1">正常</el-radio>
          <div class="inline-radio">
            <el-radio :label="2">异常</el-radio>
            <template v-if="!isRead">
              <el-form-item
                v-if="form.check === 2"
                prop="check_text"
              >
                <el-input v-model="form.check_text" clearable />
              </el-form-item>
            </template>
            <template v-else>
              <span v-if="form.check === 2" class="read">
                {{ form.check_text }}
              </span>
            </template>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="close_time"
        label="关闭时间(S)"
      >
        <el-input
          v-if="!isRead"
          v-model="form.close_time"
          clearable
        />
        <span v-else>{{ form.close_time }}</span>
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
        check: 1,
        ground_area: this.eqName || '',
        check_text: '',
        close_time: '',
        remark: ''
      },
      formRules: {
        check_mid: [
          { required: true, message: '请选择检查人员' }
        ],
        check_time: [
          { required: true, message: '请选择维护时间' }
        ],
        check: [
          { required: true, message: '请选择检查情况' }
        ],
        check_text: abnormalRule,
        close_time: [
          { required: true, trigger: 'blur', message: '请填写关闭时间' }
        ],
        ground_area: [
          { required: true, trigger: 'blur', message: '请填写地井阀区域' }
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
            close_time: data.close_time,
            ground_area: data.ground_area,
            check: +data.check === 1 ? 1 : 2,
            check_text: +data.check !== 1 ? data.check : '',
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
        check: this.form.check === 1 ? 1 : this.form.check_text,
        close_time: this.form.close_time,
        ground_area: this.form.ground_area,
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
        check: 1,
        check_text: '',
        close_time: '',
        ground_area: '',
        remark: ''
      }
      this.form = form
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
