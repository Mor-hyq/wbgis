<template>
  <div>
    <go-back />
    <el-tabs v-model="activeName">
      <!-- 基础信息 -->
      <el-tab-pane :label="mylang.baseInfo" name="first">
        <el-form
          class="custom-class"
          label-width="80px"
          label-suffix=":"
          :size="$btnSize"
          disabled
        >
          <el-form-item :label="`${mylang.roleName}`">
            <el-input v-model="roleInfo.name" />
          </el-form-item>
          <el-form-item :label="`${mylang.remark}`">
            <el-input v-model="roleInfo.remark" type="textarea" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- 功能权限 -->
      <el-tab-pane :label="mylang.authorityInfo" name="second">
        <div style="width:50%;">
          <set-authority :is-read="true" :module-ids="roleInfo.rules" />
        </div>
      </el-tab-pane>
      <!-- 角色账户 -->
      <el-tab-pane :label="mylang.userInfo" name="three">
        <!-- <role-account :is-read="true" /> -->
        <user-index :is-components="true" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getRoleDetail } from '@/api/system'
import SetAuthority from '../components/SetAuthority'
import UserIndex from '../components/UserIndex'
export default {
  name: 'RoleDetail',
  components: {
    SetAuthority,
    UserIndex
  },
  data() {
    return {
      id: this.$route.query.id || '',
      activeName: 'first',
      roleInfo: {}
    }
  },
  created() {
    this.getRoleDetail()
  },
  methods: {
    async getRoleDetail() {
      try {
        const { code, data } = await getRoleDetail({ id: this.id })
        if (code === 200) {
          this.roleInfo = data
        }
      } catch (error) {
        //
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
