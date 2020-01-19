<template>
  <div>
    <el-form-item v-if="!widget.options.hidden" :label="widget.name" :label-width="widget.options.isLabelWidth?widget.options.labelWidth + 'px':''" :prop="widget.model">
      <template v-if="widget.type == 'input'">
        <!-- <el-input
          v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
          v-model.number="dataModel"
          :type="'number'"
          :placeholder="widget.options.placeholder"
          :style="{width: widget.options.width}"
          :disabled="widget.options.disabled"
          :clearable="widget.options.clearable"
        />
        <el-input
          v-else
          v-model="dataModel"
          :type="widget.options.dataType === 'string' ? 'text' : widget.options.dataType"
          :disabled="widget.options.disabled"
          :placeholder="widget.options.placeholder"
          :clearable="widget.options.clearable"
          :show-password="widget.options.showPassword"
          :show-word-limit="widget.options.showWordLimit"
          :maxlength="widget.options.showWordLimit ? widget.options.limit.maxLength : ''"
          :style="{width: widget.options.width}"
        /> -->
        <el-input
          v-model="dataModel"
          :disabled="widget.options.disabled"
          :placeholder="widget.options.placeholder"
          :clearable="widget.options.clearable"
          :show-password="widget.options.showPassword"
          :show-word-limit="widget.options.showWordLimit"
          :maxlength="widget.options.showWordLimit ? widget.options.limit.maxLength : ''"
          :style="{width: widget.options.width}"
        >
          <template v-if="widget.options.inputSlots && widget.options.inputSlots.prepend" slot="prepend">{{ widget.options.inputSlots.prepend }}</template>
          <template v-if="widget.options.inputSlots && widget.options.inputSlots.append" slot="append">{{ widget.options.inputSlots.append }}</template>
        </el-input>
      </template>

      <template v-if="widget.type == 'textarea'">
        <el-input
          v-model="dataModel"
          type="textarea"
          :rows="5"
          :disabled="widget.options.disabled"
          :placeholder="widget.options.placeholder"
          :show-word-limit="widget.options.showWordLimit"
          :maxlength="widget.options.showWordLimit ? widget.options.limit.maxLength : ''"
          :style="{width: widget.options.width}"
        />
      </template>

      <template v-if="widget.type == 'number'">
        <el-input-number
          v-model="dataModel"
          :style="{width: widget.options.width}"
          :step="widget.options.step"
          controls-position="right"
          :disabled="widget.options.disabled"
        />
      </template>

      <template v-if="widget.type == 'radio'">
        <el-radio-group
          v-model="dataModel"
          :style="{width: widget.options.width}"
          :disabled="widget.options.disabled"
        >
          <el-radio
            v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)"
            :key="index"
            :style="{display: widget.options.inline ? 'inline-block' : 'block',lineHeight: '32px'}"
            :label="item.value"
          >
            <template v-if="widget.options.remote">{{ item.label }}</template>
            <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
          </el-radio>
        </el-radio-group>
      </template>

      <template v-if="widget.type == 'checkbox'">
        <el-checkbox-group
          v-model="dataModel"
          :style="{width: widget.options.width}"
          :disabled="widget.options.disabled"
          :min="+widget.options.limit.minLength || undefined"
          :max="+widget.options.limit.maxLength || undefined"
        >
          <el-checkbox

            v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)"
            :key="index"
            :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
            :label="item.value"
          >
            <template v-if="widget.options.remote">{{ item.label }}</template>
            <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
          </el-checkbox>
        </el-checkbox-group>
      </template>

      <template v-if="widget.type == 'time'">
        <el-time-picker
          v-model="dataModel"
          :is-range="widget.options.isRange"
          :placeholder="widget.options.placeholder"
          :start-placeholder="widget.options.startPlaceholder"
          :end-placeholder="widget.options.endPlaceholder"
          :readonly="widget.options.readonly"
          :disabled="widget.options.disabled"
          :editable="widget.options.editable"
          :clearable="widget.options.clearable"
          :arrow-control="widget.options.arrowControl"
          :value-format="widget.options.format"
          :style="{width: widget.options.width}"
        />
      </template>

      <template v-if="widget.type=='date'">
        <el-date-picker
          v-model="dataModel"
          :type="widget.options.type"
          :placeholder="widget.options.placeholder"
          :start-placeholder="widget.options.startPlaceholder"
          :end-placeholder="widget.options.endPlaceholder"
          :readonly="widget.options.readonly"
          :disabled="widget.options.disabled"
          :editable="widget.options.editable"
          :clearable="widget.options.clearable"
          :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
          :format="widget.options.format"
          :style="{width: widget.options.width}"
        />
      </template>

      <template v-if="widget.type =='rate'">
        <el-rate
          v-model="dataModel"
          :max="widget.options.max"
          :disabled="widget.options.disabled"
          :allow-half="widget.options.allowHalf"
        />
      </template>

      <template v-if="widget.type == 'color'">
        <el-color-picker
          v-model="dataModel"
          :disabled="widget.options.disabled"
          :show-alpha="widget.options.showAlpha"
        />
      </template>

      <template v-if="widget.type == 'select'">
        <el-select
          v-model="dataModel"
          :disabled="widget.options.disabled"
          :multiple="widget.options.multiple"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{width: widget.options.width}"
          :filterable="widget.options.filterable"
        >
          <el-option v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value" />
        </el-select>
      </template>

      <template v-if="widget.type=='switch'">
        <el-switch
          v-model="dataModel"
          :disabled="widget.options.disabled"
        />
      </template>

      <template v-if="widget.type=='slider'">
        <el-slider
          v-model="dataModel"
          :min="widget.options.min"
          :max="widget.options.max"
          :disabled="widget.options.disabled"
          :step="widget.options.step"
          :show-input="widget.options.showInput"
          :range="widget.options.range"
          :style="{width: widget.options.width}"
        />
      </template>

      <template v-if="widget.type=='imgupload'">
        <upload-image
          v-model="dataModel"
          :disabled="widget.options.disabled || disabled"
          :style="{'width': widget.options.width}"
          :width="widget.options.size.width"
          :height="widget.options.size.height"
          :multiple="widget.options.multiple"
          :length="widget.options.length"
          :is-delete="widget.options.isDelete"
          :min="widget.options.min"
          :is-edit="widget.options.isEdit"
          :action="widget.options.action"
          :tips="widget.options.tips"
        />
      </template>

      <template v-if="widget.type == 'editor'">
        <tinymce v-model="dataModel" :height="300" :width="widget.options.width" />
      </template>

      <template v-if="widget.type == 'cascader'">
        <el-cascader
          v-model="dataModel"
          :disabled="widget.options.disabled"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{width: widget.options.width}"
          :options="widget.options.remoteOptions"
        />
      </template>

      <template v-if="widget.type == 'text'">
        <span>{{ dataModel }}</span>
      </template>
    </el-form-item>
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImage'
import Tinymce from '@/components/Tinymce'

export default {
  components: {
    UploadImage,
    Tinymce
  },
  // widget: 表单项数据 models:选中表单项数据 rules：表单项索引 remote: 全部表单数据
  // eslint-disable-next-line vue/require-prop-types
  props: ['widget', 'models', 'rules', 'remote', 'disabled'],
  data() {
    return {
      dataModel: this.models[this.widget.model]
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.model]: val
        })
        this.$emit('input-change', val, this.widget.model)
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model]
      }
    }
  },
  created() {
    // 填充接口数据 即填充远端数据
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        this.widget.options.remoteOptions = data.map(item => {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: item[this.widget.options.props.children]
          }
        })
      })
    }

    // if (this.widget.type === 'imgupload' && this.widget.options.isQiniu) {
    //   this.remote[this.widget.options.tokenFunc]((data) => {
    //     this.widget.options.token = data
    //   })
    // }
  },
  methods: {
  }
}
</script>
