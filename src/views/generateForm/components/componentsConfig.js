const customLabelWidth = 100
export const basicComponents = [
  {
    type: 'input', // 表单类型
    name: '单行文本', // 表单字段名称
    icon: 'icon-input', // 编辑器中图标
    options: { // 表单字段选项
      width: '100%', // 表单项宽度
      labelWidth: customLabelWidth, // 表单项label宽度
      isLabelWidth: false,
      defaultValue: '', // 默认值
      required: false, // 是否必填
      dataType: 'string', // elementui字段校验规则 string,number boolean integer float url email hex
      pattern: '', // 自定义验证规则
      placeholder: '', // 占位符
      limit: {
        maxLength: '', // 最多字符输入
        minLength: '' // 最小字符输入
      },
      showWordLimit: false, // 显示字符长度限制
      disabled: false, // 是否禁止
      clearable: true, // 是否显示清空按钮
      hidden: false, // 是否隐藏
      showPassword: false, // 是否为密码框
      inputSlots: { // 是否显示input框的插入slot功能
        prepend: '',
        append: ''
      }
    }
    // "model": "input_1540908864000_94322", // 表单对应字段key
  },
  {
    type: 'textarea',
    name: '多行文本',
    icon: 'icon-diy-com-textarea',
    options: {
      width: '100%',
      defaultValue: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      required: false,
      disabled: false,
      hidden: false,
      limit: {
        maxLength: '',
        minLength: ''
      },
      showWordLimit: false,
      pattern: '',
      placeholder: ''
    }
  },
  {
    type: 'number', // 计数器类型
    name: '计数器',
    icon: 'icon-number',
    options: { // 与element组件属性相关
      width: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      required: false,
      defaultValue: 0,
      min: '', // number类型的最小值
      max: '', // number类型的最大值
      step: 1, // 计数器步长
      disabled: false,
      hidden: false,
      controlsPosition: '' // 控制按钮位置
    }
  },
  {
    type: 'radio',
    name: '单选框组',
    icon: 'icon-radio-active',
    options: {
      inline: false, // 选项组展示的方式
      defaultValue: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      showLabel: true, // 是否展示标签
      options: [ // radio选项
        {
          value: '选项1',
          label: '选项1'
        },
        {
          value: '选项2',
          label: '选项2'
        },
        {
          value: '选项3',
          label: '选项3'
        }
      ],
      required: false,
      width: '200px',
      remote: false, // 是否使用远端数据
      remoteOptions: [], // 远端数据选项
      props: { // 远端数据对应options字段的key值
        value: 'value',
        label: 'label'
      },
      remoteFunc: '', // 获取远端数据函数
      disabled: false,
      hidden: false
    }
  },
  {
    type: 'checkbox',
    name: '多选框组',
    icon: 'icon-check-box',
    options: {
      inline: false,
      defaultValue: [],
      showLabel: true,
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      options: [
        {
          value: '选项1',
          label: '选项1'
        },
        {
          value: '选项2',
          label: '选项2'
        },
        {
          value: '选项3',
          label: '选项3'
        }
      ],
      limit: {
        maxLength: '', // 最多字符输入
        minLength: '' // 最小字符输入
      },
      required: false,
      width: '200px',
      remote: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      disabled: false,
      hidden: false
    }
  },
  {
    type: 'time',
    name: '时间选择器',
    icon: 'icon-time',
    options: {
      defaultValue: '21:19:56', // 时间选择器默认值
      readonly: false, // 是否只读
      hidden: false,
      disabled: false, // 是否禁用
      editable: true, // 是否可手动输入
      clearable: true, // 是否可清楚
      placeholder: '',
      startPlaceholder: '', // 开始时间占位符
      endPlaceholder: '', // 结束时间占位符
      isRange: false, // 是否为时间范围选择，仅对<el-time-picker>有效
      arrowControl: true, // 是否使用箭头进行时间选择，仅对<el-time-picker>有效
      format: 'HH:mm:ss', // 时间格式
      required: false,
      width: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false

    }
  },
  {
    type: 'date',
    name: '日期选择器',
    icon: 'icon-date',
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: true,
      clearable: true,
      hidden: false,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'yyyy-MM-dd',
      timestamp: false,
      required: false,
      width: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false
    }
  },
  {
    type: 'rate',
    name: '评分',
    icon: 'icon-pingfen1',
    options: {
      defaultValue: null,
      max: 5,
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      disabled: false,
      allowHalf: false,
      required: false,
      hidden: false
    }
  },
  {
    type: 'color',
    name: '颜色选择器',
    icon: 'icon-color',
    options: {
      defaultValue: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      disabled: false,
      showAlpha: false,
      required: false,
      hidden: false
    }
  },
  {
    type: 'select',
    name: '下拉选择框',
    icon: 'icon-select',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      hidden: false,
      placeholder: '',
      required: false,
      showLabel: true,
      width: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      options: [
        {
          value: '下拉框1'
        },
        {
          value: '下拉框2'
        }, {
          value: '下拉框3'
        }
      ],
      remote: false,
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: ''
    }
  },
  {
    type: 'switch',
    name: '开关',
    icon: 'icon-switch',
    options: {
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      defaultValue: false,
      required: false,
      disabled: false,
      hidden: false
    }
  },
  {
    type: 'slider',
    name: '滑块',
    icon: 'icon-slider',
    options: {
      defaultValue: 0,
      disabled: false,
      required: false,
      hidden: false,
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
      width: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false
    }
  },
  {
    type: 'text',
    name: '文字',
    icon: 'icon-wenzishezhi-',
    options: {
      defaultValue: '这是一段文本',
      customClass: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      hidden: false
    }
  }
]

export const advanceComponents = [
  // {
  //   type: 'blank',
  //   name: '自定义',
  //   icon: 'icon-zidingyishuju',
  //   options: {
  //     defaultType: 'String'
  //   }
  // },
  {
    type: 'imgupload',
    name: '图片',
    icon: 'icon-tupian',
    options: {
      defaultValue: [],
      size: {
        width: 100,
        height: 100
      },
      width: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      tokenFunc: 'funcGetToken',
      disabled: false,
      length: 8,
      multiple: false,
      isDelete: false,
      hidden: false,
      min: 0,
      isEdit: false,
      tips: '',
      required: false
    }
  },
  {
    type: 'editor',
    name: '编辑器',
    icon: 'icon-fuwenbenkuang',
    options: {
      defaultValue: '',
      width: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      hidden: false,
      disabled: false
    }
  },
  {
    type: 'cascader',
    name: '级联选择器',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      labelWidth: customLabelWidth,
      isLabelWidth: false,
      placeholder: '',
      disabled: false,
      clearable: false,
      hidden: false,
      remote: true,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: ''
    }
  }
]

export const layoutComponents = [
  {
    type: 'grid',
    name: '栅格布局',
    icon: 'icon-grid-',
    columns: [
      {
        span: 12,
        list: []
      },
      {
        span: 12,
        list: []
      }
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top',
      hidden: false
    }
  },
  {
    type: 'tabs',
    name: '标签页',
    icon: 'icon-tabs',
    tab_list: [{
      title: '标签页1',
      list: []
    }],
    options: {
      type: '',
      tabPosition: 'top',
      activeIndex: 'tab_0',
      hidden: false
    }
  }
]
