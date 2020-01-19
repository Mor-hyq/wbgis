<template>
  <div class="widget-form-container">
    <div v-if="data.list.length == 0" class="form-empty" style="top:300px;">从左侧拖拽来添加字段</div>
    <el-form :size="data.config.size" label-suffix=":" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
      <div v-if="isActivity" style="margin:10px 10px 0;">
        <el-form-item label="活动模板名称" label-width="130px" required>
          <el-input v-model="data.template_name" placeholder="请填写活动模板名称" />
        </el-form-item>
        <el-form-item label="活动模板封面图" label-width="130px" required>
          <upload-image
            v-model="template_thumb"
            :length="1"
          />
        </el-form-item>
      </div>
      <draggable
        v-model="data.list"
        class=""
        v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        @end="handleMoveEnd"
        @add="handleWidgetAdd"
      >
        <transition-group name="fade" tag="div" class="widget-form-list">
          <template v-for="(element, index) in data.list">
            <template v-if="element.type == 'grid'">
              <el-row
                v-if="element && element.key"
                :key="element.key"
                class="widget-col widget-view"
                type="flex"
                :class="{active: selectWidget && selectWidget.key == element.key}"
                :gutter="element.options.gutter ? element.options.gutter : 0"
                :justify="element.options.justify"
                :align="element.options.align"
                @click.native="handleSelectWidget(index)"
              >
                <el-col v-for="(col, colIndex) in element.columns" :key="colIndex" :span="col.span ? col.span : 0">

                  <draggable
                    v-model="col.list"
                    :no-transition-on-drag="true"
                    v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                    @end="handleMoveEnd"
                    @add="handleWidgetColAdd($event, element, colIndex, 'columns')"
                  >
                    <transition-group name="fade" tag="div" class="widget-col-list">
                      <template v-for="(el, i) in col.list">
                        <widget-form-item
                          v-if="el.key"
                          :key="el.key"
                          :element="el"
                          :select.sync="selectWidget"
                          :index="i"
                          :data="col"
                        />
                      </template>
                    </transition-group>

                  </draggable>
                </el-col>
                <div v-if="selectWidget && selectWidget.key == element.key" class="widget-view-action widget-col-action">
                  <i class="iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)" />
                  <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)" />
                </div>

                <div v-if="selectWidget && selectWidget.key == element.key" class="widget-view-drag widget-col-drag">
                  <i class="iconfont icon-drag drag-widget" />
                </div>
              </el-row>
            </template>
            <template v-else-if="element.type == 'tabs'">
              <div
                v-if="element && element.key"
                :key="element.key"
                class="widget-tab widget-view is_hidden"
                :class="{active: selectWidget && selectWidget.key == element.key}"
                @click.stop="handleSelectWidget(index)"
              >
                <el-tabs
                  v-model="element.options.activeIndex"
                  :type="element.options.type"
                  :tab-position="element.options.tabPosition"
                >
                  <el-tab-pane
                    v-for="(tab, tabIndex) in element.tab_list"
                    :key="tabIndex"
                    :label="tab.title"
                    :name="'tab_'+tabIndex"
                  >
                    <draggable
                      v-model="tab.list"
                      :no-transition-on-drag="true"
                      v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                      @end="handleMoveEnd"
                      @add="handleWidgetColAdd($event, element, tabIndex, 'tab_list')"
                    >
                      <transition-group name="fade" tag="div" class="widget-col-list">
                        <template v-for="(el, i) in tab.list">
                          <widget-form-item
                            v-if="el && el.key"
                            :key="el.key"
                            :element="el"
                            :select.sync="selectWidget"
                            :index="i"
                            :data="tab"
                          />
                        </template>
                      </transition-group>

                    </draggable>
                  </el-tab-pane>
                </el-tabs>
                <div v-if="selectWidget && selectWidget.key == element.key" class="widget-view-action widget-tab-action">
                  <i class="iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)" />
                  <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)" />
                </div>

                <div v-if="selectWidget && selectWidget.key == element.key" class="widget-view-drag widget-tab-drag">
                  <i class="iconfont icon-drag drag-widget" />
                </div>
              </div>
            </template>
            <template v-else>
              <widget-form-item
                v-if="element && element.key"
                :key="element.key"
                :element="element"
                :select.sync="selectWidget"
                :index="index"
                :data="data"
              />
            </template>
          </template>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'
import { cloneDeep } from 'lodash'
import UploadImage from '@/components/UploadImage'

