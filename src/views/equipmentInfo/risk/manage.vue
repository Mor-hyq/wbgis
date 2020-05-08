<template>
  <div>
    <go-back />
    <my-table
      ref="mytable"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      :style="{'padding-top': '15px'}"
      @handlePageChange="handleChange"
    >
      <div style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="handleCreate">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="handleEdit(false)">{{ mylang.modify }}</el-button>
        <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
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
          prop="lng"
          :label="mylang.lng"
        />
        <el-table-column
          align="center"
          prop="lat"
          :label="mylang.lat"
        />
        <el-table-column
          align="center"
          prop="sort"
          :label="mylang.sort"
        />
        <el-table-column
          :label="mylang.sort + mylang.actions"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <div class="up-down" :title="mylang.goUp + mylang.sort" @click="handleSort(scope.row, 1)"><i class="el-icon-top" /></div>
            <div v-if="+scope.row.sort > 0" class="up-down" :title="mylang.goDown + mylang.sort" @click="handleSort(scope.row, -1)"><i class="el-icon-bottom" /></div>
          </template>
        </el-table-column>
        <el-table-column
          :label="mylang.actions"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
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
    <el-dialog
      :title="dialogTitle"
      custom-class="dialog-custom"
      :visible.sync="dialogTableVisible"
      @close="handleClose"
    >
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
          prop="lng_lat"
          :label="`${mylang.lnglat}`"
        >
          <el-input v-model="dialogForm.lng_lat" clearable @focus="showMap">
            <i slot="suffix" style="font-size:22px;color:#f56c6c;" class="el-input__icon el-icon-location" />
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="mylang.modify+mylang.sort"
      :visible.sync="dialogFormVisible"
      @close="handleClose"
    >
      <el-form
        ref="dialogSortForm"
        :size="$btnSize"
        inline
        :model="dialogSortForm"
        :rules="dialogSortRule"
        label-suffix=":"
      >
        <el-form-item prop="sort" label="排序调整至">
          <el-input v-model="dialogSortForm.sort" type="number" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideSortDialog">{{ mylang.cancel }}</el-button>
        <el-button type="primary" @click="confirmSortDialog">{{ mylang.confirm }}</el-button>
      </div>
    </el-dialog>
    <GetLngLat ref="getmap" :lnglat-pro="dialogForm.lng_lat" @confirm="getLT" />

  </div>
</template>

<script>
import {
  getRiskRouteList,
  addRiskRoute,
  editRiskRoute,
  deleteRiskRoute
  // getRiskRouteDetail
} from '@/api/system'
import GetLngLat from '@/components/GetLngLat'

