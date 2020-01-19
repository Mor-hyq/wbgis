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
          <el-form-item prop="name" :label="mylang.departName">
            <el-input v-model="searchForm.name" :placeholder="`请输入${mylang.departName}`" clearable />
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
          prop="code"
          :label="mylang.departCode"
        />
        <el-table-column
          align="center"
          prop="company_name"
          show-overflow-tooltip
          :label="mylang.unitName"
        />
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          :label="mylang.departName"
        />
        <!-- <el-table-column
          :label="mylang.actions"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              :size="$btnSize"
              type="primary"
              @click="handleEdit(scope.row)"
            >{{ mylang.modify }}</el-button>
            <el-button
              :size="$btnSize"
              type="danger"
              plain
              style="margin-top:5px;"
              @click="handleDeleteItem(scope.row)"
            >{{ mylang.delete }}</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </my-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible" @close="handleClose">
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
          prop="code"
          :label="mylang.departCode"
        >
          <el-input v-model="dialogForm.code" :readonly="dialogDisabled" clearable />
        </el-form-item>
        <el-form-item
          prop="company_id"
          :label="mylang.unitName"
        >
          <el-select v-model="dialogForm.company_id" clearable>
            <el-option
              v-for="type in companyOptions"
              :key="type.id"
              :value="type.id"
              :label="type.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="name" :label="mylang.departName">
          <el-input v-model="dialogForm.name" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartMentList, deleteDepartMent, addDepartMent, editDepartMent } from '@/api/system'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'Department',
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
        code: '',
        name: '',
        company_id: ''
      },
      editId: '', // 编辑时的id
      dialogDisabled: false, // 编辑时禁止修改
      dialogRule: {
        code: [
          { required: true, message: `请输入${this.mylang.unitCode}` }
        ],
        name: [
          { required: true, message: `请输入${this.mylang.departName}` }
        ],
        company_id: [
          { required: true, message: `请选择${this.mylang.unitName}` }
        ]
      },
      companyOptions: []
    }
  },
  created() {
    this.getCompanyOptions()
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
        const { code, data } = await getDepartMentList({
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
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    handleCreate() {
      this.dialogTitle = this.mylang.add + this.mylang.department
      this.dialogDisabled = false
      this.editId = ''
      this.showDialog()
      if (this.$refs.dialogForms) {
        this.$refs.dialogForms.resetFields()
      }
      this.dialogForm.code = ''
      this.dialogForm.name = ''
      this.dialogForm.company_id = ''
    },
    handleEdit(row) {
      // 编辑
      if (row) {
        this.dialogTitle = this.mylang.modify + this.mylang.department
        this.dialogDisabled = true
        this.editId = row.id
        this.showDialog()
        this.dialogForm.code = row.code
        this.dialogForm.company_id = row.company_id
        this.dialogForm.name = row.name
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
          this.dialogTitle = this.mylang.modify + this.mylang.department
          this.dialogDisabled = true
          this.editId = slcrow.id
          this.showDialog()
          this.dialogForm.code = slcrow.code
          this.dialogForm.company_id = slcrow.company_id
          this.dialogForm.name = slcrow.name
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
              this.editDepartMent()
            } else {
              // 如果dialogDisabled=false 则为新建
              this.addDepartMent()
            }
          })
        } else {
          return false
        }
      })
    },
    async addDepartMent() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addDepartMent(this.dialogForm)
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.getList({
            page: this.listQuery.page,
            pageSize: this.listQuery.limit,
            name: this.realSearch.name
          })
          this.hideDialog()
        }
      } catch (error) {
        loading.close()
      }
    },
    async editDepartMent() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editDepartMent({
          id: this.editId,
          ...this.dialogForm
        })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.getList({
            page: this.listQuery.page,
            pageSize: this.listQuery.limit,
            name: this.realSearch.name
          })
          this.hideDialog()
        }
      } catch (error) {
        loading.close()
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.department + '，确认吗？', '删除' + this.mylang.department, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData({ ids: row.id })
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
      this.$confirm('即将删除您选中的' + this.mylang.department + '，确认吗？', '删除' + this.mylang.department, {
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
        const { code } = await deleteDepartMent({ ids })
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
            name: this.realSearch.name
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    getCompanyOptions() {
      if (this.$store.state.form.companySelect.length < 1) {
        this.$store.dispatch('form/setCompanySelect').then(() => {
          this.companyOptions = this.$store.state.form.companySelect
        })
      } else {
        this.companyOptions = this.$store.state.form.companySelect
      }
    }
  }
}
</script>

