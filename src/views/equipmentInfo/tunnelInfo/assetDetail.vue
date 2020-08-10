<template>
  <div>
    <go-back />
    <el-container>
      <el-aside class="asset-aside" width="180px">
        <div class="fixed">
          <el-menu :default-active="active" @select="changeType">
            <el-menu-item
              v-for="(item, ind) in typeList"
              :key="item.id"
              :index="String(ind)"
            >
              {{ item.name }}
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main class="asset-main">
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
              <el-form-item prop="field_value_id_2" :label="mylang.equipmentName">
                <el-input v-model="searchForm.field_value_id_2" :placeholder="`请输入${mylang.equipmentName}`" clearable />
              </el-form-item>
              <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
            </el-form>
          </template>
          <div style="margin-bottom:8px;">
            <el-button type="primary" :size="$btnSize" @click="handleLink">{{ mylang.linkEquipment }}</el-button>
            <el-button type="danger" plain :size="$btnSize" @click="handleUnLink">{{ mylang.cancelLink }}</el-button>
          </div>
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            border
            class="tableBox"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <template v-if="tableData && tableData.length > 0">
              <el-table-column
                align="center"
                type="selection"
                width="55"
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
      </el-main>
    </el-container>
    <link-dialog ref="linkdialog" :pid="pid" @confirm="confirmLink" />
    <asset-detail-dialog ref="detailDialog" />
  </div>
</template>

<script>
import {
  getPipeLinkList,
  getEquipmentTypeAll,
  unlinkAsset
} from '@/api/equipmentInfo'
import LinkDialog from './components/LinkDialog'
import AssetDetailDialog from './components/AssetDetailDialog'
import deleteCache from '@/mixins/deleteCache'
export default {
  name: 'SetAsset',
  components: {
    LinkDialog,
    AssetDetailDialog
  },
  mixins: [deleteCache],
  data() {
    return {
      active: '0',
      equipment_id: '',
      equipment_name: '',
      typeList: [],
      searchForm: {
        field_value_id_2: ''
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
      pid: this.$route.query.id || ''
    }
  },
  created() {
    this.getEquipmentTypeAll()
    this.$_deleteOtherView()
  },
  methods: {
    changeType(index) {
      this.active = index
      this.searchForm.field_value_id_2 = ''
      this.equipment_id = this.typeList[index].id
      this.equipment_name = this.typeList[index].name
      this.initTableData()
    },
    async getEquipmentTypeAll() {
      try {
        const { code, data } = await getEquipmentTypeAll()
        if (code === 200) {
          this.typeList = data
          this.equipment_id = this.typeList[0].id
          this.equipment_name = this.typeList[0].name
          this.initTableData()
        }
      } catch (error) {
        //
      }
    },
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      field_value_id_2 = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, field_value_id_2 })
    },
    async getList({
      field_value_id_2 = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getPipeLinkList({
          page, paginate, field_value_id_2,
          equipment_id: this.equipment_id,
          pipe_id: this.pid
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total
          //   this.tableData = data.data || []
          if (data.data && data.data.length > 0) {
            this.tableField = data.data[0].columns
            const tableData = data.data.map(v => {
              const obj = {}
              v.columns.forEach(k => {
                obj.asset_id = v.asset_id
                obj[k.name] = k.value
              })
              return obj
            })
            this.tableData = tableData
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
        field_value_id_2: search.field_value_id_2
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        field_value_id_2: data.search.field_value_id_2
      })
    },
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    handleDetail(row) {
      this.$refs.detailDialog.show({
        asset_id: row.asset_id,
        eid: this.equipment_id
      })
    },
    handleLink() {
      this.$refs.linkdialog.show({
        title: this.equipment_name,
        equipId: this.equipment_id,
        selectedInfo: this.tableData
      })
    },
    handleUnLink(row) {
      if (this.chooseDelArr.length < 1) {
        this.$message({
          type: 'warning',
          message: '未选择任何需要取消关联的选项'
        })
        return false
      }
      this.$confirm('即将取消您选中的设备与管理关联信息，确认吗？', '取消关联', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.chooseDelArr.map(v => v.asset_id).join(',')
        this.cancelLink({ asset_ids: ids })
      })
    },
    async cancelLink({ asset_ids } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await unlinkAsset({
          pipe_id: this.pid,
          asset_ids
        })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '取消关联成功'
          })
          // 重新获取当前页面数据
          this.getList({
            page: this.listQuery.page,
            pageSize: this.listQuery.limit,
            field_value_id_2: this.realSearch.field_value_id_2
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    confirmLink() {
      // 重新获取当前页面数据
      this.getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        field_value_id_2: this.realSearch.field_value_id_2
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.asset-aside {
    // position: relative;
    padding-top: 15px;
    // .fixed {
        // position: fixed;
        // top: 115px;
        // left: 20px;
        // position: absolute;
        // top: 0;
        // left: 0;
    // }
    .el-menu {
        border: solid 1px #e6e6e6;
        max-height: 75vh;
        overflow-y: auto;
    }
    .el-menu-item {
        line-height: 38px;
        height: 38px;
    }
}
</style>
