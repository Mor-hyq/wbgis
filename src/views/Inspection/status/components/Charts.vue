<template>
  <div>
    <div class="chart-box">
      <h3 class="tit">维修数量趋势分析</h3>
      <div class="search-box">
        <div class="inline">
          <el-select
            v-model="pipeId1"
            clearable
            style="width:100%;"
            filterable
            :size="$btnSize"
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
          <el-date-picker
            v-model="year1"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
            :size="$btnSize"
          />
        </div>
        <el-button :size="$btnSize" type="primary" @click="handleSearch">{{ mylang.search }}</el-button>
      </div>
      <div :id="colId1" class="column-chart" />
    </div>
    <div class="chart-box">
      <h3 class="tit">故障类型分类统计</h3>
      <div class="search-box">
        <div class="inline">
          <el-date-picker
            v-model="typeDate.start"
            :picker-options="pickerTypeOptions1"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期"
            :size="$btnSize"
          />
        </div>
        <div class="inline">
          <el-date-picker
            v-model="typeDate.end"
            :picker-options="pickerTypeOptions2"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选结束日期"
            :size="$btnSize"
          />
          <el-button :size="$btnSize" type="primary" @click="handleSearchType">{{ mylang.search }}</el-button>
        </div>
      </div>
      <div :id="colId2" class="column-chart" />
    </div>
    <div class="chart-box">
      <h3 class="tit">设备故障统计</h3>
      <div class="search-box">
        <div class="inline">
          <el-date-picker
            v-model="faultDate.start"
            :picker-options="pickerFaultOptions1"
            type="date"
            value-format="yyyy-MM-dd"
            :size="$btnSize"
            placeholder="选择开始日期"
          />
        </div>
        <div class="inline">
          <el-date-picker
            v-model="faultDate.end"
            :picker-options="pickerFaultOptions2"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选结束日期"
            :size="$btnSize"
          />
          <el-button :size="$btnSize" type="primary" @click="handleSearchFault">{{ mylang.search }}</el-button>
        </div>
      </div>
      <div :id="colId3" class="column-chart" />
    </div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
import {
  getRepaireChart,
  getFaultTypeChart,
  getFaultChart
} from '@/api/inspection'
import dayjs from 'dayjs'
export default {
  data() {
    const curYear = String(new Date().getFullYear())
    return {
      colId1: 'chartMaintain',
      colId2: 'chartFaultType',
      colId3: 'chartFault',
      charts1: null,
      charts2: null,
      charts3: null,
      pipeId1: '',
      year1: curYear,
      typeDate: {
        start: '',
        end: ''
      },
      faultDate: {
        start: '',
        end: ''
      },
      pickerTypeOptions1: {
        disabledDate: (time) => {
          if (this.typeDate.end) {
            return time.getTime() > dayjs(this.typeDate.end).valueOf()
          } else {
            return false
          }
        }
      },
      pickerTypeOptions2: {
        disabledDate: (time) => {
          return time.getTime() < dayjs(this.typeDate.start).valueOf()
        }
      },
      pickerFaultOptions1: {
        disabledDate: (time) => {
          if (this.faultDate.end) {
            return time.getTime() > dayjs(this.faultDate.end).valueOf()
          } else {
            return false
          }
        }
      },
      pickerFaultOptions2: {
        disabledDate: (time) => {
          return time.getTime() < dayjs(this.faultDate.start).valueOf()
        }
      },
      pipeOptions: []
    }
  },
  created() {
    this.getPipeOptions()
  },
  mounted() {
    this.initCharts2()
    this.initCharts3()
  },
  methods: {
    initCharts1() {
      this.charts1 = echarts.init(document.getElementById(this.colId1))
      this.setOptions1()
    },
    async setOptions1() {
      try {
        const { code, data } = await getRepaireChart({
          pipe_id: this.pipeId1,
          year: this.year1
        })
        if (code === 200) {
          const color = ['#F20B07', '#3888fa']
          const series = data.series.map((v, i) => {
            const obj = {
              name: i === 0 ? '维修数量' : '已解决',
              type: 'line',
              data: v,
              itemStyle: {
                normal: {
                  color: color[i],
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
          this.charts1.setOption({
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['维修数量', '已解决'],
              top: 10,
              right: 10
            },
            grid: {
              top: 40,
              left: '2%',
              right: '2%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#57617B'
                }
              },
              data: data.xData
            },
            yAxis: [{
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#57617B'
                }
              },
              max: function(value) {
                return parseInt(value.max) + 2
              }
            }],
            series
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    initCharts2() {
      this.charts2 = echarts.init(document.getElementById(this.colId2))
      this.setOptions2()
    },
    async setOptions2() {
      try {
        const { code, data } = await getFaultTypeChart({
          start: this.typeDate.start,
          end: this.typeDate.end
        })
        if (code === 200) {
          this.charts2.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: data.xData,
              top: 10,
              right: 10
            },
            grid: {
              top: 40,
              left: '2%',
              right: '2%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: data.xData,
              axisTick: {
                alignWithLabel: true
              },
              axisLine: {
                lineStyle: {
                  color: '#57617B'
                }
              }
            },
            yAxis: [{
              type: 'value',
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#57617B'
                }
              },
              max: function(value) {
                return parseInt(value.max) + 2
              }
            }],
            series: [{
              data: data.series,
              type: 'bar',
              animationDuration: 1500,
              barMaxWidth: 30
            }]
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    initCharts3() {
      this.charts3 = echarts.init(document.getElementById(this.colId3))
      this.setOptions3()
    },
    async setOptions3() {
      try {
        const { code, data } = await getFaultChart({
          start: this.faultDate.start,
          end: this.faultDate.end
        })
        if (code === 200) {
          const color = ['#ffff33', '#F5222D']
          const series = data.series.map((v, i) => {
            const obj = {
              name: i === 0 ? '维修数量' : '报废数量',
              type: 'bar',
              data: v,
              itemStyle: {
                normal: {
                  color: color[i],
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
          this.charts3.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: ['维修数量', '报废数量'],
              top: 10,
              right: 10
            },
            grid: {
              top: 40,
              left: '2%',
              right: '2%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#57617B'
                }
              },
              minInterval: 1,
              max: function(value) {
                return parseInt(value.max) + 2
              }
              // boundaryGap: [0, 1]
            },
            yAxis: [{
              type: 'category',
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#57617B'
                }
              },
              data: data.xData
            }],
            series
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    getPipeOptions() {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          this.pipeOptions = this.$store.state.form.belongPipe
          this.pipeId1 = this.pipeOptions[0].id
          this.$nextTick(() => {
            this.initCharts1()
          })
        })
      } else {
        this.pipeOptions = this.$store.state.form.belongPipe
        this.pipeId1 = this.pipeOptions[0].id
        this.$nextTick(() => {
          this.initCharts1()
        })
      }
    },
    handleSearch() {
      this.initCharts1()
    },
    handleSearchType() {
      this.initCharts2()
    },
    handleSearchFault() {
      this.initCharts3()
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
}
.tit {
  margin: 0 0 15px 0;
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
