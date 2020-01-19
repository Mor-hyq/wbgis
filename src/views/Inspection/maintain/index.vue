<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane lazy label="设备维护管理" name="1">
        <maintain-index ref="maintain" />
      </el-tab-pane>
      <el-tab-pane lazy label="维护记录" name="2">
        <maintain-record ref="record" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MaintainIndex from './components/MaintainIndex'
import MaintainRecord from './components/MaintainRecord'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'EquipmentMaintain',
  components: {
    MaintainIndex,
    MaintainRecord
  },
  mixins: [deleteCache],
  data() {
    return {
      activeName: this.$store.state.form.maintainTab || '1'
    }
  },
  created() {
    this.$_deleteOtherView()
  },
  methods: {
    handleClick() {
      this.$store.commit('form/SET_MAINTAIN_TAB', this.activeName)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
