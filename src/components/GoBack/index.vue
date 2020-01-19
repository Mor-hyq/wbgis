<template>
  <div class="back" @click="goBack"><span class="icon"><i class="el-icon-back" /></span>返回</div>
</template>

<script>
export default {
  name: 'GoBack',
  methods: {
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.back {
    display: inline-block;
    padding-right: 10px;
    line-height: 30px;
    padding-top: 8px;
    cursor: pointer;
    color: #606266;
    font-size: 15px;
    &:hover {
        color: #409EFF;
        .icon {
            border-color: #409EFF;
        }
    }
    .icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 100%;
        border: 1px solid #333;
        text-align: center;
        margin-right: 8px;
    }
}
</style>
