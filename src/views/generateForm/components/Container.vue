<template>
  <el-container class="fm2-container">
    <el-main class="fm2-main">
      <el-container>
        <!-- 左侧 表单选项 -->
        <el-aside width="250px">
          <div class="components-list">
            <template v-if="basicFields.length">
              <div class="widget-cate">基础字段</div>
              <draggable
                tag="ul"
                :list="basicComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="handleMove"
                @end="handleMoveEnd"
                @start="handleMoveStart"
              >
                <template v-for="(item, index) in basicComponents">
                  <li v-if="basicFields.indexOf(item.type)>=0" :key="index" class="form-edit-widget-label" :class="{'no-put': item.type == 'divider'}">
                    <a>
                      <i class="icon iconfont" :class="item.icon" />
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>

            <template v-if="advanceFields.length">
              <div class="widget-cate">高级字段</div>
              <draggable
                tag="ul"
                :list="advanceComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="handleMove"
                @end="handleMoveEnd"
                @start="handleMoveStart"
              >
                <template v-for="(item, index) in advanceComponents">
                  <li v-if="advanceFields.indexOf(item.type) >= 0" :key="index" class="form-edit-widget-label" :class="{'no-put': item.type == 'table'}">
                    <a>
                      <i class="icon iconfont" :class="item.icon" />
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>

            <template v-if="layoutFields.length">
              <div class="widget-cate">布局字段</div>
              <draggable
                tag="ul"
                :list="layoutComponents"
                v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                :move="handleMove"
                @end="handleMoveEnd"
                @start="handleMoveStart"
              >
                <template v-for="(item, index) in layoutComponents">
                  <li v-if="layoutFields.indexOf(item.type) >=0" :key="index" class="form-edit-widget-label no-put">
                    <a>
                      <i class="icon iconfont" :class="item.icon" />
                      <span>{{ item.name }}</span>
                    </a>
                  </li>
                </template>
              </draggable>
            </template>

          </div>

        </el-aside>
        <!-- 中部 表单显示区域 -->
        <el-container class="center-container" direction="vertical">
          <el-header class="btn-bar" style="height: 45px;">
            <slot name="action" />
            <el-button v-if="preview" type="text" size="medium" icon="el-icon-finished" @click="handleCreate">提交</el-button>
            <el-button v-if="preview" type="text" size="medium" icon="el-icon-view" @click="handlePreview">预览</el-button>
            <el-button v-if="upload" type="text" size="medium" icon="el-icon-upload2" @click="handleUpload">导入JSON</el-button>
            <el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">生成JSON</el-button>
            <el-button v-if="generateCode" type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">生成代码</el-button>
            <el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">清空</el-button>
          </el-header>
          <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
            <!-- 表单显示区域 -->
            <widget-form v-if="!resetJson" ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect" />
          </el-main>
        </el-container>
        <!-- 右侧 表单项配置 -->
        <el-aside class="widget-config-container">
          <el-container>
            <el-header height="45px">
              <div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">字段属性</div>
              <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">表单属性</div>
            </el-header>
            <el-main class="config-content">
              <!-- 配置字段属性 -->
              <widget-config v-show="configTab=='widget'" :data="widgetFormSelect" />
              <!-- 配置整体表单属性 -->
              <form-config v-show="configTab=='form'" :data="widgetForm.config" />
            </el-main>
          </el-container>

        </el-aside>
        <!-- 表单预览弹窗 -->
        <cus-dialog
          ref="widgetPreview"
          :visible="previewVisible"
          width="1000px"
          form
          @on-close="previewVisible = false"
        >
          <generate-form v-if="previewVisible" ref="generateForm" insite="true" :data="widgetForm" :value="widgetModels" :remote="remoteFuncs" @on-change="handleDataChange">

            <template v-slot:blank="scope">
              宽度：<el-input v-model="scope.model.blank.width" style="width: 100px" />
              高度：<el-input v-model="scope.model.blank.height" style="width: 100px" />
            </template>
          </generate-form>

          <template slot="action">
            <el-button type="primary" @click="handleTest">获取数据</el-button>
            <el-button @click="handleReset">重置</el-button>
          </template>
        </cus-dialog>
        <!-- 导入JSON弹窗 -->
        <cus-dialog
          ref="uploadJson"
          :visible="uploadVisible"
          width="800px"
          form
          @on-close="uploadVisible = false"
          @on-submit="handleUploadJson"
        >
          <el-alert type="info" title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可" />
          <pre id="uploadeditor" style="height: 400px;width: 100%;overflow:auto;">{{ jsonEg }}</pre>
        </cus-dialog>
        <!-- 生成JSON弹窗 -->
        <cus-dialog
          ref="jsonPreview"
          :visible="jsonVisible"
          width="800px"
          form
          @on-close="jsonVisible = false"
        >

          <pre id="jsoneditor" style="height: 400px;width: 100%;overflow:auto;">{{ jsonTemplate }}</pre>

          <template slot="action">
            <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制数据</el-button>
          </template>
        </cus-dialog>
        <!-- 生成代码弹窗 -->
        <cus-dialog
          ref="codePreview"
          :visible="codeVisible"
          width="800px"
          form
          :action="false"
          @on-close="codeVisible = false"
        >
          <div id="codeeditor" style="height: 500px; width: 100%;">{{ htmlTemplate }}</div>
        </cus-dialog>
      </el-container>
    </el-main>
  </el-container>

