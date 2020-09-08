<template>
  <div>
    <my-table
      ref="mytable"
      :search-data.sync="searchForm"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @handlePageChange="handleChange"
    >
      <template v-if="!isComponent" slot="search">
        <el-form ref="searchForm" :model="searchForm" :size="$btnSize" inline>
          <el-form-item prop="state" :label="mylang.maintainState">
            <el-select v-model="searchForm.state" clearable>
              <el-option
                v-for="option in stateOptions"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="equipment_id" label="设备类型">
            <el-select
              v-model="searchForm.equipment_id"
              clearable
              :size="$btnSize"
              placeholder="全部"
            >
              <el-option
                v-for="pipe in eTypeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="cycle" :label="mylang.maintainCycle">
            <el-select
              v-model="searchForm.cycle"
              clearable
              :size="$btnSize"
              placeholder="全部"
            >
              <el-option
                v-for="cycle in cycleOptions"
                :key="cycle.id"
                :value="cycle.id"
                :label="cycle.label"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div v-if="!isComponent" style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" plain @click="handleExport">{{ mylang.export }}</el-button>
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
          v-if="!isComponent"
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          prop="equipment_name"
          :label="mylang.equipmentType"
        />
        <el-table-column
          align="center"
          prop="table_name"
          label="维护内容"
        />
        <el-table-column
          align="center"
          prop="egi_cycle"
          :label="`${mylang.maintainCycle}`"
          :formatter="formatterCycle"
        />
        <el-table-column
          align="center"
          prop="next_egi_time"
          :label="`本次${mylang.maintainDate}`"
        />
        <el-table-column
          align="center"
          prop="notify_person"
          :label="mylang.noticeStaff"
        />
        <el-table-column
          align="center"
          prop="state"
          :label="mylang.maintainState"
        >
          <template slot-scope="scope">
            <span class="order-state" :class="{ done: +scope.row.state === 1}">{{ scope.row.state_content }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="egi"
          :label="mylang.maintainRequirement"
        />
        <el-table-column
          v-if="!isComponent"
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
              type="primary"
              :size="$btnSize"
              @click="goMaintainRegister(scope.row)"
            >维护登记</el-button>

          </template>
        </el-table-column>
      </el-table>
    </my-table>
  </div>
</template>

<script>
import {
  getAssetEgiList,
  deleteAssetEgi,
  getAssetTypeState
} from '@/api/inspection'
import config from '@/config'
export default {
  name: 'EquipmentMaintainIndex',
  props: {
    isComponent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {
        pipe_name: '',
        cycle: '',
        equipment_id: '',
        state: ''
      },
      pipeOptions: [],
      stateOptions: [{
        id: '0',
        label: '待维护'
      }, {
        id: '1',
        label: '已维护'
      }],
      cycleOptions: this.$store.state.form.cycleOptions,
      eTypeOptions: [],
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
    if (!this.isComponent) {
      this.getPipeOptions()
    }
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      equipment_id = '',
      cycle = '',
      pipe_name = '',
      state = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, pipe_name, equipment_id, state, cycle })
    },
    async getList({
      equipment_id = '',
      cycle = '',
      pipe_name = '',
      state = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getAssetEgiList({
          page, paginate, equipment_id, pipe_name, state, cycle
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
        equipment_id: search.equipment_id,
        cycle: search.cycle,
        pipe_name: search.pipe_name,
        state: search.state
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        equipment_id: data.search.equipment_id,
        cycle: data.search.cycle,
        pipe_name: data.search.pipe_name,
        state: data.state
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'MaintainDetail',
        query: {
          id: row.id
        }
      })
    },
    goCreatePage() {
      this.$router.push({
        name: 'MaintainCreate'
      })
    },
    goEditPage(row) {
      if (row) {
        this.$router.push({
          name: 'MaintainEdit',
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
            name: 'MaintainEdit',
            query: {
              id: this.chooseDelArr[0].id
            }
          })
        }
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.maintainInfo + '，确认吗？', '删除' + this.mylang.maintainInfo, {
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
      this.$confirm('即将删除您选中的' + this.mylang.maintainInfo + '，确认吗？', '删除' + this.mylang.maintainInfo, {
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
        const { code } = await deleteAssetEgi({ delete_ids })
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
            equipment_id: this.realSearch.equipment_id,
            cycle: this.realSearch.cycle,
            pipe_name: this.realSearch.pipe_name,
            state: this.realSearch.state
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    handleExport() {
      if (this.tableData.length < 1) {
        return
      }
      const mode = config.mode
      let requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      requestUrl += 'admin/assetEgi?target=list&export=1'
      for (const k in this.realSearch) {
        if (this.realSearch[k] || this.realSearch[k] === 0) {
          requestUrl += `&${k}=${this.realSearch[k]}`
        }
      }
      window.location.href = requestUrl
    },
    goMaintainRegister(row) {
      this.$router.push({
        name: 'MaintainRecord',
        query: {
          id: row.id,
          eq_id: row.equipment_id
        }
      })
    },
    getSateName(row) {
      let name = ''
      for (let i = 0; i < this.stateOptions.length; i++) {
        if (this.stateOptions[i].id === String(row.state)) {
          name = this.stateOptions[i].label
          break
        }
      }
      return name
    },
    getPipeOptions() {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          this.pipeOptions = this.$store.state.form.belongPipe
          this.getEquipmentOptions(this.pipeOptions[0].id)
        })
      } else {
        this.pipeOptions = this.$store.state.form.belongPipe
        this.getEquipmentOptions(this.pipeOptions[0].id)
      }
    },
    async getEquipmentOptions(id) {
      try {
        const { code, data } = await getAssetTypeState({
          id
        })
        if (code === 200) {
          this.eTypeOptions = data || []
        }
      } catch (error) {
        //
      }
    },
    formatterCycle(row, column, cellValue) {
      let name = ''
      for (let i = 0; i < this.cycleOptions.length; i++) {
        if (this.cycleOptions[i].id === +(cellValue)) {
          name = this.cycleOptions[i].label
          break
        }
      }
      return name
    }
  }
}
</script>

<style lang="scss" scoped>
.order-state {
  color: #F56C6C;
  &.done {
    color: #67C23A;
  }
}
</style>
