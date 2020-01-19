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
          <el-form-item prop="name" :label="mylang.roleName">
            <el-input v-model="searchForm.name" :placeholder="`请输入${mylang.roleName}`" clearable />
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div v-if="!isComponents" style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="handleCreate">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="handleEdit(false)">{{ mylang.modify }}</el-button>
        <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
      </div>
      <template v-else>
        <el-row v-if="selectedList.length > 0" class="link-role" type="flex">
          <el-col :span="20">
            <el-tag
              v-for="(item, index) in selectedList"
              :key="item.role_id"
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
          prop="id"
          show-overflow-tooltip
          :label="mylang.roleCode"
        />
        <el-table-column
          align="center"
          prop="name"
          show-overflow-tooltip
          :label="mylang.roleName"
        />
        <el-table-column
          align="center"
          prop="remark"
          :label="mylang.remark"
        />
        <el-table-column
          :label="mylang.actions"
          align="center"
          :width="isComponents ? 100 : 180"
        >
          <template slot-scope="scope">
            <template v-if="!isComponents">
              <el-button
                :size="$btnSize"
                type="success"
                @click="goDetailPage(scope.row)"
              >{{ mylang.detail }}</el-button>
              <!-- <el-button
                :size="$btnSize"
                type="primary"
                @click="handleEdit(scope.row)"
              >{{ mylang.modify }}</el-button> -->
              <el-button
                :size="$btnSize"
                type="primary"
                @click="handleAuthority(scope.row)"
              >
                {{ mylang.setAuthority }}
              </el-button>
              <!-- <el-button
                :size="$btnSize"
                type="danger"
                plain
                style="margin-top:5px;"
                @click="handleDeleteItem(scope.row)"
              >{{ mylang.delete }}</el-button> -->
            </template>
            <template v-else>
              <el-button
                :size="$btnSize"
                type="success"
                @click="handleAuthority(scope.row)"
              >
                {{ mylang.readAuthority }}
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <role-dialog-form ref="dialogForm" @confirm="dialogConfirm" />
    <authority-dialog
      ref="authorityDialog"
      :dialog-title="mylang.setAuthority"
      :module-ids.sync="moduleIds"
      :is-edit="!isComponents"
      :is-read="isComponents"
      @confirm="dialogConfirm"
    />
  </div>
</template>

<script>
import authorityDialog from './authorityDialog'
import RoleDialogForm from '../role/components/RoleDialogForm'
import { getRoleList, deleteRole } from '@/api/system'
import deleteCache from '@/mixins/deleteCache'
export default {
  name: 'RoleIndex',
  components: {
    RoleDialogForm,
    authorityDialog
  },
  mixins: [deleteCache],
  props: {
    isComponents: {
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
        name: ''
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
      moduleIds: '',
      selectedList: []
    }
  },
  watch: {
    selectedInfo(val) {
      if (this.isComponents) {
        this.resetSelected()
      }
    }
  },
  created() {
    this.initTableData()
  },
  mounted() {
    this.$_deleteOtherView()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      name = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, name })
    },
    async getList({
      name = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getRoleList({
          page, paginate, name
        })
        this.tableLoading = false
        if (code === 200) {
          this.total = data.total
          this.tableData = data.data || []
          if (this.isComponents) {
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
        name: search.name
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        name: data.name
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      if (!this.isComponents) {
        this.chooseDelArr = data
      }
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'RoleDetail',
        query: {
          id: row.id
        }
      })
    },
    handleCreate() {
      this.$refs.dialogForm.show({
        dialogTitle: `${this.mylang.add}${this.mylang.role}`
      })
    },
    handleEdit(row) {
      if (row) {
        this.$refs.dialogForm.show({
          dialogTitle: `${this.mylang.modify}${this.mylang.role}`,
          disabled: true,
          editId: row.id,
          data: row
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
          this.$refs.dialogForm.show({
            dialogTitle: `${this.mylang.modify}${this.mylang.role}`,
            disabled: true,
            editId: this.chooseDelArr[0].id,
            data: this.chooseDelArr
          })
        }
      }
    },
    handleAuthority(row) {
      this.$refs.authorityDialog.show({ editId: row.id })
      this.moduleIds = row.rules
    },
    handleDeleteItem(row) {
      this.$confirm('即将删除您选中的' + this.mylang.role + '，确认吗？', '删除' + this.mylang.role, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData({ ids: row.id })
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
      this.$confirm('即将删除您选中的' + this.mylang.role + '，确认吗？', '删除' + this.mylang.role, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.chooseDelArr.map(v => v.id).join(',')
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
        const { code } = await deleteRole({ ids })
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
            name: this.realSearch.name
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    dialogConfirm() {
      this.getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        name: this.realSearch.name
      })
    },
    // components函数
    setTableSelection() {
      // 设置表格数据为已选状态
      if (this.selectedList.length > 0) {
        this.selectedList.forEach((row) => {
          const i = this.tableData.findIndex(v => +v.id === +row.role_id)
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
      if (this.isComponents) {
        // 单选
      // 判断是否勾选
        const idx = this.selectedList.findIndex(v => +v.role_id === +row.id)
        if (idx >= 0) {
        // 反选
          this.selectedList.splice(idx, 1)
        } else {
        // 正选
        // 给select选中的数据新增字段
          row.role_id = row.id
          this.selectedList.push(row)
        }
      }
    },
    handleSelectionAll(val) {
      // 点击表格全选
      if (val.length > 0) {
        // 正选
        val.forEach((row) => {
          const idx = this.selectedList.findIndex(v => +v.role_id === +row.id)
          // 如果之前未选中过 则插入数据，选中过则不做处理
          if (idx < 0) {
            row.role_id = row.id
            this.selectedList.push(row)
          }
        })
      } else {
        // 反选
        this.tableData.forEach((row) => {
          const idx = this.selectedList.findIndex(v => +v.role_id === +row.id)
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
      const i = this.tableData.findIndex(v => +v.id === +tag.role_id)
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
