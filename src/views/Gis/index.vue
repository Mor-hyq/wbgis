<template>
  <div class="gis-wrapper">
    <div class="map-wrapper">
      <!-- <div class="fengxian-pic">
        <img :src="fengxianPic" alt="">
      </div> -->
      <div id="container" class="container custom-map" />
      <div class="head">
        <el-form inline :size="btnSize">
          <el-form-item :label="mylang.pipeName">
            <el-select
              v-model="form.pipe_id"
              @change="pipeChange"
            >
              <el-option
                v-for="pipe in pipeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="mylang.equipmentType">
            <el-select
              v-model="form.equipment_id"
              clearable
              filterable
              @change="equipmentChange"
            >
              <el-option
                v-for="type in typeOptions"
                :key="type.id"
                :value="type.id"
                :label="type.name"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item :label="mylang.equipmentName">
            <el-input v-model="form.name" clearable />
          </el-form-item> -->
          <el-form-item
            :label="mylang.equipmentName"
          >
            <el-select
              v-model="form.field_value_id_2"
              clearable
            >
              <el-option
                v-for="pipe in eNameOptions"
                :key="pipe.asset_id"
                :value="pipe.name"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" :size="btnSize" @click="handleSearch">{{ mylang.search }}</el-button>
          <!-- <el-form-item style="margin-left:10px;">
            <el-checkbox v-model="form.checked" @change="checkChange">显示维护维修设备</el-checkbox>
          </el-form-item> -->
          <!-- <el-form-item>
            <el-checkbox v-model="form.control" @change="checkChange2">显示机坪供油机位风险图</el-checkbox>
          </el-form-item> -->
          <!-- <el-form-item>
            <el-checkbox v-model="form.buleShow" @change="hideBlue">隐藏参考线</el-checkbox>
          </el-form-item> -->
          <el-form-item>
            <el-checkbox v-model="form.riskArea" @change="showRisk">风险信息展示</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <gis-router-dialog :id="routeId" ref="routerDialog" :title="dialogTitle" />
      <gis-asset-dialog ref="assetDialog" />
    </div>
    <div class="chart-wrapper">
      <div class="outer">
        <h3 class="title">管道概况</h3>
        <div class="inner">
          <div class="subtit">
            <span class="left">管道长度：<strong>{{ pipeLength }}</strong>公里</span>
            <span class="right" @click="pipeVisible = true">详情</span>
          </div>
          <div class="chart1">
            <template v-if="chart1Data.length > 0">
              <div
                v-for="(item,ind) in chart1Data"
                :key="ind"
                class="progress"
                @click="goAssetIndexPage(item.eq_id)"
              >
                <span class="name" :title="item.name">{{ item.name }}</span>
                <span class="num">{{ item.num }}</span>
                <!-- <em class="pro" :style="{width: `${item.ratio}%`}" /> -->
                <em class="pro" :style="barStyle(item)" />
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="outer">
        <h3 class="title">设备完好率</h3>
        <div class="inner">
          <div class="chart">
            <!-- <div :id="chartId1" class="column-chart" /> -->
            <div :id="chartId2" class="column-chart" />
            <!-- <div :id="chartId3" class="column-chart" /> -->
          </div>
        </div>
      </div>
      <div class="outer">
        <h3 class="title">维修完成率</h3>
        <div class="inner">
          <div class="chart1 chart2">
            <template v-if="!isNoRepaire && chart2Data.length > 0">
              <template
                v-for="(item,ind) in chart2Data"
              >
                <div
                  :key="ind"
                  class="progress-box"
                  @click="goAssetPage(item.name)"
                >
                  <p class="tit" :title="item.name">{{ item.name }}</p>
                  <div class="progress">
                    <span class="name" :title="item.ratio+'%'">{{ item.ratio }}%</span>
                    <em class="pro" :style="barStyle(item)" />
                  </div>
                </div>
              </template>
            </template>
            <p v-else class="tips">无维修设备</p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="pipeVisible" custom-class="dialog-custom fixed-height" width="800px" title="管道概况">
      <div class="info" v-html="pipeInfo" />
    </el-dialog>
  </div>

