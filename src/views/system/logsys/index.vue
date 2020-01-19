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
          <el-form-item prop="department_name" :label="mylang.departName">
            <el-input v-model="searchForm.department_name" :placeholder="`请输入${mylang.departName}`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        class="tableBox"
        tooltip-effect="dark"
      >
        <el-table-column
          align="center"
          prop="id"
          :label="mylang.orderNumber"
        />
        <el-table-column
          align="center"
          prop="username"
          show-overflow-tooltip
          :label="mylang.operator"
        />
        <el-table-column
          align="center"
          prop="department_name"
          :label="mylang.department"
        />
        <!-- <el-table-column
          align="center"
          prop=""
          :label="mylang.funcModule"
        /> -->
        <el-table-column
          align="center"
          prop="name"
          :label="mylang.operatorType"
        />
        <!-- <el-table-column
          align="center"
          prop=""
          :label="mylang.operatorResult"
        /> -->
        <!-- <el-table-column
          align="center"
          prop=""
          :label="mylang.operatorDate"
        /> -->
        <el-table-column
          align="center"
          prop="ip"
          show-overflow-tooltip
          :label="mylang.ip"
        />
        <!-- <el-table-column
          align="center"
          prop=""
          show-overflow-tooltip
          :label="mylang.failureCause"
        /> -->
      </el-table>
    </my-table>
  </div>
</template>

<script>
import { getLogList } from '@/api/system'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'Log',
  mixins: [deleteCache],
  data() {
    return {
      searchForm: {
        department_name: ''
      },
      stateOptions: [],
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
    this.getStateOptions()
    this.initTableData()
    this.$_deleteOtherView()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      department_name = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, department_name })
    },
    async getList({
      department_name = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getLogList({
          page, paginate, department_name
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
        department_name: search.department_name
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        department_name: data.search.department_name
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
