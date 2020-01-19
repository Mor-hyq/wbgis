<template>
  <div>
    <el-form :inline="true" class="search-form" label-suffix=":" label-width="80px" label-position="left">
      <el-form-item :label="`${mylang.roleName}`">
        <el-input v-model="searchForm.name" style="width:200px" :maxlength="150" :placeholder="`输入${mylang.roleName}`" />
      </el-form-item>
      <el-form-item :label="`${mylang.roleRemark}`">
        <el-input v-model="searchForm.remark" style="width:200px" :maxlength="150" :placeholder="`输入${mylang.roleRemark}`" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSubmit">{{ mylang.search }}</el-button>
      </el-form-item>
    </el-form>
    <transition name="fade-y">
      <el-row v-if="selectedList.length > 0" class="link-role" type="flex">
        <span class="label">关联角色：</span>
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
    </transition>
    <slot name="button" />
    <el-table
      ref="multipleTable"
      v-loading="tableLoading"
      :data="tableData"
      class="tableBox"
      tooltip-effect="dark"
      border
      @select="handleSelectionChange"
      @select-all="handleSelectionAll"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        label-class-name="select-hidden"
      />
      <el-table-column
        align="center"
        prop="name"
        :label="`${mylang.roleName}`"
        min-width="100"
      />
      <el-table-column
        align="center"
        prop="remark"
        :formatter="formatterEmpty"
        :label="`${mylang.roleRemark}`"
        min-width="100"
      />
      <el-table-column
        align="center"
        prop="creator"
        :label="`${mylang.creator}`"
        min-width="100"
      />
      <el-table-column
        align="center"
        prop="create_time"
        :label="`${mylang.createTime}`"
        :formatter="formatterTime"
        min-width="200"
      />
      <!-- <el-table-column
        align="center"
        prop=""
        label="创建人所属工会"
        min-width="140"
      /> -->
      <el-table-column :label="mylang.actions" width="140" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="showAuth(scope.row)"
          >查看权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
    <el-dialog
      title="角色权限"
      class="dialog_header_new"
      :visible.sync="isShowAuth"
      width="900px"
      @closed="clearModuleIds"
    >
      <div style="height: 600px;overflow-y: auto">
        <set-authority ref="setAuthority" :is-read="true" :module-ids="roleModuleIds" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getRoleDetail } from '@/api/member'
