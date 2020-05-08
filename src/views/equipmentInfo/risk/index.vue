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
          <el-form-item prop="name" label="风险名称">
            <el-input v-model="searchForm.name" :placeholder="`请输入风险名称`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
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
          prop="name"
          show-overflow-tooltip
          label="风险名称"
        />
        <el-table-column
          align="center"
          prop="level"
          label="风险等级"
        >
          <template slot-scope="scope">
            <span
              v-if="levelOptions.length > 0"
              :class="`risk${scope.row.level}`"
            >{{ filterRisk(scope.row.level) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          prop="mileage"
          :label="mylang.mileage"
        /> -->
        <el-table-column
          :label="mylang.actions"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="goDetailPage(scope.row)"
            >{{ mylang.detail }}</el-button>
            <el-button
              size="mini"
              type="primary"
              style="margin-top:5px;"
              @click="goManagePage(scope.row)"
            >风险路由管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <el-dialog :title="dialogTitle" custom-class="dialog-custom" :visible.sync="dialogTableVisible" @close="handleClose">
      <el-form
        ref="dialogForms"
        :model="dialogForm"
        :rules="dialogRule"
        label-suffix=":"
        label-width="90px"
        class="custom-class"
        :size="$btnSize"
      >
        <el-form-item prop="name" label="风险名称">
          <el-input v-model="dialogForm.name" clearable />
        </el-form-item>
        <el-form-item
          prop="level"
          label="风险等级"
        >
          <el-select
            v-model="dialogForm.level"
            clearable
            placeholder="请选择风险等级"
          >
            <el-option
              v-for="level in levelOptions"
              :key="level.id"
              :value="level.id"
              :label="level.level"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="mileage" :label="mylang.mileage">
          <el-input v-model="dialogForm.mileage" clearable />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRiskList,
  addRisk,
  editRisk,
  deleteRisk
} from '@/api/system'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'TunnelRiskRouter',
  mixins: [deleteCache],
  data() {
    return {
      searchForm: {
        name: ''
      },
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
        name: '',
        // mileage: '',
        level: ''
      },
      editId: '', // 编辑时的id
      dialogDisabled: false, // 编辑时禁止修改
      dialogRule: {
        level: [
          { required: true, message: `请选择风险等级` }
        ],
        name: [
          { required: true, message: `请输入风险名称` }
        ]
        // mileage: [
        //   { required: true, message: `请输入里程` }
        // ]
      },
      levelOptions: []
    }
  },
  created() {
    this.getLevelOptions()
    this.initTableData()
    this.$_deleteOtherView()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      name = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, name })
    },
    async getList({
      name = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getRiskList({
          page, paginate, name
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
        name: search.name
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        name: data.name
      })
    },
    getCurrentList() {
      this.getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        contact: this.realSearch.contact,
        name: this.realSearch.name
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    handleCreate() {
      this.dialogTitle = this.mylang.add + this.mylang.riskLine
      this.dialogDisabled = false
      this.editId = ''
      this.showDialog()
      if (this.$refs.dialogForms) {
        this.$refs.dialogForms.resetFields()
      }
      this.dialogForm.name = ''
      this.dialogForm.level = ''
      // this.dialogForm.mileage = ''
    },
    handleEdit(row) {
      // 编辑
      if (row) {
        this.dialogTitle = this.mylang.modify + this.mylang.riskLine
        this.dialogDisabled = true
        this.editId = row.id
        this.showDialog()
        this.dialogForm.name = row.name
        this.dialogForm.level = row.level
        // this.dialogForm.mileage = row.mileage
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
          this.dialogTitle = this.mylang.modify + this.mylang.riskLine
          this.dialogDisabled = true
          this.editId = slcrow.id
          this.showDialog()
          this.dialogForm.name = slcrow.name
          this.dialogForm.level = slcrow.level
          // this.dialogForm.mileage = slcrow.mileage
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
              this.editRisk()
            } else {
              // 如果dialogDisabled=false 则为新建
              this.addRisk()
            }
          })
        } else {
          return false
        }
      })
    },
    async addRisk() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addRisk(this.dialogForm)
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
    async editRisk() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editRisk({
          id: this.editId,
          ...this.dialogForm
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
      this.$confirm('即将删除您选中的' + this.mylang.riskLine + '，确认吗？', '删除' + this.mylang.riskLine, {
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
        const { code } = await deleteRisk({ ids })
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
    goDetailPage(row) {
      this.$router.push({
        name: 'TunnelRiskRouterDetail',
        params: {
          id: row.id
        }
      })
    },
    goManagePage(row) {
      this.$router.push({
        name: 'TunnelRiskRouterManage',
        params: {
          id: row.id
        }
      })
    },
    filterRisk(level) {
      const arr = this.levelOptions.filter(v => +v.id === +level)
      return arr.length > 0 ? arr[0].level : ''
    },
    getLevelOptions() {
      if (this.$store.state.form.riskLevelSelect.length < 1) {
        this.$store.dispatch('form/setRiskLevelSelect').then(() => {
          this.levelOptions = this.$store.state.form.riskLevelSelect
        })
      } else {
        this.levelOptions = this.$store.state.form.riskLevelSelect
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
