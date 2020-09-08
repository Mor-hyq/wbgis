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
          <el-form-item prop="subject" :label="mylang.exerciseSubject">
            <el-input v-model="searchForm.subject" :placeholder="`请输入${mylang.exerciseSubject}`" clearable />
          </el-form-item>
          <el-form-item prop="state" :label="mylang.planState">
            <el-select v-model="searchForm.state" :placeholder="mylang.planState" clearable>
              <el-option
                v-for="type in stateOptions"
                :key="type.id"
                :value="type.id"
                :label="type.state"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="time" :label="mylang.exerciseTime">
            <el-date-picker
              v-model="searchForm.time"
              type="date"
              :placeholder="mylang.exerciseTime"
              clearable
            />
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
          :label="mylang.number"
        />
        <el-table-column
          align="center"
          prop="state"
          :label="mylang.planState"
        />
        <el-table-column
          align="center"
          prop="subject"
          :label="mylang.exerciseSubject"
        />
        <el-table-column
          align="center"
          prop="method"
          show-overflow-tooltip
          :label="mylang.exerciseMethod"
        />
        <el-table-column
          align="center"
          prop="time"
          :label="`${mylang.actual}${mylang.exerciseTime}`"
        />
        <el-table-column
          align="center"
          prop="remark"
          show-overflow-tooltip
          :label="mylang.remark"
        >
          <template slot-scope="scope">{{ scope.row.remark || '无' }}</template>
        </el-table-column>
      </el-table>
    </my-table>
    <exercise-plan-dialog-form ref="dialogForm" @confirm="dialogConfirm" />
  </div>
</template>

<script>
import ExercisePlanDialogForm from './components/ExercisePlanDialog'
import { getExercisePlanList, deleteExercisePlan } from '@/api/emergency'

export default {
  name: 'ExerciseDetail',
  components: {
    ExercisePlanDialogForm
  },
  data() {
    return {
      id: this.$route.query.id || '',
      searchForm: {
        state: '',
        subject: '',
        time: ''
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
      stateOptions: []
    }
  },
  created() {
    this.getStateOptions()
    this.initTableData()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      state = '',
      subject = '',
      time = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, state, subject, time })
    },
    async getList({
      emerge_drill_id = this.id,
      state = '',
      subject = '',
      time = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getExercisePlanList({
          page, paginate, state, subject, time, emerge_drill_id
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
        state: search.state,
        subject: search.subject,
        time: search.time
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        subject: data.search.subject,
        state: data.state,
        time: data.time
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    handleCreate() {
      // 新增
      this.$refs.dialogForm.show({
        dialogTitle: `${this.mylang.add}${this.mylang.exercisePlan}`
      })
    },
    handleEdit(row) {
      if (row) {
        // 修改
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
        const { code } = await deleteExercisePlan({ delete_ids })
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
            subject: this.realSearch.subject,
            state: this.realSearch.state,
            time: this.realSearch.time
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
        subject: this.realSearch.subject,
        state: this.realSearch.state,
        time: this.realSearch.time
      })
    },
    getStateOptions() {
      if (this.$store.state.form.exercisePlanState.length < 1) {
        this.$store.dispatch('form/setExercisePlanState').then(() => {
          this.stateOptions = this.$store.state.form.exercisePlanState
        })
      } else {
        this.stateOptions = this.$store.state.form.exercisePlanState
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
