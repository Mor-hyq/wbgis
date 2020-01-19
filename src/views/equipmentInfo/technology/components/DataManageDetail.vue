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
        prop="title"
        :label="mylang.fileTitle"
      >
        <el-input v-model="form.title" clearable />
      </el-form-item>
      <el-form-item
        prop="file_type_id"
        :label="mylang.fileType"
      >
        <!-- <el-select v-model="form.file_type_id" clearable>
          <el-option
            v-for="option in typeOptions"
            :key="option.id"
            :label="option.name"
            :value="option.id"
          />
        </el-select> -->
        <el-cascader
          v-model="form.file_type_id"
          :show-all-levels="false"
          :options="typeOptions"
          :props="cascaderOptions"
        />
      </el-form-item>
      <el-form-item prop="fileLen" required :label="mylang.file">
        <div
          v-for="(item, index) in fileData"
          :key="index"
          style="margin-bottom:5px;"
        >
          <el-tag
            :closable="!isRead"
            @close="handleRemove(index)"
          >{{ item.name }}</el-tag>
          <span v-if="item.sha1" class="adown" @click="adown(item)">下载附件</span>
        </div>
        <el-input v-model="form.fileLen" style="display:none;" />
        <el-button type="primary" @click="handleChoose">选择附件</el-button>
        <input ref="fileId" style="display:none;" type="file" @change="handleChange">
      </el-form-item>
      <!-- <el-button v-if="(isEdit || isRead) && form.fileLen" style="display:inline-block;" @click="downFile">下载附件</el-button> -->
      <el-form-item
        prop="remark"
        :label="mylang.remark"
      >
        <el-input v-model="form.remark" type="textarea" :rows="isRead ? '' : 5" />
      </el-form-item>
    </el-form>
    <div v-if="!isRead" style="margin-top:20px;">
      <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
      <el-button @click="goBack">{{ mylang.cancel }}</el-button>
    </div>
  </div>
</template>

<script>
import { addFile, editFile, getFileDetail, getFileTypeSelect } from '@/api/equipmentInfo'
import {
  uploadFile
} from '@/api/common'
import commonApi from '@/api/common/apiMap'
import deleteCache from '@/mixins/deleteCache'
import config from '@/config'
// import Tinymce from '@/components/Tinymce'

export default {
  name: 'DataManageDetail',
  //   components: {
  //     Tinymce
  //   },
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
      typeOptions: [],
      fileUrl: '',
      loadingToast: '',
      cascaderOptions: {
        label: 'name',
        value: 'id',
        children: 'children',
        checkStrictly: true
      },
      form: {
        title: '',
        file_type_id: '',
        upload_file_ids: '',
        fileLen: '', // 文件名称
        remark: ''
      },
      fileData: [], // 文件信息
      formRules: {
        title: [
          { required: true, message: `请输入${this.mylang.fileTitle}` }
        ],
        file_type_id: [
          { required: true, trigger: 'change', message: `请选择${this.mylang.fileType}` }
        ],
        fileLen: [
          { required: true, trigger: 'change', message: `请选择${this.mylang.file}` }
        ]
      },
      id: this.$route.query.id || ''
    }
  },
  watch: {
    fileData: {
      deep: true,
      handler(val) {
        this.form.fileLen = val.length || ''
      }
    }
  },
  created() {
    this.getTypeOptions()
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
            this.uploadFiles()
          })
        }
      })
    },
    async getDetail() {
      try {
        const { code, data } = await getFileDetail({ id: this.id })
        if (code === 200) {
          this.form = { ...this.form, ...data }
          this.fileData = data.upload_file
        }
      } catch (error) {
        //
      }
    },
    uploadFiles() {
      this.loadingToast = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const formData = new FormData()
      let addNewFile = false
      for (let i = 0; i < this.fileData.length; i++) {
        if (!this.fileData[i].id) {
          addNewFile = true
          formData.append('file[]', this.fileData[i])
        }
      }
      if (!addNewFile) {
        if (this.isEdit) {
        // 编辑提交
          this.handleEdit()
        } else {
        // 创建提交
          this.handleCreate()
        }
        return
      }
      uploadFile(formData).then((res) => {
        if (res.code === 200) {
          if (this.form.upload_file_ids) {
            const ids = this.form.upload_file_ids + ',' + res.data.map(v => v.id).join(',')
            this.form.upload_file_ids = ids
          } else {
            this.form.upload_file_ids = res.data.map(v => v.id).join(',')
          }
          if (this.isEdit) {
            // 编辑提交
            this.handleEdit()
          } else {
            // 创建提交
            this.handleCreate()
          }
        } else {
          this.loadingToast.close()
        }
      }).catch(() => {
        this.loadingToast.close()
      })
    },
    async handleCreate() {
      try {
        const file_type_ids = this.form.file_type_id
        const file_type_id = Array.isArray(file_type_ids) ? file_type_ids[file_type_ids.length - 1] : file_type_ids
        const form = {
          title: this.form.title,
          upload_file_ids: this.form.upload_file_ids,
          remark: this.form.remark,
          file_type_id
        }
        const { code } = await addFile(form)
        this.loadingToast.close()
        if (code === 200) {
          this.$_deleteView({ name: 'TechnologyInfo' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'TechnologyInfo'
            })
          }, 500)
        }
      } catch (error) {
        this.loadingToast.close()
      }
    },
    async handleEdit() {
      try {
        const file_type_ids = this.form.file_type_id
        const file_type_id = Array.isArray(file_type_ids) ? file_type_ids[file_type_ids.length - 1] : file_type_ids
        const form = {
          id: this.id,
          title: this.form.title,
          upload_file_ids: this.form.upload_file_ids,
          remark: this.form.remark,
          file_type_id
        }
        const { code } = await editFile(form)
        this.loadingToast.close()
        if (code === 200) {
          this.$_deleteView({ name: 'TechnologyInfo' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'TechnologyInfo'
            })
          }, 500)
        }
      } catch (error) {
        this.loadingToast.close()
      }
    },
    handleChoose() {
      this.$refs.fileId.click()
    },
    handleChange(e) {
      const rawFiles = e.target.files
      if (rawFiles.length > 0) {
        for (let k = 0; k < rawFiles.length; k++) {
          this.fileData.push(rawFiles[k])
        }
      }
    },
    handleRemove(idx) {
      this.fileData.splice(idx, 1)
      this.$refs.fileId.value = null
    },
    downFile() {
      window.location.href = this.fileUrl
    },
    adown(item) {
      const mode = config.mode
      const httpApi = mode === 'local' ? config.dev.url.baseURL : config[mode].url.baseURL
      const url = httpApi + commonApi.downFile + '?sha1=' + item.sha1
      window.location.href = url
    },
    async getTypeOptions() {
      const { code, data } = await getFileTypeSelect({
        type: 'tree'
      })
      if (code === 200) {
        this.typeOptions = data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.adown {
  cursor: pointer;
  color: #333;
  &:hover {
    color: #409EFF;
  }
}
</style>
