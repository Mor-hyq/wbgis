<template>
  <div class="record-wrap">
    <go-back />
    <TopLabel :label="labelName" />
    <!-- 动态组件 展示对应名称的组件 -->
    <component :is="componentName" />
  </div>
</template>

<script>
import ddpscy from './components/matainform/ddpscy'
import ddpspwz from './components/matainform/ddpspwz'
import djfcsy from './components/matainform/djfcsy'
import djzkz from './components/matainform/djzkz'
import fjbnby from './components/matainform/fjbnby'
import fjyjc from './components/matainform/fjyjc'
import gdpqy from './components/matainform/gdpqy'
import jysdtjc from './components/matainform/jysdtjc'
export default { // 该页面已弃用
  name: 'MaintainRecord',
  components: {
    ddpscy,
    ddpspwz,
    djfcsy,
    djzkz,
    fjbnby,
    fjyjc,
    gdpqy,
    jysdtjc
  },
  data() {
    return {
      actType: this.$route.query.tid || 1
    }
  },
  computed: {
    componentName() {
      let name = ''
      switch (+this.actType) {
        case 1:
          // 低点排水查油品质量检查
          name = 'ddpscy'
          break
        case 2:
          // 低点排污排水周检查
          name = 'ddpspwz'
          break
        case 3:
          // 机坪管线高点排气月检查记录
          name = 'gdpqy'
          break
        case 4:
          // 机坪地井阀测试月检查记录
          name = 'djfcsy'
          break
        case 5:
          // 机坪地井状况周检查
          name = 'djzkz'
          break
        case 6:
          // 航空加油站阀井半年保养记录
          name = 'fjbnby'
          break
        case 7:
          // 航空加油站加油栓动态检查记录
          name = 'jysdtjc'
          break
        case 8:
          // 航空加油站阀井月检查记录
          name = 'fjyjc'
          break
        default:
          break
      }
      return name
    },
    labelName() {
      let name = ''
      switch (+this.actType) {
        case 1:
          // 低点排水查油品质量检查
          name = '低点排水查油品质量检查记录'
          break
        case 2:
          // 低点排污排水周检查
          name = '低点排污排水周检查记录'
          break
        case 3:
          // 机坪管线高点排气月检查记录
          name = '机坪管线高点排气月检查记录'
          break
        case 4:
          // 机坪地井阀测试月检查记录
          name = '机坪地井阀测试月检查记录'
          break
        case 5:
          // 机坪地井状况周检查
          name = '机坪地井状况周检查记录'
          break
        case 6:
          // 航空加油站阀井半年保养记录
          name = '航空加油站阀井半年保养记录'
          break
        case 7:
          // 航空加油站加油栓动态检查记录
          name = '航空加油站加油栓动态检测记录'
          break
        case 8:
          // 航空加油站阀井月检查记录
          name = '航空加油站阀井月检查记录'
          break
        default:
          break
      }
      return name
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

