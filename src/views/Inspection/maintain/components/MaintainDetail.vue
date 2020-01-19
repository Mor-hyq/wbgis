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
            prop="pipe_id"
            :label="mylang.belongPipe"
          >
            <el-select
              v-model="form.pipe_id"
              clearable
              @change="pipeChange"
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
            prop="equipment_id"
            :label="`${mylang.equipmentType}`"
          >
            <!-- <el-select
              v-model="form.equipment_id"
              clearable
              @change="equipmentChange"
            > -->
            <el-select
              v-model="form.equipment_id"
              clearable
            >
              <el-option
                v-for="pipe in eTypeOptions"
                :key="pipe.id"
                :value="pipe.id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            prop="asset_id"
            :label="mylang.equipmentName"
          >
            <el-select
              v-model="form.asset_id"
              clearable
            >
              <el-option
                v-for="pipe in eNameOptions"
                :key="pipe.asset_id"
                :value="pipe.asset_id"
                :label="pipe.name"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item
            prop="notify_person"
            :label="`${mylang.noticeStaff}`"
          >
            <el-input v-model="form.notify_person" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="egi_cycle"
            :label="`${mylang.maintainCycle}(天)`"
          >
            <el-input v-model="form.egi_cycle" type="number" clearable />
          </el-form-item>
          <el-form-item
            prop="next_egi_time"
            :label="`下次${mylang.maintainDate}`"
          >
            <el-date-picker
              v-model="form.next_egi_time"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item
            prop="phone"
            :label="`${mylang.contact}`"
          >
            <el-input v-model="form.phone" type="number" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="egi"
        :label="`${mylang.maintainRequirement}`"
      >
        <el-input v-model="form.egi" type="textarea" :rows="isRead ? '' : 5" />
      </el-form-item>
    </el-form>
    <div v-if="!isRead" style="margin-top:20px;">
      <el-button type="primary" @click="submit">{{ mylang.save }}</el-button>
      <el-button @click="goBack">{{ mylang.cancel }}</el-button>
    </div>
  </div>
</template>

<script>
import {
  addAssetEgi,
  editAssetEgi,
  getAssetEgiDetail,
  // getAssetNameState,
  getAssetTypeState
} from '@/api/inspection'
import { validatePhone2Func } from '@/utils/validateFunc'
import deleteCache from '@/mixins/deleteCache'

export default {
  name: 'MaintainDetailComponent',
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
        equipment_id: '',
        // asset_id: '',
        egi_cycle: '',
        next_egi_time: '',
        notify_person: '',
        phone: '',
        egi: ''
      },
      formRules: {
        pipe_id: [
          { required: true, message: `请选择${this.mylang.belongPipe}` }
        ],
        equipment_id: [
          { required: true, message: `请选择${this.mylang.equipmentType}` }
        ],
        // asset_id: [
        //   { required: true, message: `请选择${this.mylang.equipment}` }
        // ],
        egi_cycle: [
          { required: true, message: `请输入${this.mylang.maintainCycle}` }
        ],
        next_egi_time: [
          { required: true, message: `请选择下次${this.mylang.maintainDate}` }
        ],
        notify_person: [
          { required: true, message: `请输入${this.mylang.noticeStaff}` }
        ],
        phone: [
          { required: true, validator: validatePhone2Func, tips: `${this.mylang.contact}` }
        ]
      },
      id: this.$route.query.id || '',
      pipeOptions: [],
      eTypeOptions: [],
      eNameOptions: [],
      pickerTypeOptions: {
        disabledDate: (time) => {
          return time.getTime() < (Date.now() - 8.64e7)
        }
      }
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
        const { code, data } = await getAssetEgiDetail({ id: this.id })
        if (code === 200) {
          this.form = { ...this.form, ...data }
          if (data.equipment_id) {
            this.getEquipmentOptions()
            // this.getEquipmentNameOptions()
          }
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
        const { code } = await addAssetEgi(this.form)
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'EquipmentMaintain' })
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'EquipmentMaintain'
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
        const { code } = await editAssetEgi({ id: this.id, ...this.form })
        loading.close()
        if (code === 200) {
          this.$_deleteView({ name: 'EquipmentMaintain' })
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          setTimeout(() => {
            this.$router.push({
              name: 'EquipmentMaintain'
            })
          }, 500)
        }
      } catch (error) {
        loading.close()
      }
    },
    pipeChange(val) {
      // 重选管道 设备类型与设备名称也要重新选择
      this.form.equipment_id = ''
      // this.form.asset_id = ''
      this.eTypeOptions = []
      this.eNameOptions = []
      if (this.form.pipe_id) {
        this.getEquipmentOptions()
      }
    },
    // equipmentChange(val) {
    //   // 重选设备类型 设备也要重新选择
    //   // this.form.asset_id = ''
    //   this.eNameOptions = []
    //   // if (this.form.pipe_id && this.form.equipment_id) {
    //   //   this.getEquipmentNameOptions()
    //   // }
    // },
    getPipeOptions() {
      if (this.$store.state.form.belongPipe.length < 1) {
        this.$store.dispatch('form/setBelongPipe').then(() => {
          this.pipeOptions = this.$store.state.form.belongPipe
        })
      } else {
        this.pipeOptions = this.$store.state.form.belongPipe
      }
    },
    async getEquipmentOptions() {
      try {
        const { code, data } = await getAssetTypeState({
          id: this.form.pipe_id
        })
        if (code === 200) {
          this.eTypeOptions = data || []
        }
      } catch (error) {
        //
      }
    }
    // async getEquipmentNameOptions() {
    //   try {
    //     const { code, data } = await getAssetNameState({
    //       id: this.form.pipe_id,
    //       equipment_id: this.form.equipment_id
    //     })
    //     if (code === 200) {
    //       this.eNameOptions = data || []
    //     }
    //   } catch (error) {
    //     console.log(error)
    //     //
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
