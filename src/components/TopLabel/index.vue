<template>
  <div class="top-label">
    <span>{{ label }}</span>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .top-label {
    border-bottom: 1px solid #DCDFE6;
    margin-bottom: 10px;
    span {
      display: inline-block;
      line-height: 36px;
      height: 36px;
      font-size: 14px;
      border-bottom: 2px solid #409EFF;
    }
  }
</style>
