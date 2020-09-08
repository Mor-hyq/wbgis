<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    custom-class="dialog-custom"
    width="50%"
    append-to-body
  >
    <el-form
      ref="generateForm"
      class="custom-class"
      label-suffix=":"
      :size="$btnSize"
      :model="models"
      :rules="rules"
      disabled
      label-width="auto"
    >
      <template v-if="formObj.length > 0">
        <template v-for="item in formObj">
          <el-col :key="item.id" :span="12">
            <GFormItem
              :models.sync="models"
              :widget="item"
            />
          </el-col>
        </template>
      </template>
    </el-form>
  </el-dialog>
</template>

<script>
import { getFieldList, getAssetDetail } from '@/api/equipmentInfo'
import GFormItem from '@/views/equipmentInfo/asset/components/GFormItem'
export default {
  name: 'GisAssetDialog',
  components: {
    GFormItem
  },
  data() {
    return {
      formObj: [],
      models: {},
      rules: {},
      values: {},
      visible: false,
      eid: '',
      id: '',
      title: ''
    }
  },
  methods: {
    show(options) {
      this.eid = options.eid
      this.id = options.id
      this.title = options.title
      this.visible = true
      this.$nextTick(() => {
        this.getField()
      })
    },
    hide() {
      this.visible = false
    },
    async getFormData() {
      try {
        const { code, data } = await getAssetDetail({
          id: this.id
        })
        if (code === 200) {
          data.value.forEach(v => {
            this.values[v.name] = v.value
          })
          this.models = {
            ...this.models,
            ...this.values
          }
        }
      } catch (error) {
        //
      }
    },
    async getField() {
      try {
        const { code, data } = await getFieldList({
          type: 'equipment',
          equipment_id: this.eid
        })
        if (code === 200) {
          this.formObj = data
          this.generateModle(data)
          this.getFormData()
        }
      } catch (error) {
        //
      }
    },
    generateModle(list) {
      list.forEach(v => {
        this.models[v.name] = v.default
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
