<template>
  <div style="padding-top:5px;">
    <p class="title">{{ detailTitle }}</p>
    <el-form
      ref="generateForm"
      class="custom-class"
      label-suffix=":"
      :size="$btnSize"
      :model="models"
      :rules="isRead ? {} :rules"
      :disabled="isRead"
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
      <div v-if="!isRead" style="margin-top:20px;">
        <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
        <el-button @click="goBack">{{ mylang.cancel }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getFieldList, getAssetDetail, addAsset, editAsset } from '@/api/equipmentInfo'
import GFormItem from './GFormItem'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'AssetDetailComponent',
  components: {
    GFormItem
  },
  mixins: [deleteCache],
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      eid: this.$route.query.eid || '',
      id: this.$route.query.id || '',
      formObj: [],
      models: {},
      rules: {},
      values: {},
      submitField: {}
    }
  },
  computed: {
    detailTitle() {
      if (this.isEdit) {
        return this.mylang.edit + decodeURIComponent(this.$route.query.ename)
      } else if (this.isRead) {
        return decodeURIComponent(this.$route.query.ename) + this.mylang.detail
      } else {
        return this.mylang.add + decodeURIComponent(this.$route.query.ename)
      }
    }
  },
  created() {
    this.getField()
  },
  methods: {
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
          if (this.isEdit || this.isRead) {
            this.getFormData()
          }
        }
      } catch (error) {
        //
      }
    },
    generateModle(list) {
      list.forEach(v => {
        this.models[v.name] = v.default
        this.rules[v.name] = [
          { required: !!v.require, message: `${v.title}必须填写` }
        ]
        this.submitField[v.name] = v.id
      })
    },
    async handleCreate() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const form = {}
        for (const k in this.models) {
          if (this.submitField[k]) {
            const id = this.submitField[k]
            const val = this.models[k]
            form['field_id_' + id] = id
            form['field_value_id_' + id] = val
          }
        }
        const { code } = await addAsset({
          equipment_id: this.eid,
          field: form
        })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'AssetIndex' })
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          setTimeout(() => {
            this.goBack()
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    async handleEdit() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const form = {}
        for (const k in this.models) {
          if (this.submitField[k]) {
            const id = this.submitField[k]
            const val = this.models[k]
            form['field_id_' + id] = id
            form['field_value_id_' + id] = val
          }
        }
        const { code } = await editAsset({
          id: this.id,
          equipment_id: this.eid,
          field: form
        })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'AssetIndex' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.goBack()
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },

    submit() {
      this.$refs.generateForm.validate(valid => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              // 编辑提交
              this.handleEdit()
            } else {
              // 创建提交
              this.handleCreate()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 10px 0 15px;
  font-size: 15px;
  font-weight: bold;
  color: #606266;
}
</style>
