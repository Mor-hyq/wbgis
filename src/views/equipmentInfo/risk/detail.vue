<template>
  <div>
    <go-back />
    <div class="top">
      <span class="name">风险名称：</span>
      <strong class="t-info">{{ info.name }}</strong>
      <span class="name left-m">风险等级：</span>
      <strong v-if="info.level" class="t-red">{{ filterRisk(info.level) }}</strong>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      class="tableBox"
      tooltip-effect="dark"
    >
      <!-- <el-table-column
        align="center"
        prop="mileage"
        :label="mylang.mileage"
      /> -->
      <el-table-column
        align="center"
        prop="lng"
        :label="`${mylang.lng}(°)`"
      />
      <el-table-column
        align="center"
        prop="lat"
        :label="`${mylang.lat}(°)`"
      />
      <el-table-column
        align="center"
        prop="sort"
        :label="mylang.sort"
      />
    </el-table>
  </div>
</template>

<script>
import {
  getRiskDetail,
  getRiskRouteList
} from '@/api/system'
export default {
  name: 'TunnelRiskRouterDetail',
  data() {
    return {
      tableLoading: false,
      tableData: [],
      id: this.$route.params.id || '',
      info: {},
      levelOptions: []
    }
  },
  created() {
    this.getLevelOptions()
    this.getList()
    this.getDetail()
  },
  methods: {
    async getList() {
      this.tableLoading = true
      this.tableData = []
      try {
        const { code, data } = await getRiskRouteList({
          id: this.id
        })
        this.tableLoading = false
        if (code === 200) {
          this.tableData = data.data || []
        }
      } catch (error) {
        this.tableLoading = false
      }
    },
    async getDetail() {
      try {
        const { code, data } = await getRiskDetail({
          id: this.id
        })
        if (code === 200) {
          this.info = data
        }
      } catch (error) {
        console.log(error)
      }
    },
    filterRisk(level) {
      const arr = this.levelOptions.filter(v => +v.id === +level)
      return arr.length > 0 ? arr[0].level : ''
    },
    getLevelOptions() {
      if (this.$store.state.form.riskLevelSelect.length < 1) {
        this.$store.dispatch('form/setRiskLevelSelect').then(() => {
          this.levelOptions = this.$store.state.form.riskLevelSelect
        })
      } else {
        this.levelOptions = this.$store.state.form.riskLevelSelect
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
    font-size: 15px;
    color: #333;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    .left-m {
        margin-left: 30px;
    }
}
</style>
