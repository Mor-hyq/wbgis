<template>
  <div>
    <el-button v-if="isRead" style="margin:10px 20px;" type="primary" :size="$btnSize" @click="printVisible = true">{{ mylang.print }}</el-button>
    <el-form
      ref="form"
      :rules="isRead ? {} :formRules"
      :model="form"
      label-suffix=":"
      label-width="auto"
      :size="$btnSize"
      class="custom-class"
      style="padding-top:5px;"
      :disabled="readState"
    >
      <el-row :gutter="25">
        <el-col :span="12">
          <el-form-item
            prop="pipe_id"
            :label="mylang.belongPipe"
          >
            <el-select
              v-model="form.pipe_id"
              clearable
              @change="pipeChange"
            >
              <el-option
                v-for="pipe in pipeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="equipment_id"
            :label="`${mylang.equipmentType}`"
          >
            <el-select
              v-model="form.equipment_id"
              clearable
              @change="equipmentChange"
            >
              <el-option
                v-for="pipe in eTypeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="title"
            :label="`${mylang.repaireOrder + mylang.title}`"
          >
            <el-input v-model="form.title" clearable />
          </el-form-item>
          <el-form-item
            prop="error_type_id"
            :label="`${mylang.faultType}`"
          >
            <el-select
              v-model="form.error_type_id"
              clearable
            >
              <el-option
                v-for="pipe in faultOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.error"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="style_id"
            :label="`${mylang.repaireMeasure}`"
          >
            <el-select
              v-model="form.style_id"
              clearable
            >
              <el-option
                v-for="pipe in measureOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.style"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="asset_num"
            :label="mylang.equipmentQuantity"
          >
            <el-input v-model="form.asset_num" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="budget"
            :label="`${mylang.budgetMoney}`"
          >
            <el-input v-model="form.budget" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="plan_start_time"
            :label="`${mylang.plan + mylang.startTime}`"
          >
            <el-date-picker
              v-model="form.plan_start_time"
              type="date"
              :placeholder="mylang.startTime"
              clearable
            />
          </el-form-item>
          <el-form-item
            prop="plan_end_time"
            :label="`${mylang.plan + mylang.endTime}`"
          >
            <el-date-picker
              v-model="form.plan_end_time"
              type="date"
              :placeholder="mylang.endTime"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="asset_ids"
        :label="`${mylang.choose + mylang.equipment}`"
      >
        <!-- <el-input v-model="form.asset_ids" style="display:none" clearable /> -->
        <el-button type="primary" style="margin-bottom:10px;" @click="showDialog">{{ mylang.choose }}</el-button>
        <el-row v-if="equipData.length > 0" class="link-role" type="flex">
          <el-col :span="20">
            <el-tag
              v-for="(item) in equipData"
              :key="item.asset_id"
              style="margin:0 5px 5px 0;"
            >{{ item.name }}</el-tag>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        prop="content"
        :label="`${mylang.repaireContent}`"
      >
        <el-input v-model="form.content" type="textarea" :rows="isRead ? '' : 5" />
      </el-form-item>
      <el-form-item
        prop="location"
        :label="`${mylang.repaireLocation}`"
      >
        <el-input v-model="form.location" type="textarea" :rows="isRead ? '' : 5" />
      </el-form-item>
    </el-form>
    <template v-if="type === 'done'">
      <el-divider />
      <el-tag>维修施工详情</el-tag>
      <el-form
        ref="cform"
        :rules="isRead ? {} :cformRules"
        :model="cform"
        label-suffix=":"
        label-width="auto"
        :size="$btnSize"
        class="custom-class"
        style="padding-top:10px;"
        :disabled="isRead"
      >
        <el-row :gutter="25">
          <el-col :span="12">
            <el-form-item
              prop="constract_unit"
              :label="`${mylang.constructionCompany}`"
            >
              <el-input v-model="cform.constract_unit" clearable />
            </el-form-item>
            <el-form-item
              prop="phone"
              :label="`${mylang.contact}`"
            >
              <el-input v-model="cform.phone" type="number" clearable />
            </el-form-item>
            <el-form-item
              prop="start_time"
              :label="`${mylang.actual + mylang.startTime}`"
            >
              <el-date-picker
                v-model="cform.start_time"
                type="date"
                :placeholder="mylang.startTime"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="constracter"
              :label="`${mylang.constructer}`"
            >
              <el-input v-model="cform.constracter" clearable />
            </el-form-item>
            <el-form-item
              prop="workload"
              :label="`${mylang.workload}`"
            >
              <el-input v-model="cform.workload" clearable />
            </el-form-item>
            <el-form-item
              prop="end_time"
              :label="`${mylang.actual + mylang.endTime}`"
            >
              <el-date-picker
                v-model="cform.end_time"
                type="date"
                :placeholder="mylang.endTime"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          prop="result"
          :label="`${mylang.repairResult}`"
        >
          <el-input v-model="cform.result" type="textarea" :rows="isRead ? '' : 5" />
        </el-form-item>
      </el-form>
    </template>
    <div v-if="!isRead" style="margin-top:20px;">
      <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
      <el-button @click="goBack">{{ mylang.cancel }}</el-button>
    </div>
    <link-equipment ref="linkEquipment" @confirm="dialogConfirm" />
    <el-dialog
      title="维修工单"
      :visible.sync="printVisible"
      width="800px"
      custom-class="dialog-custom"
      append-to-body
    >
      <ul
        id="print-table"
        class="origin-table"
      >
        <li class="center">
          <span class="width1 tit flex-center">设备维护维修工单</span>
        </li>
        <li class="center">
          <span class="width20 tit">{{ mylang.repaireOrder + mylang.title }}</span>
          <span class="text-left width1">{{ form.title }}</span>
        </li>
        <li class="center">
          <span class="width20 tit">{{ mylang.belongPipe }}</span>
          <span class="text-left width25">{{ tablePipeName }}</span>
          <span class="width20 tit">{{ mylang.equipmentType }}</span>
          <span class="text-left width25">{{ tableEtypeName }}</span>
        </li>
        <li class="center">
          <span class="width20 tit">{{ mylang.equipmentQuantity }}</span>
          <span class="text-left width25">{{ form.asset_num }}</span>
          <span class="width20 tit">{{ mylang.equipmentName }}</span>
          <span class="text-left width25">{{ tableTypeName }}</span>
        </li>
        <li class="center">
          <span class="width20 tit">{{ mylang.faultType }}</span>
          <span class="text-left width25">{{ tableFaultName }}</span>
          <span class="width20 tit">{{ mylang.budgetMoney }}</span>
          <span class="text-left width25">{{ form.budget }}元</span>
        </li>
        <li class="center">
          <span class="width20 tit">{{ mylang.repaireMeasure }}</span>
          <span class="text-left width25">{{ tableRepairType }}</span>
          <span class="width20 tit">{{ mylang.repaireLocation }}</span>
          <span class="text-left width25">{{ form.location }}</span>
        </li>
        <li class="center">
          <span class="width20 tit">{{ mylang.plan + mylang.startTime }}</span>
          <span class="text-left width25">{{ form.plan_start_time }}</span>
          <span class="width20 tit">{{ mylang.plan + mylang.endTime }}</span>
          <span class="text-left">{{ form.plan_end_time }}</span>
        </li>
        <li class="center">
          <span class="width-1em tit">{{ mylang.repaireContent }}</span>
          <span class="text-left min-height width1 pre-wrap">{{ form.content }}</span>
        </li>
        <li class="center">
          <span class="width-1em tit">维护结果</span>
          <div class="width1" style="border-left:none;">
            <div class="center inner-li">
              <span class="width20 tit">{{ mylang.constructionCompany }}</span>
              <span class="width25">{{ cform.constract_unit }}</span>
              <span class="width20 tit">{{ mylang.constructer }}</span>
              <span class="width25">{{ cform.constracter }}</span>
            </div>
            <div class="center inner-li">
              <span class="width20 tit">{{ mylang.phone }}</span>
              <span class="width25">{{ cform.phone }}</span>
              <span class="width20 tit">{{ mylang.workload }}</span>
              <span class="width25">{{ cform.workload }}</span>
            </div>
            <div class="center inner-li">
              <span class="width1 min-height text-left pre-wrap">{{ cform.result }}</span>
            </div>
            <div class="center inner-li" style="border-bottom:none;">
              <span class="width20 tit">{{ mylang.actual + mylang.startTime }}</span>
              <span class="width25">{{ cform.start_time }}</span>
              <span class="width20 tit">{{ mylang.actual + mylang.endTime }}</span>
              <span class="width25">{{ cform.end_time }}</span>
            </div>
          </div>
        </li>
      </ul>
      <div slot="footer">
        <el-button plain :size="$btnSize" @click="printVisible = false">{{ mylang.cancel }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addAssetService,
  editAssetService,
  getAssetServiceDetail,
  completeAssetService,
  getAssetTypeState
} from '@/api/inspection'
import { validatePhone2Func } from '@/utils/validateFunc'
import LinkEquipment from './LinkEquipment'
import deleteCache from '@/mixins/deleteCache'
import print from 'print-js'

