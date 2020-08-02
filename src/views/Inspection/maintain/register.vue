<template>
  <div>
    <!-- <TopLabel :label="$route.meta.title" /> -->
    <go-back />
    <my-table
      ref="mytable"
      :search-data.sync="searchForm"
      :total="total"
      :limit.sync="listQuery.limit"
      :page.sync="listQuery.page"
      @handlePageChange="handleChange"
    >
      <template slot="search">
        <el-form
          ref="searchForm"
          :model="searchForm"
          :size="$btnSize"
          inline
          style="margin-top:15px;"
        >
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
          <el-form-item prop="field_value_id_2" :label="mylang.equipmentName">
            <!-- <el-input v-model="searchForm.field_value_id_2" :placeholder="`请输入${mylang.equipmentName}`" clearable /> -->
            <el-select
              v-model="searchForm.field_value_id_2"
              clearable
            >
              <el-option
                v-for="pipe in eNameOptions"
                :key="pipe.asset_id"
                :value="pipe.name"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>

        </el-form>
      </template>
      <hr style="margin-top:-10px;">
      <el-row :gutter="5" class="report-card-box">
        <el-col :span="4">
          <el-card class="t-blue">
            <div slot="header" class="color">
              <span>{{ mylang.equipmentType }}</span>
            </div>
            <div>{{ info.equipment }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="t-green">
            <div slot="header" class="color">
              <span>下次维护时间</span>
            </div>
            <div>{{ getStringTime(info.next_egi_time) }}</div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="t-warning">
            <div slot="header" class="color">
              <span>设备数量</span>
            </div>
            <div>{{ info.asset_num }}</div>
          </el-card>
        </el-col>
      </el-row>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        class="tableBox"
        tooltip-effect="dark"
        style="margin-top:10px;"
      >
        <el-table-column
          align="center"
          prop="asset_name"
          :label="mylang.equipmentName"
        />
        <el-table-column
          align="center"
          prop="egi_time"
          :label="mylang.maintainDate"
          :formatter="filterTime"
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
          :label="mylang.actions"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              v-if="+scope.row.state === 1"
              size="mini"
              type="success"
              @click="handleDetail(scope.row)"
            >{{ mylang.detail }}</el-button>
            <el-button
              v-if="+scope.row.state !== 1"
              type="primary"
              size="mini"
              @click="handleMaintainRegister(scope.row)"
            >维护登记</el-button>
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
      :is-read="dialogInfo.isRead"
      @confirm="getCurrentList"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  getAssetNameState,
  getMaintainRegisterList
} from '@/api/inspection'
import MaintainContainer from './components/newMaintainForm/Container'
export default {
  name: 'MaintainRecord',
  components: {
    MaintainContainer
  },
  data() {
    return {
      id: this.$route.query.id || '',
      eq_id: this.$route.query.eq_id || '',
      searchForm: {
        state: '0',
        field_value_id_2: ''
      },
      stateOptions: [{
        id: '0',
        label: '未维护'
      }, {
        id: '1',
        label: '已维护'
      }],
      eNameOptions: [],
      realSearch: {},
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      tableLoading: false,
      tableData: [],
      info: {
        equipment: '',
        next_egi_time: '',
        asset_num: ''
      },
      dialogInfo: {
        visible: false,
        type: '',
        eqType: '',
        eqNum: '',
        eqName: '',
        eqId: '',
        isRead: false
      }
    }
  },
  created() {
    if (this.eq_id) {
      this.getPipeOptions()
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      field_value_id_2 = '',
      state = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate,
        field_value_id_2,
        state })
    },
    async getList({
      field_value_id_2 = '',
      state = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getMaintainRegisterList({
          page, paginate,
          field_value_id_2,
          state,
          id: this.id
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.list.total
          this.tableData = data.list.data || []
          const info = {
            equipment: data.equipment,
            next_egi_time: data.next_egi_time,
            asset_num: data.asset_num
          }
          this.info = info
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
        field_value_id_2: search.field_value_id_2,
        state: search.state
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        field_value_id_2: data.search.field_value_id_2,
        state: data.search.state
      })
    },
    getCurrentList() {
      this.getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        field_value_id_2: this.realSearch.field_value_id_2,
        state: this.realSearch.state
      })
    },
    handleDetail(row) {
      this.dialogInfo = {
        visible: true,
        eqId: row.id,
        type: row.equipment_id + '' + row.type,
        eqType: this.info.equipment,
        eqNum: row.asset_code,
        eqName: row.asset_name,
        isRead: true
      }
    },
    handleMaintainRegister(row) {
      this.dialogInfo = {
        visible: true,
        eqId: row.id,
        type: row.equipment_id + '' + row.type,
        eqType: this.info.equipment,
        eqNum: row.asset_code,
        eqName: row.asset_name,
        isRead: false
      }
    },
    filterTime(row, column, cellValue) {
      if (cellValue) {
        if (typeof cellValue === 'number') {
          return dayjs(cellValue * 1000).format('YYYY-MM-DD')
        }
        return cellValue
      }
      return ''
    },
    getStringTime(time) {
      const times = time.split(',')
      return times.map(v => {
        return dayjs(+v * 1000).format('YYYY-MM-DD')
      }).join(' ~ ')
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
          const pipeOptions = this.$store.state.form.belongPipe
          this.getEquipmentOptions(pipeOptions[0].id)
        })
      } else {
        const pipeOptions = this.$store.state.form.belongPipe
        this.getEquipmentOptions(pipeOptions[0].id)
      }
    },
    async getEquipmentOptions(id) {
      try {
        const { code, data } = await getAssetNameState({
          id,
          equipment_id: this.eq_id
        })
        if (code === 200) {
          this.eNameOptions = data || []
        }
      } catch (error) {
        //
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.color {
    font-size: 14px;
}
.order-state {
  color: #F56C6C;
  &.done {
    color: #67C23A;
  }
}
</style>
