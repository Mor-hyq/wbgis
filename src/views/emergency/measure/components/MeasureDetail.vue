<template>
  <div>
    <el-form
      ref="form"
      :rules="isRead ? {} :formRules"
      :model="form"
      label-suffix=":"
      label-width="auto"
      :size="$btnSize"
      class="custom-class"
      style="padding-top:5px;"
      :disabled="isRead"
    >
      <el-form-item
        prop="name"
        :label="mylang.measureName"
      >
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item
        prop="process"
        style="margin-bottom: 30px;"
        :label="mylang.measureProcess"
      >
        <!-- <Tinymce ref="editor1" v-model="form.process" :height="200" /> -->
        <el-input v-model="form.process" type="textarea" :rows="isRead ? '' : 5" />
      </el-form-item>
      <el-form-item
        prop="require"
        style="margin-bottom: 30px;"
        :label="mylang.measureRequire"
      >
        <!-- <Tinymce ref="editor2" v-model="form.require" :height="200" /> -->
        <el-input v-model="form.require" type="textarea" :rows="isRead ? '' : 5" />

      </el-form-item>
      <el-form-item prop="attachment" required :label="mylang.attachment">
        <el-tag v-if="form.attachment" closable @close="handleRemove">{{ form.attachment }}</el-tag>
        <el-button v-if="(isEdit || isRead) && form.attachment" @click="downFile">下载附件</el-button>
        <el-input v-model="form.attachment" style="display:none;" />
        <el-button @click="handleChoose">选择附件</el-button>
        <input id="fileId" style="display:none;" type="file" @change="handleChange">
      </el-form-item>
    </el-form>
    <div v-if="!isRead" style="margin-top:20px;">
      <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
      <el-button @click="goBack">{{ mylang.cancel }}</el-button>
    </div>
  </div>
</template>

<script>
import { addMeasure, editMeasure, getMeasureDetail } from '@/api/emergency'
import deleteCache from '@/mixins/deleteCache'
// import Tinymce from '@/components/Tinymce'

export default {
  name: 'MeasureComponentDetail',
  components: {
    // Tinymce
  },
  mixins: [deleteCache],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileUrl: '',
      form: {
        name: '',
        process: '',
        require: '',
        file: '',
        attachment: ''
      },
      formRules: {
        name: [
          { required: true, message: `请输入${this.mylang.measureName}` }
        ],
        process: [
          { required: true, trigger: 'change', message: `请输入${this.mylang.measureProcess}` }
        ],
        require: [
          { required: true, trigger: 'change', message: `请输入${this.mylang.measureRequire}` }
        ],
        attachment: [
          { required: true, trigger: 'change', message: `请选择${this.mylang.attachment}` }
        ]
      },
      id: this.$route.query.id || ''
    }
  },
  created() {
    if (this.isEdit || this.isRead) {
      this.getDetail()
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              // 编辑提交
              this.handleEdit()
            } else {
              // 创建提交
              this.handleCreate()
            }
          })
        }
      })
    },
    async getDetail() {
      try {
        const { code, data } = await getMeasureDetail({ id: this.id })
        if (code === 200) {
          this.form = { ...this.form, ...data }
          this.fileUrl = data.file_path
        }
      } catch (error) {
        //
      }
    },
    async handleCreate() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('process', this.form.process)
      formData.append('require', this.form.require)
      formData.append('file', this.form.file)
      try {
        const { code } = await addMeasure({ file: formData })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'Measures' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'Measures'
            })
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    async handleEdit() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('process', this.form.process)
      formData.append('require', this.form.require)
      formData.append('id', this.id)
      if (this.form.file) {
        formData.append('file', this.form.file)
      }
      try {
        const { code } = await editMeasure({ file: formData })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'Measures' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'Measures'
            })
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    handleChoose() {
      const fileDom = document.getElementById('fileId')
      fileDom.click()
    },
    handleChange(e) {
      const rawFile = e.target.files[0]
      if (rawFile) {
        this.form.attachment = rawFile.name
        this.form.file = rawFile
      }
    },
    handleRemove() {
      this.form.attachment = ''
      this.form.file = ''
    },
    downFile() {
      window.location.href = this.fileUrl
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