export default {
  name: 'RepaireDetailComponent',
  components: {
    LinkEquipment
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
    },
    type: { // done完成维修类型 going维修类型
      type: String,
      default: ''
    }
  },
  data() {
    const validateTime1 = (rule, value, callback) => {
      if (rule.required) {
      // 必填时的校验
        if (value === '') {
          callback(new Error(`请选择${this.mylang.plan + this.mylang.startTime}`))
        } else if (this.form.plan_end_time && value > this.form.plan_end_time) {
          callback(new Error(`${this.mylang.startTime}不能大于${this.mylang.endTime}`))
        } else {
          callback()
        }
      } else {
        // 非必填时校验
        if (this.form.plan_end_time && value > this.form.plan_end_time) {
          callback(new Error(`${this.mylang.startTime}不能大于${this.mylang.endTime}`))
        } else {
          callback()
        }
      }
    }
    const validateTime2 = (rule, value, callback) => {
      if (rule.required) {
      // 必填时的校验
        if (!this.form.plan_start_time) {
          callback(new Error(`请先选择${this.mylang.plan + this.mylang.startTime}`))
        } else if (value === '') {
          callback(new Error(`请选择${this.mylang.plan + this.mylang.endTime}`))
        } else if (value < this.form.plan_start_time) {
          callback(new Error(`${this.mylang.startTime}不能大于${this.mylang.endTime}`))
        } else {
          callback()
        }
      } else {
        // 非必填时校验
        if (value < this.form.plan_start_time) {
          callback(new Error(`${this.mylang.startTime}不能大于${this.mylang.endTime}`))
        } else {
          callback()
        }
      }
    }
    const validateTime3 = (rule, value, callback) => {
      if (rule.required) {
      // 必填时的校验
        if (value === '') {
          callback(new Error(`请选择${this.mylang.actual + this.mylang.startTime}`))
        } else if (this.cform.end_time && value > this.cform.end_time) {
          callback(new Error(`${this.mylang.startTime}不能大于${this.mylang.endTime}`))
        } else {
          callback()
        }
      } else {
        // 非必填时校验
        if (this.cform.end_time && value > this.cform.end_time) {
          callback(new Error(`${this.mylang.startTime}不能大于${this.mylang.endTime}`))
        } else {
          callback()
        }
      }
    }
    const validateTime4 = (rule, value, callback) => {
      if (rule.required) {
      // 必填时的校验
        if (!this.cform.start_time) {
          callback(new Error(`请先选择${this.mylang.actual + this.mylang.startTime}`))
        } else if (value === '') {
          callback(new Error(`请选择${this.mylang.actual + this.mylang.endTime}`))
        } else if (value < this.cform.start_time) {
          callback(new Error(`${this.mylang.startTime}不能大于${this.mylang.endTime}`))
        } else {
          callback()
        }
      } else {
        // 非必填时校验
        if (value < this.form.plan_start_time) {
          callback(new Error(`${this.mylang.startTime}不能大于${this.mylang.endTime}`))
        } else {
          callback()
        }
      }
    }
    return {
      form: {
        pipe_id: '',
        equipment_id: '',
        style_id: '',
        error_type_id: '',
        title: '',
        asset_num: '',
        budget: '',
        plan_start_time: '',
        plan_end_time: '',
        asset_ids: '',
        content: '',
        location: ''
      },
      formRules: {
        pipe_id: [
          { required: true, message: `请选择${this.mylang.belongPipe}` }
        ],
        equipment_id: [
          { required: true, message: `请选择${this.mylang.equipmentType}` }
        ],
        style_id: [
          { required: true, message: `请选择${this.mylang.repaireMeasure}` }
        ],
        error_type_id: [
          { required: true, message: `请选择${this.mylang.faultType}` }
        ],
        title: [
          { required: true, message: `请输入${this.mylang.repaireOrder + this.mylang.title}` }
        ],
        asset_num: [
          { required: true, message: `请输入${this.mylang.equipmentQuantity}` }
        ],
        budget: [
          { required: true, message: `请输入${this.mylang.budgetMoney}` }
        ],
        plan_start_time: [
          { required: true, trigger: 'change', validator: validateTime1 }
        ],
        plan_end_time: [
          { required: true, trigger: 'change', validator: validateTime2 }
        ],
        asset_ids: [
          { required: true, message: `请选择${this.mylang.equipment}` }
        ]
      },
      cform: {
        constract_unit: '',
        constracter: '',
        phone: '',
        workload: '',
        start_time: '',
        end_time: '',
        result: ''
      },
      cformRules: {
        constract_unit: [
          { required: true, message: `请输入${this.mylang.constructionCompany}` }
        ],
        constracter: [
          { required: true, message: `请输入${this.mylang.constructer}` }
        ],
        phone: [
          { required: true, validator: validatePhone2Func, tips: this.mylang.contact }
        ],
        workload: [
          { required: true, message: `请输入${this.mylang.workload}` }
        ],
        start_time: [
          { required: true, trigger: 'change', validator: validateTime3 }
        ],
        end_time: [
          { required: true, trigger: 'change', validator: validateTime4 }
        ],
        result: [
          { required: true, message: `请输入${this.mylang.repairResult}` }
        ]
      },
      id: this.$route.query.id || '',
      pipeOptions: [],
      eTypeOptions: [],
      eNameOptions: [],
      measureOptions: [],
      faultOptions: [],
      equipData: [],
      printVisible: false
    }
  },
  computed: {
    readState() {
      return this.isRead || this.type === 'done'
    },
    tableTypeName() {
      return this.equipData.map(v => v.name).join('，')
    },
    tablePipeName() {
      const obj = this.pipeOptions.find(v => +v.id === this.form.pipe_id)
      return obj ? obj.name : ''
    },
    tableEtypeName() {
      const obj = this.eTypeOptions.find(v => v.id === this.form.equipment_id)
      return obj ? obj.name : ''
    },
    tableFaultName() {
      const obj = this.faultOptions.find(v => v.id === this.form.error_type_id)
      return obj ? obj.error : ''
    },
    tableRepairType() {
      const obj = this.measureOptions.find(v => v.id === this.form.error_type_id)
      return obj ? obj.style : ''
    }
  },
  watch: {
    equipData: {
      handler(val) {
        const id = val.length > 0 ? val.map(v => v.asset_id).join() : ''
        this.$set(this.form, 'asset_ids', id)
      },
      deep: true
    }
  },
  created() {
    this.getPipeOptions()
    this.getMeasureOptions()
    this.getFaultOptions()
    if (this.isEdit || this.isRead || this.type === 'done') {
      this.getDetail()
    }
  },
  methods: {
    submit() {
      if (this.type === 'done') {
        this.$refs.cform.validate(valid => {
          if (valid) {
            this.$confirm('确定提交吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.completeRepaire()
            })
          }
        })
      } else {
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
      }
    },
    async getDetail() {
      try {
        const { code, data } = await getAssetServiceDetail({ id: this.id })
        if (code === 200) {
          this.form = {
            pipe_id: data.pipe_id,
            equipment_id: data.equipment_id,
            style_id: data.style_id,
            error_type_id: data.error_type_id,
            title: data.title,
            asset_num: data.num,
            budget: data.money,
            plan_start_time: data.start_time,
            plan_end_time: data.end_time,
            asset_ids: data.asset_ids,
            content: data.content,
            location: data.location
          }
          this.cform = {
            constract_unit: data.constract_unit,
            constracter: data.constracter,
            phone: data.phone,
            workload: data.workload,
            start_time: data.act_start_time,
            end_time: data.act_end_time,
            result: data.result
          }
          if (this.form.pipe_id) {
            this.getEquipmentOptions()
          }
          if (data.asset_ids) {
            const ids = data.asset_ids.split(',')
            const names = data.asset_ids_value.split(',')
            this.equipData = ids.map((v, i) => {
              return {
                asset_id: v,
                name: names[i]
              }
            })
          }
        }
      } catch (error) {
        //
      }
    },
    async completeRepaire() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await completeAssetService({
          id: this.id,
          ...this.cform
        })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'EquipmentRepair' })
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'EquipmentRepair'
            })
          }, 500)
        }
      } catch (error) {
        loading.close()
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
        const { code } = await addAssetService(this.form)
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'EquipmentRepair' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'EquipmentRepair'
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
        const { code } = await editAssetService({ id: this.id, ...this.form })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'EquipmentRepair' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'EquipmentRepair'
            })
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    showDialog() {
      if (!this.form.pipe_id) {
        this.$message({
          type: 'warning',
          message: `请先选择${this.mylang.belongPipe}`
        })
        return
      }
      if (!this.form.equipment_id) {
        this.$message({
          type: 'warning',
          message: `请先选择${this.mylang.equipmentType}`
        })
        return
      }
      this.$refs.linkEquipment.show({
        equipId: this.form.equipment_id,
        pipeId: this.form.pipe_id,
        asset_ids: this.form.asset_ids,
        selectInfo: this.equipData
      })
    },
    pipeChange(val) {
      // 重选管道 设备类型与设备也要重新选择
      this.form.equipment_id = ''
      this.form.asset_ids = ''
      this.equipData = []
      this.eTypeOptions = []
      if (this.form.pipe_id) {
        this.getEquipmentOptions()
      }
    },
    equipmentChange(val) {
      // 重选设备类型 设备也要重新选择
      this.form.asset_ids = ''
      this.equipData = []
    },
    getPipeOptions() {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          this.pipeOptions = this.$store.state.form.belongPipe
        })
      } else {
        this.pipeOptions = this.$store.state.form.belongPipe
      }
    },
    getMeasureOptions() {
      if (this.$store.state.form.inspectTypeSelect.length < 1) {
        this.$store.dispatch('form/setInspectTypeSelect').then(() => {
          this.measureOptions = this.$store.state.form.inspectTypeSelect
        })
      } else {
        this.measureOptions = this.$store.state.form.inspectTypeSelect
      }
    },
    getFaultOptions() {
      if (this.$store.state.form.faultTypeSelect.length < 1) {
        this.$store.dispatch('form/setFaultTypeSelect').then(() => {
          this.faultOptions = this.$store.state.form.faultTypeSelect
        })
      } else {
        this.faultOptions = this.$store.state.form.faultTypeSelect
      }
    },
    async getEquipmentOptions() {
      try {
        const { code, data } = await getAssetTypeState({
          id: this.form.pipe_id
        })
        if (code === 200) {
          this.eTypeOptions = data || []
        }
      } catch (error) {
        //
      }
    },
    dialogConfirm(val) {
      this.equipData = val.data
    },
    handlePrint() {
      print({
        printable: 'print-table',
        type: 'html',
        targetStyles: ['*']
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.origin-table {
  width: 100%;
  padding: 0;
  margin: 0;
  border-top: 1px solid #000;
  border-right: 1px solid #000;
  line-height: 28px;
  li,
  .inner-li {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #000;
    >span {
        padding: 10px;
    }
  }
  li>* {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      border-left: 1px solid #000;
  }
  .inner-li {
      flex: 0 0 100%;
  }
  .inner-li>* {
      border-left: 1px solid #000;
  }
  .flex-center {
    justify-content: center;
  }
  .center {
    text-align: center;
  }
  .text-left {
      text-align: left;
  }
  .width25 {
      flex: 0 0 25%;
      width: 25%;
  }
  .width20 {
      flex: 0 0 20%;
      width: 20%;
  }
  .width1 {
      flex: 1;
  }
  .width-1em {
      width: 2.5em;
  }
  .min-height {
      min-height: 100px;
  }
  .tit {
      font-weight: bold;
  }
  .pre-wrap {
    white-space: pre-wrap;
  }
}
</style>
