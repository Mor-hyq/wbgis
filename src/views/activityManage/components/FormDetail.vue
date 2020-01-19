<template>
  <div>
    <go-back />
    <div class="temp">
      <span class="label">模板名称:</span>
      <span class="cont">{{ widgetForm.template_name }}</span>
    </div>
    <generate-form ref="generateForm" insite="true" :disabled="isRead" :data="widgetForm" :value="widgetModels" :remote="remoteFuncs">
      <template v-slot:blank="scope">
        宽度：<el-input v-model="scope.model.blank.width" style="width: 100px" />
        高度：<el-input v-model="scope.model.blank.height" style="width: 100px" />
      </template>
    </generate-form>
    <div v-if="isEdit" style="padding:10px 0 15px 0;">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="goBack">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getFormData } from '@/api/generateForm'
import { saveAct, getActDetail, editAct } from '@/api/activity'
import GenerateForm from '@/views/generateForm/components/GenerateForm'

export default {
  components: {
    GenerateForm
  },
  props: {
    templateId: { // 表单模板id 使用模板创建活动时使用与activityId互斥
      type: [Number, String],
      default: ''
    },
    activityId: { // 表单活动id 直接编辑活动表单时使用与templateId互斥
      type: [Number, String],
      default: ''
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      widgetForm: {
        list: [], // 表单渲染内容
        template_name: '', // 活动模板名称
        template_thumb: '', // 活动模板封面图
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'medium'
        }
      }, // 表单结构数据
      widgetModels: {}, // 表单默认值
      remoteFuncs: { // 获取接口数据函数
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: '1', name: '1111' },
              { id: '2', name: '2222' },
              { id: '3', name: '3333' }
            ]

            resolve(options)
          }, 2000)
        },
        upload_callback(response, file, fileList) {
          // console.log('callback', response, file, fileList)
        }
      }
    }
  },
  created() {
    if (this.activityId) {
      this.getActivityForm(this.activityId)
    } else if (this.templateId) {
      this.getWidgetForm(this.templateId)
    }
  },
  methods: {
    // handleDataChange(field, value, data) {
    //   // console.log(field, value, data)
    // },
    async getWidgetForm(id) {
      // 获取活动模板数据
      try {
        const { code, data } = await getFormData({ id })
        if (code === 200) {
          this.widgetForm = data.content || this.widgetForm
          if (this.$refs.generateForm) {
            this.$refs.generateForm.generateModle(this.widgetForm.list)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getActivityForm(id) {
      try {
        const { code, data } = await getActDetail({ id })
        if (code === 200) {
          this.widgetForm = data.content || this.widgetForm
          if (this.$refs.generateForm) {
            this.$refs.generateForm.generateModle(this.widgetForm.list)
          }
          this.widgetModels = data.values || {}
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 创建活动
    async saveActivity({
      values = {}
    } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await saveAct({ values: { ...values, act_template_id: this.templateId }})
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.back()
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    // 编辑活动
    async editActivity({
      values = {}
    } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editAct({ values, id: this.activityId })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          // 更新上一页的数据
          this.$store.commit('app/TOGGLE_UPDATE', true)
          setTimeout(() => {
            this.$router.back()
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    submit() {
      this.$refs.generateForm.getData().then(data => {
        // 当存在templateId时，为创建活动
        if (this.templateId) {
          this.saveActivity({ values: data })
        } else if (this.activityId) {
          this.editActivity({ values: data })
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.temp {
  display: flex;
  margin-bottom: 18px;
  .label {
    flex: 0 0 100px;
    width: 100px;
    text-align: right;
    font-weight: 700;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 32px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .cont {
    line-height: 32px;
    font-size: 14px;
    color: #333;
  }
}
</style>
