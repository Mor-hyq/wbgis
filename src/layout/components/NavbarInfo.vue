<template>
  <div class="right-menu">
    <!-- <el-dropdown
      class="message-container"
      trigger="hover"
    >
      消息内容 无接口先写死
      <div class="message-wrapper">
        <i class="el-icon-message-solid" />
        消息
        <span class="nums">1</span>
      </div>
      <el-dropdown-menu slot="dropdown" class="message-dropdown">
        <el-dropdown-item>
          <div class="empty-box">暂无消息！</div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="title">
            <span>消息</span>
            <span class="more">查看更多</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="message">
            <div class="tit">
              <span>来自 职工社区</span>
              <span>2019-07-22 08:38:49</span>
            </div>
            <p class="cont" @click="goMessageDetail">林忠义申请创建到位，请审核。</p>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->
    <el-dropdown
      class="avatar-container"
      trigger="click"
    >
      <div class="avatar-wrapper">
        <el-badge :hidden="!warningNum" :value="warningNum" is-dot class="badge">
          <i class="el-icon-s-custom" />
        </el-badge>
        <span>{{ userInfo.username }}</span>
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item>
          <div @click="handleNotify">
            <i class="el-icon-warning-outline" />
            <el-badge :hidden="!warningNum" :value="warningNum" class="badge2">
              消息通知</el-badge>
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div @click="changePassword">
            <i class="el-icon-s-help" />
            修改密码
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div @click="logout">
            <i class="el-icon-d-arrow-right" />
            退出系统</div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <password-dialog :id="userInfo.id" ref="passwordDialog" :name="userInfo.username" />
  </div>
</template>

<script>
import { logout } from '@/api/login'
import { mapGetters } from 'vuex'
// import { isExternal } from '@/utils/validate'
// import config from '@/config'
import PasswordDialog from '@/components/PasswordDialog'
import notify from '@/utils/notify'

export default {
  components: {
    PasswordDialog
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'warningNum'
    ])
  },
  methods: {
    async logout() {
      const loading = this.$loading({
        lock: true,
        text: '正在退出',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await logout()
        loading.close()
        if (code === 200) {
          await this.$store.dispatch('user/resetToken')
          // 跳转至登录页面
          let redirect = `redirect=${encodeURIComponent(this.$route.fullPath)}`
          redirect += this.$route.name ? `&redirectName=${this.$route.name}` : ''
          this.$router.push(`/login?${redirect}`)
        }
      } catch (error) {
        loading.close()
      }
    },
    changePassword() {
      this.$refs.passwordDialog.show()
    },
    handleNotify() {
      notify()
    },
    goUserPage() {
      // const url = document.location.protocol + '//' + document.domain + '/web/index.php?c=user&a=profile&'
      // window.location.href = url
      // if (isExternal(url)) {
      //   window.location.href = url
      // } else {
      //   this.$router.push({
      //     path: url
      //   })
      // }
    }
    // goMessageDetail(url) {
    //   if (isExternal(url)) {
    //     window.location.href = url
    //   } else {
    //     this.$router.push({
    //       path: url
    //     })
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
.badge {
  /deep/ .el-badge__content.is-fixed {
    top: 15px;
  }
}
.badge2 {
  /deep/ .el-badge__content.is-fixed {
    top: 4px;
  }
}
.right-menu {
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .message-container {
      padding: 0 10px;
      margin-right: 10px;
      .message-wrapper {
        position: relative;
        color: #fff;
        line-height: $headerHeight;
        font-size: 16px;
        cursor: pointer;
        .nums {
          position: absolute;
          top: 10px;
          left: 12px;
          min-width: 18px;
          padding: 3px 4px;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
          color: #fff;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          background-color: #ff0030;
          border-radius: 10px;
        }
      }
    }

    .avatar-container {
        padding: 0 10px;
      .avatar-wrapper {
        position: relative;
        color: #fff;
        line-height: $headerHeight;
        font-size: 16px;
        cursor: pointer;
      }
    }
  }
  .el-dropdown-menu {
    margin-top: 5px;
    &.message-dropdown {
        width: 300px;
        height: 500px;
        overflow-y: auto;
        box-shadow: 0 6px 12px rgba(0,0,0,.175);
        .el-dropdown-menu__item {
          padding: 0 10px;
        }
      .title {
        display: flex;
        justify-content: space-between;
        height: 45px;
        line-height: 45px;
        color: #333;
        font-size: 14px;
        .more {
          &:hover {
            color: #428bca;
          }
        }
      }
      .message {
        font-size: 12px;
        line-height: 1.6;
        color: #333;
        .tit {
          display: flex;
          justify-content: space-between;
          color: #999;
          margin-bottom: 10px;
        }
        .cont {
          margin: 0;
          &:hover {
            color: #428bca;
          }
        }
      }
      .empty-box {
        padding: 50px 20px;
        text-align: center;
      }
    }
  }

</style>
