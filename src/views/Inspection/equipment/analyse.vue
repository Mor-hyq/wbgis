<template>
  <div>
    <div class="chart-box">
      <h3 class="tit">设备故障统计</h3>
      <div class="search-box">
        <div class="inline" style="margin-bottom:10px;">
          <el-select
            v-model="searchForm.pipeId"
            clearable
            style="width:100%;"
            filterable
            :size="$btnSize"
            placeholder="选择管道"
            @change="pipeChange"
          >
            <el-option
              v-for="pipe in pipeOptions"
              :key="pipe.id"
              :value="pipe.id"
              :label="pipe.name"
            />
          </el-select>
        </div>
        <div class="inline">
          <el-select
            v-model="searchForm.equipId"
            clearable
            :size="$btnSize"
            placeholder="选择设备类型"
          >
            <el-option
              v-for="pipe in eTypeOptions"
              :key="pipe.id"
              :value="pipe.id"
              :label="pipe.name"
            />
          </el-select>
        </div>
        <!-- <div class="inline">
          <el-input
            v-model="searchForm.asset_name"
            clearable
            :size="$btnSize"
            placeholder="设备名称"
          />
        </div> -->
        <div class="inline">
          <el-date-picker
            v-model="searchForm.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
            :size="$btnSize"
          />
        </div>
        <el-button :size="$btnSize" type="primary" @click="handleSearch">{{ mylang.search }}</el-button>
      </div>
      <div :id="colId" class="column-chart" />
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane lazy :label="mylang.maintainRecord" name="1">
        <maintain-record ref="tab1" is-component />
      </el-tab-pane>
      <el-tab-pane lazy :label="mylang.repaireRecord" name="2">
        <repaire-record ref="tab2" is-component is-analyse />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
import MaintainRecord from '../maintain/components/MaintainRecord'
import RepaireRecord from '../repair/index'
import deleteCache from '@/mixins/deleteCache'
import dayjs from 'dayjs'

