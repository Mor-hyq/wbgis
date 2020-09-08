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
          prop="order"
          show-overflow-tooltip
          :label="mylang.pipeNumber"
        />
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          :label="mylang.pipeName"
        />
        <el-table-column
          align="center"
          prop="length"
          :label="`${mylang.pipeLength}(m)`"
        />
        <el-table-column
          align="center"
          prop="diameter"
          :label="`${mylang.pipeDiameter}(mm)`"
        />
        <el-table-column
          align="center"
          prop="thick"
          :label="`${mylang.pipeThick}(mm)`"
        />
        <el-table-column
          align="center"
          prop="pressure"
          :label="`${mylang.designPressure}(Mpa)`"
        />
        <el-table-column
          align="center"
          prop="design_temp"
          :label="`${mylang.designTemp}(°)`"
        />
        <el-table-column
          align="center"
          prop="update_instruction"
          show-overflow-tooltip
          :label="`${mylang.updateIns}`"
        >
          <template slot-scope="scope">
            {{ scope.row.update_instruction || '无' }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="medium"
          show-overflow-tooltip
          :label="`${mylang.transMedia}`"
        />
        <el-table-column
          align="center"
          prop="material"
          show-overflow-tooltip
          :label="`${mylang.pipeMaterial}`"
        />
        <el-table-column
          align="center"
          prop="level"
          :label="`${mylang.pipeLevel}`"
        />
        <el-table-column
          align="center"
          prop="data_source"
          show-overflow-tooltip
          :label="`${mylang.dataSource}`"
        />
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
              v-if="scope.row.id == 22"
              :size="$btnSize"
              type="primary"
              style="margin-top:5px;"
              @click="goAssetPage(scope.row)"
            >{{ mylang.pipeEquipment }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
  </div>
</template>

<script>
import { getPipeList, deletePipe } from '@/api/equipmentInfo'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'TunnelInfo',
  mixins: [deleteCache],
  data() {
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
        const { code, data } = await getPipeList({
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
        name: 'TunnelInfoDetail',
        query: {
          id: row.id
        }
      })
    },
    goAssetPage(row) {
      this.$router.push({
        name: 'SetAsset',
        query: {
          id: row.id
        }
      })
    },
    goCreatePage() {
      this.$router.push({
        name: 'TunnelInfoCreate'
      })
    },
    goEditPage(row) {
      if (row) {
        this.$router.push({
          name: 'TunnelInfoEdit',
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
            name: 'TunnelInfoEdit',
            query: {
              id: this.chooseDelArr[0].id
            }
          })
        }
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.pipeInfo + '，确认吗？', '删除' + this.mylang.pipeInfo, {
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
      this.$confirm('即将删除您选中的' + this.mylang.pipeInfo + '，确认吗？', '删除' + this.mylang.pipeInfo, {
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
        const { code } = await deletePipe({ delete_ids })
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
            order: this.realSearch.order,
            state: this.realSearch.state
          })
        }
      } catch (error) {
        loading.close()
      }
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

</style>
