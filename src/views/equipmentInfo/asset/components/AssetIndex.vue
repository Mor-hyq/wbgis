<template>
  <div>
    <el-container>
      <el-aside class="asset-aside" width="180px" :style="asideStyle">
        <div class="fixed">
          <div class="subtit">{{ mylang.equipmentType }}</div>
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
              <el-button type="primary" :size="$btnSize" @click="handleSearch">{{ mylang.search }}</el-button>
              <el-button type="primary" :size="$btnSize" style="margin-bottom:12px;" @click="goEquipmentPage">{{ mylang.equipmentType }}配置</el-button>
            </el-form>
          </template>
          <div style="margin-bottom:8px;">
            <el-button type="primary" :size="$btnSize" @click="goCreatePage">{{ mylang.add }}</el-button>
            <el-button type="primary" :size="$btnSize" @click="goEditPage(false)">{{ mylang.modify }}</el-button>
            <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
            <el-button type="primary" :size="$btnSize" plain @click="showImport">{{ mylang.import }}</el-button>
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
            <template v-if="tableData && tableData.length > 0">
              <el-table-column
                align="center"
                type="selection"
                width="55"
              />
              <template
                v-for="(column, ind) in tableField"
              >
                <el-table-column
                  v-if="!column.hide"
                  :key="ind"
                  align="center"
                  :prop="column.name"
                  :label="column.title"
                />
              </template>
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
                    @click="handleDeleteItem(scope.row)"
                  >{{ mylang.delete }}</el-button> -->
                </template>
              </el-table-column>
            </template>
          </el-table>
        </my-table>
      </el-main>
    </el-container>
    <el-dialog
      :visible.sync="exportVisible"
      title="批量导入"
    >
      <import-file
        ref="importFile"
        style="width:450px;"
        :is-show-code-error="importOptions.isShowCodeError"
        :export-tips="importOptions.exportTips"
        :upload-field="importOptions.uploadField"
        :down-file-url="importOptions.downFileUrl"
        :upload-func="importOptions.uploadFunc"
        :is-disabled.sync="importOptions.exportDisabled"
        :accept="importOptions.accept"
        @success="importSuccess"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideImport">取 消</el-button>
        <el-button type="primary" :disabled="importOptions.exportDisabled" @click="bulkImport">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAssetList, getEquipmentTypeAll, deleteAsset, importAsset } from '@/api/equipmentInfo'
import deleteCache from '@/mixins/deleteCache'
import config from '@/config'
import ImportFile from '@/components/ImportFile'

export default {
  name: 'AssetIndexComponent',
  components: {
    ImportFile
  },
  mixins: [deleteCache],
  data() {
    const mode = config.mode
    const requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
    return {
      active: this.$store.state.form.assetTab || '0',
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
      exportVisible: false,
      importOptions: {
        isShowCodeError: true,
        exportTips: '批量导入模板',
        uploadField: 'file',
        downFileUrl: requestUrl + 'admin/asset?type=downloadExample',
        uploadFunc: importAsset, // 导入发布对象的函数
        exportDisabled: false, // 文件是否禁止上传
        accept: ['.xls', '.xlsx']
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device'
    ]),
    asideStyle() {
      const style = {}
      if (this.device === 'mobile') {
        style.left = '20px'
      } else {
        if (this.sidebar.opened) {
          style.left = '216px'
        } else {
          style.left = '60px'
        }
      }
      return style
    }
  },
  created() {
    this.getEquipmentTypeAll()
    this.$_deleteOtherView()
  },
  methods: {
    changeType(index) {
      this.$store.commit('form/SET_ASSET_TAB', index)
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
          // this.equipment_id = this.typeList[0].id
          // this.equipment_name = this.typeList[0].name
          this.equipment_id = this.typeList[this.active].id
          this.equipment_name = this.typeList[this.active].name
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
        const { code, data } = await getAssetList({
          page, paginate, field_value_id_2,
          equipment_id: this.equipment_id
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total
          //   this.tableData = data.data || []
          if (data.data && data.data.length > 0) {
            this.tableField = data.data[0].value
            // const arr = []
            // const tableData = data.data
            // tableData.forEach(v => {
            //   const obj = {}
            //   v.value.forEach(k => {
            //     obj.asset_id = k.asset_id
            //     obj[k.name] = k.value
            //   })
            //   arr.push(obj)
            // })
            // this.tableData = arr
            const tableData = data.data.map(v => {
              const obj = {}
              v.value.forEach(k => {
                obj.asset_id = k.asset_id
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
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goEquipmentPage() {
      this.$router.push({
        name: 'AssetType'
      })
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'AssetDetail',
        query: {
          id: row.asset_id,
          eid: this.equipment_id,
          ename: encodeURIComponent(this.equipment_name)
        }
      })
    },
    goCreatePage() {
      this.$router.push({
        name: 'AssetCreate',
        query: {
          eid: this.equipment_id,
          ename: encodeURIComponent(this.equipment_name)
        }
      })
    },
    goEditPage(row) {
      if (row) {
        this.$router.push({
          name: 'AssetEdit',
          query: {
            id: row.asset_id,
            eid: this.equipment_id,
            ename: encodeURIComponent(this.equipment_name)
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
            name: 'AssetEdit',
            query: {
              id: this.chooseDelArr[0].asset_id,
              eid: this.equipment_id,
              ename: encodeURIComponent(this.equipment_name)
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
        this.deleteData({ ids: row.asset_id })
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
        const ids = this.chooseDelArr.map(v => v.asset_id).join(',')
        this.deleteData({ ids: ids })
      })
    },
    async deleteData({ ids } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await deleteAsset({ ids })
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
            field_value_id_2: this.realSearch.field_value_id_2
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    handleExport() {
      const mode = config.mode
      let requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      requestUrl += 'admin/asset?type=export&equipment_id=' + this.equipment_id
      if (this.realSearch.field_value_id_2) {
        requestUrl += '&field_id_2=2&field_value_id_2=' + this.realSearch.field_value_id_2
      }
      window.location.href = requestUrl
      // window.open(requestUrl)
    },
    bulkImport() {
      // 批量导入发布会员信息
      this.$refs.importFile.submit()
    },
    showImport() {
      this.exportVisible = true
    },
    hideImport() {
      this.exportVisible = false
      this.$refs.importFile.resetForm()
    },
    importSuccess() {
      this.hideImport()
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
@import "~@/styles/mixin.scss";
$greybg: #f8f8f8;
$height: 80vh;
.asset-aside {
    position: fixed;
    top: 110px;
    left: 20px;
    height: $height;
    border: solid 1px #e6e6e6;
    margin-top: 10px;
    background-color: $greybg;
    .subtit {
      padding: 8px 0;
      text-align: center;
      font-size: 16px;
      color: #333;
      border-bottom: 1px solid #dedede;
      cursor: default;
    }
    .el-menu {
        border: none;
        background-color: $greybg;
        height: calc(#{$height} - 40px);
        overflow-y: auto;
        @include scrollBar;
    }
    .el-menu-item {
        line-height: 38px;
        height: 38px;
    }
}
.asset-main {
  margin-left: 180px;
}
</style>
