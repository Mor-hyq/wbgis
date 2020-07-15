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
    <el-form class="input-card">
      <el-form-item label="经度：" class="input-item">
        <el-input v-model="lnglat.lng" size="mini" type="number" clearable />
      </el-form-item>
      <el-form-item label="纬度：" class="input-item">
        <el-input v-model="lnglat.lat" size="mini" type="number" clearable />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hideMap">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AMap from 'AMap'

export default {
  name: 'GetLngLat',
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
      marker: null
    }
  },
  watch: {
    lnglat: {
      handler(val) {
        if (this.marker && val.lng && val.lat) {
          this.marker.setPosition(new AMap.LngLat(val.lng, val.lat))
        }
      },
      deep: true
    }
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
          center: new AMap.LngLat(120.428998, 30.233107),
          resizeEnable: true,
          zoom: 14
        })
      }
      AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.MapType',
        'AMap.Geolocation'
      ], function() {
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.MapType({
          defaultType: 1,
          showTraffic: true,
          showRoad: true
        }))
        map.addControl(new AMap.Geolocation())
      })
      var marker = new AMap.Marker({
        position: map.getCenter(),
        // 设置是否可以拖拽
        draggable: true,
        cursor: 'move'
      })
      if (!this.lnglat.lng && !this.lnglat.lat) {
        this.lnglat.lng = map.getCenter().getLng()
        this.lnglat.lat = map.getCenter().getLat()
      }
      marker.setMap(map)
      marker.on('dragend', () => {
        this.lnglat.lng = marker.getPosition().getLng()
        this.lnglat.lat = marker.getPosition().getLat()
      })
      map.on('click', (e) => {
        this.lnglat.lng = e.lnglat.getLng()
        this.lnglat.lat = e.lnglat.getLat()
        marker.setPosition(e.lnglat)
      })
      this.map = map
      this.marker = marker
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
            this.marker.setPosition(new AMap.LngLat(this.lnglat.lng, this.lnglat.lat))
          } else {
            this.lnglat.lng = this.map.getCenter().getLng()
            this.lnglat.lat = this.map.getCenter().getLat()
          }
        }
      })
    },
    hideMap() {
      this.isShow = false
    },
    handleConfirm() {
      this.hideMap()
      this.$emit('confirm', { lngLat: this.lnglat })
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
            padding: 15px;
            height: 70vh;
        }
        .input-card {
          position: absolute;
          top: 20px;
          left: 50%;
          z-index: 5;
          transform: translate3d(-50%, 0, 0);
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
