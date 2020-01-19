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
            prop="institute_type"
            :label="`${mylang.instituteType}`"
          >
            <el-input v-model="form.institute_type" clearable />
          </el-form-item>
          <el-form-item
            prop="response"
            :label="`${mylang.response}`"
          >
            <el-input v-model="form.response" clearable />
          </el-form-item>
          <el-form-item
            prop="region"
            :label="`${mylang.regionPlace}`"
          >
            <el-input v-model="form.region" clearable />
          </el-form-item>
          <el-form-item
            prop="coordinate"
            :label="`${mylang.coordinate}`"
          >
            <el-input v-model="form.coordinate" clearable @focus="showMap">
              <i slot="suffix" style="font-size:22px;color:#f56c6c;" class="el-input__icon el-icon-location" />
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="institute"
            :label="mylang.institute"
          >
            <el-input v-model="form.institute" clearable />
          </el-form-item>
          <el-form-item
            prop="name"
            :label="`${mylang.instituteName}`"
          >
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item
            prop="leader"
            :label="`${mylang.contactMan}`"
          >
            <el-input v-model="form.leader" clearable />
          </el-form-item>
          <el-form-item
            prop="phone"
            :label="`${mylang.leaderPhone}`"
          >
            <el-input v-model="form.phone" clearable />
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
    <GetLngLat ref="getmap" :lnglat-pro="form.coordinate" @confirm="getLT" />
  </div>
</template>

<script>
import { validatePhone2Func } from '@/utils/validateFunc'
import { addCooperation, editCooperation, getCooperationDetail } from '@/api/emergency'
import deleteCache from '@/mixins/deleteCache'
import GetLngLat from '@/components/GetLngLat'
export default {
  name: 'CooperationComponentDetail',
  components: {
    GetLngLat
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
      form: {
        order: '',
        institute: '',
        institute_type: '',
        name: '',
        response: '',
        leader: '',
        phone: '',
        region: '',
        coordinate: '',
        remark: ''
      },
      formRules: {
        order: [
          { required: true, message: `请输入${this.mylang.number}` }
        ],
        institute: [
          { required: true, message: `请输入${this.mylang.institute}` }
        ],
        institute_type: [
          { required: true, message: `请输入${this.mylang.instituteType}` }
        ],
        name: [
          { required: true, message: `请输入${this.mylang.instituteName}` }
        ],
        response: [
          { required: true, message: `请输入${this.mylang.response}` }
        ],
        leader: [
          { required: true, message: `请输入${this.mylang.contactMan}` }
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
        const { code, data } = await getCooperationDetail({ id: this.id })
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
        const { code } = await addCooperation(this.form)
        loading.close()
        if (code === 200) {
          // this.$_deleteView({ name: 'Cooperation' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            // this.$router.push({
            //   name: 'Cooperation'
            // })
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
        const { code } = await editCooperation({ id: this.id, ...this.form })
        loading.close()
        if (code === 200) {
          // this.$_deleteView({ name: 'Cooperation' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            // this.$router.push({
            //   name: 'Cooperation'
            // })
            this.goBack()
          }, 500)
          this.$store.commit('app/TOGGLE_UPDATE', true)
        }
      } catch (error) {
        loading.close()
      }
    },
    showMap() {
      this.$refs.getmap.showMap()
    },
    getLT(data) {
      this.form.coordinate = `${data.lngLat.lng},${data.lngLat.lat}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
