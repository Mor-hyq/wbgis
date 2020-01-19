<template>
  <el-dialog
    :visible.sync="visible"
    :title="dialogTitle"
    custom-class="dialog-custom"
    width="50%"
    append-to-body
    @closed="closed"
  >
    <div class="flex">
      <div
        v-for="item in value"
        :key="item.id"
        class="item"
      >
        <span class="label">{{ item.title }}:</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AssetAccountDialog', // 设备台账明细
  data: function() {
    return {
      dialogTitle: '',
      visible: false,
      value: []
    }
  },
  methods: {
    show(option) {
      this.dialogTitle = option.title
      this.visible = true
      this.value = option.value
    },
    closed() {
      this.value = []
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
    display: flex;
    flex-wrap: wrap;
}
.item {
    flex: 0 0 50%;
    padding: 10px 5px;
    display: flex;
}
.label {
    flex: 0 0 5em;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    font-weight: bold;
}
.value {
    font-size: 13px;
}

</style>
