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
            prop="fault_time"
            :label="`${mylang.accidentTime}`"
          >
            <el-date-picker
              v-model="form.fault_time"
              type="date"
              :placeholder="mylang.accidentTime"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="fault_state"
            :label="`${mylang.accidentPlace}`"
          >
            <el-input v-model="form.fault_state" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="fault_describe"
        :label="`${mylang.accidentDescribe}`"
      >
        <el-input v-model="form.fault_describe" :rows="isRead ? '' : 5" type="textarea" />
      </el-form-item>
      <el-form-item
        prop="fault_coordinate"
        :label="`${mylang.accidentLonLat}`"
      >
        <el-input v-model="form.fault_coordinate" clearable @focus="showMap">
          <i slot="suffix" style="font-size:22px;color:#f56c6c;" class="el-input__icon el-icon-location" />
        </el-input>
      </el-form-item>
      <el-form-item
        prop="accident_id"
        :label="mylang.emergencyPlan"
      >
        <el-select v-model="form.accident_id" clearable>
          <el-option
            v-for="type in plansOptions"
            :key="type.id"
            :value="type.id"
            :label="type.accident_name"
          />
        </el-select>
        <span v-if="form.accident_id" class="label" @click="handleDetail">查看详情</span>
      </el-form-item>
      <template v-if="isEdit || (isRead && +d_state === 2)">
        <el-divider />
        <el-form-item
          prop="deal_user"
          :label="mylang.appraiser"
        >
          <el-input v-model="form.deal_user" clearable />
        </el-form-item>
        <el-form-item
          prop="deal_result"
          :label="`${mylang.dealResult}`"
        >
          <el-input v-model="form.deal_result" :rows="isRead ? '' : 5" type="textarea" />
        </el-form-item>
      </template>
    </el-form>
    <div v-if="!isRead" style="margin-top:20px;">
      <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
      <el-button @click="goBack">{{ mylang.cancel }}</el-button>
    </div>
    <GetLngLat ref="getmap" :lnglat-pro="form.fault_coordinate" @confirm="getLT" />
    <el-dialog
      title="预案详情"
      :visible.sync="planVisible"
      custom-class="dialog-custom"
      width="65%"
      append-to-body
    >
      <plan-detail ref="planDetail" is-read is-component />
    </el-dialog>
  </div>
</template>

<script>
import GetLngLat from '@/components/GetLngLat'
import { addResult, editResult, getResultDetail } from '@/api/emergency'
import deleteCache from '@/mixins/deleteCache'
import PlanDetail from '../../plan/components/PlanDetail'

export default {
  name: 'ResultComponentDetail',
  components: {
    GetLngLat,
    PlanDetail
  },
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
      planVisible: false,
      form: {
        order: '',
        fault_time: '',
        fault_state: '',
        fault_describe: '',
        fault_coordinate: '',
        accident_id: '',
        deal_user: '',
        deal_result: ''
      },
      formRules: {
        order: [
          { required: true, message: `请输入${this.mylang.number}` }
        ],
        fault_time: [
          { required: true, message: `请输入${this.mylang.accidentTime}` }
        ],
        fault_state: [
          { required: true, message: `请输入${this.mylang.accidentPlace}` }
        ],
        fault_describe: [
          { required: true, message: `请输入${this.mylang.accidentDescribe}` }
        ],
        fault_coordinate: [
          { required: true, message: `请选择${this.mylang.accidentLonLat}` }
        ],
        accident_id: [
          { required: true, message: `请选择${this.mylang.emergencyPlan}` }
        ],
        deal_user: [
          { required: true, message: `请输入${this.mylang.appraiser}` }
        ],
        deal_result: [
          { required: true, message: `请输入${this.mylang.dealResult}` }
        ]
      },
      id: this.$route.query.id || '',
      d_state: this.$route.query.state || '',
      plansOptions: [],
      typeOptions: []
    }
  },
  created() {
    this.getPlanOptions()
    this.getTypeOptions()
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
        const { code, data } = await getResultDetail({ id: this.id })
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
        const { code } = await addResult(this.form)
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'Results' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'Results'
            })
          }, 500)
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
        const { code } = await editResult({ id: this.id, ...this.form })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'Results' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'Results'
            })
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    showMap() {
      this.$refs.getmap.showMap()
    },
    getLT(data) {
      this.form.fault_coordinate = `${data.lngLat.lng},${data.lngLat.lat}`
    },
    getPlanOptions() {
      if (this.$store.state.form.resultPlan.length < 1) {
        this.$store.dispatch('form/setResultPlan').then(() => {
          this.plansOptions = this.$store.state.form.resultPlan
        })
      } else {
        this.plansOptions = this.$store.state.form.resultPlan
      }
    },
    getTypeOptions() {
      if (this.$store.state.form.accidentType.length < 1) {
        this.$store.dispatch('form/setAccidentType').then(() => {
          this.typeOptions = this.$store.state.form.accidentType
        })
      } else {
        this.typeOptions = this.$store.state.form.accidentType
      }
    },
    handleDetail() {
      this.planVisible = true
      this.$nextTick(() => {
        if (this.$refs.planDetail) {
          this.$refs.planDetail.init(this.form.accident_id)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.label {
  color: #409EFF;
  font-size: 12px;
  margin-left: 10px;
  text-decoration: underline;
  cursor: default;
}
</style>