</template>

<script>
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
import AMap from 'AMap' // 引入高德地图
import {
  getAssetTypeState,
  getAssetNameState,
  getRepaireProgressChart,
  getIntactChart
  // getFaultTypeChart
} from '@/api/inspection'
import {
  getRiskList
  // getRiskRouteList
} from '@/api/system'
import { getAssetChart, getPipeDetail } from '@/api/equipmentInfo'
import { getGis } from '@/api/gis'
import GisRouterDialog from './components/GisRouterDialog'
import GisAssetDialog from './components/GisAssetDialog'
export default {
  name: 'GisIndex',
  components: {
    GisRouterDialog,
    GisAssetDialog
  },
  data() {
    return {
      chartId1: 'chartNums',
      chartId2: 'chartMaintain', // 设备完好率
      chartId3: 'chartFaultType',
      charts1: null,
      charts2: null,
      charts3: null,
      map: '',
      searchMarker: '',
      imageLayer: '',
      isFengxian: false,
      btnSize: 'mini',
      form: {
        pipe_id: '',
        equipment_id: '',
        field_value_id_2: '',
        checked: true,
        control: false,
        buleShow: false,
        riskArea: false
      },
      dialogTitle: '',
      routeId: '',
      mapData: [],
      pipeOptions: [],
      typeOptions: [],
      eNameOptions: [],
      searchMapData: [],
      iconStart: require('@/assets/images/map_qizhidian.png'),
      iconTypeRed: require('@/assets/images/icon_bsz_r.png'),
      iconTypeYellow: require('@/assets/images/icon_bsz_y.png'),
      iconTypeBlue: require('@/assets/images/icon_gdss_1.png'),
      // fengxianPic: require('@/assets/images/fengxian.jpg'),
      fengxianPic: '',
      pipeInfo: '',
      pipeLength: 0,
      pipeVisible: false,
      chart1Data: [],
      chart2Data: [],
      chartColors: ['#f56c6c', '#e6a23c', '#5cb87a', '#1989fa', '#6f7ad3'],
      lines: {},
      polyname: 'polyline',
      isNoRepaire: true, // 是否有维修数据
      polygonArrs: [],
      textArrs: []
    }
  },
  created() {
    // 获取管道后在加载地图
    this.getPipeOptions()
  },
  mounted() {
    this.initCharts2()
    this.initCharts1()
    this.initCharts3()
  },
  methods: {
    barStyle(item) {
      const style = {}
      style.width = item.ratio + '%'
      if (item.color) {
        style.backgroundColor = item.color
      }
      return style
    },
    async getData() {
      try {
        const { code, data } = await getGis({
          id: this.form.pipe_id
        })
        if (code === 200) {
          this.mapData = data.map(v => {
            return v.map(k => {
              const lnglat = k.latitude_longtitude.split(',')
              return {
                lnglat,
                selected: false,
                ...k
              }
            })
          })
          if (this.mapData.length > 0) {
            this.init()
          } else {
            this.initMap()
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    initMap() {
      const map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 13
      })
      AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.MapType'
      ], function() {
        map.addControl(new AMap.ToolBar({
          position: 'LT',
          offset: new AMap.Pixel(10, 80)
        }))
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.MapType({
          defaultType: 1
          // showTraffic: true,
          // showRoad: true
        }))
      })
      this.map = map
      this.getRiskList()
    },
    init() {
      const lngLatArr = this.mapData
      // const that = this
      // const markers = []
      // 创建地图实例
      const map = new AMap.Map('container', {
        center: new AMap.LngLat(lngLatArr[0][0].lnglat[0], lngLatArr[0][0].lnglat[1]),
        resizeEnable: true
        // zoom: 13
      })
      AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.MapType'
      ], function() {
        map.addControl(new AMap.ToolBar({
          position: 'LT',
          offset: new AMap.Pixel(10, 80)
        }))
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.MapType({
          defaultType: 1
          // showTraffic: true,
          // showRoad: true
        }))
      })
      this.map = map
      const strokeColors = ['#f00', '#00f']
      lngLatArr.forEach((all, idx) => {
        const polypath = all.map(v => v.lnglat)
        const polyline = new AMap.Polyline({
          path: polypath,
          isOutline: true,
          showDir: true,
          strokeWeight: 5,
          strokeColor: strokeColors[idx],
          strokeOpacity: 1,
          lineJoin: 'round',
          lineCap: 'round',
          outlineColor: '#fff'
        })
        // AMap.event.addListener(polyline, 'click', function(e) {
        //   console.log(e)
        // })
        this.lines[this.polyname + idx] = polyline
        polyline.setMap(map)
        map.setFitView(polyline)
      })
      this.getRiskList()
      // 不需要显示路径坐标点了
      // 创建坐标点图标
      // 默认图标
      // const defaultIcon = new AMap.Icon({
      //   image: '//webapi.amap.com/theme/v1.3/markers/n/mark_bs.png'
      // })
      // 选中图标
      // const clickIcon = new AMap.Icon({
      //   image: '//webapi.amap.com/theme/v1.3/markers/n/mark_rs.png'
      // })
      // 红色类型图标
      // const redIcon = new AMap.Icon({
      //   image: this.iconTypeRed
      // })
      // 黄色类型图标
      // const yellowIcon = new AMap.Icon({
      //   image: this.iconTypeYellow
      // })
      // 蓝色类型图标
      // const blueIcon = new AMap.Icon({
      //   image: this.iconTypeBlue
      // })
      // 起止点图标
      // const startIcon = new AMap.Icon({
      //   image: this.iconStart,
      //   imageOffset: new AMap.Pixel(-2, -2),
      //   imageSize: new AMap.Size(28, 34)
      // })
      // function resetMarker() {
      //   markers.forEach(v => {
      //     v.setIcon(defaultIcon)
      //   })
      // }
      // 不需要显示路径坐标点了
      // lngLatArr.forEach((v, i) => {
      //   // 创建坐标点实例
      //   const marker = new AMap.Marker({
      //     icon: (i === 0) || (i === lngLatArr.length - 1) ? startIcon : redIcon,
      //     position: v.lnglat,
      //     zIndex: 101,
      //     map: map,
      //     extData: {
      //       order: v.order,
      //       selected: v.selected
      //     },
      //     label: {
      //       content: (i === 0 && '管道首端') || (i === lngLatArr.length - 1 && '管道末端') || v.order,
      //       offset: new AMap.Pixel(20, 0)
      //     }
      //   })
      //   markers.push(marker)
      //   // 点击标记点 显示信息窗体
      //   AMap.event.addListener(marker, 'click', function(e) {
      //     // if (e.target.getExtData().selected) {
      //     //   return
      //     // }
      //     // e.target.setExtData({
      //     //   ...e.target.getExtData(),
      //     //   selected: true
      //     // })
      //     // resetMarker()
      //     // marker.setIcon(clickIcon)
      //     that.dialogTitle = v.order
      //     that.routeId = v.id
      //     that.$refs.routerDialog.show()
      //     // const info = new AMap.InfoWindow({
      //     //   anchor: 'bottom-left',
      //     //   offset: new AMap.Pixel(0, -20),
      //     //   content: v.order // 使用默认信息窗体框样式，显示信息内容
      //     // })
      //     // info.open(map, lngLatArr[i].lnglat)
      //     // info.on('close', function() {
      //     //   marker.setExtData({
      //     //     ...marker.getExtData(),
      //     //     selected: false
      //     //   })
      //     //   marker.setIcon(defaultIcon)
      //     // })
      //   })
      // })

      // 创建路径图层
      // const object3Dlayer = new AMap.Object3DLayer({ zIndex: 200 })
      // map.add(object3Dlayer)
      // for (let i = 0; i < lngLatArr.length; i++) {
      //   // const ri = Math.floor(Math.random() * 3)
      //   // const color = ['rgba(255,0,0,0.5)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)']
      //   const color = '#f00'
      //   const j = i + 1 >= lngLatArr.length ? lngLatArr.length : i + 1
      //   const path = [new AMap.LngLat(lngLatArr[i].lnglat[0], lngLatArr[i].lnglat[1]), new AMap.LngLat(lngLatArr[j].lnglat[0], lngLatArr[j].lnglat[1])]
      //   // const line = new AMap.Object3D.MeshLine({
      //   //   path,
      //   //   color: color,
      //   //   width: 5
      //   // })
      //   // const path = [[lngLatArr[i].lnglat[0], lngLatArr[i].lnglat[1]], [lngLatArr[j].lnglat[0], lngLatArr[j].lnglat[1]]]
      //   const polyline = new AMap.Polyline({
      //     path,
      //     isOutline: true,
      //     strokeColor: color,
      //     strokeOpacity: 0.5,
      //     lineJoin: 'round',
      //     lineCap: 'round',
      //     outlineColor: '#fff'
      //   })
      //   polyline.setMap(map)
      // }
      // const line = new AMap.Object3D.MeshLine({
      //   path: lngLatArr.map(v => new AMap.LngLat(v.lnglat[0], v.lnglat[1])),
      //   color: color[ri],
      //   width: 5
      // })
      // object3Dlayer.add(line)
    },
    hideBlue(val) {
      if (val) {
        this.lines[this.polyname + '1'].hide()
      } else {
        this.lines[this.polyname + '1'].show()
      }
    },
    initSearchMap() {
      const that = this
      const markers = []
      const blueIcon = new AMap.Icon({
        image: this.iconTypeBlue
      })
      this.searchMapData.forEach((v, i) => {
        // 创建坐标点实例
        if (!this.form.checked && !v.service) {
          return
        }
        if (i === 0 && this.form.field_value_id_2) {
          this.map.setCenter(v.lnglat)
        }
        const marker = new AMap.Marker({
          icon: blueIcon,
          position: v.lnglat,
          zIndex: 101,
          map: this.map,
          extData: {
            name: v.name
          },
          label: {
            content: v.name,
            offset: new AMap.Pixel(20, 0)
          }
        })
        markers.push(marker)
        // 点击标记点 显示信息窗体
        AMap.event.addListener(marker, 'click', function(e) {
          // that.dialogTitle = v.name
          // that.routeId = v.asset_id
          // that.$refs.routerDialog.show()
          that.$refs.assetDialog.show({
            eid: that.form.equipment_id,
            id: v.asset_id,
            title: v.name
          })
        })
      })
      this.searchMarker = markers
    },
    handleSearch() {
      this.getSearchMapData()
    },
    async getSearchMapData() {
      try {
        const { code, data } = await getAssetNameState({
          id: this.form.pipe_id,
          equipment_id: this.form.equipment_id,
          field_value_id_2: this.form.field_value_id_2,
          field_id_2: '2'
        })
        this.clearSearchMarkers()
        if (code === 200) {
          this.searchMapData = data.map(v => {
            const lnglat = v.location.split(',')
            return {
              lnglat,
              selected: false,
              ...v
            }
          })
          if (this.searchMapData.length > 0) {
            this.initSearchMap()
          }
        }
      } catch (error) {
        //
      }
    },
    clearSearchMarkers() {
      if (this.searchMarker.length > 0) {
        this.searchMarker.forEach(v => {
          v.setMap(null)
        })
        this.searchMarker = []
      }
    },
    pipeChange(val) {
      this.form.equipment_id = ''
      this.form.field_value_id_2 = ''
      this.eNameOptions = []
      this.typeOptions = []
      if (this.form.pipe_id) {
        this.getData()
        this.getTypeState()
        this.getPipeInfo()
      }
    },
    equipmentChange(val) {
      // 重选设备类型 设备也要重新选择
      this.form.field_value_id_2 = ''
      this.eNameOptions = []
      if (this.form.pipe_id && this.form.equipment_id) {
        this.getEquipmentNameOptions()
      }
    },
    async getTypeState() {
      try {
        const { code, data } = await getAssetTypeState({
          id: this.form.pipe_id
        })
        if (code === 200) {
          this.typeOptions = data
        }
      } catch (error) {
        //
      }
    },
    checkChange(val) {
      // if (this.searchMarker.length > 0) {
      this.clearSearchMarkers()
      this.initSearchMap()
      // }
    },
    checkChange2(val) {
      if (this.map) {
        if (val) {
          const layers = this.map.getLayers()
          const imageLayer = new AMap.ImageLayer({
            url: this.fengxianPic,
            bounds: this.map.getBounds(),
            zIndex: 1000,
            zooms: [0, 20]
          })
          this.imageLayer = imageLayer
          this.map.setLayers([...layers, imageLayer])
          // this.isFengxian = true
        } else {
          // this.isFengxian = false
          this.map.remove([this.imageLayer])
        }
      }
    },
    getPipeOptions() {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          this.pipeOptions = this.$store.state.form.belongPipe
          // 以第一个管道为默认值
          if (this.pipeOptions.length > 0) {
            this.form.pipe_id = this.pipeOptions[0].id
            this.getData()
            this.getTypeState()
            this.getPipeInfo()
          } else {
            this.initMap()
          }
        }).catch(() => {
          this.initMap()
        })
      } else {
        this.pipeOptions = this.$store.state.form.belongPipe
        try {
          if (this.pipeOptions.length > 0) {
            // 以第一个管道为默认值
            this.form.pipe_id = this.pipeOptions[0].id
            this.getData()
            this.getTypeState()
            this.getPipeInfo()
          }
        } catch (error) {
          this.initMap()
        }
      }
    },
    async getPipeInfo() {
      try {
        const { code, data } = await getPipeDetail({
          id: this.form.pipe_id
        })
        if (code === 200) {
          this.pipeInfo = data.remark || '无'
          this.pipeLength = (+data.length / 1000).toFixed(2)
        }
      } catch (error) {
        //
      }
    },
    async getEquipmentNameOptions() {
      try {
        const { code, data } = await getAssetNameState({
          id: this.form.pipe_id,
          equipment_id: this.form.equipment_id
        })
        if (code === 200) {
          this.eNameOptions = data || []
        }
      } catch (error) {
        //
      }
    },
    initCharts1() {
      // 管道概况图表
      // this.charts1 = echarts.init(document.getElementById(this.chartId1))
      this.setOptions1()
    },
    async setOptions1() {
      try {
        const { code, data } = await getAssetChart()
        if (code === 200) {
          const xData = data.xData || []
          const yData = data.series || []
          const eqIds = data.equipment_id || []
          const initData = []
          // const max = Math.max.apply(null, yData)
          const chartData = xData.map((v, i) => {
            // const colori = i % this.chartColors.length
            const obj = {}
            const init = {}
            init.name = v
            init.ratio = 0
            // init.color = this.chartColors[colori]
            obj.name = v
            obj.num = yData[i]
            obj.eq_id = eqIds[i]
            // obj.color = this.chartColors[colori]
            // obj.ratio = parseFloat((+yData[i] / max) * 100).toFixed(2)
            obj.ratio = 50
            initData.push(init)
            return obj
          })
          this.chart1Data = initData
          setTimeout(() => {
            this.chart1Data = chartData
          }, 300)
          // this.charts1.setOption({
          //   title: {
          //     text: '设备数量统计',
          //     x: 'center',
          //     y: 5,
          //     textStyle: {
          //       fontSize: 14,
          //       textAlign: 'center'
          //     }
          //   },
          //   tooltip: {
          //     trigger: 'axis',
          //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
          //       type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          //     }
          //   },
          //   grid: {
          //     top: 40,
          //     left: '2%',
          //     right: '2%',
          //     bottom: 10,
          //     containLabel: true
          //   },
          //   xAxis: {
          //     type: 'category',
          //     data: data.xData,
          //     axisTick: {
          //       alignWithLabel: true
          //     },

          //     axisLabel: {
          //       interval: 0,
          //       fontSize: 10,
          //       // rotate: 60,
          //       margin: 5,
          //       formatter: function(val) {
          //         let ret = ''
          //         const maxLength = 2
          //         const valLength = val.length
          //         const rowN = Math.ceil(valLength / maxLength)
          //         if (rowN > 1) {
          //           for (let k = 0; k < rowN; k++) {
          //             let temp = ''
          //             const start = k * maxLength
          //             const end = start + maxLength
          //             temp = val.substring(start, end) + '\n'
          //             ret += temp
          //           }
          //           return ret
          //         } else {
          //           return val
          //         }
          //       }

          //     },
          //     axisLine: {
          //       lineStyle: {
          //         color: '#57617B'
          //       }
          //     }
          //   },
          //   yAxis: [{
          //     type: 'value',
          //     axisTick: {
          //       show: false
          //     },
          //     axisLine: {
          //       lineStyle: {
          //         color: '#57617B'
          //       }
          //     },
          //     max: function(value) {
          //       return parseInt(value.max) + 3
          //     }
          //   }],
          //   series: [{
          //     data: data.series,
          //     type: 'bar',
          //     itemStyle: {
          //       color: '#1890FF'
          //     },
          //     animationDuration: 1500,
          //     barMaxWidth: 10
          //   }]
          // })
        }
      } catch (error) {
        console.log(error)
      }
    },
    initCharts2() {
      // 设备完好率图表
      this.charts2 = echarts.init(document.getElementById(this.chartId2))
      this.setOptions2()
    },
    async setOptions2() {
      try {
        const { code, data } = await getIntactChart()
        // 多层嵌套图表 改为扇形图表
        // if (code === 200) {
        //   const series1 = []
        //   const series2 = []
        //   const length = data.xData.length
        //   let innerLen = 1
        //   if (length > 6) {
        //     innerLen = 3
        //   } else {
        //     innerLen = Math.ceil(length / 2)
        //   }
        //   data.xData.forEach((v, i) => {
        //     const obj = {}
        //     obj.name = v
        //     obj.value = data.series[i]
        //     if (i < innerLen) {
        //       series1.push(obj)
        //     } else {
        //       series2.push(obj)
        //     }
        //   })

        //   this.charts2.setOption({
        //     // title: {
        //     //   text: '故障设备统计',
        //     //   x: 'center',
        //     //   textStyle: {
        //     //     fontSize: 14,
        //     //     textAlign: 'center'
        //     //   }
        //     // },
        //     tooltip: {
        //       trigger: 'item',
        //       formatter: '{b}:{c} ({d}%)'
        //     },
        //     legend: {
        //       orient: 'vertical',
        //       x: 'left',
        //       data: data.xData
        //     },
        //     // series: [{
        //     //   data: series,
        //     //   type: 'pie',
        //     //   radius: '50%',
        //     //   center: ['50%', '40%'],
        //     //   animationDuration: 1000
        //     // }]
        //     series: [
        //       {
        //         type: 'pie',
        //         selectedMode: 'single',
        //         radius: [0, '30%'],
        //         center: ['50%', '60%'],
        //         label: {
        //           normal: {
        //             position: 'inner'
        //           }
        //         },
        //         labelLine: {
        //           normal: {
        //             show: false
        //           }
        //         },
        //         data: series1
        //       },
        //       {
        //         type: 'pie',
        //         radius: ['40%', '55%'],
        //         center: ['50%', '60%'],
        //         data: series2
        //       }
        //     ]
        //   })
        // }
        if (code === 200) {
          const series = data.xData.map((v, i) => {
            const obj = {}
            obj.name = v
            obj.value = data.series[i]
            return obj
          })
          this.charts2.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{b}:{c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              itemWidth: 5,
              itemHeight: 5,
              itemGap: 6,
              textStyle: {
                fontSize: 11
              },
              data: data.xData
            },
            series: [{
              data: series,
              type: 'pie',
              itemStyle: {
                color: function(params) {
                  const colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
                  if (params.name === '正常设备') {
                    return '#67C23A'
                  } else {
                    return colors[params.dataIndex]
                  }
                }
              },
              radius: '50%',
              center: ['50%', '50%'],
              animationDuration: 1000
            }]
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    initCharts3() {
      // 设备维修效率 暨设备故障率
      // this.charts3 = echarts.init(document.getElementById(this.chartId3))
      this.setOptions3()
    },
    async setOptions3() {
      try {
        const { code, data } = await getRepaireProgressChart()
        if (code === 200) {
          // const xData = data.xData || []
          // const yData = data.series || []
          // if (yData.length < 2) {
          //   // 如果返回的series数据小于两条 则数据有问题
          //   this.isNoRepaire = true // 是否有维修数据
          //   return
          // }
          // const finishData = [] // series中二维数组相减后得到已完成维修的数据 [0]已完成+维修中 [1]维修中
          // for (let i = 0; i < yData[0].length; i++) {
          //   const sum = (+yData[0][i]) - (+yData[1][i])
          //   finishData.push(sum)
          // }
          // // 若已完成数据都是0 则显示无维修提示
          // if (finishData.findIndex(v => +v > 0) < 0) {
          //   this.isNoRepaire = true
          //   return
          // }
          // this.isNoRepaire = false
          // const percent = finishData.map((x, j) => {
          //   const y = +yData[0][j]
          //   if (y === 0) {
          //     return 0
          //   }
          //   return ((x / +yData[0][j]) * 100).toFixed(2)
          // })
          // const initData = []
          // const chartData = xData.map((v, i) => {
          //   const colori = i % this.chartColors.length
          //   const obj = {}
          //   const init = {}
          //   init.name = v
          //   init.ratio = +percent[i] > 0 ? 1 : 0
          //   init.color = this.chartColors[colori]
          //   obj.name = v
          //   obj.color = this.chartColors[colori]
          //   obj.ratio = percent[i] || 0
          //   initData.push(init)
          //   return obj
          // })
          this.isNoRepaire = false
          const xData = data.xData || []
          const percent = data.percent || []
          const initData = []
          const chartData = xData.map((v, i) => {
            const colori = i % this.chartColors.length
            const obj = {}
            const init = {}
            init.name = v
            init.ratio = +percent[i] > 0 ? 1 : 0
            init.color = this.chartColors[colori]
            obj.name = v
            obj.color = this.chartColors[colori]
            obj.ratio = percent[i] || 0
            initData.push(init)
            return obj
          })
          // 为了有过渡效果 先显示初始数据
          this.chart2Data = initData
          setTimeout(() => {
            this.chart2Data = chartData
          }, 300)
        }
      } catch (error) {
        console.log(error)
      }
    },
    goAssetPage(name) {
      this.$router.push({
        name: 'EquipmentRepair',
        query: {
          s_name: name
        }
      })
    },
    async getRiskList() {
      // 获取风险路由列表
      try {
        const { code, data } = await getRiskList({
          page: 1,
          paginate: 200
        })
        if (code === 200) {
          data.data.forEach(v => {
            this.getRiskRouteLists(v)
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getRiskRouteLists(route) {
      try {
        const map = this.map
        const lngLatArr = route.node ? JSON.parse(route.node) : []
        // 风险等级线条颜色
        const strokeColors = ['#F56C6C', '#E6A23C', '#fdfd00', '#409eff']
        const ind = (+route.level) % 5 - 1
        const polypath = lngLatArr
        const polygon = new AMap.Polygon({
          path: polypath,
          isOutline: true,
          zIndex: 2000,
          strokeWeight: 1,
          strokeColor: strokeColors[ind],
          fillColor: strokeColors[ind],
          fillOpacity: 0.6,
          strokeOpacity: 1,
          cursor: 'default'
        })
        this.lines[this.polyname + '3' + ind] = polygon
        polygon.setMap(map)
        const textMap = new AMap.Text({
          text: route.name,
          map: this.map,
          position: polygon.getBounds().northeast,
          anchor: 'middle-left',
          clickable: true
        })
        AMap.event.addListener(textMap, 'click', function(e) {
          textMap.hide()
        })
        AMap.event.addListener(polygon, 'click', function(e) {
          textMap.show()
        })
        this.polygonArrs.push(polygon)
        this.textArrs.push(textMap)
        if (!this.riskArea) {
          polygon.hide()
          textMap.hide()
        }
      } catch (error) {
        console.log(error)
      }
    },
    showRisk(val) {
      // 隐藏风险区域
      if (val) {
        // 显示风险区域
        this.polygonArrs.forEach(v => {
          v.show()
        })
        this.textArrs.forEach(v => {
          v.show()
        })
      } else {
        this.polygonArrs.forEach(v => {
          v.hide()
        })
        this.textArrs.forEach(v => {
          v.hide()
        })
      }
    },
    goAssetIndexPage(id) {
      this.$store.commit('form/SET_ASSET_TAB', id + '')
      this.$router.push({
        name: 'AssetIndex',
        query: {
          eq_id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.map-wrapper {
  position: relative;
  float: left;
  width: calc(100% - 300px);
  height: calc(100vh - 57px);
  .fengxian-pic {
    position: absolute;
    top: -1000px;
    left: -1000px;
    width: 1px;
    height: 1px;
    z-index: -1;
    img {
      display: block;
      width: 100%;
    }
  }
  .container {
    height: 100%;
  }
  .head {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 10;
    padding: 8px 10px;
    background-color: #2F4055;
    .el-form-item {
      margin-bottom: 0;
      /deep/ .el-form-item__label {
        color: #fff;
      }
      .el-checkbox {
        color: #fff;
        /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
          color: #fff;
        }
      }
       .el-input,
       .el-select /deep/ .el-input {
        width: 150px;
      }
    }
  }
}
.chart-wrapper {
  position: relative;
  float: right;
  width: 300px;
  height: calc(100vh - 58px);
  overflow-y: auto;
  border-left: 1px solid #bdbdbd;
  padding: 2px;
  .outer {
    border: 1px solid #bdbdbd;
    &+.outer {
      margin-top: 5px;
    }
    .title {
      margin: 0;
      height: 30px;
      padding-left: 10px;
      line-height: 30px;
      border-bottom: 1px solid #999;
      color: rgb(173, 180, 204);
      font-size: 14px;
    }
    .inner {
      padding: 5px 0;
      .subtit {
        border-left: 2px solid #1D68A3;
        overflow: hidden;
        padding: 3px 8px 0 0;
        margin-left: 8px;
        .left {
          float: left;
          color: #000;
          font-size: 14px;
          font-weight: bold;
          padding-left: 4px;
          strong {
            color: #FF0D01;
          }
        }
        .right {
          float: right;
          color: #F56C6C;
          font-size: 14px;
          text-decoration: underline;
          cursor: default;
          &:hover {
            color: #e70d0d;
          }
        }
      }
      .chart1 {
        // height: 17vh;
        height: 22vh;
        overflow-y: auto;
        padding: 0 8px 5px;
        margin-top: 5px;
        @include scrollBar;
        .progress {
          position: relative;
          width: 100%;
          height: 16px;
          border-radius: 4px;
          background-color: #F1F4F7;
          overflow: hidden;
          margin-top: 8px;
          cursor: pointer;
          .name {
            position: absolute;
            top: 0;
            left: 5%;
            z-index: 10;
            height: 100%;
            line-height: 16px;
            color: #fff;
            font-size: 12px;
            cursor: default;
          }
          .num {
            position: absolute;
            top: 0;
            right: 5%;
            z-index: 10;
            height: 100%;
            line-height: 16px;
            color: #408CBD;
            font-size: 12px;
          }
          .pro {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 0;
            max-width: 100%;
            height: 100%;
            border-radius: 4px;
            background-color: #83AED0;
            transition: width 1.2s;
          }
        }
      }
      .chart2 {
        height: 22vh;
        .progress-box+.progress-box {
          margin-top: 10px;
        }
        .tit {
          margin: 0;
          margin-bottom: 3px;
          color: #666;
          font-size: 12px;
          cursor: pointer;

        }
        .progress {
          height: 12px;
          background-color: #E2E2E2;
          border-radius: 12px;
          margin: 0;
          cursor: pointer;

          .name {
            line-height: 12px;
            font-size: 12px;
          }
          .pro {
            border-radius: 12px;
          }
        }
      }
    }
  }
  @include scrollBar;
  .column-chart {
    height: 30vh;
  }
}
.info {
  text-indent: 2em;
  white-space: pre-wrap;
}
.custom-map {
  /deep/ .amap-maptypecontrol {
    top: initial;
    bottom: 120px;
  }
}
.tips {
  text-align: center;
  font-size: 15px;
  color: #666;
}
</style>
