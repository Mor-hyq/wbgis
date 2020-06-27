<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="980px"
    top="10vh"
    :before-close="hideDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="custom-dialog"
  >
    <el-form
      :model="form"
    >
      <el-form-item
        prop=""
      />
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '维护登记'
    }
  },
  data() {
    return {
      form: {
        eqType: '',
        eqNum: '',
        eqName: '',
        egi_period_id: '',
        check_mid: '',
        check_time: '',
        low_area: '',
        visual: '',
        water_detector: '',
        deal: '',
        deal_visual: '',
        remark: ''
      }
    }
  },
  methods: {
    hideDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
