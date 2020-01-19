<template>
  <div id="cover-img-box" class="cover-img-box">
    <div
      v-for="(url, index) in pictures"
      :key="index"
      :style="{
        'width': width + 'px',
        'height': height + 'px'
      }"
      class="img-box"
    >
      <el-image
        :src="url"
        class="img"
        fit="contain"
        @load="imgload"
      >
        <div slot="error" class="err-image-slot">
          <i class="el-icon-picture-outline" />
          暂无图片
        </div>
      </el-image>
      <div class="dlt el-icon-close" @click.stop="deleteImage(index)" />
    </div>
    <span class="tips">{{ tips }}</span>
  </div>
</template>

<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
export default {
  name: 'ImageBox',
  props: {
    src: { // 图片地址组
      type: Array,
      default: () => []
    },
    tips: { // 上传图片提示
      type: String,
      default: ''
    },
    width: { // 图片容器宽度
      type: [String, Number],
      default: '120'
    },
    height: { // 图片容器高度
      type: [String, Number],
      default: '120'
    }
  },
  data() {
    return {
      pictures: [],
      imgViewer: ''
    }
  },
  watch: {
    src: {
      handler(newVal) {
        this.pictures = [...newVal]
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      const viewer = new Viewer(document.getElementById('cover-img-box'), {
        movable: false
      })
      this.imgViewer = viewer
      this.$once('hook:beforeDestroy', function() {
        viewer.destroy()
      })
    })
  },
  methods: {
    deleteImage(idx) {
      this.$emit('delete', { index: idx })
    },
    imgload() {
      // 图片加载完毕才能预览 否则有bug
      if (this.imgViewer) {
        this.imgViewer.update()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cover-img-box {
  display: flex;
  margin-top: 10px;
  .img-box {
    position: relative;
    width: 120px;
    height: 120px;
    margin-right: 30px;
    border: 1px solid #ddd;
    .img {
        width: 100%;
        height: 100%;
    }
    .dlt {
      position: absolute;
      top: 0;
      right: -20px;
      font-size: 16px;
      color: #999;
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: #000;
      }
    }
  }
  .tips {
    color: #999;
    font-size: 14px;
  }
  /deep/.err-image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 14px;
  }
}
.hidden {
  display: none!important;
}
</style>