import dayjs from 'dayjs'
import SetAuthority from '../components/SetAuthority'
import { isEqual, cloneDeep } from 'lodash'
export default {
  components: {
    SetAuthority
  },
  props: {
    isEdit: { // 是否编辑状态
      type: Boolean,
      default: false
    },
    isRead: { // 是否查看详情状态
      type: Boolean,
      default: false
    },
    selectedInfo: { // 已选中数据
      type: Array,
      default: () => []
    },
    manageIds: { // 已选中管理范围ids
      type: [String, Number],
      default: ''
    },
    uid: { // 已选中管理范围uid
      type: [String, Number],
      default: ''
    },
    manageUnionId: { // 已选中管理范围union_id
      type: [String, Number],
      default: ''
    }
    // selectedIds: {
    //   type: String,
    //   default: ''
    // },
    // selectedNames: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {
      isShowAuth: false, // 查看权限
      total: 0, // 账号管理列表总条数
      listQuery: { // 账号管理列表查询参数
        page: 1,
        limit: 10
      },
      searchForm: { // 关联角色搜索查询参数
        name: '',
        remark: ''
      },
      provideSearchForm: {}, // 搜索项
      tableLoading: false, // 表格加载loading
      tableData: [], // 账号管理列表
      roleModuleIds: '', // 角色权限
      selectedList: [] // 角色选中列表
    }
  },
  computed: {
    isCreate() {
      return !this.isEdit && !this.isRead
    }
  },
  watch: {
    selectedInfo(val) {
      this.resetSelected()
    },
    manageIds() {
      if (this.isCreate) {
        this.initTableData()
      }
    },
    uid() {
      if (!this.isCreate) {
        this.initTableData()
      }
    }
    // selectedIds(newVal) {
    //   this.resetSelected()
    // },
    // selectedNames(newVal) {
    //   this.resetSelected()
    // }
  },
  // created() {
  //   this.initTableData()
  // },
  methods: {
    initTableData({
      page = 1,
      pageSize = this.listQuery.limit,
      name = '',
      remark = ''
    } = {}) {
      // 初始化表格数据
      this.listQuery.page = 1
      this.getList({ page, pageSize, name, remark })
    },
    searchSubmit() {
      // 搜索
      this.provideSearchForm = cloneDeep(this.searchForm)
      this.initTableData({
        name: this.provideSearchForm.name,
        remark: this.provideSearchForm.remark
      })
    },
    async getList({
      page = this.listQuery.page,
      pageSize = this.listQuery.limit,
      name = '',
      remark = '',
      ids = this.manageIds,
      type = 'admin',
      uid = this.uid,
      union_id = this.manageUnionId
    }) {
      this.tableLoading = true
      this.tableData = []
      let param = {}
      // 创建与编辑时 传递参数不同
      if (this.isCreate) {
        param = {
          page,
          pageSize,
          name,
          remark,
          ids
        }
      } else {
        param = {
          page,
          pageSize,
          name,
          remark,
          type,
          uid,
          union_id
        }
      }
      // 获取列表数据
      try {
        const { code, data } = await getRoleList(param)
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total || 0
          this.tableData = data.list || []
          this.$nextTick(() => {
            this.setTableSelection()
          })
        }
      } catch (error) {
        this.tableLoading = false
      }
    },
    // 表格数据分页
    handleCurrentChange(val) {
      this.getList({
        page: val.page,
        pageSize: val.limit,
        name: this.provideSearchForm.name,
        remark: this.provideSearchForm.remark
      })
      this.listQuery.page = val.page
      this.listQuery.limit = val.limit
      this.saveSearchForm()
    },
    saveSearchForm() {
      // 当搜索条件改变但是没有点击搜索按钮时改变页码 搜索条件不变
      if (!isEqual(this.searchForm, this.provideSearchForm)) {
        this.searchForm = cloneDeep(this.provideSearchForm)
      }
    },
    handleSelectionChange(val, row) {
      // 单选
      // 判断是否勾选
      const idx = this.selectedList.findIndex(v => +v.id === +row.id)
      if (idx >= 0) {
        // 反选
        this.selectedList.splice(idx, 1)
      } else {
        // 正选
        this.selectedList.push({ id: row.id, name: row.name })
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
            this.selectedList.push({ id: row.id, name: row.name })
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
    confirmRole() {
      // 点击确认提交权限数据
      return this.selectedList.map(v => v.id).join(',')
    },
    setTableSelection() {
      // 设置表格数据为已选状态
      if (this.selectedList.length > 0) {
        this.selectedList.forEach((row) => {
          const i = this.tableData.findIndex(v => +v.id === +row.id)
          if (i >= 0) {
            this.$nextTick(() => {
              this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true)
            })
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
          this.$refs.multipleTable.toggleRowSelection(this.tableData[i], false)
        })
      }
    },
    resetSelected() {
      // 重置seletedList值
      // this.selectedList = this.selectedIds ? this.selectedIds.split(',') : []
      // this.selectedNamesList = this.selectedNames ? this.selectedNames.split(',') : []
      this.selectedList = this.selectedInfo || []
      this.setTableSelection()
    },
    clearSelected() {
      // 清空seletedList值
      this.selectedList = []
      this.$refs.multipleTable.clearSelection()
    },
    async getRoleAuth(id) {
      try {
        const { code, data } = await getRoleDetail({ id })
        if (code === 200) {
          this.roleModuleIds = data.module_ids || ''
        }
      } catch (error) {
        this.roleModuleIds = ''
      }
    },
    showAuth(row) {
      // 查看权限
      this.isShowAuth = true
      this.getRoleAuth(row.id)
    },
    hideAuth() {
      this.isShowAuth = false
    },
    clearModuleIds() {
      // 清空权限数据选中
      this.$refs.setAuthority.resetChecked()
      this.roleModuleIds = ''
    },
    formatterTime(row, column, cellValue) {
      // 时间戳转换
      const time = dayjs.unix(cellValue).format('YYYY-MM-DD HH:mm:ss')
      return time
    },
    formatterEmpty(row, column, cellValue) {
      // 空值显示
      const val = cellValue || '无'
      return val
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form {
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
}
.link-role {
  font-size: 14px;
  line-height: 30px;
  font-weight: 700;
  .label {
    color: #606266;
  }
}
// /deep/ .select-hidden.cell {
//   visibility: hidden;
// }
</style>
