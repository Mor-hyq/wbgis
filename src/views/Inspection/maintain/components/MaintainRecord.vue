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
        <el-form ref="searchForm" :model="searchForm" size="mini" inline>
          <el-form-item prop="equipment_id" label="设备类型">
            <el-select
              v-model="searchForm.equipment_id"
              clearable
              :size="$btnSize"
              placeholder="全部"
              @change="equipmentChange"
            >
              <el-option
                v-for="pipe in eTypeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="asset_id"
            :label="mylang.equipmentName"
          >
            <el-select
              v-model="searchForm.asset_id"
              clearable
            >
              <el-option
                v-for="pipe in eNameOptions"
                :key="pipe.asset_id"
                :value="pipe.asset_id"
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
          <el-form-item prop="egi_time" :label="mylang.maintainDate">
            <el-date-picker
              v-model="searchForm.egi_time"
              type="daterange"
              range-separator="-"
              start-placeholder="维护日期"
              end-placeholder="维护日期"
              value-format="yyyy-MM-dd"
              style="width:250px;"
            />
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
          prop="asset_name"
          :label="mylang.equipmentName"
        />
        <el-table-column
          align="center"
          prop="egi_cycle"
          :label="`${mylang.maintainCycle}`"
          :formatter="formatterCycle"
        />
        <el-table-column
          align="center"
          prop="egi_time"
          :label="mylang.maintainDate"
        />
        <el-table-column
          align="center"
          prop="egi_person"
          :label="mylang.maintainStaff"
        />
        <el-table-column
          align="center"
          prop="state"
          :label="mylang.maintainState"
        >
          <template slot-scope="scope">
            <span class="order-state" :class="{ done: +scope.row.state === 1}">{{ getSateName(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!isComponent"
          label="维护情况"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="goDetailPage(scope.row)"
            >{{ mylang.detail }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>

    <maintain-container
      :visible.sync="dialogInfo.visible"
      :type="dialogInfo.type"
      :eq-type="dialogInfo.eqType"
      :eq-num="dialogInfo.eqNum"
      :eq-name="dialogInfo.eqName"
      :eq-id="dialogInfo.eqId"
      :is-read="true"
    />
  </div>
</template>

<script>
import MaintainContainer from './newMaintainForm/Container'

import {
  getMaintainRecord2,
  getAssetNameState,
  getAssetTypeState
} from '@/api/inspection'
import config from '@/config'

export default {
  name: 'MaintainRecordComponent',
  components: {
    MaintainContainer
  },
  props: {
    isComponent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {
        egi_time: '',
        equipment_id: '',
        field_value_id_2: '',
        state: '',
        cycle: '',
        asset_id: ''
      },
      maintainOptions: [],
      eTypeOptions: [],
      eNameOptions: [],
      stateOptions: [{
        id: '1',
        label: '已维护'
      }, {
        id: '2',
        label: '逾期'
      }],
      cycleOptions: this.$store.state.form.cycleOptions,
      realSearch: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      chooseDelArr: [],
      tableData: [],
      dialogInfo: {
        visible: false,
        type: '',
        eqType: '',
        eqNum: '',
        eqName: '',
        eqId: ''
      }
    }
  },
  created() {
    this.getPipeOptions()
    if (!this.isComponent) {
      this.initTableData()
    }
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      egi_time = '',
      equipment_id = '',
      field_value_id_2 = '',
      asset_id = '',
      state = '',
      cycle = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({
        page, paginate,
        egi_time, equipment_id,
        field_value_id_2,
        asset_id,
        state,
        cycle })
    },
    async getList({
      egi_time = '',
      equipment_id = '',
      field_value_id_2 = '',
      asset_id = '',
      state = '',
      cycle = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getMaintainRecord2({
          page, paginate,
          egi_time: Array.isArray(egi_time) ? egi_time.join() : egi_time,
          equipment_id,
          field_value_id_2,
          asset_id,
          state,
          cycle
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total
          this.tableData = data.data || []
        }
      } catch (error) {
        console.log(error)
        this.tableLoading = false
      }
    },
    handleSearch() {
      // 搜索
      const search = this.$refs.mytable.handleSearch()
      this.realSearch = search
      this.initTableData({
        egi_time: search.egi_time,
        equipment_id: search.equipment_id,
        field_value_id_2: search.field_value_id_2,
        asset_id: search.asset_id,
        state: search.state,
        cycle: search.cycle
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        egi_time: data.search.egi_time,
        equipment_id: data.search.equipment_id,
        field_value_id_2: data.search.field_value_id_2,
        asset_id: data.search.asset_id,
        state: data.search.state,
        cycle: data.search.cycle
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      if (!this.isComponent) {
        this.chooseDelArr = data
      }
    },

    handleExport() {
      if (this.tableData.length < 1) {
        return
      }
      const mode = config.mode
      let requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      requestUrl += 'admin/assetEgiPeriod?target=list&export=1'
      for (const k in this.realSearch) {
        if (this.realSearch[k] || this.realSearch[k] === 0) {
          requestUrl += `&${k}=${Array.isArray(this.realSearch[k]) ? this.realSearch[k].join() : this.realSearch[k]}`
        }
      }
      window.location.href = requestUrl
    },
    goDetailPage(row) {
      this.dialogInfo = {
        visible: true,
        eqId: row.id,
        type: row.equipment_id + '' + row.type
      }
    },

    getMaintainOptions() {
      if (this.$store.state.form.maintainSelect.length < 1) {
        this.$store.dispatch('form/setMaintainSelect').then(() => {
          this.maintainOptions = this.$store.state.form.maintainSelect
        })
      } else {
        this.maintainOptions = this.$store.state.form.maintainSelect
      }
    },
    getPipeOptions() {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          const pipeOptions = this.$store.state.form.belongPipe
          this.pipeId = pipeOptions[0].id
          this.getEquipmentOptions(pipeOptions[0].id)
        })
      } else {
        const pipeOptions = this.$store.state.form.belongPipe
        this.pipeId = pipeOptions[0].id
        this.getEquipmentOptions(pipeOptions[0].id)
      }
    },
    equipmentChange(val) {
      // 重选设备类型 设备也要重新选择
      this.searchForm.asset_id = ''
      this.eNameOptions = []
      if (this.pipeId && this.searchForm.equipment_id) {
        this.getEquipmentNameOptions()
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
    async getEquipmentNameOptions() {
      try {
        const { code, data } = await getAssetNameState({
          id: this.pipeId,
          equipment_id: this.searchForm.equipment_id
        })
        if (code === 200) {
          this.eNameOptions = data || []
        }
      } catch (error) {
        //
      }
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
.name {
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.icon {
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
}
.el-icon-delete {
  color:#F56C6C;
  &:hover {
    color: #ec1616;
  }
}
.el-icon-edit {
  color: #409eff;
  &:hover {
    color: #0565c5;
  }
}
.order-state {
  color: #F56C6C;
  &.done {
    color: #67C23A;
  }
}
</style>
