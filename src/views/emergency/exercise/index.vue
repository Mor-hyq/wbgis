<template>
  <div>
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
          <el-form-item prop="name" :label="mylang.exerciseName">
            <el-input v-model="searchForm.name" :placeholder="`请输入${mylang.exerciseName}`" clearable />
          </el-form-item>
          <el-form-item prop="company" :label="mylang.belongCompany">
            <el-input v-model="searchForm.company" :placeholder="`请输入${mylang.belongCompany}`" clearable />
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
        ref="tables"
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
          prop="order"
          show-overflow-tooltip
          :label="mylang.planNumber"
        />
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          :label="mylang.exerciseName"
        />
        <el-table-column
          align="center"
          prop="company"
          :label="mylang.belongCompany"
        />
        <el-table-column
          :label="mylang.actions"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              :size="$btnSize"
              type="success"
              @click="goDetailPage(scope.row)"
            >{{ mylang.planDetail }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <exercise-dialog-form ref="dialogForm" @confirm="dialogConfirm" />
  </div>
</template>

<script>
import ExerciseDialogForm from './components/ExerciseDialogForm'
import { getExerciseList, deleteExercise } from '@/api/emergency'

export default {
  name: 'Exercise',
  components: {
    ExerciseDialogForm
  },
  data() {
    return {
      searchForm: {
        name: '',
        company: ''
      },
      realSearch: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      chooseDelArr: [],
      tableData: []
    }
  },
  created() {
    this.initTableData()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      name = '',
      company = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, name, company })
    },
    async getList({
      company = '',
      name = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getExerciseList({
          page, paginate, company, name
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
        company: search.company,
        name: search.name
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        company: data.search.company,
        name: data.name
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'ExerciseDetail',
        query: {
          id: row.id
        }
      })
    },
    handleCreate() {
      this.$refs.dialogForm.show({
        dialogTitle: `${this.mylang.add}${this.mylang.exercisePlan}`
      })
    },
    handleEdit(row) {
      if (row) {
        this.$refs.dialogForm.show({
          dialogTitle: `${this.mylang.modify}${this.mylang.exercisePlan}`,
          disabled: true,
          editId: row.id,
          data: row
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
          this.$refs.dialogForm.show({
            dialogTitle: `${this.mylang.modify}${this.mylang.exercisePlan}`,
            disabled: true,
            editId: this.chooseDelArr[0].id,
            data: this.chooseDelArr[0]
          })
        }
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.exercisePlan + '，确认吗？', '删除' + this.mylang.exercisePlan, {
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
      this.$confirm('即将删除您选中的' + this.mylang.exercisePlan + '，确认吗？', '删除' + this.mylang.exercisePlan, {
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
        const { code } = await deleteExercise({ delete_ids })
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
            company: this.realSearch.company,
            name: this.realSearch.name
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    dialogConfirm() {
      this.getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        company: this.realSearch.company,
        name: this.realSearch.name
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
