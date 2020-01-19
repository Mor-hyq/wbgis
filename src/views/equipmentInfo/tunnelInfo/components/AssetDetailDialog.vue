<template>
  <el-dialog
    :visible.sync="visible"
    custom-class="dialog-custom"
    append-to-body
    width="80%"
  >
    <el-form
      ref="generateForm"
      class="custom-class"
      label-suffix=":"
      :size="$btnSize"
      :model="models"
      :disabled="true"
      label-width="auto"
    >
      <template v-if="formObj.length > 0">
        <template v-for="item in formObj">
          <GFormItem
            :key="item.id"
            :models.sync="models"
            :widget="item"
          />
        </template>
      </template>
    </el-form>
  </el-dialog>
</template>

<script>
import { getFieldList, getAssetDetail } from '@/api/equipmentInfo'
import GFormItem from '../../asset/components/GFormItem'
export default {
  name: 'AssetDetailDialog',
  components: {
    GFormItem
  },
  data() {
    return {
      dialogTitle: '',
      visible: false,
      asset_id: '',
      eid: '',
      formObj: [],
      models: {},
      values: {}
    }
  },
  methods: {
    hide() {
      this.visible = false
    },
    show(option) {
      this.dialogTitle = option.title
      this.asset_id = option.asset_id
      this.eid = option.eid
      this.visible = true
      this.getField()
    },
    async getFormData() {
      try {
        const { code, data } = await getAssetDetail({
          id: this.asset_id
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
