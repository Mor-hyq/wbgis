<template>
  <div>
    <el-form>
      <el-form-item label="选择文件" label-width="80px" :error="errorMessage">
        <el-upload
          ref="upload"
          class="upload-file"
          :class="{'margin-change': !disabled}"
          :multiple="false"
          :limit="1"
          :accept="acceptStr"
          action=""
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :auto-upload="false"
          :on-change="handleChange"
        >
          <el-button v-if="disabled" slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="el-upload-tip">支持{{ acceptStr }}文件，数据格式例如：<span class="down-text" @click="exportFile">{{ exportTips }}</span></div>
  </div>
</template>

<script>
export default {
  name: 'ImportFile', // 导入上传文件组件
  props: {
    accept: { // 接收的上传文件格式
      type: Array,
      default: () => ['.xls', '.csv', '.xlsx']
    },
    downFileUrl: { // 下载模板的链接
      type: String,
      default: ''
    },
    uploadField: { // 上传文件时的参数字段名称
      type: String,
      default: 'file'
    },
    uploadFunc: { // 上传文件函数
      type: Function,
      default: () => {}
    },
    exportTips: { // 下载模板文件提示文案
      type: String,
      default: ''
    },
    isDisabled: { // 判断文件是否禁止上传
      type: Boolean,
      default: false
    },
    params: { // 导入发布对象接口所需要的除file外的其他参数
      type: Object,
      default: () => {}
    },
    isShowCodeError: { // 是否在code==200时，判断data.msg并提示错误
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file: '',
      errorMessage: ''
    }
  },
  computed: {
    acceptStr() {
      return this.accept.join()
    },
    disabled() {
      this.$emit('update:isDisabled', !this.file)
      return !this.file
    }
  },
  methods: {
    validateFormate(file) {
      const fileName = file.name
      const nameArr = fileName.split('.')
      const fileFormat = nameArr[nameArr.length - 1].toLowerCase()
      if (!this.accept.includes('.' + fileFormat)) {
        this.errorMessage = `格式错误，支持${this.acceptStr}格式，请删除该文件后重新选择。`
        return false
      }
      this.errorMessage = ''
      return true
    },
    beforeUpload(file) {
      this.validateFormate(file)
    },
    handleChange(file) {
      if (this.validateFormate(file)) {
        this.file = file
      } else {
        this.file = ''
      }
    },
    exportFile() {
      if (this.downFileUrl) {
        window.location.href = this.downFileUrl
      } else {
        this.$message({
          type: 'error',
          message: '下载链接错误'
        })
      }
    },
    handleRemove(file) {
      this.file = ''
      this.errorMessage = ''
    },
    async submit() {
      if (!this.file) {
        this.$message({
          type: 'error',
          message: '请选择要上传的文件'
        })
      }
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const file = new FormData()
      file.append(this.uploadField, this.file.raw)
      for (const k in this.params) {
        file.append(k, this.params[k])
      }
      try {
        const { code, msg, data } = await this.uploadFunc(file)
        loading.close()
        if (code === 200) {
          if (this.isShowCodeError) {
            if (data.msg) {
              // 部分导入失败
              this.$notify.error({
                title: '导入失败内容',
                message: data.msg,
                duration: 0
              })
            } else {
              this.$message({
                type: 'success',
                message: msg
              })
              // 上传成功函数
              this.$emit('success')
            }
          } else {
            this.$message({
              type: 'success',
              message: msg
            })
            // 上传成功函数
            this.$emit('success')
          }
        } else {
          // 上传失败函数
          this.$emit('fail')
        }
      } catch (error) {
        // 上传失败函数
        this.$emit('fail')
        loading.close()
        console.log(error)
      }
    },
    resetForm() {
      // 重置导入文件的数据
      this.$refs.upload.clearFiles()
      this.file = ''
      this.errorMessage = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload-tip {
    padding-left: 80px;
    font-size: 14px;
    .down-text {
        color: #409EFF;
        cursor: pointer;
        &:hover {
            color: rgb(126, 188, 250);
        }
    }
}
.margin-change {
  margin-top: -40px;
}
</style>
