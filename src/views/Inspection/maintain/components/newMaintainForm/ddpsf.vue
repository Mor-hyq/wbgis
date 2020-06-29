<template>
  <div>
    <el-form
      :model="form"
      :rules="isRead ? {} :formRules"
      label-suffix=":"
      :size="$btnSize"
      class="custom-class"
      :disabled="isRead"
      label-width="100px"
    >
      <el-row :gutter="25">
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentType"
          >{{ eqType }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentNumber"
          >{{ eqNum }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentName"
          >{{ eqName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="25">
        <el-col :span="8">
          <el-form-item
            prop="check_mid"
            label="检查人员"
          >
            <el-select
              v-model="form.check_mid"
              clearable
              filterable
            >
              <el-option
                v-for="item in memberOptions"
                :key="item.id"
                :value="item.id"
                :label="item.nickname"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            prop="check_time"
            label="维护时间"
          >
            <el-date-picker
              v-model="form.check_time"
              prefix-icon="none"
              clearable
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="维护时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="low_area"
        label="机坪低点排水区域"
      >
        <el-input
          v-model="form.low_area"
          clearable
        />
      </el-form-item>
      <el-form-item
        prop="visual"
        label="目视"
      >
        <el-radio-group v-model="form.visual">
          <el-radio
            v-for="item in visualOptions"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="water_detector"
        label="化学测水器"
      >
        <el-radio-group v-model="form.water_detector">
          <el-radio
            v-for="item in waterOptions"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="deal"
        label="处理过程"
      >
        <el-input
          v-model="form.deal"
          :rows="2"
          type="textarea"
        />
      </el-form-item>
      <el-form-item
        prop="deal_visual"
        label="目视结论"
      >
        <el-radio-group v-model="form.deal_visual">
          <el-radio
            v-for="item in dealOptions"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="remark"
        label="备注"
      >
        <el-input
          v-model="form.remark"
          :rows="2"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    isRead: {
      type: Boolean,
      default: false
    },
    eqType: {
      type: String,
      default: ''
    },
    eqNum: {
      type: String,
      default: ''
    },
    eqName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        egi_period_id: '',
        check_mid: '',
        check_time: '',
        low_area: '',
        visual: '',
        water_detector: '',
        deal: '',
        deal_visual: '',
        remark: ''
      },
      formRules: {

      },
      memberOptions: [],
      visualOptions: [
        {
          id: 1,
          name: '清澈透明'
        },
        {
          id: 2,
          name: '少量水分杂质'
        },
        {
          id: 3,
          name: '大量水分杂质'
        }
      ],
      waterOptions: [
        {
          id: 1,
          name: '不变色'
        },
        {
          id: 2,
          name: '变色'
        }
      ],
      dealOptions: [
        {
          id: 1,
          name: '合格'
        },
        {
          id: 2,
          name: '不合格'
        }
      ]
    }
  },
  created() {
    this.getCheckMember()
  },
  methods: {
    getCheckMember() {
      if (this.$store.state.form.checkMember.length < 1) {
        this.$store.dispatch('form/setCheckMember').then(() => {
          this.memberOptions = this.$store.state.form.checkMember
        })
      } else {
        this.memberOptions = this.$store.state.form.checkMember
      }
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
