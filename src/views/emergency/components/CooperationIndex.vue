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
          <el-form-item prop="name" :label="mylang.instituteName">
            <el-input v-model="searchForm.name" :placeholder="`请输入${mylang.instituteName}`" clearable />
          </el-form-item>
          <el-form-item prop="institute" :label="mylang.institute">
            <el-input v-model="searchForm.institute" :placeholder="`请输入${mylang.institute}`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div v-if="!isDialog" style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="goCreatePage">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="goEditPage(false)">{{ mylang.modify }}</el-button>
        <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
        <el-button type="primary" :size="$btnSize" plain @click="handleExport">{{ mylang.export }}</el-button>
      </div>
      <template v-else>
        <el-row v-if="selectedList.length > 0" class="link-role" type="flex">
          <el-col :span="20">
            <el-tag
              v-for="(item, index) in selectedList"
              :key="item.id"
              style="margin:0 5px 5px 0;"
              closable
              @close="handleClose(item, index)"
            >{{ item.name }}</el-tag>
          </el-col>
        </el-row>
      </template>
      <el-table
        ref="tables"
        v-loading="tableLoading"
        :data="tableData"
        border
        class="tableBox"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        @select="handleSelectChange"
        @select-all="handleSelectionAll"
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
          :label="mylang.number"
        />
        <el-table-column
          align="center"
          prop="institute"
          show-overflow-tooltip
          :label="mylang.institute"
        />
        <el-table-column
          align="center"
          prop="institute_type"
          show-overflow-tooltip
          :label="mylang.instituteType"
        />
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          :label="mylang.instituteName"
        />
        <el-table-column
          align="center"
          prop="response"
          show-overflow-tooltip
          :label="mylang.response"
        />
        <el-table-column
          align="center"
          prop="leader"
          show-overflow-tooltip
          :label="mylang.contactMan"
        />
        <el-table-column
          align="center"
          prop="region"
          show-overflow-tooltip
          :label="mylang.regionPlace"
        />
        <el-table-column
          align="center"
          prop="phone"
          show-overflow-tooltip
          :label="mylang.phone"
        />
        <el-table-column
          align="center"
          prop="coordinate"
          show-overflow-tooltip
          :label="mylang.coordinate"
        />
        <el-table-column
          align="center"
          prop="remark"
          show-overflow-tooltip
          :label="mylang.remark"
        >
          <template slot-scope="scope">{{ scope.row.remark || '无' }}</template>
        </el-table-column>
      </el-table>
    </my-table>
  </div>
</template>

<script>
import { getCooperationList, deleteCooperation } from '@/api/emergency'
import config from '@/config'

export default {
  name: 'CooperationIndex',
  props: {
    isDialog: { // 是否在弹窗中显示 在弹窗中显示 不展示新增、删除、跳转等按钮
      type: Boolean,
      default: false
    },
    selectedInfo: { // 已选中数据
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchForm: {
        name: '',
        institute: ''
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
      selectedList: [] // 弹窗时 选中的id列表
    }
  },
  watch: {
    selectedInfo(val) {
      if (this.isDialog) {
        this.resetSelected()
      }
    }
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      institute = '',
      name = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, institute, name })
    },
    async getList({
      institute = '',
      name = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getCooperationList({
          page, paginate, institute, name
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total
          this.tableData = data.data || []
          if (this.isDialog) {
            // 弹窗时
            this.$nextTick(() => {
              this.setTableSelection()
            })
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
        institute: search.institute,
        name: search.name
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        institute: data.institute,
        name: data.name
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      if (!this.isDialog) {
        this.chooseDelArr = data
      }
    },
    goCreatePage() {
      this.$router.push({
        name: 'CooperationCreate'
      })
    },
    goEditPage(row) {
      if (row) {
        this.$router.push({
          name: 'CooperationEdit',
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
            name: 'CooperationEdit',
            query: {
              id: this.chooseDelArr[0].id
            }
          })
        }
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.assistant + '，确认吗？', '删除' + this.mylang.assistant, {
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
      this.$confirm('即将删除您选中的' + this.mylang.assistant + '，确认吗？', '删除' + this.mylang.assistant, {
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
        const { code } = await deleteCooperation({ delete_ids })
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
            institute: this.realSearch.institute,
            name: this.realSearch.name
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    // dialog时函数
    setTableSelection() {
      // 设置表格数据为已选状态
      if (this.selectedList.length > 0) {
        this.selectedList.forEach((row) => {
          const i = this.tableData.findIndex(v => +v.id === +row.id)
          if (i >= 0) {
            this.$nextTick(() => {
              this.$refs.tables.toggleRowSelection(this.tableData[i], true)
            })
          }
        })
      }
    },
    confirmSelect() {
      // 点击确认提交权限数据
      return this.selectedList
    },
    handleSelectChange(val, row) {
      if (this.isDialog) {
        // 单选
      // 判断是否勾选
        const idx = this.selectedList.findIndex(v => +v.id === +row.id)
        if (idx >= 0) {
        // 反选
          this.selectedList.splice(idx, 1)
        } else {
        // 正选
          this.selectedList.push(row)
        }
      }
    },
    handleSelectionAll(val) {
      // 点击表格全选
      if (val.length > 0) {
        // 正选
        val.forEach((row) => {
          const idx = this.selectedList.findIndex(v => +v.id === +row.id)
          // 如果之前未选中过 则插入数据，选中过则不做处理
          if (idx < 0) {
            this.selectedList.push(row)
          }
        })
      } else {
        // 反选
        this.tableData.forEach((row) => {
          const idx = this.selectedList.findIndex(v => +v.id === +row.id)
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
      const i = this.tableData.findIndex(v => +v.id === +tag.id)
      if (i >= 0) {
        this.$nextTick(() => {
          this.$refs.tables.toggleRowSelection(this.tableData[i], false)
        })
      }
    },
    resetSelected() {
      // 重置seletedList值
      this.selectedList = this.selectedInfo || []
      this.setTableSelection()
    },
    clearSelected() {
      // 清空seletedList值
      this.selectedList = []
      this.$refs.tables.clearSelection()
    },
    handleExport() {
      if (this.tableData.length < 1) {
        return
      }
      const mode = config.mode
      let requestUrl = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      requestUrl += 'admin/assistUnit?target=list&export=1'
      for (const k in this.realSearch) {
        if (this.realSearch[k] || this.realSearch[k] === 0) {
          requestUrl += `&${k}=${this.realSearch[k]}`
        }
      }
      window.location.href = requestUrl
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
