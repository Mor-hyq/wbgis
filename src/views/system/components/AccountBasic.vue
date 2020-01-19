<template>
  <div>
    <el-form ref="ruleForm" class="defined-class" :model="form" label-suffix=":" label-width="95px" :rules="isRead ? {} :rules">
      <!-- 账户名 -->
      <el-form-item :label="`${mylang.userName}`" prop="username">
        <el-input
          v-model="form.username"
          style="width:400px"
          :maxlength="150"
          clearable
          :disabled="isRead"
          :placeholder="`请输入${mylang.userName}`"
        />
      </el-form-item>
      <!-- 姓名 -->
      <el-form-item :label="`${mylang.realName}`" prop="real_name">
        <el-input
          v-model="form.real_name"
          style="width:400px"
          clearable
          :disabled="isRead"
          :maxlength="150"
          :placeholder="`请输入${mylang.realName}`"
        />
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item :label="`${mylang.phone}`" prop="phone">
        <el-input
          v-model="form.phone"
          style="width:400px"
          clearable
          :disabled="isRead"
          :maxlength="150"
          :placeholder="`请输入${mylang.phone}`"
        />
      </el-form-item>
      <!-- 所属工会 改成管理范围 创建时必填，创建完不可修改 -->
      <el-form-item :label="`${mylang.manageArea}`" prop="union_id">
        <el-input
          v-model="form.union_name"
          clearable
          class="union-class"
          style="width:400px;"
          autocomplete="off"
          auto-complete="off"
          :disabled="isRead || isEdit"
          :placeholder="`请选择${mylang.manageArea}`"
          @focus="showManageTree"
          @clear="clearManageUnion"
        />
      </el-form-item>
      <!-- 管理范围改成巡检范围 -->
      <!-- <el-form-item :label="`${mylang.viewArea}`" prop="union_ids">
        <template v-if="isRead">
          <p class="manage-area" @click="showViewTree">{{ form.union_names }}</p>
          <p v-if="form.union_names" class="tips" @click="showViewTree">（点击文字查看更多内容）</p>
        </template>
        <template v-else>
          <el-input
            v-model="form.union_names"
            clearable
            class="union-class"
            style="width:400px;"
            autocomplete="off"
            auto-complete="off"
            :disabled="isRead"
            :placeholder="`请选择${mylang.viewArea}`"
            @focus="showViewTree"
            @clear="clearViewUnion"
          />
        </template>
      </el-form-item> -->
      <!-- 关联会员 -->
      <el-form-item :label="`${mylang.memberLink}`" prop="mid">
        <!-- <span v-if="form.mid" style="margin-right: 10px;">{{ form.mid_name }}</span> -->
        <el-tag
          v-if="form.mid"
          :closable="!isRead"
          @close="handleClose"
        >{{ form.mid_name }}</el-tag>
        <el-button v-if="!isRead" type="primary" size="small" @click="showVip">{{ mylang.choose }}</el-button>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item :label="`${mylang.status}`" prop="status">
        <el-switch
          v-model="form.status"
          class="account-switch"
          :width="60"
          :active-value="1"
          :inactive-value="0"
          :disabled="isRead"
          active-text="启用"
          inactive-text="禁用"
          active-color="#409EFF"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <!-- 是否锁定 -->
      <el-form-item v-if="!isCreate" :label="`是否${mylang.lock}`" prop="lock">
        <el-switch
          v-model="form.lock"
          :width="80"
          class="account-switch"
          :active-value="1"
          :inactive-value="0"
          :disabled="isRead"
          active-text="已锁定"
          inactive-text="未锁定"
          inactive-color="#409EFF"
          active-color="#ff4949"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item v-if="!isRead" :label="`${mylang.password}`" prop="password">
        <!-- 避免浏览器自动填充密码 -->
        <input type="text" tabindex="-1" autocomplete="off" style="width:0;height:0;position:absolute;left:-9999px;top:-9999px;">
        <el-input
          v-model="form.password"
          type="password"
          style="width:400px"
          clearable
          autocomplete="new-password"
          auto-complete="new-password"
          :maxlength="150"
          :placeholder="`请输入${mylang.password}`"
        />
      </el-form-item>
      <el-form-item v-if="!isRead" :label="`确认${mylang.password}`" prop="confirm_password">
        <el-input
          v-model="form.confirm_password"
          type="password"
          style="width:400px"
          clearable
          autocomplete="new-password"
          auto-complete="new-password"
          :maxlength="150"
          :placeholder="`请再次输入${mylang.password}`"
        />
      </el-form-item>
    </el-form>
    <!-- 选择管理范围工会弹窗 -->
    <union-tree
      ref="unionTrees"
      :dialog-title="`选择${mylang.manageArea}`"
      :is-multiple="false"
      :module-name.sync="form.union_name"
      :module-ids="form.union_id"
      :is-read="isRead"
      :is-account-tree="true"
      :is-confirm-request="true"
      @confirm="setManageUnionValue"
    />
    <!-- 选择巡检范围弹窗 -->
    <union-tree
      ref="manageUnionTree"
      :dialog-title="`选择${mylang.viewArea}`"
      :is-multiple="true"
      :module-name.sync="form.union_names"
      :module-ids="form.union_ids"
      :is-read="isRead"
      :is-account-tree="true"
      :is-link-only-brother="true"
      @confirm="setViewUnionValue"
    />
  </div>
