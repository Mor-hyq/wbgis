<template>
  <div style="padding-top: 20px;">
    <el-button type="primary" :size="$btnSize" @click="handlePrint">{{ mylang.print }}</el-button>
    <table id="print-table" class="print-table" align="center" cellspacing="0" cellpadding="0">
      <caption>{{ tableName }}</caption>
      <tbody>
        <tr>
          <th rowspan="2">机坪低点排水区域</th>
          <th colspan="3">目视</th>
          <th colspan="2">化学测水器</th>
          <th rowspan="2">处理过程</th>
          <th colspan="2">目视结论</th>
          <th rowspan="2">检查人员</th>
          <th rowspan="2">检查日期</th>
        </tr>
        <tr>
          <th>清澈透明</th>
          <th>少量水分杂质</th>
          <th>大量水份杂质</th>
          <th>不变色</th>
          <th>变色</th>
          <th>合格</th>
          <th>不合格</th>
        </tr>
        <tr>
          <!-- 机坪低点排水区域 -->
          <td>fjdkls</td>
          <!-- 目视  清澈透明-->
          <td>✔</td>
          <!-- 目视  少量水分杂质-->
          <td />
          <!-- 目视  大量水份杂质-->
          <td />
          <!-- 化学测水器 不变色-->
          <td />
          <!-- 化学测水器 变色-->
          <td>✔</td>
          <!-- 处理过程 -->
          <td>阀井大开杀戒菲菲姐</td>
          <!-- 目视结论 合格-->
          <td>✔</td>
          <!-- 目视结论 不合格-->
          <td>✔</td>
          <!-- 检查人员 -->
          <td>张三</td>
          <!-- 检查日期 -->
          <td>20201012</td>
        </tr>
        <tr
          v-for="(list, index) in tableList"
          :key="index"
        >
          <!-- 编号 -->
          <td>{{ list.asset_code }}</td>
          <!-- 阀室/阀门 -->
          <td>{{ getName(list.valve) }}</td>
          <!-- 渗漏 -->
          <td>{{ getName(list.leakage) }}</td>
          <!-- 积水/油 -->
          <td>{{ getName(list.stag_water) }}</td>
          <!-- 洁净 -->
          <td>{{ getName(list.clean) }}</td>
          <!-- 井盖 -->
          <td>{{ getName(list.cover) }}</td>
          <!-- 检查日期 -->
          <td>{{ list.check_time }}</td>
          <!-- 检查人 -->
          <td>{{ list.check_member }}</td>
        </tr>
        <tr>
          <td class="all-col" colspan="11">异常处理：<div v-html="abnormalDeal" /></td>
        </tr>
        <tr>
          <td class="all-col" colspan="11">备注：<div v-html="remark" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  getEquipmentMatainDetail
} from '@/api/inspection'
import print from 'print-js'

export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    peid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      tableName: '',
      tableList: [],
      abnormalDeal: '',
      remark: '检查正常打“√”，异常情况文字说明。'
    }
  },
  created() {
    // this.getDetail()
  },
  methods: {
    async getDetail() {
      try {
        const { code, data } = await getEquipmentMatainDetail({
          id: this.id,
          period: this.peid
        })
        if (code === 200) {
          this.tableName = data.title
          this.tableList = data.list
          this.abnormalDeal = data.abnormal_deal
          this.remark = data.remark
        }
      } catch (error) {
        console.log(error)
      }
    },
    handlePrint() {
      print({
        printable: 'print-table',
        type: 'html',
        maxWidth: 1092,
        style: '@media print{@page {size:landscape}}',
        targetStyles: ['*']
      })
      // print({
      //   printable: 'print-table',
      //   type: 'html',
      //   maxWidth: 1092,
      //   scanStyles: false,
      //   // style: tcss,
      //   css: 'http://plane.leizikeji.top/table-css/ddpscy.css'
      //   // style: dcss
      //   // targetStyles: ['*']
      //   // header: '',
      //   // style: '@media print{@page {size:landscape}}'
      // })
    },
    getName(type) {
      return +type === 1 ? '√' : type
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
