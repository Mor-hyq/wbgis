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
        <el-form ref="searchForm" :model="searchForm" :size="$btnSize" inline>
          <el-form-item prop="pipe_name" :label="mylang.pipeName">
            <el-input v-model="searchForm.pipe_name" :placeholder="`请输入${mylang.pipeName}`" clearable />
          </el-form-item>
          <!-- <el-form-item prop="pipe_name" :label="mylang.pipeName">
            <el-select
              v-model="searchForm.pipe_name"
              clearable
              filterable
            >
              <el-option
                v-for="pipe in pipeOptions"
                :key="pipe.name"
                :value="pipe.name"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item> -->
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
          <el-form-item prop="egi_person" :label="mylang.maintainStaff">
            <el-input v-model="searchForm.egi_person" :placeholder="`请输入${mylang.maintainStaff}`" clearable />
          </el-form-item>
          <el-form-item prop="egi" :label="mylang.maintainRequirement">
            <el-input v-model="searchForm.egi" :placeholder="`请输入${mylang.maintainRequirement}`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div v-if="!isComponent" style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="goCreatePage">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="goEditPage(false)">{{ mylang.modify }}</el-button>
        <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
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
          prop="pipe_name"
          :label="mylang.pipeName"
        />
        <el-table-column
          align="center"
          prop="equipment_name"
          show-overflow-tooltip
          :label="mylang.equipmentType"
        />
        <!-- <el-table-column
          align="center"
          prop="asset_name"
          show-overflow-tooltip
          :label="mylang.equipmentName"
        /> -->
        <el-table-column
          align="center"
          prop="egi_cycle"
          show-overflow-tooltip
          :label="`${mylang.maintainCycle}(天)`"
        />
        <el-table-column
          align="center"
          prop="next_egi_time"
          show-overflow-tooltip
          :label="`下次${mylang.maintainDate}`"
        />
        <el-table-column
          align="center"
          prop="notify_person"
          :label="mylang.noticeStaff"
        />
        <el-table-column
          align="center"
          prop="phone"
          :label="mylang.contact"
        />
        <el-table-column
          align="center"
          prop="create_time"
          :label="mylang.createTime"
        />
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
          :label="mylang.actions"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              :size="$btnSize"
              type="success"
              @click="goDetailPage(scope.row)"
            >{{ mylang.detail }}</el-button>
            <el-button
              type="primary"
              :size="$btnSize"
              @click="handleMaintain(scope.row)"
            >维护登记</el-button>
            <!-- <el-button
              :size="$btnSize"
              type="primary"
              @click="goEditPage(scope.row)"
            >{{ mylang.modify }}</el-button> -->
            <!-- <el-button
              :size="$btnSize"
              type="danger"
              plain
              style="margin-top:5px;"
              @click="handleDeleteItem(scope.row)"
            >{{ mylang.delete }}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <el-dialog v-if="!isComponent" :title="dialogTitle" :visible.sync="dialogTableVisible" @close="handleClose">
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
          <el-select
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
    </el-dialog>
  </div>
</template>

