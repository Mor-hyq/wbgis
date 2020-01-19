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
          <el-form-item prop="name" :label="mylang.unitName">
            <el-input v-model="searchForm.name" :placeholder="`请输入${mylang.unitName}`" clearable />
          </el-form-item>
          <el-form-item prop="contact" :label="mylang.contact">
            <el-input v-model="searchForm.contact" :placeholder="`请输入${mylang.contact}`" clearable />
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
          show-overflow-tooltip
          :label="mylang.unitCode"
        />
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          :label="mylang.unitName"
        />
        <el-table-column
          align="center"
          prop="addr"
          show-overflow-tooltip
          :label="mylang.address"
        />
        <el-table-column
          align="center"
          prop="contact"
          show-overflow-tooltip
          :label="mylang.contact"
        />
        <el-table-column
          align="center"
          prop="remark"
          show-overflow-tooltip
          :label="mylang.remark"
        >
          <template slot-scope="scope">{{ scope.row.remark || '无' }}</template>
        </el-table-column>
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
        <el-form-item
          prop="code"
          :label="mylang.unitCode"
        >
          <el-input v-model="dialogForm.code" :readonly="dialogDisabled" clearable />
        </el-form-item>
        <el-form-item
          prop="contact"
          :label="mylang.contact"
        >
          <el-input v-model="dialogForm.contact" clearable />
        </el-form-item>
        <el-form-item prop="name" :label="mylang.unitName">
          <el-input v-model="dialogForm.name" clearable />
        </el-form-item>
        <el-form-item prop="addr" :label="mylang.address">
          <el-input v-model="dialogForm.addr" clearable />
        </el-form-item>
        <el-form-item prop="remark" :label="mylang.remark">
          <el-input v-model="dialogForm.remark" type="textarea" :rows="5" />
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
import { getCompanyList, deleteCompany, addCompany, editCompany } from '@/api/system'
import deleteCache from '@/mixins/deleteCache'
import { validatePhone2Func } from '@/utils/validateFunc'

export default {
  name: 'Company',
  mixins: [deleteCache],
  data() {
    return {
      searchForm: {
        name: '',
        contact: ''
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
        contact: '',
        addr: '',
        remark: ''
      },
      editId: '', // 编辑时的id
      dialogDisabled: false, // 编辑时禁止修改
      dialogRule: {
        code: [
          { required: true, message: `请输入${this.mylang.unitCode}` }
        ],
        contact: [
          { required: true, validator: validatePhone2Func, tips: this.mylang.contact }
        ],
        name: [
          { required: true, message: `请输入${this.mylang.unitName}` }
        ],
        addr: [
          { required: true, message: `请输入${this.mylang.address}` }
        ]
      }
    }
  },
  created() {
    this.initTableData()
    this.$_deleteOtherView()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      contact = '',
      name = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, contact, name })
    },
    async getList({
      contact = '',
      name = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getCompanyList({
          page, paginate, contact, name
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
        contact: search.contact,
        name: search.name
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        contact: data.contact,
        name: data.name
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    handleCreate() {
      this.dialogTitle = this.mylang.add + this.mylang.company
      this.dialogDisabled = false
      this.editId = ''
      this.showDialog()
      if (this.$refs.dialogForms) {
        this.$refs.dialogForms.resetFields()
      }
      this.dialogForm.code = ''
      this.dialogForm.contact = ''
      this.dialogForm.name = ''
      this.dialogForm.addr = ''
      this.dialogForm.remark = ''
    },
    handleEdit(row) {
      // 编辑
      if (row) {
        this.dialogTitle = this.mylang.modify + this.mylang.company
        this.dialogDisabled = true
        this.editId = row.id
        this.showDialog()
        this.dialogForm.code = row.code
        this.dialogForm.contact = row.contact
        this.dialogForm.name = row.name
        this.dialogForm.addr = row.addr
        this.dialogForm.remark = row.remark
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
          this.dialogTitle = this.mylang.modify + this.mylang.company
          this.dialogDisabled = true
          this.editId = slcrow.id
          this.showDialog()
          this.dialogForm.code = slcrow.code
          this.dialogForm.contact = slcrow.contact
          this.dialogForm.name = slcrow.name
          this.dialogForm.addr = slcrow.addr
          this.dialogForm.remark = slcrow.remark
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
              this.editCompany()
            } else {
              // 如果dialogDisabled=false 则为新建
              this.addCompany()
            }
          })
        } else {
          return false
        }
      })
    },
    async addCompany() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addCompany(this.dialogForm)
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.getList({
            page: this.listQuery.page,
            pageSize: this.listQuery.limit,
            contact: this.realSearch.contact,
            name: this.realSearch.name
          })
          this.hideDialog()
          // 更新单位下拉列表
          this.$store.dispatch('form/setCompanySelect')
        }
      } catch (error) {
        loading.close()
      }
    },
    async editCompany() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editCompany({
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
          this.getList({
            page: this.listQuery.page,
            pageSize: this.listQuery.limit,
            contact: this.realSearch.contact,
            name: this.realSearch.name
          })
          // 更新单位下拉列表
          this.$store.dispatch('form/setCompanySelect')
        }
      } catch (error) {
        loading.close()
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.currentUnit + '，确认吗？', '删除' + this.mylang.currentUnit, {
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
      this.$confirm('即将删除您选中的' + this.mylang.currentUnit + '，确认吗？', '删除' + this.mylang.currentUnit, {
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
        const { code } = await deleteCompany({ ids })
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
            contact: this.realSearch.contact,
            name: this.realSearch.name
          })
          // 更新单位下拉列表
          this.$store.dispatch('form/setCompanySelect')
        }
      } catch (error) {
        loading.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