import {
  getAssetAnalyse,
  getAssetTypeState
} from '@/api/inspection'
export default {
  name: 'EquipmentAnalyse',
  components: {
    MaintainRecord,
    RepaireRecord
  },
  mixins: [deleteCache],
  data() {
    const curYear = String(new Date().getFullYear())
    const curMonth = String(new Date().getMonth() + 1)
    return {
      activeName: '1',
      activeTab: ['1'],
      colId: 'chartFault',
      charts: null,
      pipeOptions: [],
      eTypeOptions: [],
      searchForm: {
        pipeId: '',
        equipId: '',
        // asset_name: '',
        year: curYear
      },
      curMoth: curMonth,
      curSlc: curMonth - 1
    }
  },
  created() {
    this.$_deleteOtherView()
    this.getPipeOptions()
  },
  // mounted() {
  //   // this.initCharts(true)
  //   // this.$nextTick(() => {
  //   //   this.$refs['tab' + this.activeName].searchForm.time = this.searchForm.year + '-' + this.curMoth
  //   //   this.$refs['tab' + this.activeName].handleSearch()
  //   // })
  // },
  methods: {
    initCharts(isinit) {
      if (!isinit) {
        this.curSlc = ''
      }
      this.charts = echarts.init(document.getElementById(this.colId))
      this.setOptions()
    },
    async setOptions() {
      const that = this
      try {
        const { code, data } = await getAssetAnalyse({
          pipe_id: this.searchForm.pipeId,
          equipment_id: this.searchForm.equipId,
          year: this.searchForm.year
          // field_value_id_2: this.searchForm.asset_name
        })
        if (code === 200) {
          const color = ['#2c6ee7', '#f03c3c']
          const colorselect = ['#0313f3', '#ee0808']
          const series = data.series.map((v, i) => {
            const obj = {
              name: i === 0 ? '维修次数' : '维护次数',
              type: 'bar',
              data: v,
              itemStyle: {
                normal: {
                  // color: color[i],
                  color: function(params) {
                    const key = params.dataIndex
                    if (key === that.curSlc) {
                      return colorselect[i]
                    } else {
                      return color[i]
                    }
                  },
                  lineStyle: {
                    color: color[i],
                    width: 2
                  }
                }
              },
              smooth: true,
              animationDuration: 1500,
              animationEasing: 'quadraticOut'
            }
            return obj
          })
          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: ['维修次数', '维护次数'],
              top: 30,
              right: '5%'
            },
            grid: {
              top: 80,
              left: '5%',
              right: '5%',
              bottom: '3%',
              containLabel: true
            },
            yAxis: {
              type: 'value',
              name: '次数',
              axisLine: {
                lineStyle: {
                  color: '#57617B'
                }
              },
              max: function(value) {
                return parseInt(value.max) + 5
              },
              triggerEvent: true
              // boundaryGap: [0, 0.01]
            },
            xAxis: [{
              type: 'category',
              name: '月份',
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#57617B'
                }
              },
              axisLabel: {
                fontSize: 12
                // rotate: 60
              },
              data: data.xData
            }],
            series
          }
          this.charts.setOption(option)
          this.initTabs()
          this.charts.getZr().off('click')
          this.charts.getZr().on('click', (params) => {
            const pointInPixel = [params.offsetX, params.offsetY]
            if (this.charts.containPixel('grid', pointInPixel)) {
              const xIndexArr = this.charts.convertFromPixel({ seriesIndex: 0 }, pointInPixel)
              let tabindex = this.activeName
              if (params.target) {
                // tabindex = params.target.seriesIndex + 1 + '' || this.activeName
                tabindex = 2 - params.target.seriesIndex + '' || this.activeName
              }
              this.activeName = tabindex
              const xIndex = xIndexArr[0]
              this.curMoth = xIndex + 1
              this.curSlc = xIndex
              this.$nextTick(() => {
                this.initTabs()
              })
              this.charts.setOption(option)
            }
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleSearch() {
      this.initCharts()
    },
    initTabs() {
      this.activeTab = [this.activeName]
      const time = this.searchForm.year + '-' + this.curMoth
      const stime = dayjs(time).startOf('month').format('YYYY-MM-DD')
      const etime = dayjs(time).endOf('month').format('YYYY-MM-DD')
      this.$refs['tab' + this.activeName].searchForm.egi_time = stime + ',' + etime
      this.$refs['tab' + this.activeName].searchForm.start_time = stime + ',' + etime
      // this.$refs['tab' + this.activeName].searchForm.time = this.searchForm.year + '-' + this.curMoth
      this.$refs['tab' + this.activeName].searchForm.pipe_id = this.searchForm.pipeId
      this.$refs['tab' + this.activeName].searchForm.equipment_id = this.searchForm.equipId
      // this.$refs['tab' + this.activeName].searchForm.field_value_id_2 = this.searchForm.asset_name
      this.$refs['tab' + this.activeName].handleSearch()
    },
    pipeChange(val) {
      // 重选管道 设备类型与设备也要重新选择
      this.searchForm.equipId = ''
      this.eTypeOptions = []
      if (this.searchForm.pipeId) {
        this.getEquipmentOptions()
      }
    },
    getPipeOptions() {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          this.pipeOptions = this.$store.state.form.belongPipe
          this.searchForm.pipeId = this.pipeOptions[0].id
          if (this.pipeOptions.length > 0) {
            this.initCharts(true)
            this.getEquipmentOptions()
            this.$nextTick(() => {
              const time = this.searchForm.year + '-' + this.curMoth
              const stime = dayjs(time).startOf('month').format('YYYY-MM-DD')
              const etime = dayjs(time).endOf('month').format('YYYY-MM-DD')
              this.$refs['tab' + this.activeName].searchForm.egi_time = stime + ',' + etime
              this.$refs['tab' + this.activeName].searchForm.start_time = stime + ',' + etime
              // this.$refs['tab' + this.activeName].searchForm.time = this.searchForm.year + '-' + this.curMoth
              this.$refs['tab' + this.activeName].searchForm.pipe_id = this.searchForm.pipeId
              this.$refs['tab' + this.activeName].searchForm.equipment_id = this.searchForm.equipId
              // this.$refs['tab' + this.activeName].searchForm.field_value_id_2 = this.searchForm.asset_name
              this.$refs['tab' + this.activeName].handleSearch()
            })
          }
        })
      } else {
        this.pipeOptions = this.$store.state.form.belongPipe
        try {
          if (this.pipeOptions.length > 0) {
            this.searchForm.pipeId = this.pipeOptions[0].id
            this.getEquipmentOptions()
            this.$nextTick(() => {
              this.initCharts(true)
              const time = this.searchForm.year + '-' + this.curMoth
              const stime = dayjs(time).startOf('month').format('YYYY-MM-DD')
              const etime = dayjs(time).endOf('month').format('YYYY-MM-DD')
              this.$refs['tab' + this.activeName].searchForm.egi_time = stime + ',' + etime
              this.$refs['tab' + this.activeName].searchForm.start_time = stime + ',' + etime
              // this.$refs['tab' + this.activeName].searchForm.time = this.searchForm.year + '-' + this.curMoth
              this.$refs['tab' + this.activeName].searchForm.pipe_id = this.searchForm.pipeId
              this.$refs['tab' + this.activeName].searchForm.equipment_id = this.searchForm.equipId
              // this.$refs['tab' + this.activeName].searchForm.field_value_id_2 = this.searchForm.asset_name
              this.$refs['tab' + this.activeName].handleSearch()
            })
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    async getEquipmentOptions() {
      try {
        const { code, data } = await getAssetTypeState({
          id: this.searchForm.pipeId
        })
        if (code === 200) {
          this.eTypeOptions = data || []
        }
      } catch (error) {
        //
      }
    },
    handleClick(val) {
      if (!this.activeTab.includes(this.activeName)) {
        this.activeTab.push(this.activeName)
        this.$nextTick(() => {
          const time = this.searchForm.year + '-' + this.curMoth
          const stime = dayjs(time).startOf('month').format('YYYY-MM-DD')
          const etime = dayjs(time).endOf('month').format('YYYY-MM-DD')
          this.$refs['tab' + this.activeName].searchForm.egi_time = stime + ',' + etime
          this.$refs['tab' + this.activeName].searchForm.start_time = stime + ',' + etime
          // this.$refs['tab' + this.activeName].searchForm.time = this.searchForm.year + '-' + this.curMoth
          this.$refs['tab' + this.activeName].searchForm.pipe_id = this.searchForm.pipeId
          this.$refs['tab' + this.activeName].searchForm.equipment_id = this.searchForm.equipId
          // this.$refs['tab' + this.activeName].searchForm.field_value_id_2 = this.searchForm.asset_name

          this.$refs['tab' + this.activeName].handleSearch()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-box {
  margin-bottom: 20px;
}
.column-chart {
    height: 280px;
    color: #ee0808;
}
.tit {
  margin: 15px 0;
  text-align: center;
}
.search-box {
  text-align: left;
  .inline {
    display: inline-block;
    margin-right: 20px;
  }
}
</style>
