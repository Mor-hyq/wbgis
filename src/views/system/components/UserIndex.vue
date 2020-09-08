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
          <el-form-item prop="username" :label="mylang.account">
            <el-input v-model="searchForm.username" :placeholder="`请输入${mylang.account}`" clearable />
          </el-form-item>
          <el-form-item prop="nickname" :label="mylang.realName">
            <el-input v-model="searchForm.nickname" :placeholder="`请输入${mylang.realName}`" clearable />
          </el-form-item>
          <el-form-item prop="mobile" :label="mylang.phone">
            <el-input v-model="searchForm.mobile" :placeholder="`请输入${mylang.phone}`" clearable />
          </el-form-item>
          <el-form-item prop="status" :label="mylang.status">
            <el-select v-model="searchForm.status" clearable :placeholder="`请选择${mylang.status}`">
              <el-option
                v-for="status in statusOptions"
                :key="status.id"
                :value="status.id"
                :label="status.label"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" :size="$btnSize" style="margin-bottom:22px;" @click="handleSearch">{{ mylang.search }}</el-button>
        </el-form>
      </template>
      <div v-if="!isComponents" style="margin-bottom:8px;">
        <el-button type="primary" :size="$btnSize" @click="handleCreate">{{ mylang.add }}</el-button>
        <el-button type="primary" :size="$btnSize" @click="handleEdit(false)">{{ mylang.modify }}</el-button>
        <el-button type="danger" :size="$btnSize" plain @click="handleDelete">{{ mylang.delete }}</el-button>
      </div>
      <el-table
        ref="tables"
        v-loading="tableLoading"
        :data="tableData"
        border
        class="tableBox"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="!isComponents"
          align="center"
          type="selection"
          width="55"
          :selectable="setDisabledFunc"
        />
        <el-table-column
          align="center"
          prop="id"
          :label="mylang.userCode"
        />
        <el-table-column
          align="center"
          prop="username"
          show-overflow-tooltip
          :label="mylang.account"
        />
        <el-table-column
          align="center"
          prop="nickname"
          show-overflow-tooltip
          :label="mylang.realName"
        />
        <el-table-column
          align="center"
          prop="department_name"
          show-overflow-tooltip
          :label="mylang.department"
        />
        <el-table-column
          width="100"
          align="center"
          :label="mylang.status"
          prop="status"
          class-name="switch-column"
        >
          <template slot-scope="scope">
            <div
              v-if="!isComponents && +scope.row.id !== +userInfo.id"
              class="switch-mask"
              @click="handleSwitch(scope.row)"
            />
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              class="account-switch"
              :width="60"
              active-color="#409EFF"
              inactive-color="#ff4949"
              :active-text="mylang.open"
              :inactive-text="mylang.ban"
              :disabled="scope.row | filterUid(userInfo.id, isComponents)"
              @change="swichOpen(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="mobile"
          show-overflow-tooltip
          :label="mylang.phone"
        />
        <el-table-column
          v-if="!isComponents"
          :label="mylang.actions"
          align="center"
          width="280"
        >
          <template slot-scope="scope">
            <el-button
              :size="$btnSize"
              type="success"
              @click="goDetailPage(scope.row)"
            >{{ mylang.detail }}</el-button>
            <el-button
              :size="$btnSize"
              type="primary"
              :disabled="scope.row | filterUid(userInfo.id)"
              @click="handleLink(scope.row)"
            >{{ mylang.linkRole }}</el-button>
            <el-button
              :size="$btnSize"
              type="primary"
              :disabled="scope.row | filterUid(userInfo.id)"
              style="margin-top:5px;"
              @click="handlePassword(scope.row)"
            >{{ mylang.modify + mylang.password }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </my-table>
    <user-dialog-form ref="dialogForm" @confirm="dialogConfirm" />
    <user-dialog-link ref="dialogLink" @confirm="dialogConfirm" />
    <password-dialog :id="cid" ref="changePassword" :name="cname" />
  </div>
</template>

<script>
import UserDialogLink from '../user/components/UserDialogLink'
import UserDialogForm from '../user/components/UserDialogForm'
import PasswordDialog from '@/components/PasswordDialog'
import { getUserList, deleteUser, editUser } from '@/api/system'
import { mapGetters } from 'vuex'
export default {
  name: 'UserIndex',
  filters: {
    filterUid(row, userId, isComponents) {
      if (isComponents) {
        return true
      } else {
        return +row.id === +userId
      }
    }
  },
  components: {
    UserDialogForm,
    UserDialogLink,
    PasswordDialog
  },
  props: {
    isComponents: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {
        username: '',
        nickname: '',
        mobile: '',
        status: ''
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
      statusOptions: this.$store.state.form.userStatus,
      cid: '',
      cname: ''
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.initTableData()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit,
      username = '',
      nickname = '',
      mobile = '',
      status = ''
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate, username, nickname, mobile, status })
    },
    async getList({
      username = '',
      nickname = '',
      mobile = '',
      status = '',
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getUserList({
          page, paginate, username, nickname, mobile, status
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
        username: search.username,
        nickname: search.nickname,
        mobile: search.mobile,
        status: search.status
      })
    },
    handleChange(data) {
    // 切换分页
      this.getList({
        page: data.page.page,
        paginate: data.page.limit,
        username: data.username,
        nickname: data.nickname,
        mobile: data.mobile,
        status: data.status
      })
    },
    // 复选框选中事件
    handleSelectionChange(data) {
      this.chooseDelArr = data
    },
    goDetailPage(row) {
      this.$router.push({
        name: 'UserDetail',
        query: {
          id: row.id
        }
      })
    },
    handleCreate() {
      this.$refs.dialogForm.show({
        dialogTitle: `${this.mylang.add}${this.mylang.account}`
      })
    },
    handleEdit(row) {
      if (row) {
        this.$refs.dialogForm.show({
          dialogTitle: `${this.mylang.modify}${this.mylang.account}`,
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
            dialogTitle: `${this.mylang.modify}${this.mylang.account}`,
            disabled: true,
            editId: this.chooseDelArr[0].id,
            data: this.chooseDelArr[0]
          })
        }
      }
    },
    handleLink(row) {
      this.$refs.dialogLink.show({
        editId: row.id
      })
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
        const { code } = await deleteUser({ ids })
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
            username: this.realSearch.username,
            nickname: this.realSearch.nickname,
            mobile: this.realSearch.mobile,
            status: this.realSearch.status
          })
        }
      } catch (error) {
        loading.close()
      }
    },
    handleSwitch(row) {
      const str = +row.status === 1 ? this.mylang.ban : this.mylang.open
      this.$confirm(`即将${str}您选中的${this.mylang.account}，确认吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.swichOpen(row)
      })
    },
    // 开关事件 更新账户状态
    async swichOpen(row) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        // 需要改变的状态
        const status = +row.status === 1 ? 0 : 1
        const { code } = await editUser({
          id: row.id,
          status: status
        })
        loading.close()
        if (code === 200) {
          // 状态改变
          row.status = +row.status === 1 ? 0 : 1
        }
      } catch (error) {
        loading.close()
      }
    },
    setDisabledFunc(data) {
      return +data.id !== +this.userInfo.id
    },
    dialogConfirm() {
      this.getList({
        page: this.listQuery.page,
        pageSize: this.listQuery.limit,
        username: this.realSearch.username,
        nickname: this.realSearch.nickname,
        mobile: this.realSearch.mobile,
        status: this.realSearch.status
      })
    },
    handlePassword(row) {
      this.cid = row.id
      this.cname = row.username
      this.$refs.changePassword.show()
    }
  }
}
</script>

<style lang="scss" scoped>
    .account-switch{
  position: relative;
  /deep/ {
    .el-switch__label--left{
      position: absolute;
      left: 22px;
      margin-right: 0;
      z-index: -1;
      color: #fff !important;
    }
    .el-switch__label--right{
      position: absolute;
      right: 22px;
      margin-left: 0;
      z-index: -1;
      color: #fff !important;
    }
    .el-switch__label--right.is-active{
      z-index: 10;
    }
    .el-switch__label--left.is-active{
      z-index: 10;
    }
  }
}
.tableBox {
  /deep/ .switch-column {
    .cell {
      position: relative;
    }
    .switch-mask {
      position: absolute;
      top: 0;
      left: 10px;
      right: 10px;
      height: 100%;
      z-index: 100;
      cursor: pointer;
    }
  }
}
</style>
