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
      <template slot="search">
        <el-form ref="searchForm" :model="searchForm" size="mini" inline>
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
      <div style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" plain @click="handleExport()">{{ mylang.export }}表单</el-button>
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
        <!-- <el-table-column
          align="center"
          prop="pipe_name"
          :label="mylang.pipeName"
        /> -->
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
          prop="plan_time"
          :label="mylang.maintainDate"
        />
        <el-table-column
          align="center"
          prop="state"
          :label="mylang.maintainState"
        >
          <template slot-scope="scope">
            <span class="order-state" :class="{ done: +scope.row.state === 1}">{{ scope.row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="mylang.actions"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleExport(scope.row)"
            >{{ mylang.export }}表单</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          prop="name"
          label="维护表单"
        >
          <template slot-scope="scope">
            <span class="name" @click="goRecordDetail(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </my-table>
  </div>
</template>

<script>
import {
  getAssetTypeState,
  getEquipmentMatainList
} from '@/api/inspection'
export default {
  name: 'MaintainFormComponent',
  data() {
    return {
      searchForm: {
        state: '',
        equipment_id: '',
        cycle: ''
      },
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
    this.getPipeOptions()
    this.initTableData()
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
        const { code, data } = await getEquipmentMatainList({
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
    handleExport(row) {
      if (row) {
        this.$router.push({
          name: 'MaintainRecordForm',
          query: {
            type: row.equipment_id + '' + row.type,
            id: row.asset_egi_id,
            peid: row.period
          }
        })
      } else {
        if (this.chooseDelArr.length < 1) {
          this.$message({
            type: 'warning',
            message: '请选择导出表单'
          })
        } else if (this.chooseDelArr.length > 1) {
          this.$message({
            type: 'warning',
            message: '导出表单只能选择一项'
          })
        } else {
          const q = this.chooseDelArr[0]
          this.$router.push({
            name: 'MaintainRecordForm',
            query: {
              type: q.equipment_id + '' + q.type,
              id: q.asset_egi_id,
              peid: q.period
            }
          })
        }
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
