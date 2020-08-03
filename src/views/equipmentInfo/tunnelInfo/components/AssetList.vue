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
        <el-form ref="searchForm" :model="searchForm" :size="$btnSize" inline>
          <el-form-item prop="name" :label="mylang.equipmentName">
            <el-input v-model="searchForm.name" :placeholder="`请输入${mylang.equipmentName}`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <!-- <el-row v-if="selectedList.length > 0" class="link-role" type="flex">
        <el-col :span="20">
          <el-tag
            v-for="(item, index) in selectedList"
            :key="item.role_id"
            style="margin:0 5px 5px 0;"
            closable
            @close="handleClose(item, index)"
          >{{ item.name }}</el-tag>
        </el-col>
      </el-row> -->
      <el-table
        ref="tables"
        v-loading="tableLoading"
        :data="tableData"
        border
        class="tableBox"
        tooltip-effect="dark"
        @select="handleSelectChange"
        @select-all="handleSelectionAll"
      >
        <template v-if="tableData && tableData.length > 0">
          <el-table-column
            align="center"
            type="selection"
            width="55"
            :selectable="setDisabledFunc"
          />
          <el-table-column
            v-for="(column, ind) in tableField"
            :key="ind"
            align="center"
            :prop="column.name"
            :label="column.title"
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
                @click="handleDetail(scope.row)"
              >{{ mylang.detail }}</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </my-table>
    <asset-detail-dialog ref="detailDialog" />
  </div>
</template>

<script>
import { getAssetList } from '@/api/equipmentInfo'
import AssetDetailDialog from './AssetDetailDialog'
import { cloneDeep } from 'lodash'
export default {
  name: 'AssetListComponent',
  components: {
    AssetDetailDialog
  },
  props: {
    selectedInfo: { // 已选中数据
      type: Array,
      default: () => []
    },
    equipmentId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      searchForm: {
        name: '',
        type: ''
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
      tableField: [], // 表格header信息
      selectedList: []
    }
  },
  watch: {
    selectedInfo(val) {
      // this.resetSelected()
    }
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      name = '',
      type = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, name, type })
    },
    async getList({
      name = '',
      type = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getAssetList({
          page, paginate,
          field_value_id_2: name,
          equipment_id: this.equipmentId,
          type
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total
          if (data.data && data.data.length > 0) {
            this.tableField = data.data[0].value
            const tableData = data.data.map(v => {
              const obj = {}
              v.value.forEach(k => {
                obj.asset_id = k.asset_id
                obj.relation = v.relation
                obj[k.name] = k.value
              })
              return obj
            })
            this.tableData = tableData
            // this.$nextTick(() => {
            //   this.setTableSelection()
            // })
          } else {
            this.tableData = []
          }
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
        type: search.type
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        name: data.search.name,
        type: data.search.type
      })
    },
    handleDetail(row) {
      this.$refs.detailDialog.show({
        asset_id: row.asset_id,
        eid: this.equipmentId
      })
    },
    // components函数
    setTableSelection() {
      // 设置表格数据为已选状态
      // if (this.selectedList.length > 0) {
      //   this.selectedList.forEach((row) => {
      //     const i = this.tableData.findIndex(v => +v.asset_id === +row.asset_id)
      //     if (i >= 0) {
      //       this.$nextTick(() => {
      //         this.$refs.tables.toggleRowSelection(this.tableData[i], true)
      //       })
      //     }
      //   })
      // }
    },
    setDisabledFunc(data) {
      // 设置禁止选择
      // const i = this.selectedInfo.findIndex(v => +v.asset_id === +data.asset_id)
      // return i < 0
      return +data.relation !== 1
    },
    confirmSelect() {
      // 点击确认提交权限数据
      return this.selectedList
    },
    handleSelectChange(val, row) {
      // 单选
      // 判断是否勾选
      const idx = this.selectedList.findIndex(v => +v.asset_id === +row.asset_id)
      if (idx >= 0) {
        // 反选
        this.selectedList.splice(idx, 1)
      } else {
        // 正选
        // 给select选中的数据新增字段
        this.selectedList.push(row)
      }
    },
    handleSelectionAll(val) {
      // 点击表格全选
      if (val.length > 0) {
        // 正选
        val.forEach((row) => {
          const idx = this.selectedList.findIndex(v => +v.asset_id === +row.asset_id)
          // 如果之前未选中过 则插入数据，选中过则不做处理
          if (idx < 0) {
            this.selectedList.push(row)
          }
        })
      } else {
        // 反选
        this.tableData.forEach((row) => {
          const idx = this.selectedList.findIndex(v => +v.asset_id === +row.asset_id)
          // 如果之前选中过 则删除数据，未选中则不做处理
          if (idx >= 0) {
            this.selectedList.splice(idx, 1)
          }
        })
      }
    },
    handleClose(tag, index) {
      // 关闭标签事件
      this.selectedList.splice(index, 1)
      const i = this.tableData.findIndex(v => +v.asset_id === +tag.asset_id)
      if (i >= 0) {
        this.$nextTick(() => {
          this.$refs.tables.toggleRowSelection(this.tableData[i], false)
        })
      }
    },
    resetSelected() {
      // 重置seletedList值
      this.selectedList = cloneDeep(this.selectedInfo) || []
      this.setTableSelection()
    },
    clearSelected() {
      // 清空seletedList值
      this.selectedList = []
      this.$refs.tables.clearSelection()
    },
    clearSearch() {
      this.searchForm.name = ''
      this.searchForm.type = ''
    }
  }
}
</script>
