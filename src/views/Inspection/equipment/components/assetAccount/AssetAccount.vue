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
          <el-form-item prop="pipe_id" :label="mylang.pipeName">
            <el-select
              v-model="searchForm.pipe_id"
              clearable
              filterable
              @change="pipeChange"
            >
              <el-option
                v-for="pipe in pipeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="equipment_id"
            :label="`${mylang.equipmentType}`"
          >
            <el-select
              v-model="searchForm.equipment_id"
              clearable
            >
              <el-option
                v-for="pipe in eTypeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="status" :label="mylang.repaireState">
            <el-select v-model="searchForm.status" clearable>
              <el-option
                v-for="option in stateOptions"
                :key="option.id"
                :label="option.label"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="field_value_id_2" :label="mylang.equipmentName">
            <el-input v-model="searchForm.field_value_id_2" :placeholder="`请输入${mylang.equipmentName}`" clearable />
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
          prop="status"
          :label="mylang.equipment+mylang.status"
        >
          <template slot-scope="scope">
            {{ scope.row.status }}
          </template>
        </el-table-column>
        <el-table-column
          :label="mylang.actions"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              :size="$btnSize"
              type="success"
              @click="handleDetail(scope.row)"
            >{{ mylang.detail }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <asset-account-dialog ref="dialog" />
  </div>
</template>

<script>
import { getAssetAccount, getAssetTypeState } from '@/api/inspection'
import AssetAccountDialog from './AssetAccountDialog'

export default {
  name: 'AssetAccountComponent', // 设备台账
  components: {
    AssetAccountDialog
  },
  data() {
    return {
      searchForm: {
        pipe_id: '',
        equipment_id: '',
        field_value_id_2: '',
        status: ''
      },
      pipeOptions: [],
      stateOptions: [{
        id: 0,
        label: '报废'
      }, {
        id: 1,
        label: '使用中'
      }, {
        id: 2,
        label: '维修中'
      }, {
        id: 3,
        label: '已更换'
      }],
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
      pipe_id = '',
      equipment_id = '',
      field_value_id_2 = '',
      status = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, pipe_id, equipment_id,
        field_value_id_2,
        status
      })
    },
    async getList({
      pipe_id = '',
      equipment_id = '',
      field_value_id_2 = '',
      status = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      const field_id_2 = field_value_id_2 ? '2' : ''
      try {
        const { code, data } = await getAssetAccount({
          page, paginate, pipe_id, equipment_id,
          field_value_id_2,
          status,
          field_id_2
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
        field_value_id_2: search.field_value_id_2,
        pipe_id: search.pipe_id,
        equipment_id: search.equipment_id,
        status: search.status
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        field_value_id_2: data.search.field_value_id_2,
        pipe_id: data.search.pipe_id,
        equipment_id: data.search.equipment_id,
        status: data.search.status
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    handleDetail(row) {
      this.$refs.dialog.show({
        value: row.value,
        title: row.equipment_name
      })
    },
    pipeChange(val) {
      // 重选管道 设备类型与设备也要重新选择
      this.searchForm.equipment_id = ''
      this.eTypeOptions = []
      if (this.searchForm.pipe_id) {
        this.getEquipmentOptions()
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
    },
    async getEquipmentOptions() {
      try {
        const { code, data } = await getAssetTypeState({
          id: this.searchForm.pipe_id
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
