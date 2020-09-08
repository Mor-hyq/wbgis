<template>
  <div>
    <el-button v-if="isRead" :size="$btnSize" type="primary" style="margin:10px 0 5px;" @click="handlePrint">{{ mylang.print }}</el-button>
    <el-form
      id="print-plan"
      ref="form"
      :rules="isRead ? {} :formRules"
      :model="form"
      label-suffix=":"
      label-width="100px"
      :size="$btnSize"
      class="custom-class"
      :style="formStyle"
      :disabled="isRead"
    >
      <h3 v-if="isRead" style="text-align:center;font-size:16px;margin:0 10px;">{{ form.name }}处置预案</h3>
      <el-form-item
        prop="name"
        :label="mylang.accidentName"
        :style="styleObj"
      >
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item
        prop="type"
        :label="mylang.accidentType"
        :style="styleObj"
      >
        <el-select v-model="form.type" clearable>
          <el-option
            v-for="type in typeOptions"
            :key="type.id"
            :value="type.id"
            :label="type.type"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="level"
        :label="mylang.accidentLevel"
        :style="styleObj"
      >
        <el-select v-model="form.level" clearable>
          <el-option
            v-for="level in levelOptions"
            :key="level.id"
            :value="level.id"
            :label="level.level"
          />
        </el-select>
      </el-form-item>
      <!-- 应急人员 -->
      <el-form-item
        prop="work_ids"
        :label="mylang.emergencyStaff"
      >
        <el-button type="primary" class="inner-btn" @click="show('staff')">{{ mylang.choose }}</el-button>
        <el-table
          v-if="staffData.length > 0"
          :data="staffData"
          border
          stripe
          :size="$btnSize"
        >
          <el-table-column
            align="center"
            prop="order"
            :label="mylang.number"
          />
          <el-table-column
            align="center"
            prop="name"
            :label="mylang.realName"
          />
          <el-table-column
            align="center"
            prop="response"
            :label="mylang.response"
          />
          <el-table-column
            align="center"
            prop="position"
            :label="mylang.position"
          />
        </el-table>
      </el-form-item>
      <!-- 消防队伍 -->
      <el-form-item
        prop="team_ids"
        :label="mylang.fireTeam"
      >
        <el-button type="primary" class="inner-btn" @click="show('fireTeam')">{{ mylang.choose }}</el-button>
        <el-table
          v-if="fireTeamData.length > 0"
          :data="fireTeamData"
          border
          stripe
          :size="$btnSize"
        >
          <el-table-column
            align="center"
            prop="order"
            :label="mylang.number"
          />
          <el-table-column
            align="center"
            prop="unit"
            :label="mylang.unitName"
          />
          <el-table-column
            align="center"
            prop="team_place"
            :label="mylang.teamPlace"
          />
          <el-table-column
            align="center"
            prop="response"
            :label="mylang.response"
          />
          <el-table-column
            align="center"
            prop="number"
            :label="mylang.staffNumber"
          />
          <el-table-column
            align="center"
            prop="name"
            :label="mylang.label"
          />
        </el-table>
      </el-form-item>
      <!-- 应急车辆 -->
      <el-form-item
        prop="car_ids"
        :label="mylang.emergencyCars"
      >
        <el-button type="primary" class="inner-btn" @click="show('car')">{{ mylang.choose }}</el-button>
        <el-table
          v-if="carData.length > 0"
          :data="carData"
          border
          stripe
          :size="$btnSize"
        >
          <el-table-column
            align="center"
            prop="order"
            :label="mylang.number"
          />
          <el-table-column
            align="center"
            prop="unit"
            :label="mylang.unitName"
          />
          <el-table-column
            align="center"
            prop="store_place"
            :label="mylang.storePlace"
          />
          <el-table-column
            align="center"
            prop="plate_number"
            :label="mylang.plateNumber"
          />
          <el-table-column
            align="center"
            prop="number"

            :label="mylang.limitNumber"
          />
          <el-table-column
            align="center"
            prop="driver"
            :label="mylang.driver"
          />
        </el-table>
      </el-form-item>
      <!-- 应急物资 -->
      <el-form-item
        prop="material_ids"
        :label="mylang.emergencySupply"
      >
        <el-button type="primary" class="inner-btn" @click="show('supply')">{{ mylang.choose }}</el-button>
        <el-table
          v-if="supplyData.length > 0"
          :data="supplyData"
          border
          stripe
          :size="$btnSize"
        >
          <el-table-column
            align="center"
            prop="order"
            :label="mylang.number"
          />
          <el-table-column
            align="center"
            prop="unit"
            :label="mylang.unitName"
          />
          <el-table-column
            align="center"
            prop="material"
            :label="mylang.materialName"
          />
          <el-table-column
            align="center"
            prop="number"
            :label="mylang.quantity"
          />
          <el-table-column
            align="center"
            prop="leader"
            :label="mylang.leader"
          />
        </el-table>
      </el-form-item>
      <!-- 外协单位 -->
      <el-form-item
        prop="assist_ids"
        :label="mylang.assistant"
      >
        <el-button type="primary" class="inner-btn" @click="show('cooperation')">{{ mylang.choose }}</el-button>
        <el-table
          v-if="cooperationData.length > 0"
          :data="cooperationData"
          border
          stripe
          :size="$btnSize"
        >
          <el-table-column
            align="center"
            prop="order"
            :label="mylang.number"
          />
          <el-table-column
            align="center"
            prop="institute"
            :label="mylang.institute"
          />
          <el-table-column
            align="center"
            prop="response"
            :label="mylang.response"
          />
          <el-table-column
            align="center"
            prop="leader"
            :label="mylang.contactMan"
          />
        </el-table>
      </el-form-item>
      <!-- 处置措施 -->
      <el-form-item
        prop="measure_ids"
        :label="mylang.measurePlan"
      >
        <el-button type="primary" class="inner-btn" @click="show('measure')">{{ mylang.choose }}</el-button>
        <el-table
          v-if="measureData.length > 0"
          :data="measureData"
          border
          stripe
          :size="$btnSize"
        >
          <el-table-column
            align="center"
            prop="name"
            :label="mylang.measureName"
          />
          <el-table-column
            align="center"
            prop="create_time"
            :label="mylang.registerTime"
          />
          <el-table-column
            align="center"
            prop="process"
            show-overflow-tooltip
            label="处置流程"
          >
            <template slot-scope="scope">
              <div v-html="scope.row.process" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="require"
            show-overflow-tooltip
            label="处置要求"
          >
            <template slot-scope="scope">
              <div v-html="scope.row.require" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="attachment"
            :label="mylang.attachmentName"
          >
            <template slot-scope="scope">
              <span class="down" title="点击下载附件" @click="adown(scope.row)">{{ scope.row.attachment }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item
        prop="push_app"
        :label="mylang.openSms"
      >
        <el-radio-group v-model="form.push_app">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div v-if="!isRead" style="margin-top:20px;">
      <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
      <el-button @click="goBack">{{ mylang.cancel }}</el-button>
    </div>
    <dialog-plans ref="dia" @confirm="dialogConfirm" />
  </div>
</template>

<script>
import DialogPlans from './DialogPlans'
import { addPlan, editPlan, getPlanDetail } from '@/api/emergency'
import deleteCache from '@/mixins/deleteCache'
import config from '@/config'
import print from 'print-js'

export default {
  name: 'PlanComponentDetail',
  components: {
    DialogPlans
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
    isComponent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        type: '',
        level: '',
        work_ids: '',
        team_ids: '',
        car_ids: '',
        material_ids: '',
        assist_ids: '',
        measure_ids: '',
        push_app: '',
        emerge_worker_ids: ''
      },
      selectData: {},
      formRules: {
        name: [
          { required: true, message: `请输入${this.mylang.accidentName}` }
        ],
        type: [
          { required: true, trigger: 'change', message: `请选择${this.mylang.accidentType}` }
        ],
        push_app: [
          { required: true, trigger: 'change', message: `请选择是否开启移动APP推送` }
        ],
        emerge_worker_ids: [
          { required: true, trigger: 'change', message: `请选择发送人员` }
        ]
      },
      staffData: [], // 应急人员选中表格信息
      fireTeamData: [],
      carData: [],
      supplyData: [],
      cooperationData: [],
      measureData: [],
      sendtoData: [],
      selectDialogName: '', // 显示弹窗时所属字段名称
      levelOptions: [],
      typeOptions: [],
      id: ''
    }
  },
  computed: {
    styleObj() {
      return this.isRead ? { 'margin-bottom': '5px' } : {}
    },
    formStyle() {
      return this.isRead ? { 'padding-right': '15px' } : { 'padding-top': '15px' }
    }
  },
  watch: {
    staffData: {
      handler(val) {
        this.form.work_ids = val.length > 0 ? val.map(v => v.id).join() : ''
      },
      deep: true
    },
    fireTeamData: {
      handler(val) {
        this.form.team_ids = val.length > 0 ? val.map(v => v.id).join() : ''
      },
      deep: true
    },
    carData: {
      handler(val) {
        this.form.car_ids = val.length > 0 ? val.map(v => v.id).join() : ''
      },
      deep: true
    },
    supplyData: {
      handler(val) {
        this.form.material_ids = val.length > 0 ? val.map(v => v.id).join() : ''
      },
      deep: true
    },
    cooperationData: {
      handler(val) {
        this.form.assist_ids = val.length > 0 ? val.map(v => v.id).join() : ''
      },
      deep: true
    },
    measureData: {
      handler(val) {
        this.form.measure_ids = val.length > 0 ? val.map(v => v.id).join() : ''
      },
      deep: true
    },
    sendtoData: {
      handler(val) {
        const id = val.length > 0 ? val.map(v => v.id).join() : ''
        this.$set(this.form, 'emerge_worker_ids', id)
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(id) {
      this.getLevelOptions()
      this.getTypeOptions()
      if (this.isComponent) {
        this.id = id
      } else {
        this.id = this.$route.query.id || ''
      }
      if (this.id) {
        if (this.isEdit || this.isRead) {
          this.getDetail()
        }
      }
    },
    show(prop) {
      const component = prop
      this.selectDialogName = prop + 'Data'
      let title = ''
      const selectedInfo = this[this.selectDialogName]
      switch (prop) {
        case 'staff':
          title = '应急人员'
          break
        case 'fireTeam':
          title = '消防队伍'
          break
        case 'car':
          title = '应急车辆'
          break
        case 'supply':
          title = '应急物资'
          break
        case 'cooperation':
          title = '外协单位'
          break
        case 'measure':
          title = '处置措施'
          break
        case 'sendto':
          title = '选择发送人员'
          break
      }
      this.$refs.dia.show({
        component,
        title,
        selectedInfo
      })
    },
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
        const { code, data } = await getPlanDetail({ id: this.id })
        if (code === 200) {
          this.form = {
            name: data.accident_name,
            type: data.type,
            level: data.level, // 这个应该传value值
            push_app: data.accident_deal.push_app
          }
          this.staffData = data.worker_list || []
          this.fireTeamData = data.team_list || []
          this.carData = data.car_list || []
          this.supplyData = data.material_list || []
          this.cooperationData = data.assist_list || []
          this.measureData = data.measure_list || []
          if (data.accident_deal.emerge_worker_ids) {
            const ids = data.accident_deal.emerge_worker_ids.split(',')
            const names = data.accident_deal.emerge_workers.split(',').reverse()
            this.sendtoData = ids.map((v, i) => {
              return {
                id: v,
                name: names[i]
              }
            })
          }
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
        const { code } = await addPlan(this.form)
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'Plans' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'Plans'
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
        const { code } = await editPlan({ id: this.id, ...this.form })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'Plans' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'Plans'
            })
          }, 500)
        }
      } catch (error) {
        loading.close()
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
    getLevelOptions() {
      if (this.$store.state.form.accidentLevel.length < 1) {
        this.$store.dispatch('form/setAccidentLevel').then(() => {
          this.levelOptions = this.$store.state.form.accidentLevel
        })
      } else {
        this.levelOptions = this.$store.state.form.accidentLevel
      }
    },
    dialogConfirm(val) {
      this[this.selectDialogName] = val.data
    },
    adown(row) {
      const url = this.returnDownUrl(row)
      window.location.href = url
    },
    returnDownUrl(row, type) {
      const mode = config.mode
      const httpApi = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      const url = httpApi + row.file_path
      return url
    },
    handlePrint() {
      print({
        printable: 'print-plan',
        type: 'html',
        maxWidth: 1080,
        targetStyles: ['*']
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
.inner-btn {
  margin-bottom: 10px;
}
.down {
  color: #333;
  cursor: default;
  &:hover {
  color: #409eff;
  }
}
</style>
