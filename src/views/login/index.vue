<template>
  <div class="login-container">
    <div class="top">
      <div class="logo"><img :src="logoIcon" alt=""></div>
      <div class="content">
        <div class="form">
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <el-form-item prop="username">
              <span class="icon icon-user" />
              <el-input
                ref="username"
                v-model="loginForm.username"
                clearable
                placeholder="请输入用户名"
                name="username"
                type="text"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="icon icon-psw" />
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                clearable
                placeholder="请输入密码"
                name="password"
                @keyup.enter.native="handleLogin"
              />
              <!-- <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span> -->
            </el-form-item>

            <!-- <el-form-item v-if="isNeedSmsCode" prop="phone">
              <span class="svg-container">

              </span>
              <el-input
                ref="phone"
                v-model="loginForm.phone"
                clearable
                placeholder="请输入手机号码"
                name="phone"
                type="text"
              />
            </el-form-item> -->
            <!--
            <div v-if="isNeedSmsCode" type="flex" class="tips">
              <div>
                <el-form-item style="margin-bottom:0;" prop="smscode">
                  <el-input
                    ref="smscode"
                    v-model="loginForm.smscode"
                    clearable
                    placeholder="请输入验证码"
                    name="smscode"
                    type="text"
                    @keyup.enter.native="handleLogin"
                  />
                </el-form-item>
              </div>
              <div>
                <clock-down ref="clockDown" @click="getSmsCode" />
              </div>
            </div> -->

            <!-- <div class="tips">
              <el-checkbox v-model="loginForm.isremember">记住我</el-checkbox>
              <el-button type="primary" size="mini" @click="resetPassword">忘记密码</el-button>
            </div> -->

            <el-button class="login-btn" :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>
          </el-form>
        </div>
      </div>

    </div>
    <div class="footer">北京宏信环科科技发展有限公司</div>
  </div>
</template>

<script>
import { validatePasswordFunc, validateSmsCodeFunc, validatePhoneFunc } from '@/utils/validateFunc'
import { getCsrfToken, sendCode, login } from '@/api/login'
// import { getRouteAuth } from '@/api/common'
// import config from '@/config'
import { mapGetters } from 'vuex'
import notify from '@/utils/notify'