</template>

<script>
import { saveForm, updateFormData, getFormData } from '@/api/generateForm'
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
import Clipboard from 'clipboard'
import { basicComponents, layoutComponents, advanceComponents } from './componentsConfig.js'
import generateCode from './generateCode.js'

export default {
  name: 'FmMakingForm',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm
  },
  props: {
    id: { // 表单模板id
      type: [Number, String],
      default: ''
    },
    preview: { // 是否开启顶部预览功能
      type: Boolean,
      default: false
    },
    generateCode: { // 是否开启顶部生成代码功能
      type: Boolean,
      default: false
    },
    generateJson: { // 是否开启顶部生成JSON数据功能
      type: Boolean,
      default: true
    },
    upload: { // 是否开启顶部导入JSON功能
      type: Boolean,
      default: false
    },
    clearable: { // 是否开启顶部清空功能
      type: Boolean,
      default: false
    },
    basicFields: { // 基础字段
      type: Array,
      default: () => ['input', 'textarea', 'number', 'radio', 'checkbox', 'time', 'date', 'rate', 'color', 'select', 'switch', 'slider', 'text']
    },
    advanceFields: { // 高级字段
      type: Array,
      default: () => ['blank', 'imgupload', 'editor', 'cascader']
    },
    layoutFields: { // 布局字段
      type: Array,
      default: () => ['grid', 'tabs']
    }
  },
  data() {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      resetJson: false,
      template_name: '',
      template_thumb: '',
      widgetForm: { // 表单数据结构
        list: [], // 表单渲染内容
        template_name: '', // 活动模板名称
        template_thumb: '', // 活动模板封面图
        config: {
          labelWidth: 100,
          labelPosition: 'right',
          size: 'medium'
        }
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: { // 获取接口数据函数
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { value: '1', label: '1111' },
              { value: '2', label: '2222' },
              { value: '3', label: '3333' }
            ]

            resolve(options)
          }, 2000)
        },
        upload_callback(response, file, fileList) {
          // console.log('callback', response, file, fileList)
        }
      },
      widgetModels: {}, // 表单默认值
      blank: '',
      htmlTemplate: '',
      jsonTemplate: '',
      uploadEditor: null,
      jsonCopyValue: '',
      jsonClipboard: null,
      jsonEg: `{
  "list": [
    {
      "type": "input",
      "name": "单行文本",
      "icon": "icon-input",
      "options": {
        "width": "100%",
        "defaultValue": "",
        "required": false,
        "dataType": "string",
        "pattern": "",
        "placeholder": "",
        "remoteFunc": "func_1540908864000_94322"
      },
      "key": "1540908864000_94322",
      "model": "input_1540908864000_94322",
      "rules": [
        {
          "type": "string",
          "message": "单行文本格式不正确"
        }
      ]
    },
    {
      "type": "textarea",
      "name": "多行文本",
      "icon": "icon-diy-com-textarea",
      "options": {
        "width": "100%",
        "defaultValue": "",
        "required": false,
        "pattern": "",
        "placeholder": "",
        "remoteFunc": "func_1540908876000_19435"
      },
      "key": "1540908876000_19435",
      "model": "textarea_1540908876000_19435",
      "rules": []
    }
  ],
  "config": {
    "labelWidth": 100,
    "labelPosition": "top",
    "size": "medium"
  }
}`
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function(val) {
        // console.log(val)
        // console.log(this.$refs.widgetForm)
      }
    }
  },
  created() {
    // 如果路由携带id则为编辑状态
    if (this.id) {
      this.getWidgetForm(this.id)
    }
  },
  mounted() {

  },
  methods: {
    async getWidgetForm(id) {
      try {
        const { code, data } = await getFormData({ id })
        if (code === 200) {
          this.widgetForm = data.content || this.widgetForm
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleConfigSelect(value) {
      this.configTab = value
    },
    handleMoveEnd(evt) {
      // console.log('end', evt)
    },
    handleMoveStart({ oldIndex }) {
      // console.log('start', oldIndex, this.basicComponents)
    },
    handleMove() {
      return true
    },
    handlePreview() {
      // console.log(this.widgetForm)
      this.previewVisible = true
    },
    handleTest() {
      this.$refs.generateForm.getData().then(data => {
        this.$alert(data, '').catch(e => {})
        this.$refs.widgetPreview.end()
      }).catch(e => {
        this.$refs.widgetPreview.end()
      })
    },
    handleReset() {
      this.$refs.generateForm.reset()
    },
    handleGenerateJson() {
      // 生成JSON
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      // console.log(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {
        // const editor = ace.edit('jsoneditor')
        // editor.session.setMode('ace/mode/json')

        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard('.json-btn')
          this.jsonClipboard.on('success', (e) => {
            this.$message.success('复制成功')
          })
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm)
      })
    },
    handleGenerateCode() {
      // 生成代码
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm))
      // this.$nextTick(() => {
      //   const editor = ace.edit('codeeditor')
      //   editor.session.setMode('ace/mode/html')
      // })
    },
    handleUpload() {
      // 导入JSON数据
      this.uploadVisible = true
      // this.$nextTick(() => {
      //   this.uploadEditor = ace.edit('uploadeditor')
      //   this.uploadEditor.session.setMode('ace/mode/json')
      // })
    },
    handleCreate() {
      // 提交数据生成表单
      this.$confirm('是否提交活动模板数据？', '提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        if (!this.widgetForm.template_name) {
          this.$message({
            type: 'error',
            message: '请填写活动模板名称'
          })
          return
        }
        if (!this.widgetForm.template_thumb) {
          this.$message({
            type: 'error',
            message: '请选择活动模板封面图'
          })
          return
        }
        const loading = this.$loading({
          lock: true,
          text: '提交中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        try {
          if (!this.id) {
            // 创建模板
            const { code } = await saveForm({
              template: this.widgetForm
            })
            loading.close()
            if (code === 200) {
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              setTimeout(() => {
                this.$router.back()
              }, 500)
            }
          } else {
            // 编辑模板
            const { code } = await updateFormData({
              template: this.widgetForm,
              id: this.id
            })
            loading.close()
            if (code === 200) {
              this.$message({
                type: 'success',
                message: '提交成功'
              })
              setTimeout(() => {
                this.$router.back()
              }, 500)
            }
          }
        } catch (error) {
          loading.close()
        }
      })
    },
    handleUploadJson() {
      try {
        this.setJSON(JSON.parse(this.uploadEditor.getValue()))
        this.uploadVisible = false
      } catch (e) {
        this.$message.error(e.message)
        this.$refs.uploadJson.end()
      }
    },
    handleClear() {
      this.$confirm('是否清空数据？', '清空', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        // 清空表单数据
        this.widgetForm = {
          list: [],
          template_name: '',
          template_thumb: '',
          config: {
            labelWidth: 100,
            labelPosition: 'right',
            size: 'medium'
          }
        }
        this.widgetFormSelect = {}
      })
    },
    getJSON() {
      return this.widgetForm
    },
    getHtml() {
      return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON(json) {
      this.widgetForm = json

      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0]
      }
    },
    handleInput(val) {
      // console.log(val)
      this.blank = val
    },
    handleDataChange(field, value, data) {
      // console.log(field, value, data)
    },
    handleSuccess(response, file, fileList) {
      this.template_thumb = file
    }
  }
}
</script>

<style lang="scss">
.widget-empty{
  background-position: 50%;
}
</style>
