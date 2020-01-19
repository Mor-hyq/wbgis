<template>
  <div>
    <!-- <TopLabel :label="$route.meta.title" /> -->
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
          <el-form-item prop="name" :label="mylang.accidentName">
            <el-input v-model="searchForm.name" clearable :placeholder="`请输入${mylang.accidentName}`" />
          </el-form-item>
          <el-form-item prop="type" :label="mylang.accidentType">
            <el-select v-model="searchForm.type" clearable :placeholder="`请选择${mylang.accidentType}`">
              <el-option
                v-for="type in typeOptions"
                :key="type.id"
                :value="type.id"
                :label="type.type"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="level" :label="mylang.accidentLevel">
            <el-select v-model="searchForm.level" clearable :placeholder="`请选择${mylang.accidentLevel}`">
              <el-option
                v-for="level in levelOptions"
                :key="level.id"
                :value="level.id"
                :label="level.level"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="goCreatePage">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="goEditPage(false)">{{ mylang.modify }}</el-button>
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
          prop="accident_name"
          show-overflow-tooltip
          :label="mylang.accidentName"
        />
        <el-table-column
          align="center"
          prop="type"
          show-overflow-tooltip
          :label="mylang.accidentType"
        />
        <el-table-column
          align="center"
          prop="level"
          show-overflow-tooltip
          :label="mylang.accidentLevel"
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
            >{{ mylang.detail }}</el-button>
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
  </div>
</template>

<script>
import { getPlanList, deletePlan } from '@/api/emergency'
// import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'PlansIndex',
  //   mixins: [deleteCache],
  data() {
    return {
      searchForm: {
        name: '',
        type: '',
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
      levelOptions: [],
      typeOptions: []
    }
  },
  created() {
    this.getLevelOptions()
    this.getTypeOptions()
    this.initTableData()
    // this.$_deleteOtherView()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      name = '',
      type = '',
      level = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, name, type, level })
    },
    async getList({
      name = '',
      type = '',
      level = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getPlanList({
          page, paginate, name, type, level
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
        name: search.name,
        type: search.type,
        level: search.level
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        name: data.name,
        type: data.type,
        level: data.level
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goCreatePage() {
      this.$router.push({
        name: 'PlansCreate'
      })
    },
    goEditPage(row) {
      if (row) {
        this.$router.push({
          name: 'PlansEdit',
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
            name: 'PlansEdit',
            query: {
              id: this.chooseDelArr[0].id
            }
          })
        }
      }
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'PlansDetail',
        query: {
          id: row.id
        }
      })
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.emergencyPlan + '，确认吗？', '删除' + this.mylang.emergencyPlan, {
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
      this.$confirm('即将删除您选中的' + this.mylang.emergencyPlan + '，确认吗？', '删除' + this.mylang.emergencyPlan, {
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
        const { code } = await deletePlan({ delete_ids })
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
            name: this.realSearch.name,
            type: this.realSearch.type,
            level: this.level
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    getTypeOptions() {
      if (this.$store.state.form.accidentType.length < 1) {
        this.$store.dispatch('form/setAccidentType').then(() => {
          this.typeOptions = this.$store.state.form.accidentType
        })
      } else {
        this.typeOptions = this.$store.state.form.accidentType
      }
    },
    getLevelOptions() {
      if (this.$store.state.form.accidentLevel.length < 1) {
        this.$store.dispatch('form/setAccidentLevel').then(() => {
          this.levelOptions = this.$store.state.form.accidentLevel
        })
      } else {
        this.levelOptions = this.$store.state.form.accidentLevel
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