<script>
import { getAssetEgiList, deleteAssetEgi, finishMaintain } from '@/api/inspection'
import config from '@/config'
export default {
  name: 'EquipmentMaintainIndex',
  props: {
    isComponent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {
        pipe_name: '',
        egi_person: '',
        egi: '',
        state: ''
      },
      pipeOptions: [],
      stateOptions: [{
        id: '0',
        // label: this.mylang.abnormal
        label: '待维护'
      }, {
        id: '1',
        // label: this.mylang.normal
        label: '已维护'
      }],
      realSearch: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      chooseDelArr: [],
      tableData: [],
      dialogTableVisible: false,
      dialogTitle: '',
      dialogForm: { // 弹窗中的表单
        egi_person: '',
        egi_time: '',
        egi_result: '',
        table_id: ''
      },
      editId: '', // 编辑时的id
      dialogRule: {
        egi_person: [
          { required: true, message: `请输入${this.mylang.maintainStaff}` }
        ],
        egi_time: [
          { required: true, message: `请选择${this.mylang.maintainDate}` }
        ],
        table_id: [
          { required: true, message: `请选择维护表单` }
        ]
      },
      maintainOptions: []
    }
  },
  created() {
    // if (!this.isComponent) {
    //   this.$_deleteOtherView()
    // }
    this.initTableData()
    if (!this.isComponent) {
      // this.getPipeOptions()
      this.getMaintainOptions()
    }
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      egi = '',
      egi_person = '',
      pipe_name = '',
      state = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, pipe_name, egi, state, egi_person })
    },
    async getList({
      egi = '',
      egi_person = '',
      pipe_name = '',
      state = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getAssetEgiList({
          page, paginate, egi, pipe_name, state, egi_person
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total
          this.tableData = data.data || []
        }
      } catch (error) {
        this.tableLoading = false
      }
    },
    handleSearch() {
      // 搜索
      const search = this.$refs.mytable.handleSearch()
      this.realSearch = search
      this.initTableData({
        egi: search.egi,
        egi_person: search.egi_person,
        pipe_name: search.pipe_name,
        state: search.state
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        egi: data.search.egi,
        egi_person: data.search.egi_person,
        pipe_name: data.search.pipe_name,
        state: data.state
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'MaintainDetail',
        query: {
          id: row.id
        }
      })
    },
    handleMaintain(row) {
      if (row) {
        // const slcrow = this.chooseDelArr[0]
        this.dialogTitle = this.mylang.finishMaintain
        this.editId = row.id
        this.showDialog()
        if (this.$refs.dialogForms) {
          this.$refs.dialogForms.resetFields()
        }
        this.dialogForm.egi_person = ''
        this.dialogForm.egi_time = ''
        this.dialogForm.egi_result = ''
        this.dialogForm.table_id = ''
      } else {
        if (this.chooseDelArr.length === 0) {
          this.$message({
            type: 'warning',
            message: '未选择任何需要维护的选项'
          })
        } else if (this.chooseDelArr.length > 1) {
          this.$message({
            type: 'warning',
            message: '维护项只能选择一个'
          })
        } else {
          const slcrow = this.chooseDelArr[0]
          this.dialogTitle = this.mylang.finishMaintain
          this.editId = slcrow.id
          this.showDialog()
          if (this.$refs.dialogForms) {
            this.$refs.dialogForms.resetFields()
          }
          this.dialogForm.egi_person = ''
          this.dialogForm.egi_time = ''
          this.dialogForm.egi_result = ''
          this.dialogForm.table_id = ''
        }
      }
    },
    showDialog() {
      this.dialogTableVisible = true
    },
    hideDialog() {
      this.dialogTableVisible = false
    },
    handleClose() {
      this.editId = ''
    },
    handleConfirm() {
      // 提交确认
      this.$refs.dialogForms.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.finishMaintain()
            // this.goCreateRecord()
          })
        } else {
          return false
        }
      })
    },
    async finishMaintain() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code, data } = await finishMaintain({
          id: this.editId,
          ...this.dialogForm
        })
        loading.close()
        if (code === 200) {
          // 重新获取当前页面数据
          // this.getList({
          //   page: this.listQuery.page,
          //   pageSize: this.listQuery.limit,
          //   egi: this.realSearch.egi,
          //   egi_person: this.realSearch.egi_person,
          //   pipe_name: this.realSearch.pipe_name,
          //   state: this.realSearch.state
          // })
          this.goCreateRecord({
            rid: data.egi_record_id,
            tid: this.dialogForm.table_id
          })
          this.hideDialog()
        }
      } catch (error) {
        console.log(error)
        loading.close()
      }
    },
    goCreatePage() {
      this.$router.push({
        name: 'MaintainCreate'
      })
    },
    goCreateRecord(data) {
      this.$router.push({
        name: 'MaintainRecord',
        query: {
          rid: data.rid,
          tid: data.tid
        }
      })
    },
    goEditPage(row) {
      if (row) {
        this.$router.push({
          name: 'MaintainEdit',
          query: {
            id: row.id
          }
        })
      } else {
        if (this.chooseDelArr.length === 0) {
          this.$message({
            type: 'warning',
            message: '未选择任何需要修改的选项'
          })
        } else if (this.chooseDelArr.length > 1) {
          this.$message({
            type: 'warning',
            message: '修改项只能选择一个'
          })
        } else {
          this.$router.push({
            name: 'MaintainEdit',
            query: {
              id: this.chooseDelArr[0].id
            }
          })
        }
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.maintainInfo + '，确认吗？', '删除' + this.mylang.maintainInfo, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData({ delete_ids: row.id })
      })
    },
    handleDelete() {
      if (this.chooseDelArr.length === 0) {
        this.$message({
          type: 'warning',
          message: '未选择任何需要删除的选项'
        })
        return false
      }
      this.$confirm('即将删除您选中的' + this.mylang.maintainInfo + '，确认吗？', '删除' + this.mylang.maintainInfo, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.chooseDelArr.map(v => v.id).join(',')
        this.deleteData({ delete_ids: ids })
      })
    },
    async deleteData({ delete_ids } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await deleteAssetEgi({ delete_ids })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          // 重新获取当前页面数据
          this.getList({
            page: this.listQuery.page,
            pageSize: this.listQuery.limit,
            egi: this.realSearch.egi,
            egi_person: this.realSearch.egi_person,
            pipe_name: this.realSearch.pipe_name,
            state: this.realSearch.state
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    handleExport() {
      const mode = config.mode
      let requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      requestUrl += 'admin/assetEgi?target=list&export=1'
      for (const k in this.realSearch) {
        if (this.realSearch[k] || this.realSearch[k] === 0) {
          requestUrl += `&${k}=${this.realSearch[k]}`
        }
      }
      window.location.href = requestUrl
      // window.open(requestUrl)
    },
    getSateName(row) {
      let name = ''
      switch (+row.state) {
        case 0:
          // name = '维护中'
          name = '待维护'
          break
        case 1:
          // name = '维护完成'
          name = '已维护'
          break
        default:
          break
      }
      return name
    },
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
          this.pipeOptions = this.$store.state.form.belongPipe
        })
      } else {
        this.pipeOptions = this.$store.state.form.belongPipe
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-state {
  color: #F56C6C;
  &.done {
    color: #67C23A;
  }
}
</style>
