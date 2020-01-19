<template>
  <div>
    <el-input
      v-model="imgValue"
      placeholder="请选择图片"
      clearable
      @clear="clearImg"
      @change="changeHandle"
    >
      <el-button slot="append" @click="showImageDialog">选择图片</el-button>
    </el-input>
    <div v-if="tips" class="tips">{{ tips }}</div>
    <slot>
      <image-box
        :src="imgs"
        :width="width"
        :height="height"
        @delete="deleteCover"
      />
    </slot>
    <!-- 素材库组件 -->
    <image-library ref="chooseImage" :multiple="multiple" :selected-images="imgs" @confirm="selectImage" />
  </div>
</template>

<script>
import ImageLibrary from '@/components/ImageLibrary'
import ImageBox from '@/components/ImageBox'
export default {
  name: 'ImageInput',
  components: {
    ImageLibrary,
    ImageBox
  },
  props: {
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, String],
      default: () => []
    },
    tips: { // 提示信息
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
    },
    listUrl: { // 列表接口地址
      type: String,
      default: ''
    },
    uploadUrl: { // 上传接口地址
      type: String,
      default: ''
    },
    campareItem: { // 素材库传递的图片src的字段
      type: String,
      default: 'url'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // imgs: this.value ? Array.isArray(this.value) ? this.value : this.value.split(',') : []
      imgs: [],
      imgValue: ''
    }
  },
  computed: {
    // imgValue() {
    //   return this.imgs.join()
    // },
    temImgs() {
      return this.value ? Array.isArray(this.value) ? this.value : this.value.split(',') : []
    }
  },
  watch: {
    temImgs: {
      handler(newVal) {
        this.imgs = newVal
      },
      deep: true
    },
    imgs: {
      handler(newVal) {
        this.imgValue = newVal.join()
        this.$emit('input', this.imgValue)
      },
      deep: true
    }
  },
  created() {
    this.imgs = this.temImgs
  },
  methods: {
    selectImage(data) {
      // 选中后的图片
      this.imgs = data.map(v => v[this.campareItem])
    //   this.$emit('input', this.imgs)
    },
    showImageDialog() {
      // 触发子组件的事件 显示图片弹窗
      this.$refs.chooseImage.showDialog()
    },
    deleteCover(data) {
      if (this.disabled) {
        return
      }
      this.imgs.splice(data.index, 1)
    //   this.$emit('input', this.imgs)
    },
    clearImg() {
      this.imgs = []
    //   this.$emit('input', this.imgs)
    },
    changeHandle(val) {
      this.imgs = val.split(',')
    //   this.$emit('input', this.imgs)
    }
    // previews(idx, item) {
    //   // 调用图片预览
    //   this.$imagePreview({
    //     images: this.imgs,
    //     index: idx
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
// .flex {
//     display: flex;
// }
// .margin-right {
//     margin-right: 30px;
// }
// .tips {
//     line-height: 1;
//     padding: 10px 0 5px;
//     color: #999;
//     font-size: 14px;
//   }
.el-input-group__append button.el-button--default {
    border-color: transparent;
    background-color: #409EFF;
    color: #fff;
}
.el-input-group__append button.el-button--default:hover {
  background: #66b1ff;
}
.el-input-group__append button.el-button--success {
    border-color: transparent;
    background-color: #67c23a;
    color: #fff;
}
.el-input-group__append button.el-button--success:hover {
  background: #85ce61;
}
</style>
