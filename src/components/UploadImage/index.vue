<template>
  <div
    :id="uploadId"
    class="fm-uplaod-container"
  >
    <div
      v-if="status ==='uploading'"
      :style="{width: width+'px', height: height+'px'}"
      class="upload-file uploading"
    >
      <el-progress :width="miniWidth*0.9" class="upload-progress" type="circle" :percentage="progress" />
    </div>
    <div
      v-for="(item) in imgList"
      :key="item[srcField]"
      :style="{width: width+'px', height: height+'px'}"
      class="upload-file is-success"
    >
      <img :src="item[srcField]">
      <label class="item-status">
        <i class="el-icon-upload-success el-icon-check" />
      </label>
      <div class="uplaod-action" :style="{height: miniWidth / 4 + 'px'}">
        <i class="el-icon-full-screen" title="预览" :style="{'font-size': miniWidth/8+'px'}" @click="handlePreviewFile(item)" />
        <!-- <i v-if="isDelete && imgList.length > min" class="el-icon-delete" title="删除" :style="{'font-size': miniWidth/8+'px'}" @click="handleRemove(item)" /> -->
        <i v-if="!disabled" class="el-icon-delete" title="删除" :style="{'font-size': miniWidth/8+'px'}" @click="handleRemove(item)" />
      </div>
    </div>
    <div
      v-show="imgList.length < length"
      class="el-upload el-upload--picture-card"
      :class="{'is-disabled': disabled}"
      :style="{width: width+'px', height: height+'px'}"
      @click.self="handleAdd"
    >
      <i class="el-icon-plus" :style="{fontSize:miniWidth/4+'px',marginTop: (-miniWidth/8)+'px', marginLeft: (-miniWidth/8)+'px'}" @click.self="handleAdd" />
      <input v-if="multiple" ref="uploadInput" accept="image/*" multiple type="file" :style="{width: 0, height: 0}" name="file" class="el-upload__input upload-input" @change="handleChange">
      <input v-else ref="uploadInput" accept="image/*" type="file" :style="{width:0, height: 0}" name="file" class="el-upload__input upload-input" @change="handleChange">
    </div>
    <p v-if="tips" class="tips">{{ tips }}</p>
  </div>
</template>

<script>
import Viewer from 'viewerjs'
require('viewerjs/dist/viewer.css')
import { uploadImage } from '@/api/common'

