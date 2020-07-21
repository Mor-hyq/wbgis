<template>
  <div style="padding-top: 20px;">
    <div
      v-for="(table, idx) in tableList"
      :key="idx"
      style="margin-bottom: 30px;"
    >
      <el-button type="primary" :size="$btnSize" @click="handlePrint(idx)">{{ mylang.print }}</el-button>
      <table :id="`print-table-${idx}`" class="print-table" align="center" cellspacing="0" cellpadding="0">
        <caption>{{ tableName }}</caption>
        <tbody>
          <tr>
            <td style="width:80px;">车号</td>
            <td colspan="24" style="text-align:left;">{{ table.car_type }}</td>
          </tr>
          <tr>
            <td>项目</td>
            <td colspan="12">车辆底盘设备</td>
            <td colspan="12">车辆上装设备</td>
          </tr>
          <tr>
            <td>检查内容</td>
            <td>燃油</td>
            <td>机油</td>
            <td>冷却水</td>
            <td>灯光</td>
            <td>制动</td>
            <td>转向</td>
            <td>轮胎</td>
            <td>液压油</td>
            <td>渗漏</td>
            <td>异响</td>
            <td>阀门</td>
            <td>联锁</td>
            <td>呆德曼</td>
            <td>接头</td>
            <td>胶管</td>
            <td>导电线及拖线胶带</td>
            <td>过滤器</td>
            <td>铅封</td>
            <td>车载监控</td>
            <td>熄火装置</td>
            <td>限高装置</td>
            <td>液压装置</td>
            <td>渗漏</td>
            <td>防撞</td>
          </tr>
          <tr>
            <td>检查结果</td>
            <!-- 燃油 -->
            <td>{{ getName(table.chass_equipment_fuel, table.chass_equipment_fuel_text) }}</td>
            <!-- 机油 -->
            <td>{{ getName(table.chass_equipment_oil, table.chass_equipment_oil_text) }}</td>
            <!-- 冷却水 -->
            <td>{{ getName(table.chass_equipment_cool_water, table.chass_equipment_cool_water_text) }}</td>
            <!-- 灯光 -->
            <td>{{ getName(table.chass_equipment_light, table.chass_equipment_light_text) }}</td>
            <!-- 制动 -->
            <td>{{ getName(table.chass_equipment_brake, table.chass_equipment_brake_text) }}</td>
            <!-- 转向 -->
            <td>{{ getName(table.chass_equipment_turn, table.chass_equipment_turn_text) }}</td>
            <!-- 轮胎 -->
            <td>{{ getName(table.chass_equipment_tyre, table.chass_equipment_tyre_text) }}</td>
            <!-- 液压油 -->
            <td>{{ getName(table.chass_equipment_hydraulic_oil, table.chass_equipment_hydraulic_oil_text) }}</td>
            <!-- 渗漏 -->
            <td>{{ getName(table.chass_equipment_leakage, table.chass_equipment_leakage_text) }}</td>
            <!-- 异响 -->
            <td>{{ getName(table.chass_equipment_noise, table.chass_equipment_noise_text) }}</td>
            <!-- 阀门 -->
            <td>{{ getName(table.body_equipment_valve, table.body_equipment_valve_text) }}</td>
            <!-- 联锁 -->
            <td>{{ getName(table.body_equipment_interlock, table.body_equipment_interlock_text) }}</td>
            <!-- 呆德曼 -->
            <td>{{ getName(table.body_equipment_deadman, table.body_equipment_deadman_text) }}</td>
            <!-- 接头 -->
            <td>{{ getName(table.body_equipment_connector, table.body_equipment_connector_text) }}</td>
            <!-- 胶管 -->
            <td>{{ getName(table.body_equipment_hose, table.body_equipment_hose_text) }}</td>
            <!-- 导电线及拖线胶带 -->
            <td>{{ getName(table.body_equipment_tow_line, table.body_equipment_tow_line_text) }}</td>
            <!-- 过滤器 -->
            <td>{{ getName(table.body_equipment_filter, table.body_equipment_filter_text) }}</td>
            <!-- 铅封 -->
            <td>{{ getName(table.body_equipment_lead_seal, table.body_equipment_lead_seal_text) }}</td>
            <!-- 车载监控 -->
            <td>{{ getName(table.body_equipment_car_monitoring, table.body_equipment_car_monitoring_text) }}</td>
            <!-- 熄火装置 -->
            <td>{{ getName(table.body_equipment_flameout_device, table.body_equipment_flameout_device_text) }}</td>
            <!-- 限高装置 -->
            <td>{{ getName(table.body_equipment_height_limit, table.body_equipment_height_limit_text) }}</td>
            <!-- 液压装置 -->
            <td>{{ getName(table.body_equipment_hydraulic_device, table.body_equipment_hydraulic_device_text) }}</td>
            <!-- 渗漏 -->
            <td>{{ getName(table.body_equipment_leakage, table.body_equipment_leakage_text) }}</td>
            <!-- 防撞 -->
            <td>{{ getName(table.body_equipment_anticollision, table.body_equipment_anticollision_text) }}</td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="12">{{ table.chass_equipment_remark }}</td>
            <td colspan="12">{{ table.body_equipment_remark }}</td>
          </tr>
          <tr>
            <td>项目</td>
            <td colspan="8">油品质量</td>
            <td colspan="9">随车工具</td>
            <td colspan="7">其他设备</td>
          </tr>
          <tr>
            <td>检查内容</td>
            <td colspan="2">取样器</td>
            <td colspan="2">目视情况</td>
            <td colspan="2">测水器</td>
            <td colspan="2">目视结果</td>
            <td>梯子</td>
            <td>轮档</td>
            <td>灭火器</td>
            <td>油单</td>
            <td>油样桶</td>
            <td>吸油毡</td>
            <td>测水器</td>
            <td>加油单</td>
            <td>警示装置</td>
            <td colspan="7" />
          </tr>
          <tr>
            <td rowspan="3">检查结果</td>
            <td rowspan="3" colspan="2">{{ getName(table.oil_quality_sample, table.oil_quality_sample_text) }}</td>
            <td>清澈透明</td>
            <td>{{ getName2(table.oil_quality_visual_1) }}</td>
            <td>不变色</td>
            <td>{{ getName2(table.oil_quality_water_detector_1) }}</td>
            <td rowspan="3" colspan="2">{{ table.oil_quality_visual_result }}</td>
            <td rowspan="3">{{ getName(table.vehicle_tool_ladder, table.vehicle_tool_ladder_text) }}</td>
            <td rowspan="3">{{ getName(table.vehicle_tool_wheel, table.vehicle_tool_wheel_text) }}</td>
            <td rowspan="3">{{ getName(table.vehicle_tool_fire_extinguisher, table.vehicle_tool_fire_extinguisher_text) }}</td>
            <td rowspan="3">{{ getName(table.vehicle_tool_oil_list, table.vehicle_tool_oil_list_text) }}</td>
            <td rowspan="3">{{ getName(table.vehicle_tool_oil_barrel, table.vehicle_tool_oil_barrel_text) }}</td>
            <td rowspan="3">{{ getName(table.vehicle_tool_oil_felt, table.vehicle_tool_oil_felt_text) }}</td>
            <td rowspan="3">{{ getName(table.vehicle_tool_water_detector, table.vehicle_tool_water_detector_text) }}</td>
            <td rowspan="3">{{ getName(table.vehicle_tool_oil_filling, table.vehicle_tool_oil_filling_text) }}</td>
            <td rowspan="3">{{ getName(table.vehicle_tool_warning_device, table.vehicle_tool_warning_device_text) }}</td>
            <td rowspan="3" colspan="7" style="text-align:left;vertical-align:top;">
              <p v-if="table.other_content">检查内容：{{ table.other_content }}</p>
              <p v-if="table.other_result">检查结果：{{ table.other_result }}</p>
            </td>
          </tr>

          <tr>
            <td>少量水分杂质</td>
            <td>{{ getName2(table.oil_quality_visual_2) }}</td>
            <td>变色</td>
            <td>{{ getName2(table.oil_quality_water_detector_2) }}</td>
          </tr>
          <tr>
            <td>大量水分杂质</td>
            <td>{{ getName2(table.oil_quality_visual_3) }}</td>
            <td />
            <td />
          </tr>
          <tr>
            <td>备注</td>
            <td class="all-col" colspan="24"><div v-html="table.remark" /></td>
          </tr>
          <tr>
            <td>说明</td>
            <!-- <td colspan="10">完好打“√”，有异常故障打“✖”并在备注栏内注明原因及处理情况</td> -->
            <td colspan="10" />
            <td colspan="2">班次</td>
            <td colspan="2">{{ table.shift }}</td>
            <td colspan="2">检查人</td>
            <td colspan="3">{{ table.check_member }}</td>
            <td colspan="5">{{ table.check_time }}</td>
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
      tableList: [],
      abnormalDeal: '',
      remark: '检查正常打“√”，异常情况文字说明。'
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
              check_time: v.check_time,
              remark: v.remark,
              shift: v.shift
            }
            if (v.chass_equipment) {
              const chass_equipment = JSON.parse(v.chass_equipment)
              for (const k in chass_equipment) {
                form[k] = chass_equipment[k]
              }
            }
            if (v.body_equipment) {
              const body_equipment = JSON.parse(v.body_equipment)
              for (const k in body_equipment) {
                form[k] = body_equipment[k]
              }
            }
            if (v.oil_quality) {
              const oil_quality = JSON.parse(v.oil_quality)

              for (const k in oil_quality) {
                if (k === 'oil_quality_visual') {
                  form[k + '_' + oil_quality[k]] = oil_quality[k]
                }
                if (k === 'oil_quality_water_detector') {
                  form[k + '_' + oil_quality[k]] = oil_quality[k]
                }
                form[k] = oil_quality[k]
              }
            }
            if (v.vehicle_tool) {
              const vehicle_tool = JSON.parse(v.vehicle_tool)
              for (const k in vehicle_tool) {
                form[k] = vehicle_tool[k]
              }
            }
            if (v.other) {
              const other = JSON.parse(v.other)
              for (const k in other) {
                form[k] = other[k]
              }
            }
            return form
          })
          this.abnormalDeal = data.abnormal_deal
          this.remark = data.remark
        }
      } catch (error) {
        console.log(error)
      }
    },
    handlePrint(idx) {
      print({
        printable: 'print-table-' + idx,
        type: 'html',
        // maxWidth: 1092,
        style: '@media print{@page {size:portrait;margin:0 auto;}}.print-table{border:1px solid #666;border-collapse:collapse;margin:0 auto}.print-table.medium-width th{width:120px}.print-table.small-width th{width:100px}.print-table caption{margin-bottom:10px;font-size: 16px;font-weight: bold;}.print-table th{width:80px}.print-table th,.print-table td{border:1px solid #666;padding:8px 5px}.print-table td{text-align:center}.print-table .all-col{text-align:left;padding:20px 10px}.print-table .all-col div{white-space:pre;padding-left:2em}.print-table .cus-tit{display:inline-block;width:30%}.print-table .cus-tit:last-child{width:40%;text-align:right}.print-table .cus-tit span{font-weight:normal;font-size:16px}'

      })
    },
    getName(type, text) {
      return +type === 1 ? '✔' : (text || '')
    },
    getName2(type) {
      return +type === 1 ? '✔' : (type || '')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
