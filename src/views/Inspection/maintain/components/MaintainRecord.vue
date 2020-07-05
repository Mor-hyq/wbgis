<template>
  <div>
    <my-table
      ref="mytable"
      :search-data.sync="searchForm"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @handlePageChange="handleChange"
    >
      <template v-if="!isComponent" slot="search">
        <el-form ref="searchForm" :model="searchForm" size="mini" inline>
          <el-form-item prop="equipment_id" label="设备类型">
            <el-select
              v-model="searchForm.equipment_id"
              clearable
              :size="$btnSize"
              placeholder="全部"
            >
              <el-option
                v-for="pipe in eTypeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="field_value_id_2" :label="mylang.equipmentName">
            <el-input v-model="searchForm.field_value_id_2" :placeholder="`请输入${mylang.equipmentName}`" clearable />
          </el-form-item>
          <!-- <el-form-item prop="plan_time" :label="mylang.plan + mylang.maintainDate">
            <el-date-picker
              v-model="searchForm.plan_time"
              type="daterange"
              range-separator="-"
              start-placeholder="维护日期"
              end-placeholder="维护日期"
              value-format="yyyy-MM-dd"
              style="width:250px;"
            />
          </el-form-item> -->
          <el-form-item prop="egi_time" :label="mylang.maintainDate">
            <el-date-picker
              v-model="searchForm.egi_time"
              type="daterange"
              range-separator="-"
              start-placeholder="维护日期"
              end-placeholder="维护日期"
              value-format="yyyy-MM-dd"
              style="width:250px;"
            />
          </el-form-item>
          <el-form-item prop="state" :label="mylang.maintainState">
            <el-select v-model="searchForm.state" clearable>
              <el-option
                v-for="option in stateOptions"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="cycle" :label="mylang.maintainCycle">
            <el-select
              v-model="searchForm.cycle"
              clearable
              :size="$btnSize"
              placeholder="全部"
            >
              <el-option
                v-for="cycle in cycleOptions"
                :key="cycle.id"
                :value="cycle.id"
                :label="cycle.label"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="table_id" label="维护表单">
            <el-select
              v-model="searchForm.table_id"
              clearable
            >
              <el-option
                v-for="type in maintainOptions"
                :key="type.id"
                :value="type.id"
                :label="type.name"
              />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item prop="state" :label="mylang.maintainState">
            <el-select v-model="searchForm.state" clearable style="width:120px;">
              <el-option value="0" label="维护中" />
              <el-option value="1" label="维护完成" />
            </el-select>
          </el-form-item> -->
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div v-if="!isComponent" style="margin-bottom:8px;">
        <!-- <el-button type="primary" :size="$btnSize" @click="handleEdit()">{{ mylang.modify }}</el-button> -->
        <!-- <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button> -->
        <el-button type="primary" :size="$btnSize" plain @click="handleExport">{{ mylang.export }}</el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        class="tableBox"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="!isComponent"
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          prop="equipment_name"
          :label="mylang.equipmentType"
        />
        <el-table-column
          align="center"
          prop="asset_name"
          :label="mylang.equipmentName"
        />
        <el-table-column
          align="center"
          prop="egi_cycle"
          :label="`${mylang.maintainCycle}`"
          :formatter="formatterCycle"
        />
        <el-table-column
          align="center"
          prop="egi_time"
          :label="mylang.maintainDate"
        />
        <el-table-column
          align="center"
          prop="egi_person"
          :label="mylang.maintainStaff"
        />
        <!-- <el-table-column
          align="center"
          prop="plan_time"
          :label="mylang.plan + mylang.maintainDate"
        /> -->
        <el-table-column
          align="center"
          prop="state"
          :label="mylang.maintainState"
        >
          <template slot-scope="scope">
            <span class="order-state" :class="{ done: +scope.row.state === 1}">{{ getSateName(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isComponent"
          label="维护情况"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="goDetailPage(scope.row)"
            >{{ mylang.detail }}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          prop="name"
          label="维护表单"
        >
          <template slot-scope="scope">
            <span class="name" @click="goRecordDetail(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </my-table>
    <!-- <el-dialog v-if="!isComponent" :title="dialogTitle" :visible.sync="dialogTableVisible" @close="handleClose">
      <el-form
        ref="dialogForms"
        :model="dialogForm"
        :rules="dialogRule"
        label-suffix=":"
        label-width="90px"
        class="custom-class"
        :size="$btnSize"
      >
        <el-form-item
          prop="egi_person"
          :label="mylang.maintainStaff"
        >
          <el-input v-model="dialogForm.egi_person" clearable />
        </el-form-item>
        <el-form-item
          prop="egi_time"
          :label="mylang.maintainDate"
        >
          <el-date-picker
            v-model="dialogForm.egi_time"
            type="date"
            :placeholder="mylang.maintainDate"
            value-format="yyyy-MM-dd"
            clearable
          />
        </el-form-item>
        <el-form-item prop="egi_result" :label="mylang.maintainResult">
          <el-input v-model="dialogForm.egi_result" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item prop="table_id" label="维护表单">
          <div v-if="dialogForm.isEdit">
            <span class="name">{{ dialogForm.table_name }}</span>
            <i class="icon el-icon-edit" title="编辑" @click="goMatainPage('edit')" />
            <i class="icon el-icon-delete" title="删除" @click="handleDelEdit" />
          </div>
          <el-select
            v-else
            v-model="dialogForm.table_id"
            clearable
          >
            <el-option
              v-for="type in maintainOptions"
              :key="type.id"
              :value="type.id"
              :label="type.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
        <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
      </div>
    </el-dialog> -->
    <maintain-container
      :visible.sync="dialogInfo.visible"
      :type="dialogInfo.type"
      :eq-type="dialogInfo.eqType"
      :eq-num="dialogInfo.eqNum"
      :eq-name="dialogInfo.eqName"
      :eq-id="dialogInfo.eqId"
      :is-read="true"
    />
  </div>
</template>

<script>
import MaintainContainer from './newMaintainForm/Container'

import {
  // getMaintainRecord,
  getMaintainRecord2,
  // deleteMaintainRecord,
  // editMaintainRecord,
  getAssetTypeState
} from '@/api/inspection'
import config from '@/config'

export default {
  name: 'MaintainRecordComponent',
  components: {
    MaintainContainer
  },
  props: {
    isComponent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {
        // plan_time: '',
        egi_time: '',
        equipment_id: '',
        field_value_id_2: '',
        state: '',
        cycle: ''
      },
      maintainOptions: [],
      eTypeOptions: [],
      stateOptions: [{
        id: '1',
        // label: this.mylang.abnormal
        label: '已维护'
      }, {
        id: '2',
        // label: this.mylang.normal
        label: '逾期'
      }],
      cycleOptions: this.$store.state.form.cycleOptions,
      realSearch: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      chooseDelArr: [],
      tableData: [],
      dialogInfo: {
        visible: false,
        type: '',
        eqType: '',
        eqNum: '',
        eqName: '',
        eqId: ''
      }
      // dialogTableVisible: false,
      // dialogTitle: '',
      // dialogForm: { // 弹窗中的表单
      //   id: '', // 编辑时的id
      //   egi_person: '',
      //   egi_time: '',
      //   egi_result: '',
      //   table_id: '',
      //   table_name: '',
      //   isEdit: false
      // },
      // dialogRule: {
      //   egi_person: [
      //     { required: true, message: `请输入${this.mylang.maintainStaff}` }
      //   ],
      //   egi_time: [
      //     { required: true, message: `请选择${this.mylang.maintainDate}` }
      //   ],
      //   table_id: [
      //     { required: true, message: `请选择维护表单` }
      //   ]
      // }
    }
  },
  created() {
    // this.getMaintainOptions()
    this.getPipeOptions()
    if (!this.isComponent) {
      this.initTableData()
    }
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      // plan_time = '',
      egi_time = '',
      equipment_id = '',
      field_value_id_2 = '',
      state = '',
      cycle = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({
        page, paginate,
        //  plan_time,
        egi_time, equipment_id,
        field_value_id_2,
        state,
        cycle })
    },
    async getList({
      // plan_time = '',
      egi_time = '',
      equipment_id = '',
      field_value_id_2 = '',
      state = '',
      cycle = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getMaintainRecord2({
          page, paginate,
          // plan_time: Array.isArray(plan_time) ? plan_time.join() : '',
          egi_time: Array.isArray(egi_time) ? egi_time.join() : egi_time,
          equipment_id,
          field_value_id_2,
          state,
          cycle
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total
          this.tableData = data.data || []
        }
      } catch (error) {
        console.log(error)
        this.tableLoading = false
      }
    },
    handleSearch() {
      // 搜索
      const search = this.$refs.mytable.handleSearch()
      this.realSearch = search
      this.initTableData({
        // plan_time: search.plan_time,
        egi_time: search.egi_time,
        equipment_id: search.equipment_id,
        field_value_id_2: search.field_value_id_2,
        state: search.state,
        cycle: search.cycle
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        // plan_time: data.search.plan_time,
        egi_time: data.search.egi_time,
        equipment_id: data.search.equipment_id,
        field_value_id_2: data.search.field_value_id_2,
        state: data.search.state,
        cycle: data.search.cycle
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      if (!this.isComponent) {
        this.chooseDelArr = data
      }
    },
    // handleEdit() {
    //   if (this.chooseDelArr.length === 0) {
    //     this.$message({
    //       type: 'warning',
    //       message: '未选择任何需要修改的选项'
    //     })
    //   } else if (this.chooseDelArr.length > 1) {
    //     this.$message({
    //       type: 'warning',
    //       message: '修改项只能选择一个'
    //     })
    //   } else {
    //     const slcrow = this.chooseDelArr[0]
    //     this.dialogTitle = '维护信息修改'
    //     this.showDialog()
    //     if (this.$refs.dialogForms) {
    //       this.$refs.dialogForms.resetFields()
    //     }
    //     this.dialogForm.id = slcrow.id
    //     this.dialogForm.egi_person = slcrow.egi_person
    //     this.dialogForm.egi_time = slcrow.egi_time
    //     this.dialogForm.egi_result = slcrow.egi_result
    //     this.dialogForm.table_id = slcrow.table_id
    //     this.dialogForm.table_name = slcrow.name
    //     this.dialogForm.isEdit = !!slcrow.table_id
    //   }
    // },
    // handleDelete() {
    //   if (this.chooseDelArr.length === 0) {
    //     this.$message({
    //       type: 'warning',
    //       message: '未选择任何需要删除的选项'
    //     })
    //     return false
    //   }
    //   this.$confirm('即将删除您选中的' + this.mylang.maintainInfo + '，确认吗？', '删除' + this.mylang.maintainInfo, {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const ids = this.chooseDelArr.map(v => v.id).join(',')
    //     this.deleteData({ delete_ids: ids })
    //   })
    // },
    // async deleteData({ delete_ids } = {}) {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: '提交中',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    //   try {
    //     const { code } = await deleteMaintainRecord({ delete_ids })
    //     loading.close()
    //     if (code === 200) {
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功'
    //       })
    //       // 重新获取当前页面数据
    //       this.getList({
    //         page: this.listQuery.page,
    //         pageSize: this.listQuery.limit,
    //         plan_time: this.realSearch.plan_time,
    //         egi_time: this.realSearch.egi_time,
    //         equipment_id: this.realSearch.equipment_id,
    //         field_value_id_2: this.realSearch.field_value_id_2,
    //         state: this.realSearch.state,
    //         cycle: this.realSearch.cycle
    //       })
    //     }
    //   } catch (error) {
    //     loading.close()
    //   }
    // },
    // goRecordDetail(row) {
    //   this.$router.push({
    //     name: 'MaintainRecord',
    //     query: {
    //       tid: row.table_id,
    //       rid: row.id,
    //       is_r: '1'
    //     }
    //   })
    // },
    // handleConfirm() {
    //   // 提交确认
    //   this.$refs.dialogForms.validate((valid) => {
    //     if (valid) {
    //       this.$confirm('确定保存吗？', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }).then(() => {
    //         this.finishMaintain()
    //       })
    //     } else {
    //       return false
    //     }
    //   })
    // },
    // async finishMaintain() {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: '提交中',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    //   try {
    //     const { code } = await editMaintainRecord({
    //       ...this.dialogForm,
    //       egi_table_id: this.dialogForm.table_id
    //     })
    //     loading.close()
    //     if (code === 200) {
    //       // 重新获取当前页面数据
    //       if (this.dialogForm.isEdit) {
    //         // 没有修改过 维护表单 则直接刷新当前页面
    //         this.getList({
    //           page: this.listQuery.page,
    //           pageSize: this.listQuery.limit,
    //           plan_time: this.realSearch.plan_time,
    //           egi_time: this.realSearch.egi_time,
    //           equipment_id: this.realSearch.equipment_id,
    //           field_value_id_2: this.realSearch.field_value_id_2,
    //           state: this.realSearch.state,
    //           cycle: this.realSearch.cycle
    //         })
    //         this.hideDialog()
    //       } else {
    //         // 重新选择了 维护表单
    //         this.goMatainPage('create')
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error)
    //     loading.close()
    //   }
    // },
    // handleDelEdit() {
    //   this.dialogForm.table_name = ''
    //   this.dialogForm.table_id = ''
    //   this.dialogForm.isEdit = false
    // },
    // showDialog() {
    //   this.dialogTableVisible = true
    // },
    // hideDialog() {
    //   this.dialogTableVisible = false
    // },
    // handleClose() {
    //   this.dialogForm = { // 弹窗中的表单
    //     id: '', // 编辑时的id
    //     egi_person: '',
    //     egi_time: '',
    //     egi_result: '',
    //     table_id: '',
    //     table_name: '',
    //     isEdit: false
    //   }
    // },
    handleExport() {
      if (this.tableData.length < 1) {
        return
      }
      const mode = config.mode
      let requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      requestUrl += 'admin/assetEgiPeriod?target=list&export=1'
      for (const k in this.realSearch) {
        if (this.realSearch[k] || this.realSearch[k] === 0) {
          requestUrl += `&${k}=${Array.isArray(this.realSearch[k]) ? this.realSearch[k].join() : this.realSearch[k]}`
        }
      }
      window.location.href = requestUrl
      // window.open(requestUrl)
    },
    goDetailPage(row) {
      this.dialogInfo = {
        visible: true,
        eqId: row.id,
        type: row.equipment_id + '' + row.type
        // eqType: this.info.equipment,
        // eqNum: row.asset_code,
        // eqName: row.asset_name
      }
    },
    // goMatainPage(type) {
    //   if (type === 'edit') {
    //     this.$router.push({
    //       name: 'MaintainRecord',
    //       query: {
    //         rid: this.dialogForm.id,
    //         tid: this.dialogForm.table_id,
    //         is_e: '1'
    //       }
    //     })
    //   } else {
    //     this.$router.push({
    //       name: 'MaintainRecord',
    //       query: {
    //         rid: this.dialogForm.id,
    //         tid: this.dialogForm.table_id
    //       }
    //     })
    //   }
    // },
    getMaintainOptions() {
      if (this.$store.state.form.maintainSelect.length < 1) {
        this.$store.dispatch('form/setMaintainSelect').then(() => {
          this.maintainOptions = this.$store.state.form.maintainSelect
        })
      } else {
        this.maintainOptions = this.$store.state.form.maintainSelect
      }
    },
    getPipeOptions() {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          const pipeOptions = this.$store.state.form.belongPipe
          this.getEquipmentOptions(pipeOptions[0].id)
        })
      } else {
        const pipeOptions = this.$store.state.form.belongPipe
        this.getEquipmentOptions(pipeOptions[0].id)
      }
    },
    async getEquipmentOptions(id) {
      try {
        const { code, data } = await getAssetTypeState({
          id
        })
        if (code === 200) {
          this.eTypeOptions = data || []
        }
      } catch (error) {
        //
      }
    },
    getSateName(row) {
      let name = ''
      for (let i = 0; i < this.stateOptions.length; i++) {
        if (this.stateOptions[i].id === String(row.state)) {
          name = this.stateOptions[i].label
          break
        }
      }
      return name
    },
    formatterCycle(row, column, cellValue) {
      let name = ''
      for (let i = 0; i < this.cycleOptions.length; i++) {
        if (this.cycleOptions[i].id === String(cellValue)) {
          name = this.cycleOptions[i].label
          break
        }
      }
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.name {
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.icon {
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
}
.el-icon-delete {
  color:#F56C6C;
  &:hover {
    color: #ec1616;
  }
}
.el-icon-edit {
  color: #409eff;
  &:hover {
    color: #0565c5;
  }
}
.order-state {
  color: #F56C6C;
  &.done {
    color: #67C23A;
  }
}
</style>
