<template>
  <div class="record-wrap">
    <go-back />
    <!-- <TopLabel :label="labelName" /> -->
    <!-- 动态组件 展示对应名称的组件 -->
    <component
      :is="componentName.type"
      :id="id"
      :peid="peid"
    />
    <!-- <fjyjc
      :id="id"
      :peid="peid"
    /> -->
  </div>
</template>

<script>
import fjyjc from './components/newMaintainForm/fjyjcTable'
import fjbnby from './components/newMaintainForm/fjbnbyTable'
import djzkz from './components/newMaintainForm/djzkzTable'
import djfcsy from './components/newMaintainForm/djfcsyTable'
import gdpqy from './components/newMaintainForm/gdpqyTable'
import ddpspwz from './components/newMaintainForm/ddpspwzTable'
import xsyjcs from './components/newMaintainForm/xsyjcsTable'
import glqflqyc from './components/newMaintainForm/glqflqycTable'
import ycsbclr from './components/newMaintainForm/ycsbclrTable'
import ycsbclrg from './components/newMaintainForm/ycsbclrgTable'
import glflq from './components/newMaintainForm/glflqTable'
import gytjdx from './components/newMaintainForm/gytjdxTable'
import hkjyzgytr from './components/newMaintainForm/hkjyzgytrTable'
import jycddm from './components/newMaintainForm/jycddmTable'
import yljtlwy from './components/newMaintainForm/yljtlwyTable'
export default { // 该页面已弃用
  name: 'MaintainRecordForm',
  components: {
    fjyjc,
    fjbnby,
    djzkz,
    djfcsy,
    gdpqy,
    ddpspwz,
    xsyjcs,
    glqflqyc,
    ycsbclr,
    ycsbclrg,
    glflq,
    gytjdx,
    hkjyzgytr,
    jycddm,
    yljtlwy
  },
  data() {
    return {
      type: this.$route.query.type || '',
      // type: '162',
      id: this.$route.query.id || '',
      peid: this.$route.query.peid || ''
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
  created() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.record-wrap {
  width: 100%;
  overflow-x: auto;
}
</style>

