<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane lazy label="设备台账" name="1">
        <asset-account />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AssetAccount from './components/assetAccount/AssetAccount'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'EquipmentAccount',
  components: {
    AssetAccount
  },
  mixins: [deleteCache],
  data() {
    return {
      activeName: '1'
    }
  },
  created() {
    this.$_deleteOtherView()
  }
}
</script>

<style lang="scss" scoped>

</style>
