<template>
  <div>
    <el-form
      :model="form"
      label-suffix=":"
    >
      <el-form-item
        prop="eqType"
        :label="mylang.equipmentType"
      >{{ form.eqType }}</el-form-item>
      <el-form-item
        prop="eqNum"
        :label="mylang.equipmentNumber"
      >{{ form.eqNum }}</el-form-item>
      <el-form-item
        prop="eqName"
        :label="mylang.equipmentName"
      >{{ form.eqName }}</el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
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
  }
}
</script>

<style lang="scss" scoped>

</style>