export default {
  // 上传图片组件
  name: 'UploadImage',
  props: {
    value: { // 图片数组
      type: Array,
      default: () => []
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    multiple: { // 是否多选
      type: Boolean,
      default: false
    },
    length: { // 最多图片数量
      type: Number,
      default: 9
    },
    isDelete: { // 是否可删除
      type: Boolean,
      default: true
    },
    // min: { // 图片最小数量
    //   type: Number,
    //   default: 0
    // },
    // action: { // 图片上传地址 本项目图片地址固定
    //   type: String,
    //   default: ''
    // },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    imgLimitSize: { // 图片限制大小单位MB 为0则不做限制
      type: Number,
      default: 0
    },
    tips: { // 图片提示文案
      type: String,
      default: ''
    },
    srcField: { // 图片上传后传递的图片路径字段名
      type: String,
      default: 'thumb'
    }
  },
  data() {
    return {
      imgList: this.value.map(v => {
        if (typeof v === 'string') {
          return {
            [this.srcField]: v
          }
        }
        return v
      }),
      viewer: null,
      status: '',
      progress: 0,
      uploadId: 'upload_' + new Date().getTime(),
      editIndex: -1
    }
  },
  computed: {
    miniWidth() {
      if (this.width > this.height) {
        return this.height
      } else {
        return this.width
      }
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        this.imgList = val.map(v => {
          if (typeof v === 'string') {
            return {
              [this.srcField]: v
            }
          }
          return v
        })
      }
    }
    // imgList: {
    //   deep: true,
    //   handler(val) {
    //     this.$emit('input', this.imgList)
    //   }
    // }
  },
  mounted() {
    // this.$emit('input', this.imgList)
  },
  methods: {
    async handleChange() {
      const files = this.$refs.uploadInput.files
      if (files.length + this.imgList.length > this.length) {
        this.$message({
          type: 'error',
          message: `图片不能超过${this.length}张`
        })
        return
      }
      const formData = new FormData()
      this.status = 'uploading'
      this.progress = 0
      for (let i = 0; i < files.length; i++) {
        formData.append('img[]', files[i])
        const fileName = files[i].name
        const nameArr = fileName.split('.')
        const fileFormat = nameArr[nameArr.length - 1].toLowerCase()
        if (this.imgLimitSize) {
          const isLt2M = files[i].size / 1024 / 1024 < this.imgLimitSize
          if (!isLt2M) {
            this.$message({
              type: 'error',
              message: `图片大小不能超过 ${this.imgLimitSize}MB!`
            })
            this.status = ''
            return
          }
        }
        if (!(/png|jpe?g/).test(fileFormat)) {
          this.$message({
            type: 'error',
            message: '上传格式出错，图片格式必须为png/jpg/jpeg'
          })
          this.status = ''
          return
        }
      }
      try {
        const { code, data } = await uploadImage({ img: formData }, (res) => {
          this.progress = Math.floor(res.loaded / res.total * 100)
        })
        if (code === 200) {
          this.imgList = this.imgList.concat(data.img || [])
          this.status = 'success'
          const tempImg = this.imgList.map(v => v[this.srcField])
          this.$emit('input', tempImg)
        } else {
          this.status = 'fail'
        }
      } catch (error) {
        this.status = 'fail'
      }
    },
    handleRemove(key) {
      this.imgList.splice(this.imgList.findIndex(item => item[this.srcField] === key[this.srcField]), 1)
    },
    handleAdd() {
      if (!this.disabled) {
        this.editIndex = -1
        this.$refs.uploadInput.click()
      }
    },
    handlePreviewFile(key) {
      this.viewer && this.viewer.destroy()
      this.uploadId = 'upload_' + new Date().getTime()
      this.$nextTick(() => {
        this.viewer = new Viewer(document.getElementById(this.uploadId))
        this.viewer.view(this.imgList.findIndex(item => item[this.srcField] === key[this.srcField]))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fm-uplaod-container{
  .is-disabled{
    position: relative;

    &::after{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      content: '';
      display: block;
      cursor:not-allowed;
    }
  }

  .upload-file{
    margin: 0 10px 10px 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    // background: #fff;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    position: relative;
    vertical-align: top;
    &:hover{
      .uplaod-action{
        display: flex;
      }
    }
    .uplaod-action{
      position: absolute;
      // top: 0;
      // height: 30px;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.6);
      display: none;
      justify-content: center;
      align-items: center;
      i{
        color: #fff;
        cursor: pointer;
        margin: 0 5px;
      }
    }
    &.is-success{
      .item-status{
        position: absolute;
        right: -15px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        text-align: center;
        transform: rotate(45deg);
        box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
        &>i{
          font-size: 12px;
          margin-top: 11px;
          color: #fff;
          transform: rotate(-45deg);
        }
      }
    }
    &.uploading{
      &:before{
        display: block;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.3);
      }
    }
    .upload-progress{
      position: absolute;
      .el-progress__text{
        color: #fff;
        font-size: 16px !important;
      }
    }
    img{
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }
  .el-upload--picture-card{
    position: relative;
    overflow: hidden;
    .el-icon-plus{
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }
  .upload-input{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    opacity: 0;
    cursor: pointer;
  }

  .drag-img-list{
    display: inline;

    .ghost{
      position: relative;
      &::after {
        width: 100%;
        height: 100%;
        display: block;
        content: '';
        background: #fbfdff;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border: 1px dashed #3bb3c2;
      }
    }

    &>div{
      cursor: move;
    }
  }
}

.viewer-container{
  z-index: 9999 !important;
}
.tips {
  padding-top: 5px;
  margin: 0;
  line-height: 1.5;
  font-size: 12px;
  color: #999;
}
</style>
