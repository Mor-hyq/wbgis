<template>
  <div>
    <go-back />
    <!-- 基础信息 -->
    <el-tabs v-model="activeName">
      <el-tab-pane :label="mylang.baseInfo" name="first">
        <el-form
          class="custom-class"
          label-width="80px"
          label-suffix=":"
          :size="$btnSize"
          disabled
        >
          <el-row :gutter="25">
            <el-col :span="12">
              <el-form-item :label="`${mylang.userCode}`">
                <el-input v-model="userInfo.code" />
              </el-form-item>
              <el-form-item :label="`${mylang.realName}`">
                <el-input v-model="userInfo.nickname" />
              </el-form-item>
              <el-form-item :label="mylang.department">
                <el-input v-model="userInfo.department_name" />
              </el-form-item>
              <el-form-item :label="mylang.phone">
                <el-input v-model="userInfo.mobile" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`${mylang.account}`">
                <el-input v-model="userInfo.username" />
              </el-form-item>
              <el-form-item :label="mylang.sex">
                <span>{{ filterSex(userInfo.sex) }}</span>
              </el-form-item>
              <el-form-item :label="mylang.job">
                <el-input v-model="userInfo.position" />
              </el-form-item>
              <el-form-item :label="mylang.userStatus">
                <el-switch
                  v-model="userInfo.status"
                  class="account-switch"
                  :width="60"
                  :active-value="1"
                  :inactive-value="0"
                  :active-text="mylang.open"
                  :inactive-text="mylang.ban"
                  active-color="#409EFF"
                  inactive-color="#ff4949"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <!-- 用户角色 -->
      <el-tab-pane :label="mylang.userRole" name="second">
        <el-table
          ref="userTables"
          :data="userInfo.role"
          border
          class="tableBox"
          tooltip-effect="dark"
        >
          <el-table-column
            align="center"
            prop="name"
            :label="mylang.roleName"
          />
          <el-table-column
            align="center"
            prop="remark"
            :label="mylang.remark"
          >
            <template slot-scope="scope">
              {{ scope.row.remark || '无' }}
            </template>
          </el-table-column>
          <el-table-column
            :label="mylang.actions"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                :size="$btnSize"
                type="primary"
                @click="showAuthority(scope.row)"
              >{{ mylang.readAuthority }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 权限信息 -->
      <el-tab-pane :label="mylang.authorityInfo" name="three">
        <div style="width:50%;">
          <set-authority :is-read="true" :module-ids="moduleIds" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <authority-dialog
      ref="authorityDialog"
      is-read
      :dialog-title="mylang.authorityInfo"
      :module-ids.sync="itemModuleIds"
    />

  </div>
</template>

<script>
import { getUserDetail } from '@/api/system'
import SetAuthority from '../components/SetAuthority'
import authorityDialog from '../components/authorityDialog'

export default {
  name: 'UserDetail',
  components: {
    SetAuthority,
    authorityDialog
  },
  data() {
    return {
      id: this.$route.query.id || '',
      activeName: 'first',
      userInfo: {},
      moduleIds: '',
      itemModuleIds: ''
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    async getUserDetail() {
      try {
        const { code, data } = await getUserDetail({ id: this.id })
        if (code === 200) {
          this.userInfo = data
          if (data.role && data.role.length > 0) {
            // this.moduleIds = data.role.map(v => v.role_id).join(',')
            this.moduleIds = data.menu.join(',')
          } else {
            this.moduleIds = ''
          }
        }
      } catch (error) {
        //
      }
    },
    filterSex(val) {
      let name = ''
      switch (+val) {
        case 0:
          name = '女'
          break
        case 1:
          name = '男'
          break
        case 2:
          name = '保密'
          break
        default:
          name = '保密'
          break
      }
      return name
    },
    showAuthority(row) {
      this.$refs.authorityDialog.show()
      this.itemModuleIds = row.rules
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
</style>
