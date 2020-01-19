<template>
  <el-button class="sms-btn" type="primary" :disabled="issend" @click="send">{{ btnName }}</el-button>
</template>
<script>
export default {
  name: 'ClockDown',
  data() {
    return {
      clocktime: 60,
      timer: null
    }
  },
  computed: {
    issend() {
      return this.clocktime !== 60
    },
    btnName() {
      return this.issend ? `${this.clocktime}s` : '获取验证码'
    }
  },
  methods: {
    send() {
      // 倒计时状态 无法触发父组件事件
      if (!this.issend) {
        this.$emit('click')
      }
    },
    getCode() {
      if (this.issend) {
        return
      }
      this.clockDown()
    },
    clockDown() {
      let i = 59
      this.clocktime = 59
      this.timer = setInterval(() => {
        if (i-- > 0) {
          this.clocktime = i
        } else {
          this.restClock()
        }
      }, 1000)
    },
    restClock() {
      clearInterval(this.timer)
      this.clocktime = 60
    }
  }
}
</script>

<style lang="scss" scoped>
.sms-btn {
    width: 110px;
}
</style>