// import { getLoginStatus } from '@/utils/auth'
// import ClockDown from '@/components/ClockDown'
// import { lowerFirst } from 'lodash'
export default {
  name: 'Login',
  components: {
    // ClockDown
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        phone: '',
        smscode: '',
        isremember: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', validator: validatePasswordFunc }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhoneFunc }],
        smscode: [{ required: true, trigger: 'blur', validator: validateSmsCodeFunc }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      errorMessage: '',
      logoIcon: require('@/assets/images/login/logo.png')
    }
  },
  computed: {
    // isNeedSmsCode() {
    //   // 暂时登录不发送短信
    //   return false
    // },
    ...mapGetters([
      'isLogin'
    ])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    // 删除403状态触发的锁住状态
    if (sessionStorage.getItem('loginLock')) {
      sessionStorage.removeItem('loginLock')
    }
  },
  methods: {
    // 获取token
    async getCSRFToken() {
      try {
        const { code, data } = await getCsrfToken()
        if (code === 200) {
          // 存储token
          this.$store.commit('user/SET_TOKEN', data)
        }
      } catch (error) {
        //
      }
    },
    // 获取验证码
    async getSmsCode() {
      let errNum = 0
      // 校验表单phone和username项
      this.$refs.loginForm.validateField(['phone', 'username'], (error) => {
        if (!error) {
          errNum += 1
        }
      })
      if (errNum === 2) {
        try {
          const { code } = await sendCode({
            phone: this.loginForm.phone.trim(),
            username: this.loginForm.username.trim()
          })
          if (code === 200) {
            this.$message({
              message: '发送成功',
              type: 'success'
            })
            // 触发组件倒计时功能
            this.$refs.clockDown.getCode()
          }
        } catch (error) {
          //
        }
      }
    },

    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) {
          this.loading = true
          try {
            // 获取csrftoken
            const result = await getCsrfToken()
            if (result.code === 200) {
              // 存储token
              this.$store.commit('user/SET_TOKEN', result.data)
              // 获取成功后触发登录接口
              const { code, msg, data } = await login({
                username: this.loginForm.username.trim(),
                password: this.loginForm.password.trim(),
                csrftoken: result.data,
                sms_code: this.loginForm.smscode.trim()
              })
              if (code === 200) {
                // 存储用户信息
                this.$store.commit('user/SET_USERINFO', data)
                // this.$store.commit('user/SET_USERNAME', data.username)
                // this.$store.commit('user/SET_LOGIN', getLoginStatus())
                this.$store.commit('user/SET_LOGIN', result.data)
                this.errorMessage = ''
                const newPath = this.redirect || '/'
                this.loading = false
                this.$router.push({ path: newPath })
                notify()
              } else {
                this.errorMessage = msg
                this.loading = false
              }
            } else {
              this.loading = false
            }
          } catch (error) {
            this.loading = false
          }
        } else {
          return false
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    resetPassword() {
      // 忘记密码
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
// $light_gray:#fff;
// $cursor: #fff;
$light_gray:#333;
$cursor: #333;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 40px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  .top {
    position: relative;
    height: 62vh;
    background-image: url("../../assets/images/login/login.jpg");
    background-size: cover;
    background-position: center bottom;
    background-repeat: no-repeat;
  }
  .logo {
    position: absolute;
    top: 8vh;
    left: 0;
    right: 0;
    img {
      display: block;
      width: 300px;
      margin: auto;
    }
  }
  .footer {
    position: absolute;
    bottom: 8vh;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 14px;
    color: #294e70;
  }
  .content {
    position: absolute;
    // top: 34vh;
    bottom: -100px;
    left: 50%;
    z-index: 10;
    transform: translate3d(-50%,0,0);
    .form {
      position: relative;
      margin: auto;
      width: 400px;
      padding: 52px 48px 45px;
      background: hsla(0,26%,96%,.4);
      border-radius: 8px;
      box-shadow: 0 2px 4px 0 rgba($color: #000000, $alpha: 0.2);
      .error-message {
        position: absolute;
        top: 22px;
        left: 50px;
        margin: 0;
        line-height: 1;
        color: #F56C6C;
        font-size: 13px;
      }
      .login-form {
        position: relative;
        max-width: 100%;
        margin: 0 auto;
        overflow: hidden;
        /deep/ .el-form-item {
          background: transparent;
          border-radius: 0px;
          .el-form-item__content {
            padding-left: 15px;
            border-radius: 5px;
            line-height: inherit;
            background-color: #fff;
            // box-shadow: 0 0 2px 1px rgba($color: #000000, $alpha: 0.1);
            border: 1px solid #ededed;
          }
          .el-input {
            width: 87%;
            input {
              padding: 8px 5px;
              height: 40px;
            }
          }
        }
        .tips {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          font-size: 16px;
        }
      }
    }
  }
  // .svg-container {
  //   padding: 5px 5px 5px 10px;
  //   color: $dark_gray;
  //   vertical-align: middle;
  //   width: 30px;
  //   font-size: 20px;
  //   display: inline-block;
  // }
  .icon {
    display: inline-block;
    width: 25px;
    height: 40px;
    vertical-align: top;
    background-repeat: no-repeat;
    background-position: center center;
    &.icon-user {
      background-image: url('../../assets/images/login/icon_user.png')
    }
    &.icon-psw {
      background-image: url('../../assets/images/login/icon_psw.png')
    }
  }
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .login-btn {
    width: 100%;
    // background-color: #47a6ff;
    // &:hover {
    //   opacity: 0.8;
    // }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
