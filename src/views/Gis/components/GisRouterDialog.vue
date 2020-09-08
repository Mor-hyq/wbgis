<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    custom-class="dialog-custom"
    width="50%"
    append-to-body
  >
    <el-form
      ref="form"
      :model="form"
      label-suffix=":"
      label-width="auto"
      :size="$btnSize"
      class="custom-class"
      style="padding-top:5px;"
      :disabled="true"
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
            <el-input v-model="form.latitude_longtitude" clearable />
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
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getPipeDRouteDetail } from '@/api/equipmentInfo'

export default {
  name: 'GisRouterDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      tableLoading: false,
      form: {},
      pipeOptions: []
    }
  },
  created() {
    this.getPipeOptions()
  },
  methods: {
    show() {
      this.visible = true
      this.$nextTick(() => {
        this.getDetail()
      })
    },
    hide() {
      this.visible = false
    },
    async getDetail() {
      this.tableLoading = true
      try {
        const { code, data } = await getPipeDRouteDetail({ id: this.id })
        this.tableLoading = false
        if (code === 200) {
          const thumb = Array.isArray(data.thumb) ? data.thumb : (data.thumb ? data.thumb.split(',') : [])
          this.form = { ...this.form, ...data, thumb }
        }
      } catch (error) {
        this.tableLoading = false
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
