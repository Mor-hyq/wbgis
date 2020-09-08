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

        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="money"
            :label="`${mylang.budgetMoney}`"
          >
            <el-input v-model="form.money" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="asset_num"
            :label="mylang.equipmentQuantity"
          >
            <el-input
              v-model="form.asset_num"
              type="number"
              readonly
            />
          </el-form-item>

        </el-col>
      </el-row>
      <el-form-item
        prop="asset_ids"
        :label="`${mylang.choose + mylang.equipment}`"
      >
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
        prop="start_time"
        label="报修日期"
      >
        <el-date-picker
          v-model="form.start_time"
          type="date"
          placeholder="报修日期"
          clearable
        />
      </el-form-item>

      <el-form-item
        prop="fault"
        label="故障现象及判断"
      >
        <el-input v-model="form.fault" type="textarea" :rows="isRead ? '' : 5" />
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
              prop="construct_union"
              :label="`${mylang.constructionCompany}`"
            >
              <el-input v-model="cform.construct_union" clearable />
            </el-form-item>
            <el-form-item
              prop="overhaul_mid"
              label="检修人员"
            >
              <el-select
                v-model="cform.overhaul_mid"
                clearable
                allow-create
                filterable
              >
                <el-option
                  v-for="item in memberOptions"
                  :key="item.id"
                  :value="item.nickname"
                  :label="item.nickname"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              prop="service_time"
              :label="`维修时间`"
            >
              <el-date-picker
                v-model="cform.service_time"
                type="date"
                placeholder="维修时间"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="real_money"
              :label="`实际金额`"
            >
              <el-input v-model="cform.real_money" clearable />
            </el-form-item>
            <el-form-item
              prop="accept_mid"
              label="验收人员"
            >
              <el-select
                v-model="cform.accept_mid"
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
            <el-form-item
              prop="accept_time"
              label="验收时间"
            >
              <el-date-picker
                v-model="cform.accept_time"
                type="date"
                placeholder="验收时间"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          prop="content"
          label="检修内容"
        >
          <el-input v-model="cform.content" type="textarea" :rows="isRead ? '' : 5" />
        </el-form-item>
        <el-form-item
          prop="accept"
          label="验收情况"
        >
          <el-input v-model="cform.accept" type="textarea" :rows="isRead ? '' : 5" />
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

      <table id="print-table" class="print-table" align="center" cellspacing="0" cellpadding="0">
        <caption>设备检修记录</caption>
        <tr style="height:100px;">
          <td style="width:50px;">故障现象及判断</td>
          <td colspan="2">{{ form.fault }}</td>
          <td>设备名称</td>
          <td colspan="2">{{ tableInfo.assetName }}</td>
        </tr>
        <tr>
          <td>检修内容</td>
          <td colspan="5" class="c-min-height">{{ cform.content }}</td>
        </tr>
        <tr>
          <td>验收情况</td>
          <td colspan="5" class="c-min-height">{{ cform.accept }}</td>
        </tr>
        <tr>
          <td>报修时间</td>
          <td colspan="5">{{ form.start_time }}</td>
        </tr>
        <tr>
          <td style="width:100px">检修人</td>
          <td style="width:150px;" />
          <td>{{ cform.service_time }}</td>
          <td>验收人</td>
          <td style="width:150px;" />
          <td>{{ cform.accept_time }}</td>
        </tr>
      </table>
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
    return {
      form: {
        pipe_id: '',
        equipment_id: '',

        asset_num: '',
        money: '',

        start_time: '',
        asset_ids: '',
        fault: ''
      },
      formRules: {
        pipe_id: [
          { required: true, message: `请选择${this.mylang.belongPipe}` }
        ],
        equipment_id: [
          { required: true, message: `请选择${this.mylang.equipmentType}` }
        ],

        asset_num: [
          { required: true, message: `请输入${this.mylang.equipmentQuantity}` }
        ],
        money: [
          { required: false, message: `请输入${this.mylang.budgetMoney}` }
        ],

        start_time: [
          { required: true, trigger: 'change', message: '请选择报修时间' }
        ],
        asset_ids: [
          { required: true, message: `请选择${this.mylang.equipment}` }
        ]
      },
      cform: {
        construct_union: '',
        real_money: '',
        overhaul_mid: '',
        accept_mid: '',
        service_time: '',
        accept_time: '',
        content: '',
        accept: ''
      },
      cformRules: {
        construct_union: [
          { required: true, message: `请输入${this.mylang.constructionCompany}` }
        ],
        real_money: [
          { required: true, message: `请输入实际金额` }
        ],
        overhaul_mid: [
          { required: true, message: `请选择检修人员` }
        ],
        accept_mid: [
          { required: true, message: `请选择验收人员` }
        ],
        accept_time: [
          { required: true, trigger: 'change', message: '请选择验收时间' }
        ],
        service_time: [
          { required: true, trigger: 'change', message: '请选择维修时间' }
        ],
        accept: [
          { required: true, message: `请输入验收情况` }
        ]
      },
      id: this.$route.query.id || '',
      pipeOptions: [],
      eTypeOptions: [],
      eNameOptions: [],
      memberOptions: [],
      equipData: [],
      printVisible: false,
      tableInfo: {}
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
    }
  },
  watch: {
    equipData: {
      handler(val) {
        const id = val.length > 0 ? val.map(v => v.asset_id).join() : ''
        this.$set(this.form, 'asset_ids', id)
        this.$set(this.form, 'asset_num', val.length)
      },
      deep: true
    }
  },
  created() {
    this.getPipeOptions()
    this.getCheckMember()
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

            asset_num: data.asset_num,
            money: data.money,

            start_time: data.start_time,
            asset_ids: data.asset_ids,
            fault: data.fault
          }
          this.tableInfo.assetName = data.asset_ids_value
          this.cform = {
            construct_union: data.construct_union,
            real_money: data.real_money,
            overhaul_mid: +data.overhaul_mid || data.overhaul_mid,
            accept_mid: +data.accept_mid || data.accept_mid,

            service_time: data.service_time,
            accept_time: data.accept_time,
            content: data.content,
            accept: data.accept
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
    getCheckMember() {
      if (this.$store.state.form.checkMember.length < 1) {
        this.$store.dispatch('form/setCheckMember').then(() => {
          this.memberOptions = this.$store.state.form.checkMember
        })
      } else {
        this.memberOptions = this.$store.state.form.checkMember
      }
    },
    filterName(id) {
      if (+id) {
        const names = this.memberOptions.find(v => +v.id === +id)
        return names ? names.nickname : id
      }
      return id
    },
    dialogConfirm(val) {
      this.equipData = val.data
    },
    handlePrint() {
      print({
        printable: 'print-table',
        type: 'html',
        style: '@media print{@page {size:portrait;margin:0 auto;}}.print-table{border:1px solid #666;border-collapse:collapse;margin:0 auto}.print-table.medium-width th{width:120px}.print-table.small-width th{width:100px}.print-table caption{margin-bottom:10px;font-size: 16px;font-weight: bold;}.print-table th{width:80px}.print-table th,.print-table td{border:1px solid #666;padding:8px 5px}.print-table td{text-align:center}.print-table .all-col{text-align:left;padding:20px 10px}.print-table .all-col div{white-space:pre;padding-left:2em}.print-table .cus-tit{display:inline-block;width:30%}.print-table .cus-tit:last-child{width:40%;text-align:right}.print-table .cus-tit span{font-weight:normal;font-size:16px}.print-table .c-min-height{height:350px!important;}'

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
.c-min-height {
  height: 100px;
}
</style>
