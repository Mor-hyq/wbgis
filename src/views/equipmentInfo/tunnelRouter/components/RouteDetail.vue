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
          <el-form-item prop="pipe_id" :label="mylang.belongPipe">
            <el-select
              v-model="form.pipe_id"
              clearable
              style="width:100%;"
              filterable
            >
              <el-option
                v-for="pipe in pipeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="order"
            :label="mylang.routeNumber"
          >
            <el-input v-model="form.order" clearable />
          </el-form-item>
          <el-form-item
            prop="mileage"
            :label="`${mylang.mileage}(m)`"
          >
            <el-input v-model="form.mileage" type="number" clearable />
          </el-form-item>

          <el-form-item
            prop="turn_angle"
            :label="`${mylang.turnAngle}(°)`"
          >
            <el-input v-model="form.turn_angle" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="pipe_depth"
            :label="`${mylang.pipeDepth}(m)`"
          >
            <el-input v-model="form.pipe_depth" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="region"
            :label="`${mylang.region}`"
          >
            <el-input v-model="form.region" clearable />
          </el-form-item>
          <el-form-item
            prop="thumb"
            :label="`${mylang.picture}`"
          >
            <upload-image
              v-model="form.thumb"
              :multiple="false"
              :length="1"
              :disabled="isRead"
              :img-limit-size="8"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="name"
            :label="mylang.routeName"
          >
            <el-input v-model="form.name" clearable />
          </el-form-item>
          <el-form-item
            prop="ground_elevation"
            :label="`${mylang.groundElevation}(m)`"
          >
            <el-input v-model="form.ground_elevation" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="latitude_longtitude"
            :label="`${mylang.lnglat}`"
          >
            <el-input v-model="form.latitude_longtitude" clearable @focus="showMap">
              <i slot="suffix" style="font-size:22px;color:#f56c6c;" class="el-input__icon el-icon-location" />
            </el-input>
          </el-form-item>
          <el-form-item
            prop="location"
            :label="`${mylang.location}`"
          >
            <el-input v-model="form.location" clearable />
          </el-form-item>
          <el-form-item
            prop="date"
            :label="mylang.measureDate"
          >
            <el-date-picker
              v-model="form.date"
              type="date"
              :placeholder="mylang.measureDate"
              clearable
            />
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
    <GetLngLat ref="getmap" :lnglat-pro="form.latitude_longtitude" @confirm="getLT" />
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImage'
import GetLngLat from '@/components/GetLngLat'
import { addPipeRoute, editPipeRoute, getPipeDRouteDetail } from '@/api/equipmentInfo'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'RouteDetail',
  components: {
    UploadImage,
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
        pipe_id: '',
        order: '',
        name: '',
        mileage: '',
        latitude_longtitude: '',
        ground_elevation: '',
        pipe_depth: '',
        turn_angle: '',
        location: '',
        region: '',
        date: '',
        thumb: [],
        remark: ''
      },
      formRules: {
        pipe_id: [
          { required: true, message: `请选择${this.mylang.belongPipe}` }
        ],
        order: [
          { required: true, message: `请输入${this.mylang.routeNumber}` }
        ],
        mileage: [
          { required: true, message: `请输入${this.mylang.mileage}` }
        ],
        name: [
          { required: true, message: `请输入${this.mylang.routeName}` }
        ],
        latitude_longtitude: [
          { required: true, message: `请选择${this.mylang.lnglat}` }
        ],
        ground_elevation: [
          { required: true, message: `请输入${this.mylang.groundElevation}` }
        ]
      },
      id: this.$route.query.id || '',
      pipeOptions: []
    }
  },
  created() {
    this.getPipeOptions()
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
        const { code, data } = await getPipeDRouteDetail({ id: this.id })
        if (code === 200) {
          const thumb = Array.isArray(data.thumb) ? data.thumb : (data.thumb ? data.thumb.split(',') : [])
          this.form = { ...this.form, ...data, thumb }
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
        const form = { ...this.form, thumb: this.form.thumb.join() }
        const { code } = await addPipeRoute(form)
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'TunnelRouter' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'TunnelRouter'
            })
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
        const form = { ...this.form, thumb: this.form.thumb.join() }
        const { code } = await editPipeRoute({ id: this.id, ...form })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'TunnelRouter' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'TunnelRouter'
            })
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    getPipeOptions() {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          this.pipeOptions = this.$store.state.form.belongPipe
        })
      } else {
        this.pipeOptions = this.$store.state.form.belongPipe
      }
    },
    showMap() {
      this.$refs.getmap.showMap()
    },
    getLT(data) {
      this.form.latitude_longtitude = `${data.lngLat.lng},${data.lngLat.lat}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
