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
            <el-input v-model="form.order" :readonly="isRead || isEdit" clearable />
          </el-form-item>
          <el-form-item
            prop="material"
            :label="`${mylang.materialName}`"
          >
            <el-input v-model="form.material" clearable />
          </el-form-item>
          <el-form-item
            prop="number"
            :label="`${mylang.quantity}`"
          >
            <el-input v-model="form.number" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="specificate"
            :label="`${mylang.specificate}`"
          >
            <el-input v-model="form.specificate" clearable />
          </el-form-item>
          <el-form-item
            prop="leader"
            :label="`${mylang.leader}`"
          >
            <el-input v-model="form.leader" clearable />
          </el-form-item>
          <el-form-item
            prop="check_time"
            :label="`${mylang.checkTime}`"
          >
            <el-date-picker
              v-model="form.check_time"
              type="date"
              :placeholder="mylang.checkTime"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="unit"
            :label="mylang.unitName"
          >
            <el-input v-model="form.unit" clearable />
          </el-form-item>
          <el-form-item
            prop="store_place"
            :label="`${mylang.storePlace}`"
          >
            <el-input v-model="form.store_place" clearable />
          </el-form-item>
          <el-form-item
            prop="mesure"
            :label="`${mylang.measureUnit}`"
          >
            <el-input v-model="form.mesure" clearable />
          </el-form-item>
          <el-form-item
            prop="phone"
            :label="`${mylang.leaderPhone}`"
          >
            <el-input v-model="form.phone" clearable />
          </el-form-item>
          <el-form-item
            prop="expire_time"
            :label="`${mylang.expireTime}`"
          >
            <el-date-picker
              v-model="form.expire_time"
              type="date"
              :placeholder="mylang.expireTime"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="remark"
        :label="`${mylang.remark}`"
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
import { addSupply, editSupply, getSupplyDetail } from '@/api/emergency'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'SupplyDetail',
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
        unit: '',
        material: '',
        store_place: '',
        specificate: '',
        mesure: '',
        number: '',
        leader: '',
        phone: '',
        expire_time: '',
        check_time: '',
        remark: ''
      },
      formRules: {
        order: [
          { required: true, message: `请输入${this.mylang.number}` }
        ],
        unit: [
          { required: true, message: `请输入${this.mylang.unitName}` }
        ],
        store_place: [
          { required: true, message: `请输入${this.mylang.storePlace}` }
        ],
        material: [
          { required: true, message: `请输入${this.mylang.materialName}` }
        ],
        specificate: [
          { required: true, message: `请输入${this.mylang.specificate}` }
        ],
        mesure: [
          { required: true, message: `请输入${this.mylang.measureUnit}` }
        ],
        phone: [
          { required: false, trigger: 'blur', validator: validatePhone2Func, tips: '联系电话' }
        ]
      },
      id: this.$route.query.id || ''
    }
  },
  created() {
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
        const { code, data } = await getSupplyDetail({ id: this.id })
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
        const { code } = await addSupply(this.form)
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.goBack()
          }, 500)
          this.$store.commit('app/TOGGLE_UPDATE', true)
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
        const { code } = await editSupply({ id: this.id, ...this.form })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.goBack()
          }, 500)
          this.$store.commit('app/TOGGLE_UPDATE', true)
        }
      } catch (error) {
        loading.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
