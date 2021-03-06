<template>
  <el-form-item
    v-if="element && element.key"
    class="widget-view "
    :class="{active: selectWidget && selectWidget.key == element.key, 'is_req': element.options.required}"
    :label="element.name"
    :label-width="element.options.isLabelWidth ? element.options.labelWidth +'px' : ''"
    @click.native.stop="handleSelectWidget(index)"
  >
    <template v-if="element.type == 'input'">
      <el-input
        v-model="element.options.defaultValue"
        :style="{width: element.options.width}"
        :placeholder="element.options.placeholder"
        :disabled="element.options.disabled"
        :clearable="element.options.clearable"
        :show-password="element.options.showPassword"
        :show-word-limit="element.options.showWordLimit"
        :maxlength="element.options.limit.maxLength"
      >
        <template v-if="element.options.inputSlots && element.options.inputSlots.prepend" slot="prepend">{{ element.options.inputSlots.prepend }}</template>
        <template v-if="element.options.inputSlots && element.options.inputSlots.append" slot="append">{{ element.options.inputSlots.append }}</template>
      </el-input>
    </template>

    <template v-if="element.type == 'textarea'">
      <el-input
        v-model="element.options.defaultValue"
        type="textarea"
        :rows="5"
        :style="{width: element.options.width}"
        :disabled="element.options.disabled"
        :placeholder="element.options.placeholder"
        :show-word-limit="element.options.showWordLimit"
        :maxlength="element.options.limit.maxLength"
      />
    </template>

    <template v-if="element.type == 'number'">
      <el-input-number
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :controls-position="element.options.controlsPosition"
        :style="{width: element.options.width}"
      />
    </template>

    <template v-if="element.type == 'radio'">
      <el-radio-group
        v-model="element.options.defaultValue"
        :style="{width: element.options.width}"
        :disabled="element.options.disabled"
      >
        <el-radio
          v-for="(item, rindex) in element.options.options"
          :key="item.value + rindex"
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
        >
          {{ element.options.showLabel ? item.label : item.value }}
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type == 'checkbox'">
      <el-checkbox-group
        v-model="element.options.defaultValue"
        :style="{width: element.options.width}"
        :disabled="element.options.disabled"
        :min="+element.options.limit.minLength || undefined"
        :max="+element.options.limit.maxLength || undefined"
      >
        <el-checkbox
          v-for="(item, cindex) in element.options.options"
          :key="item.value + cindex"
          :style="{display: element.options.inline ? 'inline-block' : 'block'}"
          :label="item.value"
        >
          {{ element.options.showLabel ? item.label : item.value }}
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="element.type == 'time'">
      <el-time-picker
        v-model="element.options.defaultValue"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :arrow-control="element.options.arrowControl"
        :style="{width: element.options.width}"
      />
    </template>

    <template v-if="element.type == 'date'">
      <el-date-picker
        v-model="element.options.defaultValue"
        :type="element.options.type"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :style="{width: element.options.width}"
      />
    </template>

    <template v-if="element.type == 'rate'">
      <el-rate
        v-model="element.options.defaultValue"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :allow-half="element.options.allowHalf"
      />
    </template>

    <template v-if="element.type == 'color'">
      <el-color-picker
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :show-alpha="element.options.showAlpha"
      />
    </template>

    <template v-if="element.type == 'select'">
      <el-select
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :multiple="element.options.multiple"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{width: element.options.width}"
      >
        <el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel?item.label:item.value" />
      </el-select>
    </template>

    <template v-if="element.type=='switch'">
      <el-switch
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
      />
    </template>

    <template v-if="element.type=='slider'">
      <el-slider
        v-model="element.options.defaultValue"
        :min="element.options.min"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :step="element.options.step"
        :show-input="element.options.showInput"
        :range="element.options.range"
        :style="{width: element.options.width}"
      />
    </template>

    <template v-if="element.type=='imgupload'">
      <upload-image
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :style="{'width': element.options.width}"
        :width="element.options.size.width"
        :height="element.options.size.height"
        :tips="element.options.tips"
      />
    </template>

    <template v-if="element.type == 'cascader'">
      <el-cascader
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{width: element.options.width}"
        :options="element.options.remoteOptions"
      />
    </template>

    <template v-if="element.type == 'editor'">
      <tinymce v-model="element.options.defaultValue" :height="300" />
    </template>

    <template v-if="element.type=='blank'">
      <div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">自定义区域</div>
    </template>

    <template v-if="element.type == 'text'">
      <span>{{ element.options.defaultValue }}</span>
    </template>

    <div v-if="selectWidget && selectWidget.key == element.key" class="widget-view-action">
      <i class="iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)" />
      <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)" />
    </div>

    <div v-if="selectWidget && selectWidget.key == element.key" class="widget-view-drag">
      <i class="iconfont icon-drag drag-widget" />
    </div>

  </el-form-item>
</template>

<script>
import UploadImage from '@/components/UploadImage'
import Tinymce from '@/components/Tinymce'
import { cloneDeep } from 'lodash'

export default {
  components: {
    Tinymce,
    UploadImage
  },
  // element: 表单项数据 select:选中表单项数据 index：表单项索引 data: 全部表单数据
  // eslint-disable-next-line vue/require-prop-types
  props: ['element', 'select', 'index', 'data'],
  data() {
    return {
      selectWidget: this.select
    }
  },
  watch: {
    select(val) {
      this.selectWidget = val
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true
    }
  },
  mounted() {

  },
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index]
    },
    handleWidgetDelete(index) {
      // 删除表单项
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)
      })
    },
    handleWidgetClone(index) {
      // 复制表单项
      const randomKey = this.data.list[index].type + '_' + Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      const cloneData = {
        ...this.data.list[index],
        // options: { ...this.data.list[index].options },
        options: cloneDeep(this.data.list[index].options),
        key: randomKey,
        model: randomKey
      }

      // 构建radioitem数据
      // if (this.data.list[index].type === 'radio' || this.data.list[index].type === 'checkbox') {
      //   cloneData = {
      //     ...cloneData,
      //     options: {
      //       ...cloneData.options,
      //       options: cloneData.options.options.map(item => ({ ...item }))
      //     }
      //   }
      // }

      this.data.list.splice(index, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
      })
    }
  }
}
</script>