</template>

<script>
import { validatePhoneFunc, validatePasswordFunc, validateAccountFunc, validateRealNameFunc } from '@/utils/validateFunc'
import UnionTree from '@/components/UnionTree'
export default {
  components: {
    UnionTree
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isRead: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (rule.required) {
      // 必填时的校验
        if (!this.form.password) {
          callback(new Error('请先输入密码'))
        } else if (value === '') {
          callback(new Error('请输入确认密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        // 非必填时校验
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
    return {
      defaultProps: { // 树默认属性
        children: 'children',
        label: 'name'
      },
      userRoleIds: '', // 选择管理范围后的管理角色相关id
      form: { // 新增账号表单
        username: '',
        mid: '',
        mid_name: '',
        real_name: '',
        phone: '',
        union_id: '',
        union_name: '',
        status: 1,
        lock: 0,
        union_ids: '',
        union_names: '',
        password: '',
        confirm_password: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'change', message: '请输入账户名' },
          { trigger: 'change', validator: validateAccountFunc, accountTip: '账户名' }
        ],
        real_name: [
          { required: true, trigger: 'change', message: '请输入姓名' },
          { trigger: 'change', validator: validateRealNameFunc, accountTip: '姓名' }
        ],
        phone: [
          { required: true, trigger: 'blur', message: '请输入手机号' },
          { trigger: 'blur', validator: validatePhoneFunc }
        ],
        union_id: [
          { required: true, trigger: 'change', message: '请选择管理范围' }
        ],
        union_ids: [
          { required: false, trigger: 'change', message: '请选择巡检范围' }
        ]
      },
      passwordRule1: {
        password: [
          { required: true, trigger: 'blur', message: '请填写密码' },
          { required: true, trigger: 'blur', validator: validatePasswordFunc }
        ],
        confirm_password: [
          { required: true, trigger: 'blur', validator: validatePass2 }
        ]
      },
      passwordRule2: {
        password: [
          { required: false, trigger: 'blur', validator: validatePasswordFunc }
        ],
        confirm_password: [
          { required: false, trigger: 'blur', validator: validatePass2 }
        ]
      }
    }
  },
  computed: {
    isCreate() {
      return !this.isEdit && !this.isRead
    }
  },
  watch: {
    editData(newVal) {
      this.getDetail(newVal)
    },
    'form.union_id'(newVal, oldVal) {
      // 监听管理范围变化
      this.$emit('changeUnionIds', true)
    }
  },
  created() {
    if (this.isRead) {
      this.rules = {}
    } else {
      if (this.isEdit) {
        Object.assign(this.rules, this.passwordRule2)
      } else {
        Object.assign(this.rules, this.passwordRule1)
      }
    }
  },
  methods: {
    getDetail(data) {
      this.form.username = data.username || ''
      this.form.mid = data.mid || ''
      this.form.real_name = data.real_name || ''
      this.form.mid_name = data.member_name || ''
      this.form.phone = data.phone || ''
      this.form.status = +data.status
      this.form.lock = data.lock ? 1 : 0
      this.form.union_id = data.union_id || ''
      this.form.union_name = data.union_name || ''
      this.form.union_ids = data.union_ids || ''
      const unionNames = data.unions ? data.unions.map(v => v.name).join(',') : ''
      this.form.union_names = unionNames || ''
    },
    toValidate(cb) {
      // 触发表单提交验证
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          // 验证通过
          cb && cb({ ...this.form })
        } else {
          cb && cb(false)
        }
      })
    },
    handleVipConfirm(data) {
      // 接收传递的值 vipdialog弹窗值
      this.form.mid = data.ids
      this.form.mid_name = data.names
    },
    // 删除关联会员
    handleClose() {
      this.form.mid = ''
      this.form.mid_name = ''
    },
    // 显示管理范围
    showManageTree() {
      this.$refs.unionTrees.showTree()
    },
    // 获取选中工会id并设置管理范围表单值
    setManageUnionValue(data) {
      this.form.union_id = data.value
      // this.userRoleIds = data.userUnionInfo.user_role_ids
      this.userRoleIds = data.userUnionInfo
    },
    // 点击清空管理范围数据
    clearManageUnion() {
      this.form.union_id = ''
    },
    // 显示所属工会
    showViewTree() {
      this.$refs.manageUnionTree.showTree()
    },
    // 获取选中工会id并设置巡检值
    setViewUnionValue(data) {
      this.form.union_ids = data.value
    },
    // 点击清空巡检数据
    clearViewUnion() {
      this.form.union_ids = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.union-class {
  /deep/ input {
    text-overflow: ellipsis;
  }
}
.manage-area {
  cursor: pointer;
  color: #409EFF;
  margin: 0;
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    color: rgb(15, 128, 241);
  }
}
.tips {
  color: #97a8be;
  font-size: 12px;
  margin: 0;
}
.defined-class {
  /deep/ .el-input.is-disabled .el-input__inner {
    background-color: transparent;
    border-color: transparent;
    color: inherit;
    cursor: default;
    padding-left: 0;
  }
  /deep/ .el-switch.is-disabled {
    opacity: 1;
  }
}
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
