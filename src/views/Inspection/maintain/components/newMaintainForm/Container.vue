<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="750px"
    top="10vh"
    :before-close="hideDialog"
    :close-on-click-modal="false"
    custom-class="custom-dialog"
    :destroy-on-close="true"
  >
    <component
      :is="componentName.type"
      v-if="visible"
      :ref="componentRef"
      :is-read="isRead"
      :eq-type="eqType"
      :eq-num="eqNum"
      :eq-name="eqName"
      :eq-id="eqId"
      @success="handleSuccess"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
      <el-button v-if="!isRead" type="primary" @click="handleConfirm">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ddpspwz from './ddpspwz'
import gdpqy from './gdpqy'
import fjyjc from './fjyjc'
import fjbnby from './fjbnby'
import glqflqyc from './glqflqyc'
import djzkz from './djzkz'
import djfcsy from './djfcsy'
import xsyjcs from './xsyjcs'
import ycsbclr from './ycsbclr'
import ycsbclrg from './ycsbclrg'
import glflq from './glflq'
import jycddm from './jycddm'
import yljtlwy from './yljtlwy'
import gytjdx from './gytjdx'
import hkjyzgytr from './hkjyzgytr'
export default {
  components: {
    ddpspwz,
    gdpqy,
    fjyjc,
    fjbnby,
    glqflqyc,
    djzkz,
    djfcsy,
    xsyjcs,
    ycsbclr,
    ycsbclrg,
    glflq,
    jycddm,
    yljtlwy,
    gytjdx,
    hkjyzgytr
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dialogTitle: {
      type: String,
      default: '维护登记'
    },
    type: {
      type: String,
      default: ''
    },
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
    },
    eqId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      componentRef: 'ref_' + Date.now()
    }
  },
  computed: {
    componentName() {
      switch (this.type) {
        case '11':
          return {
            name: '阀井月检查记录',
            type: 'fjyjc'
          }
        case '12':
          return {
            name: '阀井半年保养记录',
            type: 'fjbnby'
          }
        case '31':
          return {
            name: '机坪地井状况周检查记录',
            type: 'djzkz'
          }
        case '32':
          return {
            name: '机坪地井阀测试月检查记录',
            type: 'djfcsy'
          }
        case '51':
          return {
            name: '机坪管线高点排气月检查记录',
            type: 'gdpqy'
          }
        case '61':
          return {
            name: '机坪管线低点排水排污周检查记录',
            type: 'ddpspwz'
          }
        case '81':
          return {
            name: '牺牲阳极测试记录',
            type: 'xsyjcs'
          }
        case '91':
          return {
            name: '过滤器/分离器（预过滤器）压差记录',
            type: 'glqflqyc'
          }
        case '101':
          return {
            name: '航空加油站油车设备、车辆日检查单',
            type: 'ycsbclr'
          }
        case '111':
          return {
            name: '航空加油站油车设备、车辆日检查单',
            type: 'ycsbclrg'
          }
        case '171':
          return {
            name: '过滤器/分离器（预过滤器）压差记录',
            type: 'glflq'
          }
        case '211':
          return {
            name: '加油车呆德曼开闭时间周检查记录',
            type: 'jycddm'
          }
        case '201':
          return {
            name: '压力接头滤网月检查清洗记录',
            type: 'yljtlwy'
          }
        case '161':
          return {
            name: '灌油台接地线导电性能周检查记录',
            type: 'gytjdx'
          }
        case '162':
          return {
            name: '航空加油站灌油台日检查记录',
            type: 'hkjyzgytr'
          }

        default:
          return {}
      }
    }
  },
  methods: {
    hideDialog() {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      this.$refs[this.componentRef].validate()
    },
    handleSuccess() {
      this.hideDialog()
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 15px;
 /deep/ .custom-dialog {
     .el-dialog__header {
         padding: $padding $padding 5px;
         .el-dialog__headerbtn {
             top: $padding;
             right: $padding;
         }
     }
    .el-dialog__body {
        padding: 0 $padding $padding;
        max-height: 70vh;
        height: 70vh;
        overflow: auto;
    }
    .inline-radio {
      margin-top: 8px;
      min-height: 30px;
      .el-form-item {
        display: inline-block;
        margin: 0;
        .el-input {
          width: 160px;
        }
      }
    }
    .read {
      font-size: 14px;
    }
}
</style>
