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
        prop="low_area"
        label="机坪低点排水区域"
      >
        <span class="read">{{ form.low_area }}</span>
      </el-form-item>
      <el-form-item
        prop="visual"
        label="目视"
      >
        <el-radio-group v-model="form.visual">
          <el-radio
            v-for="item in visualOptions"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="water_detector"
        label="化学测水器"
      >
        <el-radio-group v-model="form.water_detector">
          <el-radio
            v-for="item in waterOptions"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
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
        prop="deal_visual"
        label="目视结论"
      >
        <el-radio-group v-model="form.deal_visual">
          <el-radio
            v-for="item in dealOptions"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-radio>
        </el-radio-group>
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
        low_area: this.eqName || '',
        visual: 1,
        water_detector: 1,
        deal: '',
        deal_visual: 1,
        remark: ''
      },
      formRules: {
        check_mid: [
          { required: true, message: '请选择检查人员' }
        ],
        check_time: [
          { required: true, message: '请选择维护时间' }
        ],
        low_area: [
          { required: true, message: '请填写机坪低点排水区域' }
        ],
        visual: [
          { required: true, message: '请选择目视选项' }
        ],
        water_detector: [
          { required: true, message: '请选择化学测水器选项' }
        ],
        deal_visual: [
          { required: true, message: '请选择目视结论' }
        ]
      },
      memberOptions: [],
      visualOptions: [
        {
          id: 1,
          name: '清澈透明'
        },
        {
          id: 2,
          name: '少量水分杂质'
        },
        {
          id: 3,
          name: '大量水分杂质'
        }
      ],
      waterOptions: [
        {
          id: 1,
          name: '不变色'
        },
        {
          id: 2,
          name: '变色'
        }
      ],
      dealOptions: [
        {
          id: 1,
          name: '合格'
        },
        {
          id: 2,
          name: '不合格'
        }
      ]
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
            low_area: data.low_area,
            visual: +data.visual,
            water_detector: +data.water_detector,
            deal: data.deal,
            deal_visual: +data.deal_visual,
            remark: data.remark,
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
        low_area: '',
        visual: 1,
        water_detector: 1,
        deal: '',
        deal_visual: 1,
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
