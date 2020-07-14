<template>
  <div style="padding-top: 20px;">
    <div
      v-for="(table, idx) in tableList"
      :key="idx"
      style="margin-bottom: 30px;"
    >
      <el-button type="primary" :size="$btnSize" @click="handlePrint(idx)">{{ mylang.print }}</el-button>
      <table :id="`print-table-${idx}`" class="print-table small-width" align="center" cellspacing="0" cellpadding="0">
        <caption>{{ tableName }}</caption>
        <tbody>
          <tr>
            <th :colspan="4">{{ table.area_1_name }}</th>
            <th :colspan="4">{{ table.area_2_name }}</th>
          </tr>
          <tr>
            <th>检查项</th>
            <th>合格</th>
            <th>不合格</th>
            <th>处置</th>
            <th>检查项</th>
            <th>合格</th>
            <th>不合格</th>
            <th>处置</th>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>闸阀</td>
            <td>{{ getName(table.area1_gate_valve) }}</td>
            <td>{{ getName2(table.area1_gate_valve) }}</td>
            <td>{{ table.area1_gate_valve_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>闸阀</td>
            <td>{{ getName(table.area2_gate_valve) }}</td>
            <td>{{ getName2(table.area2_gate_valve) }}</td>
            <td>{{ table.area2_gate_valve_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>稳压阀</td>
            <td>{{ getName(table.area1_sustaining_valve) }}</td>
            <td>{{ getName2(table.area1_sustaining_valve) }}</td>
            <td>{{ table.area1_sustaining_valve_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>稳压阀</td>
            <td>{{ getName(table.area2_sustaining_valve) }}</td>
            <td>{{ getName2(table.area2_sustaining_valve) }}</td>
            <td>{{ table.area2_sustaining_valve_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>10#过滤器</td>
            <td>{{ getName(table.area1_ten_filter) }}</td>
            <td>{{ getName2(table.area1_ten_filter) }}</td>
            <td>{{ table.area1_ten_filter_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>11#过滤器</td>
            <td>{{ getName(table.area2_ten_filter) }}</td>
            <td>{{ getName2(table.area2_ten_filter) }}</td>
            <td>{{ table.area2_ten_filter_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>压力表</td>
            <td>{{ getName(table.area1_pressure_gauge) }}</td>
            <td>{{ getName2(table.area1_pressure_gauge) }}</td>
            <td>{{ table.area1_pressure_gauge_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>压力表</td>
            <td>{{ getName(table.area2_pressure_gauge) }}</td>
            <td>{{ getName2(table.area2_pressure_gauge) }}</td>
            <td>{{ table.area2_pressure_gauge_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>泄压阀</td>
            <td>{{ getName(table.area1_pressure_relief_valve) }}</td>
            <td>{{ getName2(table.area1_pressure_relief_valve) }}</td>
            <td>{{ table.area1_pressure_relief_valve_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>泄压阀</td>
            <td>{{ getName(table.area2_pressure_relief_valve) }}</td>
            <td>{{ getName2(table.area2_pressure_relief_valve) }}</td>
            <td>{{ table.area2_pressure_relief_valve_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>自动排气阀</td>
            <td>{{ getName(table.area1_auto_exhaust_valve) }}</td>
            <td>{{ getName2(table.area1_auto_exhaust_valve) }}</td>
            <td>{{ table.area1_auto_exhaust_valve_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>自动排气阀</td>
            <td>{{ getName(table.area2_auto_exhaust_valve) }}</td>
            <td>{{ getName2(table.area2_auto_exhaust_valve) }}</td>
            <td>{{ table.area2_auto_exhaust_valve_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>压差计</td>
            <td>{{ getName(table.area1_pressure_meter) }}</td>
            <td>{{ getName2(table.area1_pressure_meter) }}</td>
            <td>{{ table.area1_pressure_meter_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>压差计</td>
            <td>{{ getName(table.area2_pressure_meter) }}</td>
            <td>{{ getName2(table.area2_pressure_meter) }}</td>
            <td>{{ table.area2_pressure_meter_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>闭路取样器</td>
            <td>{{ getName(table.area1_loop_sampler) }}</td>
            <td>{{ getName2(table.area1_loop_sampler) }}</td>
            <td>{{ table.area1_loop_sampler_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>闭路取样器</td>
            <td>{{ getName(table.area2_loop_sampler) }}</td>
            <td>{{ getName2(table.area2_loop_sampler) }}</td>
            <td>{{ table.area2_loop_sampler_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>流量计</td>
            <td>{{ getName(table.area1_flow_meter) }}</td>
            <td>{{ getName2(table.area1_flow_meter) }}</td>
            <td>{{ table.area1_flow_meter_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>流量计</td>
            <td>{{ getName(table.area2_flow_meter) }}</td>
            <td>{{ getName2(table.area2_flow_meter) }}</td>
            <td>{{ table.area2_flow_meter_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>灌油球阀</td>
            <td>{{ getName(table.area1_ball_valve) }}</td>
            <td>{{ getName2(table.area1_ball_valve) }}</td>
            <td>{{ table.area1_ball_valve_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>灌油球阀</td>
            <td>{{ getName(table.area2_ball_valve) }}</td>
            <td>{{ getName2(table.area2_ball_valve) }}</td>
            <td>{{ table.area2_ball_valve_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>加油胶管</td>
            <td>{{ getName(table.area1_refuel_hose) }}</td>
            <td>{{ getName2(table.area1_refuel_hose) }}</td>
            <td>{{ table.area1_refuel_hose_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>加油胶管</td>
            <td>{{ getName(table.area2_refuel_hose) }}</td>
            <td>{{ getName2(table.area2_refuel_hose) }}</td>
            <td>{{ table.area2_refuel_hose_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>加油接头</td>
            <td>{{ getName(table.area1_refuel_connector) }}</td>
            <td>{{ getName2(table.area1_refuel_connector) }}</td>
            <td>{{ table.area1_refuel_connector_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>加油接头</td>
            <td>{{ getName(table.area2_refuel_connector) }}</td>
            <td>{{ getName2(table.area2_refuel_connector) }}</td>
            <td>{{ table.area2_refuel_connector_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>导静电线</td>
            <td>{{ getName(table.area1_static_wire) }}</td>
            <td>{{ getName2(table.area1_static_wire) }}</td>
            <td>{{ table.area1_static_wire_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>导静电线</td>
            <td>{{ getName(table.area2_static_wire) }}</td>
            <td>{{ getName2(table.area2_static_wire) }}</td>
            <td>{{ table.area2_static_wire_text }}</td>
          </tr>
          <tr>
            <!-- 10号过滤器区域 -->
            <td>管路及连接</td>
            <td>{{ getName(table.area1_pipeline_connect) }}</td>
            <td>{{ getName2(table.area1_pipeline_connect) }}</td>
            <td>{{ table.area1_pipeline_connect_text }}</td>
            <!-- 11号过滤器区域 -->
            <td>管路及连接</td>
            <td>{{ getName(table.area2_pipeline_connect) }}</td>
            <td>{{ getName2(table.area2_pipeline_connect) }}</td>
            <td>{{ table.area2_pipeline_connect_text }}</td>
          </tr>
          <tr>
            <th :colspan="4">灌油棚区域</th>
            <th :colspan="4">计量器材箱内物品</th>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>静电释放装置</td>
            <td>{{ getName(table.area3_electrostatic_device) }}</td>
            <td>{{ getName2(table.area3_electrostatic_device) }}</td>
            <td>{{ table.area3_electrostatic_device_text }}</td>
            <!-- 计量器材箱内物品 -->
            <td>温度计</td>
            <td>{{ getName(table.area4_thermometer) }}</td>
            <td>{{ getName2(table.area4_thermometer) }}</td>
            <td>{{ table.area4_thermometer_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>灭火器</td>
            <td>{{ getName(table.area3_fire_extinguisher) }}</td>
            <td>{{ getName2(table.area3_fire_extinguisher) }}</td>
            <td>{{ table.area3_fire_extinguisher_text }}</td>
            <!-- 计量器材箱内物品 -->
            <td>密度计</td>
            <td>{{ getName(table.area4_densimeter) }}</td>
            <td>{{ getName2(table.area4_densimeter) }}</td>
            <td>{{ table.area4_densimeter_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>灭火毯</td>
            <td>{{ getName(table.area3_fire_blanket) }}</td>
            <td>{{ getName2(table.area3_fire_blanket) }}</td>
            <td>{{ table.area3_fire_blanket_text }}</td>
            <!-- 计量器材箱内物品 -->
            <td>电子温密仪</td>
            <td>{{ getName(table.area4_electronic_thermometer) }}</td>
            <td>{{ getName2(table.area4_electronic_thermometer) }}</td>
            <td>{{ table.area4_electronic_thermometer_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>消防沙箱</td>
            <td>{{ getName(table.area3_fire_sandbox) }}</td>
            <td>{{ getName2(table.area3_fire_sandbox) }}</td>
            <td>{{ table.area3_fire_sandbox_text }}</td>
            <!-- 计量器材箱内物品 -->
            <td>量筒</td>
            <td>{{ getName(table.area4_cylinder) }}</td>
            <td>{{ getName2(table.area4_cylinder) }}</td>
            <td>{{ table.area4_cylinder_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>消防锹</td>
            <td>{{ getName(table.area3_fire_shovel) }}</td>
            <td>{{ getName2(table.area3_fire_shovel) }}</td>
            <td>{{ table.area3_fire_shovel_text }}</td>
            <!-- 计量器材箱内物品 -->
            <td>油样瓶</td>
            <td>{{ getName(table.area4_oil_sample) }}</td>
            <td>{{ getName2(table.area4_oil_sample) }}</td>
            <td>{{ table.area4_oil_sample_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>有毒有害标识</td>
            <td>{{ getName(table.area3_poisonous_signs) }}</td>
            <td>{{ getName2(table.area3_poisonous_signs) }}</td>
            <td>{{ table.area3_poisonous_signs_text }}</td>
            <!-- 计量器材箱内物品 -->
            <td>测水器</td>
            <td>{{ getName(table.area4_water_gauge) }}</td>
            <td>{{ getName2(table.area4_water_gauge) }}</td>
            <td>{{ table.area4_water_gauge_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>易燃物标识</td>
            <td>{{ getName(table.area3_combustibles_signs) }}</td>
            <td>{{ getName2(table.area3_combustibles_signs) }}</td>
            <td>{{ table.area3_combustibles_signs_text }}</td>
            <!-- 计量器材箱内物品 -->
            <td>针筒</td>
            <td>{{ getName(table.area4_syringe) }}</td>
            <td>{{ getName2(table.area4_syringe) }}</td>
            <td>{{ table.area4_syringe_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>作业警示牌</td>
            <td>{{ getName(table.area3_operation_signs) }}</td>
            <td>{{ getName2(table.area3_operation_signs) }}</td>
            <td>{{ table.area3_operation_signs_text }}</td>
            <!-- 油品质量 -->
            <th colspan="4" rowspan="2">油品质量</th>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>灌油棚照明</td>
            <td>{{ getName(table.area3_lighting) }}</td>
            <td>{{ getName2(table.area3_lighting) }}</td>
            <td>{{ table.area3_lighting_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>废弃物回收桶</td>
            <td>{{ getName(table.area3_recycle_bucket) }}</td>
            <td>{{ getName2(table.area3_recycle_bucket) }}</td>
            <td>{{ table.area3_recycle_bucket_text }}</td>
            <!-- 油品质量 -->
            <td>检查项</td>
            <td>合格</td>
            <td>不合格</td>
            <td>处置</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>零位罐油高</td>
            <td>{{ getName(table.area3_zero_position) }}</td>
            <td>{{ getName2(table.area3_zero_position) }}</td>
            <td>{{ table.area3_zero_position_text }}</td>
            <!-- 油品质量 -->
            <td>10#过滤器</td>
            <td>{{ getName(table.area5_ten_filter) }}</td>
            <td>{{ getName2(table.area5_ten_filter) }}</td>
            <td>{{ table.area5_ten_filter_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>集油箱油高</td>
            <td>{{ getName(table.area3_high_oil) }}</td>
            <td>{{ getName2(table.area3_high_oil) }}</td>
            <td>{{ table.area3_high_oil_text }}</td>
            <!-- 油品质量 -->
            <td>11#过滤器</td>
            <td>{{ getName(table.area5_eleven_filter) }}</td>
            <td>{{ getName2(table.area5_eleven_filter) }}</td>
            <td>{{ table.area5_eleven_filter_text }}</td>
          </tr>
          <tr>
            <!-- 灌油棚区域 -->
            <td>铅封</td>
            <td>{{ getName(table.area3_lead_seal) }}</td>
            <td>{{ getName2(table.area3_lead_seal) }}</td>
            <td>{{ table.area3_lead_seal_text }}</td>
            <!-- 油品质量 -->
            <td>集油箱</td>
            <td>{{ getName(table.area5_oil_tank) }}</td>
            <td>{{ getName2(table.area5_oil_tank) }}</td>
            <td>{{ table.area5_oil_tank_text }}</td>
          </tr>
          <tr>
            <td class="all-col" colspan="5" style="border-right:none;">说明：完好打“√”，有故障或异常打“Χ”并在处置栏内注明原因及处理情况</td>
            <td class="all-col" colspan="3" style="border-left:none;">检查人：{{ item.check_member }} {{ item.check_time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
      tableList: []
    //   checkMember: '',
    //   checkTime: ''
      // abnormalDeal: '',
      // remark: ''
    }
  },
  created() {
    this.getDetail()
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
          this.tableList = data.list.map(v => {
            const form = {
              check_member: v.check_member,
              check_time: v.check_time
            }
            if (data.area_1_value) {
              const area = JSON.parse(data.area_1_value)
              for (const k in area) {
                form[k] = area[k]
              }
            }
            if (data.area_2_value) {
              const area = JSON.parse(data.area_2_value)
              for (const k in area) {
                form[k] = area[k]
              }
            }
            if (data.area_3_value) {
              const area = JSON.parse(data.area_3_value)
              for (const k in area) {
                form[k] = area[k]
              }
            }
            if (data.area_4_value) {
              const area = JSON.parse(data.area_4_value)
              for (const k in area) {
                form[k] = area[k]
              }
            }
            if (data.area_5_value) {
              const area = JSON.parse(data.area_5_value)
              for (const k in area) {
                form[k] = area[k]
              }
            }
            return form
          })
          // this.abnormalDeal = data.abnormal_deal
          // this.remark = data.remark
        //   this.checkMember = data.check_member
        //   this.checkTime = data.check_time
        }
      } catch (error) {
        console.log(error)
      }
    },
    handlePrint(idx) {
      print({
        printable: 'print-table-' + idx,
        type: 'html',
        maxWidth: 1092,
        style: '@media print{@page {size:landscape;margin:0;}}',
        targetStyles: ['*']
      })
    },
    getName(type) {
      //   return +type === 1 ? '✔' : (type || '')
      return +type === 1 ? '✔' : ''
    },
    getName2(type) {
      return +type !== 1 ? '×' : ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
