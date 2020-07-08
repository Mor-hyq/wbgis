<template>
  <el-dialog
    title="选取坐标点"
    append-to-body
    top="5vh"
    custom-class="custom-dialog-class"
    :visible.sync="isShow"
    :close-on-click-modal="false"
  >
    <div :id="id" class="map-container" />
    <!-- <el-form class="input-card">
      <el-form-item label="经度：" class="input-item">
        <el-input v-model="lnglat.lng" size="mini" type="number" clearable />
      </el-form-item>
      <el-form-item label="纬度：" class="input-item">
        <el-input v-model="lnglat.lat" size="mini" type="number" clearable />
      </el-form-item>
    </el-form> -->
    <div

      class="input-card"
    >
      <el-button
        v-if="showbtn"
        type="primary"
        size="mini"
        style="margin:auto;"
        @click="startDraw"
      >开始绘制</el-button>
      <template
        v-else
      >
        <!-- <el-button
          type="primary"
          size="mini"
          style="margin:auto;"
          @click="modifyDraw"
        >
          编辑图形
        </el-button> -->
        <el-button
          type="primary"
          size="mini"
          style="margin:auto;"
          @click="resetDraw"
        >重新绘制</el-button>
      </template>
      <p style="margin:10px 0 0;">双击鼠标左键或单击鼠标右键结束绘制</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideMap">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AMap from 'AMap'

export default {
  name: 'GetLngLatArea',
  props: {
    id: {
      type: String,
      default: function() {
        return 'map-container-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    lnglatPro: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      lnglat: {
        lng: '',
        lat: ''
      },
      map: null,
      drawPolygon: null,
      mouseTool: null,
      showbtn: true,
      polyEditor: null
    //   marker: null
    }
  },
  watch: {
    // lnglat: {
    //   handler(val) {
    //     if (this.marker && val.lng && val.lat) {
    //       this.marker.setPosition(new AMap.LngLat(val.lng, val.lat))
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    init() {
      let map = null
      if (this.lnglat.lng && this.lnglat.lat) {
        map = new AMap.Map(this.id, {
          center: new AMap.LngLat(this.lnglat.lng, this.lnglat.lat),
          resizeEnable: true,
          zoom: 14
        })
      } else {
        map = new AMap.Map(this.id, {
          resizeEnable: true,
          zoom: 14
        })
      }
      AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.MapType',
        'AMap.Geolocation',
        'AMap.MouseTool',
        'AMap.PolyEditor'
      ], function() {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.MapType({
          defaultType: 1
        }))
        map.addControl(new AMap.Geolocation())
      })
      this.mouseTool = new AMap.MouseTool(map)
      this.drawPolygon = function() {
        this.mouseTool.polygon({
          strokeColor: '#F56C6C',
          // strokeOpacity: 1,
          strokeWeight: 1,
          strokeOpacity: 1,
          fillColor: '#F56C6C',
          fillOpacity: 0.4,
          // 线样式还支持 'dashed'
          strokeStyle: 'solid'
          // strokeStyle是dashed时有效
          // strokeDasharray: [30,10],
        })
      }
      this.mouseTool.on('draw', (e) => {
        // console.log(e.obj.getPath())
        // const lnglat = e.obj.getPath().map(v => {
        //   return [v.lng, v.lat]
        // })

        // const poly = new AMap.Polygon({
        //   path: lnglat,
        //   strokeColor: '#F56C6C',
        //   // strokeOpacity: 1,
        //   strokeWeight: 1,
        //   strokeOpacity: 1,
        //   fillColor: '#F56C6C',
        //   fillOpacity: 0.4,
        //   // 线样式还支持 'dashed'
        //   strokeStyle: 'solid'
        // })
        this.polyEditor = new AMap.PolyEditor(this.map, e.obj)
        this.polyEditor.open()
        // this.mouseTool.close(true)
        this.showbtn = false
      })
      //   var marker = new AMap.Marker({
      //     position: map.getCenter(),
      //     // 设置是否可以拖拽
      //     draggable: true,
      //     cursor: 'move'
      //   })
      //   if (!this.lnglat.lng && !this.lnglat.lat) {
      //     this.lnglat.lng = map.getCenter().getLng()
      //     this.lnglat.lat = map.getCenter().getLat()
      //   }
      //   marker.setMap(map)
      //   marker.on('dragend', () => {
      //     this.lnglat.lng = marker.getPosition().getLng()
      //     this.lnglat.lat = marker.getPosition().getLat()
      //   })
      //   map.on('click', (e) => {
      //     this.lnglat.lng = e.lnglat.getLng()
      //     this.lnglat.lat = e.lnglat.getLat()
      //     marker.setPosition(e.lnglat)
      //   })
      //   this.marker = marker
      this.map = map
    },
    showMap() {
      this.isShow = true
      const ll = this.lnglatPro.split(',')
      this.lnglat.lng = ll[0]
      this.lnglat.lat = ll[1]
      this.$nextTick(() => {
        if (!this.map) {
          this.init()
        } else {
          if (ll[0] && ll[1]) {
            this.map.setCenter(new AMap.LngLat(this.lnglat.lng, this.lnglat.lat))
            // this.marker.setPosition(new AMap.LngLat(this.lnglat.lng, this.lnglat.lat))
          } else {
            this.lnglat.lng = this.map.getCenter().getLng()
            this.lnglat.lat = this.map.getCenter().getLat()
          }
        }
      })
    },
    startDraw() {
      if (this.drawPolygon) {
        this.drawPolygon()
      }
    },
    // modifyDraw() {
    //   // this.polyEditor = new AMap.PolyEditor(this.map, polygon)
    // },
    resetDraw() {
      if (this.mouseTool) {
        this.mouseTool.close(true)
        this.showbtn = true
        this.startDraw()
      }
      if (this.polyEditor) {
        this.polyEditor.close()
      }
    },
    hideMap() {
      this.isShow = false
    },
    handleConfirm() {
      console.log(this.polyEditor)
      const lngLat = this.polyEditor.$t
      console.log(lngLat)
      // this.$emit('confirm', { lngLat: this.lnglat })
      // this.hideMap()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
    /deep/ .custom-dialog-class {
        width: 80vw;
        .el-dialog__body {
        position: relative;
            padding: 10px;
            height: 70vh;
        }
        .input-card {
          position: absolute;
          top: 20px;
          left: 100px;
          z-index: 5;
        //   transform: translate3d(-50%, 0, 0);
          padding: 9px 15px;
          border-radius: 0.4rem;
          background-color: #fff;
          box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
          .el-form-item__label,
          .el-form-item__content {
            line-height: 20px;
          }
          .input-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            >input {
              padding: 2px;
            }
          }
        }
    }
}
.map-container {
    width: 100%;
    height: 100%;
}
</style>
