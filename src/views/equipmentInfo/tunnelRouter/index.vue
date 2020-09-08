<template>
  <div>
    <TopLabel :label="$route.meta.title" />
    <my-table
      ref="mytable"
      :search-data.sync="searchForm"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      :style="{'padding-top': '15px'}"
      @handlePageChange="handleChange"
    >
      <template slot="search">
        <el-form ref="searchForm" :model="searchForm" :size="$btnSize" inline>
          <el-form-item prop="name" :label="mylang.pipeName">
            <el-input v-model="searchForm.name" :placeholder="`请输入${mylang.pipeName}`" clearable />
          </el-form-item>
          <el-form-item prop="state" :label="mylang.workState">
            <el-select v-model="searchForm.state" placeholder="所有" clearable>
              <el-option
                v-for="option in stateOptions"
                :key="option.id"
                :label="option.state"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="order" :label="mylang.pipeNumber">
            <el-input v-model="searchForm.order" :placeholder="`请输入${mylang.pipeNumber}`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="goCreatePage">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="goEditPage(false)">{{ mylang.modify }}</el-button>
        <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
        <el-button type="primary" :size="$btnSize" plain @click="handleExport">{{ mylang.export }}</el-button>
        <el-button type="primary" :size="$btnSize" plain @click="showImport">{{ mylang.import }}</el-button>
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
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          prop="pipe_name"
          show-overflow-tooltip
          :label="mylang.pipeName"
        />
        <el-table-column
          align="center"
          prop="order"
          show-overflow-tooltip
          :label="mylang.routeNumber"
        />
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          :label="mylang.routeName"
        />
        <el-table-column
          align="center"
          prop="mileage"
          :label="`${mylang.mileage}(m)`"
        />
        <el-table-column
          align="center"
          prop="latitude_longtitude"
          show-overflow-tooltip
          :label="`${mylang.lnglat}(°)`"
        />
        <el-table-column
          align="center"
          prop="ground_elevation"
          :label="`${mylang.groundElevation}(m)`"
        />
        <el-table-column
          align="center"
          prop="pipe_depth"
          :label="`${mylang.pipeDepth}(m)`"
        />
        <el-table-column
          align="center"
          prop="turn_angle"
          show-overflow-tooltip
          :label="`${mylang.turnAngle}(°)`"
        />
        <el-table-column
          align="center"
          prop="location"
          show-overflow-tooltip
          :label="`${mylang.location}`"
        />
        <el-table-column
          align="center"
          prop="region"
          show-overflow-tooltip
          :label="`${mylang.region}`"
        />
        <el-table-column
          align="center"
          prop="date"
          show-overflow-tooltip
          :label="`${mylang.measureDate}`"
        />
        <el-table-column
          align="center"
          prop="sort"
          :label="`${mylang.sort}`"
        />
        <el-table-column
          :label="mylang.sort + mylang.actions"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <div v-if="+scope.row.sort > 1" class="up-down" :title="mylang.goUp" @click="handleSort(scope.row, -1)"><i class="el-icon-top" /></div>
            <div class="up-down" :title="mylang.goDown" @click="handleSort(scope.row, 1)"><i class="el-icon-bottom" /></div>
          </template>
        </el-table-column>
        <el-table-column
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
              :size="$btnSize"
              type="primary"
              style="margin-top:5px;"
              @click="handleSortShow(scope.row)"
            >{{ mylang.sort }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <el-dialog :title="mylang.modify+mylang.sort" :visible.sync="dialogFormVisible">
      <el-form ref="dialogForm" :size="$btnSize" inline :model="dialogForm" :rules="dialogRule" label-suffix=":">
        <el-form-item prop="sort" label="排序调整至">
          <el-input v-model="dialogForm.sort" type="number" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
        <el-button type="primary" @click="confirmDialog">{{ mylang.confirm }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="exportVisible"
      title="批量导入"
    >
      <import-file
        ref="importFile"
        style="width:450px;"
        :is-show-code-error="importOptions.isShowCodeError"
        :export-tips="importOptions.exportTips"
        :upload-field="importOptions.uploadField"
        :down-file-url="importOptions.downFileUrl"
        :upload-func="importOptions.uploadFunc"
        :is-disabled.sync="importOptions.exportDisabled"
        :accept="importOptions.accept"
        @success="importSuccess"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideImport">取 消</el-button>
        <el-button type="primary" :disabled="importOptions.exportDisabled" @click="bulkImport">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPipeRouteList, deletePipeRoute, updatePipeSort, importPipeRoute } from '@/api/equipmentInfo'
import deleteCache from '@/mixins/deleteCache'
import config from '@/config'
import ImportFile from '@/components/ImportFile'

export default {
  name: 'TunnelRouter',
  components: {
    ImportFile
  },
  mixins: [deleteCache],
  data() {
    const mode = config.mode
    const requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
    return {
      searchForm: {
        order: '',
        name: '',
        state: ''
      },
      pipeOptions: [],
      stateOptions: [],
      realSearch: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      chooseDelArr: [],
      tableData: [],
      dialogFormVisible: false,
      dialogForm: {
        sort: ''
      },
      dialogRule: {
        sort: [
          { required: true, message: `请输入排序顺序` }
        ]
      },
      sortId: '',
      exportVisible: false,
      importOptions: {
        isShowCodeError: true,
        exportTips: '批量导入模板',
        uploadField: 'file',
        downFileUrl: requestUrl + 'admin/route?target=downloadExample',
        uploadFunc: importPipeRoute, // 导入发布对象的函数
        exportDisabled: false, // 文件是否禁止上传
        accept: ['.xls', '.xlsx']
      }
    }
  },
  created() {
    this.getStateOptions()
    this.initTableData()
    this.$_deleteOtherView()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      name = '',
      order = '',
      state = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, name, order, state })
    },
    async getList({
      name = '',
      order = '',
      state = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getPipeRouteList({
          page, paginate, name, order, state
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
    getStateOptions() {
      if (this.$store.state.form.workState.length < 1) {
        this.$store.dispatch('form/setWorkState').then(() => {
          this.stateOptions = this.$store.state.form.workState
        })
      } else {
        this.stateOptions = this.$store.state.form.workState
      }
    },
    handleSearch() {
      // 搜索
      const search = this.$refs.mytable.handleSearch()
      this.realSearch = search
      this.initTableData({
        name: search.name,
        order: search.order,
        state: search.state
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        name: data.search.name,
        order: data.search.order,
        state: data.state
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'TunnelRouterDetail',
        query: {
          id: row.id
        }
      })
    },
    goCreatePage() {
      this.$router.push({
        name: 'TunnelRouterCreate'
      })
    },
    goEditPage(row) {
      if (row) {
        this.$router.push({
          name: 'TunnelRouterEdit',
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
            name: 'TunnelRouterEdit',
            query: {
              id: this.chooseDelArr[0].id
            }
          })
        }
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.pipeRouteInfo + '，确认吗？', '删除' + this.mylang.pipeRouteInfo, {
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
      this.$confirm('即将删除您选中的' + this.mylang.pipeRouteInfo + '，确认吗？', '删除' + this.mylang.pipeRouteInfo, {
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
        const { code } = await deletePipeRoute({ delete_ids })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: this.mylang.delete + '成功'
          })
          // 重新获取当前页面数据
          this.getList({
            page: this.listQuery.page,
            pageSize: this.listQuery.limit,
            name: this.realSearch.name,
            order: this.realSearch.order,
            state: this.realSearch.state
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    hideDialog() {
      this.dialogFormVisible = false
    },
    showDialog() {
      this.dialogFormVisible = true
    },
    handleSortShow(row) {
      this.sortId = row.id
      this.showDialog()
    },
    confirmDialog() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定要提交修改吗？', `${this.mylang.modify}${this.mylang.sort}`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updatePipeSort({
              id: this.sortId,
              sort: this.dialogForm.sort
            }, true)
          })
        }
      })
    },
    handleSort(row, direct) {
      const direction = direct > 0 ? '下移' : '上移'
      this.$confirm('确定要' + direction + '管道吗？', '移动管道', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sort = +row.sort + direct
        this.updatePipeSort({
          id: row.id,
          sort
        })
      })
    },
    async updatePipeSort({ id, sort } = {}, isDialog) {
      try {
        const { code } = await updatePipeSort({
          id,
          sort
        })
        if (code === 200) {
          // 重新获取当前页面数据
          this.getList({
            page: this.listQuery.page,
            pageSize: this.listQuery.limit,
            name: this.realSearch.name,
            order: this.realSearch.order,
            state: this.realSearch.state
          })
          if (isDialog) {
            this.hideDialog()
            this.sortId = ''
          }
        }
      } catch (error) {
        console.log(error)
        //
      }
    },
    handleExport() {
      if (this.tableData.length < 1) {
        return
      }
      const mode = config.mode
      let requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      requestUrl += 'admin/route?target=list&export=1'
      for (const k in this.realSearch) {
        if (this.realSearch[k] || this.realSearch[k] === 0) {
          requestUrl += `&${k}=${this.realSearch[k]}`
        }
      }
      window.location.href = requestUrl
    },
    bulkImport() {
      // 批量导入发布会员信息
      this.$refs.importFile.submit()
    },
    showImport() {
      this.exportVisible = true
    },
    hideImport() {
      this.exportVisible = false
      this.$refs.importFile.resetForm()
    },
    importSuccess() {
      this.hideImport()
      // 重新获取当前页面数据
      this.getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        name: this.realSearch.name,
        order: this.realSearch.order,
        state: this.realSearch.state
      })
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
.up-down {
  display: inline-block;
  line-height: 1;
  padding: 5px;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #DCDFE6;
  transition: .1s;
  font-size: 12px;
  border-radius: 3px;
  color: #409EFF;
  background: #ecf5ff;
  border-color: #b3d8ff;
  &:hover {
    background: #409EFF;
    border-color: #409EFF;
    color: #FFF;
  }
}
</style>
