<template>
  <div>
    <el-form
      ref="form"
      :rules="isRead ? {} :formRules"
      :model="form"
      label-suffix=":"
      label-width="auto"
      :size="$btnSize"
      class="custom-class"
      style="padding-top:5px;"
      :disabled="isRead"
    >
      <el-row :gutter="25">
        <el-col :span="12">
          <el-form-item
            prop="order"
            :label="mylang.number"
          >
            <el-input v-model="form.order" clearable />
          </el-form-item>
          <el-form-item
            prop="length"
            :label="`${mylang.pipeLength}(m)`"
          >
            <el-input v-model="form.length" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="thick"
            :label="`${mylang.pipeThick}(mm)`"
          >
            <el-input v-model="form.thick" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="delivery_pressure"
            :label="`${mylang.deliveryPressure}(MPa)`"
          >
            <el-input v-model="form.delivery_pressure" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="use_temp"
            :label="`${mylang.useTemp}(°C)`"
          >
            <el-input v-model="form.use_temp" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="location_prime"
            :label="mylang.locationPrime"
          >
            <el-input v-model="form.location_prime" clearable />
          </el-form-item>
          <el-form-item
            prop="medium"
            :label="mylang.transMedia"
          >
            <el-input v-model="form.medium" clearable />
          </el-form-item>
          <el-form-item
            prop="specification"
            :label="mylang.specification"
          >
            <el-input v-model="form.specification" clearable />
          </el-form-item>
          <el-form-item
            prop="level"
            :label="mylang.pipeLevel"
          >
            <el-input v-model="form.level" clearable />
          </el-form-item>
          <el-form-item
            prop="use_limit"
            :label="mylang.useLimit"
          >
            <el-input v-model="form.use_limit" clearable />
          </el-form-item>
          <el-form-item
            prop="design_unit"
            :label="mylang.designUnit"
          >
            <el-input v-model="form.design_unit" clearable />
          </el-form-item>
          <el-form-item
            prop="header"
            :label="mylang.header"
          >
            <el-input v-model="form.header" clearable />
          </el-form-item>
          <el-form-item
            prop="data_source"
            :label="mylang.dataSource"
          >
            <el-input v-model="form.data_source" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="name"
            :label="mylang.pipeName"
          >
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item
            prop="diameter"
            :label="`${mylang.pipeDiameter}(mm)`"
          >
            <el-input v-model="form.diameter" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="pressure"
            :label="`${mylang.designPressure}(MPa)`"
          >
            <el-input v-model="form.pressure" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="design_temp"
            :label="`${mylang.designTemp}(°C)`"
          >
            <el-input v-model="form.design_temp" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="state"
            :label="mylang.workState"
          >
            <el-select v-model="form.state" clearable>
              <el-option
                v-for="option in stateOptions"
                :key="option.id"
                :label="option.state"
                :value="option.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="update_instruction"
            :label="mylang.updateIns"
          >
            <el-input v-model="form.update_instruction" clearable />
          </el-form-item>
          <el-form-item
            prop="start_location"
            :label="mylang.startLocation"
          >
            <el-input v-model="form.start_location" clearable />
          </el-form-item>
          <el-form-item
            prop="material"
            :label="mylang.pipeMaterial"
          >
            <el-input v-model="form.material" clearable />
          </el-form-item>
          <el-form-item
            prop="layer_material	"
            :label="mylang.layerMaterial"
          >
            <el-input v-model="form.layer_material" clearable />
          </el-form-item>
          <el-form-item
            prop="pipe_unit"
            :label="mylang.pipeUnit"
          >
            <el-input v-model="form.pipe_unit" clearable />
          </el-form-item>
          <el-form-item
            prop="construct_unit"
            :label="mylang.constructUnit"
          >
            <el-input v-model="form.construct_unit" clearable />
          </el-form-item>
          <el-form-item
            prop="phone"
            :label="mylang.headerPhone"
          >
            <el-input v-model="form.phone" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="remark"
        :label="mylang.remark"
      >
        <el-input v-model="form.remark" :rows="isRead ? '' : 5" type="textarea" />
      </el-form-item>
    </el-form>
    <div v-if="!isRead" style="margin-top:20px;">
      <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
      <el-button @click="goBack">{{ mylang.cancel }}</el-button>
    </div>
  </div>
</template>

<script>
import { validatePhone2Func } from '@/utils/validateFunc'
import { addPipe, editPipe, getPipeDetail } from '@/api/equipmentInfo'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'InfoDetail',
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
      form: {
        order: '',
        name: '',
        length: '',
        diameter: '',
        thick: '',
        pressure: '',
        delivery_pressure: '',
        design_temp: '',
        use_temp: '',
        state: 1,
        medium: '',
        material: '',
        level: '',
        data_source: '',
        location_prime: '',
        update_instruction: '',
        start_location: '',
        specification: '',
        layer_material: '',
        use_limit: '',
        pipe_unit: '',
        design_unit: '',
        construct_unit: '',
        header: '',
        phone: '',
        remark: ''
      },
      formRules: {
        order: [
          { required: true, message: `请输入${this.mylang.number}` }
        ],
        name: [
          { required: true, message: `请输入${this.mylang.pipeName}` }
        ],
        length: [
          { required: true, message: `请输入${this.mylang.pipeLength}` }
        ],
        diameter: [
          { required: true, message: `请输入${this.mylang.pipeDiameter}` }
        ],
        thick: [
          { required: true, message: `请输入${this.mylang.pipeThick}` }
        ],
        pressure: [
          { required: true, message: `请输入${this.mylang.designPressure}` }
        ],
        delivery_pressure: [
          { required: true, message: `请输入${this.mylang.deliveryPressure}` }
        ],
        phone: [
          { required: false, trigger: 'blur', validator: validatePhone2Func, tips: '联系号码' }
        ]
      },
      id: this.$route.query.id || '',
      stateOptions: []
    }
  },
  created() {
    this.getStateOptions()
    if (this.isEdit || this.isRead) {
      this.getDetail()
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
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
    },
    async getDetail() {
      try {
        const { code, data } = await getPipeDetail({ id: this.id })
        if (code === 200) {
          this.form = { ...this.form, ...data }
        }
      } catch (error) {
        //
      }
    },
    async handleCreate() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addPipe(this.form)
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'TunnelInfo' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'TunnelInfo'
            })
          }, 500)
          this.$store.dispatch('form/setBelongPipe')
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
        const { code } = await editPipe({ id: this.id, ...this.form })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'TunnelInfo' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'TunnelInfo'
            })
          }, 500)
          this.$store.dispatch('form/setBelongPipe')
        }
      } catch (error) {
        loading.close()
      }
    },
    getStateOptions() {
      if (this.$store.state.form.workState.length < 1) {
        this.$store.dispatch('form/setWorkState').then(() => {
          this.stateOptions = this.$store.state.form.workState
        })
      } else {
        this.stateOptions = this.$store.state.form.workState
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
