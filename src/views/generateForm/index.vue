<template>
  <div class="custom-form" style="height:100%;">
    <form-making :id="id" preview clearable />
  </div>
</template>

<script>
import FormMaking from './components/Container'
export default {
  components: {
    FormMaking
  },
  data() {
    return {
      id: ''
    }
  },
  created() {
    this.id = this.$route.query.id || ''
  },
  methods: {
    getform() {
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-form {
  /deep/ {
    @import './components/styles/cover.scss';
    @import './components/iconfont/iconfont.css';
    @import './components/styles/index.scss';
  }
}
</style>
