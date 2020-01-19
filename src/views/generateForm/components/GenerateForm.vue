<template>
  <div>
    <el-form
      ref="generateForm"
      label-suffix=":"
      :size="data.config.size"
      :model="models"
      :rules="rules"
      :label-position="data.config.labelPosition"
      :label-width="data.config.labelWidth + 'px'"
      :disabled="disabled"
    >
      <template v-for="item in data.list">
        <template v-if="!item.options.hidden">
          <template v-if="item.type == 'grid'">
            <el-row
              :key="item.key"
              type="flex"
              :gutter="item.options.gutter ? item.options.gutter : 0"
              :justify="item.options.justify"
              :align="item.options.align"
            >
              <!-- 自定义布局 -->
              <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">

                <template v-for="citem in col.list">
                  <el-form-item v-if="citem.type=='blank'" :key="citem.key" :label="citem.name" :prop="citem.model">
                    <slot :name="citem.model" :model="models" />
                  </el-form-item>
                  <genetate-form-item
                    v-else
                    :key="citem.key"
                    :models.sync="models"
                    :remote="remote"
                    :rules="rules"
                    :widget="citem"
                    :disabled="disabled"
                    @input-change="onInputChange"
                  />
                </template>
              </el-col>
            </el-row>
          </template>
          <template v-else-if="item.type === 'tabs'">
            <!-- tabs表单模块 -->
            <el-tabs
              :key="item.key"
              v-model="item.options.activeIndex"
              :type="item.options.type"
              :tab-position="item.options.tabPosition"
            >
              <el-tab-pane
                v-for="(tab, tabIndex) in item.tab_list"
                :key="tabIndex"
                :label="tab.title"
                :name="'tab_'+tabIndex"
              >
                <template v-for="citem in tab.list">
                  <el-form-item v-if="citem.type=='blank'" :key="citem.key" :label="citem.name" :prop="citem.model">
                    <slot :name="citem.model" :model="models" />
                  </el-form-item>
                  <genetate-form-item
                    v-else
                    :key="citem.key"
                    :models.sync="models"
                    :remote="remote"
                    :rules="rules"
                    :widget="citem"
                    :disabled="disabled"
                    @input-change="onInputChange"
                  />
                </template>
              </el-tab-pane>
            </el-tabs>
          </template>
          <!-- 自定义表单模块 -->
          <template v-else-if="item.type == 'blank'">
            <el-form-item :key="item.key" :label="item.name" :prop="item.model">
              <slot :name="item.model" :model="models" />
            </el-form-item>
          </template>
          <!-- 正常表单 -->
          <template v-else>
            <genetate-form-item
              :key="item.key"
              :models.sync="models"
              :rules="rules"
              :widget="item"
              :remote="remote"
              :disabled="disabled"
              @input-change="onInputChange"
            />
          </template>
        </template>

      </template>
    </el-form>
  </div>
</template>

<script>
import GenetateFormItem from './GenerateFormItem'

export default {
  name: 'FmGenerateForm',
  components: {
    GenetateFormItem
  },
  // value: 表单项默认数据 remote:获取接口数据函数 data: 全部表单数据
  // eslint-disable-next-line vue/require-prop-types
  props: ['data', 'remote', 'value', 'insite', 'disabled'],
  data() {
    return {
      models: {},
      rules: {}
    }
  },
  watch: {
    // data: {
    //   deep: true,
    //   handler(val) {
    //     console.log(val)
    //     this.generateModle(val.list)
    //   }
    // },
    value: {
      deep: true,
      handler(val) {
        this.models = { ...this.models, ...val }
      }
    }
  },
  created() {
    this.generateModle(this.data.list)
    // console.log(JSON.stringify(this.data.list))
  },
  mounted() {
  },
  methods: {
    generateModle(genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          // 栅格布局
          genList[i].columns.forEach(item => {
            this.generateModle(item.list)
          })
        } else if (genList[i].type === 'tabs') {
          // tab表单布局
          genList[i].tab_list.forEach(item => {
            this.generateModle(item.list)
          })
        } else {
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            // 表单结构设置默认值
            this.models[genList[i].model] = this.value[genList[i].model]
          } else {
            if (genList[i].type === 'blank') {
              // 自定义
              this.$set(this.models, genList[i].model, genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : []))
            } else {
              // 生成表单结构
              this.models[genList[i].model] = genList[i].options.defaultValue
            }
          }
          // 生成验证规则
          if (this.rules[genList[i].model]) {
            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
              if (item.pattern) {
                return { ...item, pattern: new RegExp(item.pattern) }
              } else {
                return { ...item }
              }
            })]
          } else {
            this.rules[genList[i].model] = [...genList[i].rules.map(item => {
              if (item.pattern) {
                return { ...item, pattern: new RegExp(item.pattern) }
              } else {
                return { ...item }
              }
            })]
          }
        }
      }
    },
    getData() {
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error('表单数据校验失败').message)
          }
        })
      })
    },
    reset() {
      this.$refs.generateForm.resetFields()
    },
    onInputChange(value, field) {
      this.$emit('on-change', field, value, this.models)
    },
    refresh() {

    }
  }
}
</script>
