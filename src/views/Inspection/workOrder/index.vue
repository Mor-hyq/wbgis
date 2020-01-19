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
      <!-- <template slot="search">
        <el-form ref="searchForm" :model="searchForm" :size="$btnSize" inline>
          <el-form-item prop="pipe_id" :label="mylang.pipeName">
            <el-select
              v-model="searchForm.pipe_id"
              clearable
              filterable
            >
              <el-option
                v-for="pipe in pipeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="state" :label="mylang.repaireState">
            <el-select v-model="searchForm.state" clearable>
              <el-option
                v-for="option in stateOptions"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="title" :label="mylang.repairTitle">
            <el-input v-model="searchForm.title" :placeholder="`请输入${mylang.repairTitle}`" clearable />
          </el-form-item>
          <el-form-item prop="field_value_id_2" :label="mylang.equipmentName">
            <el-input v-model="searchForm.field_value_id_2" :placeholder="`请输入${mylang.equipmentName}`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template> -->
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        class="tableBox"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column
          align="center"
          type="selection"
          width="55"
        /> -->
        <el-table-column
          align="center"
          prop="pipe_name"
          show-overflow-tooltip
          :label="mylang.pipeName"
        />
        <el-table-column
          align="center"
          prop="equipment_name"
          show-overflow-tooltip
          :label="mylang.equipmentType"
        />
        <el-table-column
          align="center"
          prop="do"
          :label="mylang.repairing"
        />
        <el-table-column
          align="center"
          prop="over"
          :label="mylang.finishRepaire"
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
          </template>
        </el-table-column>
      </el-table>
    </my-table>
  </div>
</template>

<script>
import { getWorkOrderChart } from '@/api/inspection'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'WorkOrder',
  mixins: [deleteCache],
  data() {
    return {
      searchForm: {
        pipe_id: '',
        title: '',
        field_value_id_2: '',
        state: ''
      },
      pipeOptions: [],
      stateOptions: [{
        id: 0,
        label: this.mylang.repairing
      }, {
        id: 1,
        label: this.mylang.repaired
      }],
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
    this.$_deleteOtherView()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      title = '',
      field_value_id_2 = '',
      pipe_id = '',
      state = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, pipe_id, title, state, field_value_id_2 })
    },
    async getList({
      title = '',
      field_value_id_2 = '',
      pipe_id = '',
      state = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getWorkOrderChart({
          page, paginate, title, pipe_id, state, field_value_id_2
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
        title: search.title,
        field_value_id_2: search.field_value_id_2,
        pipe_id: search.pipe_id,
        state: search.state
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        title: data.search.title,
        field_value_id_2: data.search.field_value_id_2,
        pipe_id: data.search.pipe_id,
        state: data.state
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'EquipmentRepair',
        query: {
          pipe_id: row.pipe_id,
          name: row.equipment_name,
          do: '1'
        }
      })
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

