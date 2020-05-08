
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
          <el-form-item prop="level" :label="mylang.accidentLevel">
            <el-input v-model="searchForm.level" :placeholder="`请输入${mylang.accidentLevel}`" clearable />
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
          prop="id"
          :label="mylang.number"
        />
        <el-table-column
          align="center"
          prop="level"
          :label="mylang.accidentLevel"
        />
        <el-table-column
          :label="mylang.actions"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row)"
            >{{ mylang.modify }}</el-button>
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
        <el-form-item prop="level" :label="mylang.accidentLevel">
          <el-input v-model="dialogForm.level" clearable />
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
import {
  getAccidentLevelList,
  addAccidentLevel,
  editAccidentLevel,
  deleteAccidentLevel
} from '@/api/emergency'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'AccidentLevel',
  mixins: [deleteCache],
  data() {
    return {
      searchForm: {
        level: ''
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
        level: ''
      },
      editId: '', // 编辑时的id
      dialogDisabled: false, // 编辑时禁止修改
      dialogRule: {
        level: [
          { required: true, message: `请输入${this.mylang.accidentLevel}` }
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
      level = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, level })
    },
    async getList({
      level = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getAccidentLevelList({
          page, paginate, level
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
        level: search.level
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        level: data.level
      })
    },
    getCurrentList() {
      this.getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        level: this.realSearch.level
      })
      //   风险等级数据更新
      this.$store.dispatch('form/setRiskLevelSelect')
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    handleCreate() {
      this.dialogTitle = this.mylang.add + this.mylang.accidentLevel
      this.dialogDisabled = false
      this.editId = ''
      this.showDialog()
      if (this.$refs.dialogForms) {
        this.$refs.dialogForms.resetFields()
      }
      this.dialogForm.level = ''
    },
    handleEdit(row) {
      // 编辑
      if (row) {
        this.dialogTitle = this.mylang.modify + this.mylang.accidentLevel
        this.dialogDisabled = true
        this.editId = row.id
        this.showDialog()
        this.dialogForm.level = row.level
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
          this.dialogTitle = this.mylang.modify + this.mylang.accidentLevel
          this.dialogDisabled = true
          this.editId = slcrow.id
          this.showDialog()
          this.dialogForm.level = slcrow.level
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
              this.editAccidentLevel()
            } else {
              // 如果dialogDisabled=false 则为新建
              this.addAccidentLevel()
            }
          })
        } else {
          return false
        }
      })
    },
    async addAccidentLevel() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addAccidentLevel(this.dialogForm)
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
    async editAccidentLevel() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editAccidentLevel({
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
      this.$confirm('即将删除您选中的' + this.mylang.accidentLevel + '，确认吗？', '删除' + this.mylang.accidentLevel, {
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
        const { code } = await deleteAccidentLevel({ ids })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          // 重新获取当前页面数据
          this.getCurrentList()
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
