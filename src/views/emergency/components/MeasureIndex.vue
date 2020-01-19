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
          <el-form-item prop="name" :label="mylang.measureName">
            <el-input v-model="searchForm.name" :placeholder="`请输入${mylang.measureName}`" clearable />
          </el-form-item>
          <el-form-item prop="create_time" :label="mylang.registerTime">
            <el-date-picker
              v-model="searchForm.create_time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
            />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div v-if="!isDialog" style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="goCreatePage">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="goEditPage(false)">{{ mylang.modify }}</el-button>
        <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
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
          prop="name"
          show-overflow-tooltip
          :label="mylang.measureName"
        />
        <el-table-column
          align="center"
          prop="create_time"
          show-overflow-tooltip
          :label="mylang.registerTime"
        />
        <el-table-column
          align="center"
          prop="process"
          show-overflow-tooltip
          label="处置流程"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.process" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="require"
          show-overflow-tooltip
          label="处置要求"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.require" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="attachment"
          show-overflow-tooltip
          :label="mylang.attachmentName"
        >
          <template slot-scope="scope">
            <span class="down" title="点击下载附件" @click="adown(scope.row)">{{ scope.row.attachment }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          v-if="!isDialog"
          :label="mylang.actions"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              :size="$btnSize"
              type="primary"
              @click="goEditPage(scope.row)"
            >{{ mylang.modify }}</el-button>
            <el-button
              :size="$btnSize"
              type="danger"
              plain
              style="margin-top:5px;"
              @click="handleDeleteItem(scope.row)"
            >{{ mylang.delete }}</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </my-table>
  </div>
</template>

<script>
import { getMeasureList, deleteMeasure } from '@/api/emergency'
import config from '@/config'

export default {
  name: 'MeasureIndex',
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
        create_time: ''
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
      create_time = '',
      name = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, create_time, name })
    },
    async getList({
      create_time = '',
      name = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getMeasureList({
          page, paginate, create_time, name
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
        create_time: search.create_time,
        name: search.name
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        create_time: data.create_time,
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
        name: 'MeasuresCreate'
      })
    },
    goEditPage(row) {
      if (row) {
        this.$router.push({
          name: 'MeasuresEdit',
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
            name: 'MeasuresEdit',
            query: {
              id: this.chooseDelArr[0].id
            }
          })
        }
      }
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.measurePlan + '，确认吗？', '删除' + this.mylang.measurePlan, {
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
      this.$confirm('即将删除您选中的' + this.mylang.measurePlan + '，确认吗？', '删除' + this.mylang.measurePlan, {
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
        const { code } = await deleteMeasure({ delete_ids })
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
            create_time: this.realSearch.create_time,
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
    adown(row) {
      const url = this.returnDownUrl(row)
      window.location.href = url
      // window.open(url)
    },
    returnDownUrl(row, type) {
      const mode = config.mode
      const httpApi = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      const url = httpApi + row.file_path
      return url
    }
  }
}
</script>

<style lang="scss" scoped>
.down {
  color: #333;
  cursor: default;
  &:hover {
  color: #409eff;
  }
}
</style>
