<template>
  <div>
    <el-form-item
      :label="widget.title"
      :prop="widget.name"
    >
      <template v-if="widget.type == 1">
        <el-input
          v-if="widget.name === 'location'"
          v-model="dataModel"
          clearable
          @focus="showMap"
        >
          <i slot="suffix" style="font-size:22px;color:#f56c6c;" class="el-input__icon el-icon-location" />
        </el-input>
        <el-input
          v-else
          v-model="dataModel"
          type="text"
          clearable
        />
      </template>
      <template v-else-if="widget.type == 2">
        <el-input
          v-model="dataModel"
          type="number"
          clearable
        />
      </template>
      <template v-else-if="widget.type == 3">
        <el-date-picker
          v-model="dataModel"
          type="date"
          value-format="yyyy-MM-dd"
          clearable
        />
      </template>
      <template v-else-if="widget.type == 4">
        <el-date-picker
          v-model="dataModel"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          clearable
        />
      </template>
      <template v-else-if="widget.type == 5">
        <el-select v-model="dataModel">
          <el-option
            v-for="opt in widget.enum"
            :key="opt.value"
            :label="opt.title"
            :value="opt.value"
          />
        </el-select>
      </template>
      <template v-else-if="widget.type == 6">
        <el-radio-group v-model="dataModel">
          <el-radio
            v-for="radio in widget.enum"
            :key="radio.value"
            :label="radio.value"
          >{{ radio.title }}</el-radio>
        </el-radio-group>
      </template>
      <template v-else-if="widget.type == 7">
        <el-checkbox-group v-model="dataModel">
          <el-checkbox
            v-for="check in widget.enum"
            :key="check.value"
            :label="check.value"
          >{{ check.title }}</el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-else-if="widget.type == 8">
        <el-input
          v-model="dataModel"
          type="textarea"
          :rows="5"
          clearable
        />
      </template>
      <template v-else-if="widget.type == 9">
        <tinymce v-model="dataModel" :height="300" />
      </template>
      <template v-else-if="widget.type == 10">
        <upload-image
          v-model="dataModel"
        />
      </template>
      <template v-else-if="widget.type == 11">
        <div />
      </template>
    </el-form-item>
    <GetLngLat v-if="widget.type === 1 && widget.name === 'location'" ref="getmap" :lnglat-pro="dataModel" @confirm="getLT" />
  </div>
</template>

<script>
import UploadImage from '@/components/UploadImage'
import GetLngLat from '@/components/GetLngLat'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'GFormItem',
  components: {
    UploadImage,
    Tinymce,
    GetLngLat
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['widget', 'models'],
  data() {
    return {
      dataModel: this.models[this.widget.name]
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.name] = val
        this.$emit('update:models', {
          ...this.models,
          [this.widget.name]: val
        })
        this.$emit('input-change', val, this.widget.name)
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.name]
      }
    }
  },
  methods: {
    showMap() {
      this.$refs.getmap.showMap()
    },
    getLT(data) {
      this.dataModel = `${data.lngLat.lng},${data.lngLat.lat}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