export default {
  components: {
    Draggable,
    WidgetFormItem,
    UploadImage
  },
  // select:选中表单项数据  data: 全部表单数据
  // eslint-disable-next-line vue/require-prop-types
  props: ['data', 'select'],
  data() {
    return {
      selectWidget: this.select,
      isActivity: true,
      template_thumb: []
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
    },
    template_thumb: {
      deep: true,
      handler(val) {
        this.data.template_thumb = val.join()
      }
    },
    'data.template_thumb'(val) {
      if (!val) {
        this.template_thumb = []
      } else {
        this.template_thumb = val.split(',')
      }
    }
    // data: {
    //   handler(newval) {
    //     console.log('val', JSON.stringify(newval))
    //   },
    //   deep: true
    // }
  },
  mounted() {
    document.body.ondrop = function(event) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },
  methods: {
    handleMoveEnd({ newIndex, oldIndex }) {
      // console.log('index', newIndex, oldIndex)
    },
    handleSelectWidget(index) {
      // console.log(index, '#####')
      this.selectWidget = this.data.list[index]
    },
    handleWidgetAdd(evt) {
      const newIndex = evt.newIndex
      // const to = evt.to
      // console.log(to)

      // 为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
      this.$set(this.data.list, newIndex, {
        ...this.data.list[newIndex],
        options: {
          ...cloneDeep(this.data.list[newIndex].options),
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: this.data.list[newIndex].type + '_' + key,
        rules: []
      })

      // if (this.data.list[newIndex].type === 'radio' || this.data.list[newIndex].type === 'checkbox' || this.data.list[newIndex].type === 'select') {
      //   this.$set(this.data.list, newIndex, {
      //     ...this.data.list[newIndex],
      //     options: {
      //       ...this.data.list[newIndex].options,
      //       options: this.data.list[newIndex].options.options.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      // }
      // 重新生成grid类型数据
      if (this.data.list[newIndex].type === 'grid') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          columns: this.data.list[newIndex].columns.map(item => ({ ...item }))
        })
      }
      // 重新生成tabs类型数据
      if (this.data.list[newIndex].type === 'tabs') {
        this.$set(this.data.list, newIndex, {
          ...this.data.list[newIndex],
          // tab_list: this.data.list[newIndex].tab_list.map(item => ({ ...item }))
          tab_list: cloneDeep(this.data.list[newIndex].tab_list)
        })
      }

      this.selectWidget = this.data.list[newIndex]
    },
    handleWidgetColAdd($event, row, colIndex, field) {
      // 向grid布局中添加表单
      const newIndex = $event.newIndex
      const oldIndex = $event.oldIndex
      const item = $event.item

      // 防止布局元素的嵌套拖拽
      if (item.className.indexOf('data-grid') >= 0) {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === 'DIV' && this.data.list.splice(oldIndex, 0, row[field][colIndex].list[newIndex])

        row[field][colIndex].list.splice(newIndex, 1)

        return false
      }

      const key = Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)

      this.$set(row[field][colIndex].list, newIndex, {
        ...row[field][colIndex].list[newIndex],
        options: {
          // ...row[field][colIndex].list[newIndex].options,
          ...cloneDeep(row[field][colIndex].list[newIndex].options),
          remoteFunc: 'func_' + key
        },
        key,
        // 绑定键值
        model: row[field][colIndex].list[newIndex].type + '_' + key,
        rules: []
      })

      // if (row[field][colIndex].list[newIndex].type === 'radio' || row[field][colIndex].list[newIndex].type === 'checkbox' || row[field][colIndex].list[newIndex].type === 'select') {
      //   this.$set(row[field][colIndex].list, newIndex, {
      //     ...row[field][colIndex].list[newIndex],
      //     options: {
      //       ...row[field][colIndex].list[newIndex].options,
      //       options: row[field][colIndex].list[newIndex].options.options.map(item => ({
      //         ...item
      //       }))
      //     }
      //   })
      // }

      this.selectWidget = row[field][colIndex].list[newIndex]
    },
    handleWidgetDelete(index) {
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
        tab_list: this.handleWidgetTabListClone(this.data.list[index].tab_list),
        options: cloneDeep(this.data.list[index].options),
        key: randomKey,
        model: randomKey
      }

      this.data.list.splice(index, 0, cloneData)

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]
      })
    },
    handleWidgetTabListClone(data = []) {
      // 复制表单项
      const arr = []
      function cloneListData(list = []) {
        const listArr = []
        list.forEach((v, idx) => {
          const randomKey = v.type + '_' + Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
          const cloneData = {
            ...v,
            options: cloneDeep(v.options),
            key: randomKey,
            model: randomKey
          }
          listArr.push(cloneData)
        })
        return listArr
      }
      data.forEach((item, index) => {
        const randomKey = item.type + '_' + Date.parse(new Date()) + '_' + Math.ceil(Math.random() * 99999)
        const cloneData = {
          ...item,
          list: cloneListData(item.list),
          key: randomKey,
          model: randomKey
        }
        arr.push(cloneData)
      })
      return arr
    }
  }
}
</script>