export default {
  name: 'TunnelRiskRouterManage',
  components: {
    GetLngLat
  },
  data() {
    return {
      id: this.$route.params.id || '',
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      chooseDelArr: [],
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogTitle: '',
      dialogForm: { // 弹窗中的表单
        lng_lat: ''
      },
      dialogSortForm: { // 排序弹窗表单
        sort: ''
      },

      editId: '', // 编辑时的id
      dialogDisabled: false, // 编辑时禁止修改
      dialogRule: {
        lng_lat: [
          { required: true, message: `请选择${this.mylang.lnglat}` }
        ]
      },
      dialogSortRule: {
        sort: [
          { required: true, message: `请填写${this.mylang.sort}` }
        ]
      },
      levelOptions: this.$store.state.form.riskLevelSelect
    }
  },
  created() {
    this.initTableData()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate })
    },
    async getList({
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getRiskRouteList({
          page, paginate,
          risk_id: this.id
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
      this.initTableData()
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit
      })
    },
    getCurrentList() {
      this.getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    handleCreate() {
      this.dialogTitle = this.mylang.add + this.mylang.riskRoute
      this.dialogDisabled = false
      this.editId = ''
      this.showDialog()
      if (this.$refs.dialogForms) {
        this.$refs.dialogForms.resetFields()
      }
      this.dialogForm.lng_lat = ''
    },
    handleEdit(row) {
      // 编辑
      if (row) {
        this.dialogTitle = this.mylang.modify + this.mylang.riskRoute
        this.dialogDisabled = true
        this.editId = row.id
        this.showDialog()
        this.dialogForm.lng_lat = row.lng + ',' + row.lat
        this.dialogForm.sort = row.sort
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
          const slcrow = this.chooseDelArr[0]
          this.dialogTitle = this.mylang.modify + this.mylang.riskRoute
          this.dialogDisabled = true
          this.editId = slcrow.id
          this.showDialog()
          this.dialogForm.lng_lat = slcrow.lng + ',' + slcrow.lat
          this.dialogForm.sort = slcrow.sort
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
            // 如果dialogDisabled=true 则为编辑
            if (this.dialogDisabled) {
              this.editRiskRoute()
            } else {
              // 如果dialogDisabled=false 则为新建
              this.addRiskRoute()
            }
          })
        } else {
          return false
        }
      })
    },
    async addRiskRoute() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const lngLat = this.dialogForm.lng_lat.split(',')
      try {
        const { code } = await addRiskRoute({
          risk_id: this.id,
          lng: lngLat[0],
          lat: lngLat[1]
        })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.getCurrentList()
          this.hideDialog()
        }
      } catch (error) {
        loading.close()
      }
    },
    async editRiskRoute() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const lngLat = this.dialogForm.lng_lat.split(',')
      try {
        const { code } = await editRiskRoute({
          risk_id: this.id,
          id: this.editId,
          lng: lngLat[0],
          lat: lngLat[1],
          sort: this.dialogForm.sort
        })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.hideDialog()
          this.getCurrentList()
        }
      } catch (error) {
        loading.close()
      }
    },
    handleDelete() {
      if (this.chooseDelArr.length === 0) {
        this.$message({
          type: 'warning',
          message: '未选择任何需要删除的选项'
        })
        return false
      }
      this.$confirm('即将删除您选中的' + this.mylang.riskRoute + '，确认吗？', '删除' + this.mylang.riskRoute, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.chooseDelArr.map(v => v.id).join(',')
        this.deleteData({ ids: ids })
      })
    },
    async deleteData({ ids } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await deleteRiskRoute({ ids })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          // 重新获取当前页面数据
          this.getCurrentList()
          // 更新单位下拉列表
        }
      } catch (error) {
        loading.close()
      }
    },
    confirmSortDialog() {
      // 提交确认
      this.$refs.dialogSortForm.validate((valid) => {
        if (valid) {
          this.$confirm('确定修改排序吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updatePipeSort({
              id: this.editId,
              sort: this.dialogSortForm.sort,
              lng: this.dialogSortForm.lng,
              lat: this.dialogSortForm.lat
            }, true)
          })
        } else {
          return false
        }
      })
    },
    handleSort(row, direct) {
      const direction = direct > 0 ? this.mylang.goUp : this.mylang.goDown
      this.$confirm('确定要' + direction + '排序吗？', '排序', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sort = +row.sort + direct
        this.updatePipeSort({
          id: row.id,
          sort,
          lng: row.lng,
          lat: row.lat
        })
      })
    },
    async updatePipeSort({ id, sort, lng, lat } = {}, isDialog) {
      try {
        const { code } = await editRiskRoute({
          id,
          sort,
          lng,
          lat,
          risk_id: this.id
        })
        if (code === 200) {
          // 重新获取当前页面数据
          this.getCurrentList()
          if (isDialog) {
            this.hideSortDialog()
          }
        }
      } catch (error) {
        console.log(error)
        //
      }
    },
    showSortDialog() {
      this.dialogFormVisible = true
    },
    hideSortDialog() {
      this.dialogFormVisible = false
    },
    handleSortShow(row) {
      this.editId = row.id
      this.dialogSortForm = { ...row }
      this.showSortDialog()
    },
    showMap() {
      this.$refs.getmap.showMap()
    },
    getLT(data) {
      this.dialogForm.lng_lat = `${data.lngLat.lng},${data.lngLat.lat}`
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
