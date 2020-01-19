<template>
  <div v-if="show">
    <el-form label-position="top">
      <el-form-item v-if="data.type!='grid' && data.type !='tabs'" label="标题">
        <el-input v-model="data.name" />
      </el-form-item>
      <el-form-item label="字段标识">
        <el-input v-model="data.model" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('width')>=0" label="宽度">
        <el-input v-model="data.options.width" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('labelWidth')>=0" label="标签宽度">
        <el-checkbox v-model="data.options.isLabelWidth" style="margin-right:0;">自定义</el-checkbox>
        <el-input-number v-model="data.options.labelWidth" size="small" :disabled="!data.options.isLabelWidth" :min="0" :max="200" :step="10" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('height')>=0" label="高度">
        <el-input v-model="data.options.height" />
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('size')>=0" label="大小">
        宽度:<el-input v-model.number="data.options.size.width" class="el-input--small" style="width: 90px;" type="number" />
        高度:<el-input v-model.number="data.options.size.height" class="el-input--small" style="width: 90px;" type="number" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('inputSlots')>=0" label="添加">
        <el-input v-model="data.options.inputSlots.prepend">
          <template slot="prepend">前置内容</template>
        </el-input>
        <el-input v-model="data.options.inputSlots.append">
          <template slot="prepend">后置内容</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('placeholder')>=0 && (data.type!='time' || data.type!='date')" label="占位内容">
        <el-input v-model="data.options.placeholder" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('inline')>=0" label="布局方式">
        <el-radio-group v-model="data.options.inline" size="mini">
          <el-radio-button :label="false">块级</el-radio-button>
          <el-radio-button :label="true">行内</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showInput')>=0" label="显示输入框">
        <el-switch v-model="data.options.showInput" />
      </el-form-item>
      <template v-if="data.type !== 'imgupload'">
        <el-form-item v-if="Object.keys(data.options).indexOf('min')>=0" label="最小值">
          <el-input-number v-model="data.options.min" :min="0" :max="100" :step="1" />
        </el-form-item>
      </template>
      <el-form-item v-if="Object.keys(data.options).indexOf('max')>=0" label="最大值">
        <el-input-number v-model="data.options.max" :min="0" :max="100" :step="1" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('step')>=0" label="步长">
        <el-input-number v-model="data.options.step" :min="0" :max="100" :step="1" />
      </el-form-item>
      <el-form-item v-if="data.type=='select' || data.type=='imgupload'" label="是否多选">
        <el-switch v-model="data.options.multiple" @change="handleSelectMuliple" />
      </el-form-item>
      <el-form-item v-if="data.type=='select'" label="是否可搜索">
        <el-switch v-model="data.options.filterable" />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('allowHalf')>=0" label="允许半选">
        <el-switch
          v-model="data.options.allowHalf"
        />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showAlpha')>=0" label="支持透明度选择">
        <el-switch
          v-model="data.options.showAlpha"
        />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('showLabel')>=0" label="是否显示标签">
        <el-switch
          v-model="data.options.showLabel"
        />
      </el-form-item>
      <el-form-item v-if="Object.keys(data.options).indexOf('options')>=0" label="选项">
        <el-radio-group v-model="data.options.remote" size="mini" style="margin-bottom:10px;">
          <el-radio-button :label="false">静态数据</el-radio-button>
          <el-radio-button :label="true">远端数据</el-radio-button>
        </el-radio-group>
        <template v-if="data.options.remote">
          <div>
            <el-input v-model="data.options.remoteFunc" size="mini" style="">
              <template slot="prepend">远端方法</template>
            </el-input>
            <el-input v-model="data.options.props.value" size="mini" style="">
              <template slot="prepend">值</template>
            </el-input>
            <el-input v-model="data.options.props.label" size="mini" style="">
              <template slot="prepend">标签</template>
            </el-input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <el-radio-group v-model="data.options.defaultValue" size="mini">
              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-radio
                    :label="item.value"
                    style="margin-right: 5px;line-height:40px;"
                  >
                    <el-input v-model="item.value" placeholder="值" :style="{'width': data.options.showLabel? '90px': '180px' }" size="mini" />
                    <el-input v-if="data.options.showLabel" v-model="item.label" placeholder="标签" style="width:90px;" size="mini" />
                  </el-radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 2px;cursor: move;"><i class="iconfont icon-icon_bars" /></i>
                  <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />

                </li>
              </draggable>

            </el-radio-group>
          </template>

          <template v-if="data.type=='checkbox' || (data.type=='select' && data.options.multiple)">
            <el-checkbox-group v-model="data.options.defaultValue">

              <draggable
                tag="ul"
                :list="data.options.options"
                v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
                handle=".drag-item"
              >
                <li v-for="(item, index) in data.options.options" :key="index">
                  <el-checkbox
                    :label="item.value"
                    style="margin-right: 5px;"
                  >
                    <el-input v-model="item.value" placeholder="值" :style="{'width': data.options.showLabel? '90px': '180px' }" size="mini" />
                    <el-input v-if="data.options.showLabel" v-model="item.label" placeholder="标签" style="width:90px;" size="mini" />
                  </el-checkbox>
                  <i class="drag-item" style="font-size: 16px;margin: 0 2px;cursor: move;"><i class="iconfont icon-icon_bars" /></i>
                  <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />

                </li>
              </draggable>
            </el-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddOption">添加选项</el-button>
          </div>
        </template>

      </el-form-item>

      <el-form-item v-if="data.type=='cascader'" label="远端数据">
        <div>
          <el-input v-model="data.options.remoteFunc" size="mini" style="">
            <template slot="prepend">远端方法</template>
          </el-input>
          <el-input v-model="data.options.props.value" size="mini" style="">
            <template slot="prepend">值</template>
          </el-input>
          <el-input v-model="data.options.props.label" size="mini" style="">
            <template slot="prepend">标签</template>
          </el-input>
          <el-input v-model="data.options.props.children" size="mini" style="">
            <template slot="prepend">子选项</template>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'textarea' || data.type == 'input' || data.type=='rate' || data.type=='color' || data.type=='switch')" label="默认值">
        <el-input v-if="data.type=='textarea'" v-model="data.options.defaultValue" type="textarea" :rows="5" />
        <el-input v-if="data.type=='input'" v-model="data.options.defaultValue" />
        <el-rate v-if="data.type == 'rate'" v-model="data.options.defaultValue" style="display:inline-block;vertical-align: middle;" :max="data.options.max" :allow-half="data.options.allowHalf" />
        <el-button v-if="data.type == 'rate'" type="text" style="display:inline-block;vertical-align: middle;margin-left: 10px;" @click="data.options.defaultValue=0">清空</el-button>
        <el-color-picker
          v-if="data.type == 'color'"
          v-model="data.options.defaultValue"
          :show-alpha="data.options.showAlpha"
        />
        <el-switch v-if="data.type=='switch'" v-model="data.options.defaultValue" />
      </el-form-item>

      <template v-if="data.type == 'time' || data.type == 'date'">
        <el-form-item v-if="data.type == 'date'" label="显示类型">
          <el-select v-model="data.options.type">
            <el-option value="year" />
            <el-option value="month" />
            <el-option value="date" />
            <el-option value="dates" />
            <!-- <el-option value="week"></el-option> -->
            <el-option value="datetime" />
            <el-option value="datetimerange" />
            <el-option value="daterange" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="data.type == 'time'" label="是否为范围选择">
          <el-switch
            v-model="data.options.isRange"
          />
        </el-form-item>
        <el-form-item v-if="data.type == 'date'" label="是否获取时间戳">
          <el-switch
            v-model="data.options.timestamp"
          />
        </el-form-item>
        <el-form-item v-if="(!data.options.isRange && data.type == 'time') || (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')" label="占位内容">
          <el-input v-model="data.options.placeholder" />
        </el-form-item>
        <el-form-item v-if="(data.options.isRange) || data.options.type=='datetimerange' || data.options.type=='daterange'" label="开始时间占位内容">
          <el-input v-model="data.options.startPlaceholder" />
        </el-form-item>
        <el-form-item v-if="data.options.isRange || data.options.type=='datetimerange' || data.options.type=='daterange'" label="结束时间占位内容">
          <el-input v-model="data.options.endPlaceholder" />
        </el-form-item>
        <el-form-item label="格式">
          <el-input v-model="data.options.format" />
        </el-form-item>
        <el-form-item v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0" label="默认值">
          <el-time-picker
            v-if="!data.options.isRange"
            key="1"
            v-model="data.options.defaultValue"
            style="width: 100%;"
            :arrow-control="data.options.arrowControl"
            :value-format="data.options.format"
          />
          <el-time-picker
            v-if="data.options.isRange"
            key="2"
            v-model="data.options.defaultValue"
            style="width: 100%;"
            is-range
            :arrow-control="data.options.arrowControl"
            :value-format="data.options.format"
          />
        </el-form-item>
      </template>

      <template v-if="data.type=='imgupload'">
        <el-form-item label="最小上传数">
          <el-input v-model.number="data.options.min" type="number" />
        </el-form-item>
        <el-form-item label="最大上传数">
          <el-input v-model.number="data.options.length" type="number" />
        </el-form-item>
        <el-form-item label="图片提示文案">
          <el-input v-model="data.options.tips" type="text" placeholder="输入图片提示文案" clearable />
        </el-form-item>
      </template>

      <template v-if="data.type=='blank'">
        <el-form-item label="绑定数据类型">
          <el-select v-model="data.options.defaultType">
            <el-option value="String" label="字符" />
            <el-option value="Object" label="对象" />
            <el-option value="Array" label="数组" />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type == 'grid'">
        <el-form-item label="字段标识">
          <el-input v-model="data.model" />
        </el-form-item>
        <el-form-item label="栅格间隔">
          <el-input v-model.number="data.options.gutter" type="number" />
        </el-form-item>
        <el-form-item label="列配置项">
          <draggable
            tag="ul"
            :list="data.columns"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
            handle=".drag-item"
          >
            <li v-for="(item, index) in data.columns" :key="index">
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars" /></i>
              <el-input v-model.number="item.span" placeholder="栅格值" size="mini" style="width: 100px;" type="number" />

              <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />

            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddColumn">添加列</el-button>
          </div>
        </el-form-item>
        <el-form-item label="水平排列方式">
          <el-select v-model="data.options.justify">
            <el-option value="start" label="左对齐" />
            <el-option value="end" label="右对齐" />
            <el-option value="center" label="居中" />
            <el-option value="space-around" label="两侧间隔相等" />
            <el-option value="space-between" label="两端对齐" />
          </el-select>
        </el-form-item>
        <el-form-item label="垂直排列方式">
          <el-select v-model="data.options.align">
            <el-option value="top" label="顶部对齐" />
            <el-option value="middle" label="居中" />
            <el-option value="bottom" label="底部对齐" />
          </el-select>
        </el-form-item>
      </template>

      <template v-if="data.type != 'grid' && data.type !='tabs'">

        <!-- <el-form-item label="数据绑定Key">
          <el-input v-model="data.model" />
        </el-form-item> -->
        <el-form-item label="操作属性">
          <el-checkbox v-if="Object.keys(data.options).indexOf('readonly')>=0" v-model="data.options.readonly">完全只读</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('disabled')>=0" v-model="data.options.disabled">禁用	</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('hidden')>=0" v-model="data.options.hidden">隐藏</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('editable')>=0" v-model="data.options.editable">文本框可输入</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('showPassword')>=0" v-model="data.options.showPassword">是否为密码框</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('clearable')>=0" v-model="data.options.clearable">显示清除按钮</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('arrowControl')>=0" v-model="data.options.arrowControl">使用箭头进行时间选择</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('isDelete')>=0" v-model="data.options.isDelete">删除</el-checkbox>
          <el-checkbox v-if="Object.keys(data.options).indexOf('isEdit')>=0" v-model="data.options.isEdit">编辑</el-checkbox>
        </el-form-item>
        <el-form-item label="校验">
          <div v-if="Object.keys(data.options).indexOf('required')>=0">
            <el-checkbox v-model="data.options.required">必填</el-checkbox>
          </div>
          <el-select v-if="Object.keys(data.options).indexOf('dataType')>=0" v-model="data.options.dataType" size="mini">
            <el-option value="string" label="任意字符" />
            <el-option value="phone" label="手机号码" />
            <el-option value="idCard" label="身份证号码" />
            <el-option value="integer" label="整数" />
            <el-option value="float" label="小数" />
            <el-option value="url" label="URL地址" />
            <el-option value="email" label="邮箱地址" />
          </el-select>
          <div v-if="Object.keys(data.options).indexOf('limit')>=0">
            <el-checkbox v-if="Object.keys(data.options).indexOf('showWordLimit')>=0" v-model="data.options.showWordLimit">显示字符长度限制</el-checkbox>
            <el-form-item label="长度限制">
              <el-input v-model="data.options.limit.minLength" :min="1" :max="data.options.limit.maxLength" class="el-input--small" type="number" clearable>
                <template slot="prepend">{{ data.type === 'checkbox' ? '最小个数:': '最小长度:' }}</template>
              </el-input>
              <el-input v-model="data.options.limit.maxLength" :min="data.options.limit.minLength" class="el-input--small" type="number" clearable>
                <template slot="prepend">{{ data.type === 'checkbox' ? '最大个数:': '最大长度:' }}</template>
              </el-input>
            </el-form-item>
          </div>
          <div v-if="Object.keys(data.options).indexOf('pattern')>=0">
            <el-input v-model.lazy="data.options.pattern" size="mini" style=" width: 240px;" placeholder="填写正则表达式" />
          </div>
        </el-form-item>
      </template>

      <template v-if="data.type == 'tabs'">
        <!-- <el-form-item label="字段标识">
          <el-input v-model="data.model" />
        </el-form-item> -->
        <el-form-item label="风格类型">
          <el-radio-group v-model="data.options.type" size="mini">
            <el-radio-button label="">默认</el-radio-button>
            <el-radio-button label="card">选项卡</el-radio-button>
            <el-radio-button label="border-card">卡片化</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选项卡位置">
          <el-radio-group v-model="data.options.tabPosition" size="mini">
            <el-radio-button label="top">顶部</el-radio-button>
            <el-radio-button label="bottom">底部</el-radio-button>
            <el-radio-button label="left">左侧</el-radio-button>
            <el-radio-button label="right">右侧</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签配置项">
          <draggable
            tag="ul"
            :list="data.tab_list"
            v-bind="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
            handle=".drag-item"
          >
            <li v-for="(item, index) in data.tab_list" :key="index">
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="iconfont icon-icon_bars" /></i>
              <el-input v-model="item.title" placeholder="标签名称" size="mini" style="width: 100px;" />

              <el-button circle plain type="danger" size="mini" icon="el-icon-minus" style="padding: 4px;margin-left: 5px;" @click="handleOptionsRemove(index)" />

            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <el-button type="text" @click="handleAddTabList">添加标签</el-button>
          </div>
        </el-form-item>

      </template>
      <template v-if="data.type == 'grid' || data.type == 'tabs'">
        <el-form-item label="操作属性">
          <el-checkbox v-if="Object.keys(data.options).indexOf('hidden')>=0" v-model="data.options.hidden">隐藏</el-checkbox>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  // data: 全部表单数据
  // eslint-disable-next-line vue/require-prop-types
  props: ['data'],
  data() {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null,
        limit: null
      }
    }
  },
  computed: {
    show() {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    }
  },
  watch: {
    'data.options.isRange': function(val) {
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue') >= 0) { this.data.options.defaultValue = '' }
        }
      }
    },
    'data.options.required': function(val) {
      this.validateRequired(val)
    },
    'data.options.dataType': function(val) {
      this.validateDataType(val)
    },
    'data.options.pattern': function(val) {
      this.validatePattern(val)
    },
    'data.options.limit': {
      deep: true,
      handler(val) {
        this.validateLimit(val)
      }
    },
    'data.name': function(val) {
      if (this.data.options) {
        this.validateRequired(this.data.options.required)
        this.validateDataType(this.data.options.dataType)
        this.validatePattern(this.data.options.pattern)
        this.validateLimit(this.data.options.limit)
      }
    }
  },
  methods: {
    handleOptionsRemove(index) {
      // 删除右侧配置项中，可多选的配置选项
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else if (this.data.type === 'tabs') {
        this.data.tab_list.splice(index, 1)
      } else {
        if (this.data.options.options[index].value === this.data.options.defaultValue) {
          this.data.options.defaultValue = ''
        }
        this.data.options.options.splice(index, 1)
      }
    },
    handleAddOption() {
      // 新增右侧配置项中，可多选的配置选项
      const length = this.data.options.options.length + 1
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: '新选项' + length,
          label: '新选项' + length
        })
      } else {
        this.data.options.options.push({
          value: '新选项' + length
        })
      }
    },
    handleAddColumn() {
      // 新增右侧配置项中grid类型，列配置项
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    handleAddTabList() {
      // 新增右侧配置项中tabs类型，标签页
      const length = this.data.tab_list.length + 1
      this.data.tab_list.push({
        title: '标签页' + length,
        list: []
      })
    },
    generateRule() {
      // 生成验证规则 将验证规则添加至每个表单项中
      this.data.rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMuliple(value) {
      // 是否多选判断 只用于select或imgupload类型
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [...this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }
      } else {
        if (this.data.options.defaultValue.length > 0) {
          this.data.options.defaultValue = [...this.data.options.defaultValue]
        } else {
          if (this.data.type === 'imgupload') {
            this.data.options.defaultValue = []
          } else {
            this.data.options.defaultValue = ''
          }
        }
      }
    },

    validateRequired(val) {
      // 验证规则 是否必填
      if (val) {
        this.validator.required = { required: true, message: `${this.data.name}必须填写` }
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },

    validateDataType(val) {
      // 验证规则 输入类型判断（只用于input单行文本类型）
      if (!this.show) {
        return false
      }
      let reg = ''
      switch (val) {
        case 'phone':
          reg = '/^1[3|4|5|7|8][0-9]\\d{8}$/'
          break
        case 'idCard':
          reg = '/^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$/'
          break
        case 'integer':
          reg = '/^-?[1-9]\\d*$/'
          break
        case 'float':
          reg = '/^-?([1-9]\\d*\\.\\d*|0\\.\\d*)$/'
          break
        case 'url':
          reg = '(https?|ftp):\\/\\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
          break
        case 'email':
          reg = '/^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$/'
          break
      }
      if (reg) {
        const newReg = /(^\/)([^\/]*)(\/$)/
        const str = newReg.test(reg) ? reg.replace(newReg, '$2') : reg
        this.validator.type = { pattern: str, message: this.data.name + '格式不匹配' }
      } else {
        this.validator.type = null
      }
      // if (val) {
      //   this.validator.type = { type: val, message: this.data.name + '格式不正确' }
      // } else {
      //   this.validator.type = null
      // }

      this.generateRule()
    },
    validatePattern(val) {
      // 验证规则 自定义正则匹配规则
      if (!this.show) {
        return false
      }

      if (val) {
        const reg = /(^\/)([^\/]*)(\/$)/
        const str = reg.test(val) ? val.replace(reg, '$2') : val
        this.validator.pattern = { pattern: str, message: this.data.name + '格式不匹配' }
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    },
    validateLimit(val) {
      // 验证规则 字符串限制长度
      if (!this.show) {
        return false
      }
      if (val) {
        let message = ''
        if (val.minLength && val.maxLength) {
          message = `${this.data.name}长度在${val.minLength}至${val.maxLength}字符`
        } else if (val.minLength && !val.maxLength) {
          message = `${this.data.name}长度大于${val.minLength}字符`
        } else if (val.maxLength && !val.minLength) {
          message = `${this.data.name}长度小于${val.maxLength}字符`
        }
        if (message && this.data.type !== 'checkbox') {
          this.validator.limit = { min: val.minLength, max: val.maxLength, message }
        }
      } else {
        this.validator.limit = null
      }
      this.generateRule()
    }
  }
}
</script>
