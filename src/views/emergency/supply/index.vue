<template>
  <div>
    <!-- <TopLabel :label="$route.meta.title" /> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane lazy :label="mylang.emergencyStaff" name="1">
        <staff-index ref="tab1" />
      </el-tab-pane>
      <el-tab-pane lazy :label="mylang.fireTeam" name="2">
        <fire-team-index ref="tab2" />
      </el-tab-pane>
      <el-tab-pane lazy :label="mylang.emergencyCars" name="3">
        <cars-index ref="tab3" />
      </el-tab-pane>
      <el-tab-pane lazy :label="mylang.emergencySupply" name="4">
        <supply-index ref="tab4" />
      </el-tab-pane>
      <el-tab-pane lazy :label="mylang.assistant" name="5">
        <cooperation-index ref="tab5" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import deleteCache from '@/mixins/deleteCache'
import SupplyIndex from '../components/SupplyIndex'
import StaffIndex from '../components/StaffIndex'
import CarsIndex from '../components/CarsIndex'
import CooperationIndex from '../components/CooperationIndex'
import FireTeamIndex from '../components/FireTeamIndex'
export default {
  name: 'Supply',
  components: {
    SupplyIndex,
    StaffIndex,
    CarsIndex,
    CooperationIndex,
    FireTeamIndex
  },
  mixins: [deleteCache],
  data() {
    return {
      activeName: '1',
      activeTab: ['1']
    }
  },
  mounted() {
    this.$refs['tab' + this.activeName].initTableData()
    this.$_deleteOtherView()
  },
  activated() {
    if (this.$store.state.app.isUpdate) {
      this.$store.commit('app/TOGGLE_UPDATE', false)
      this.$refs['tab' + this.activeName].initTableData()
    }
  },
  methods: {
    handleClick(val) {
      if (!this.activeTab.includes(this.activeName)) {
        this.activeTab.push(this.activeName)
        this.$nextTick(() => {
          this.$refs['tab' + this.activeName].initTableData()
        })
      }
    }
  }
}
</script>

