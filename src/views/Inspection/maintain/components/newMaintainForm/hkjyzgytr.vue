<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="isRead ? {} :formRules"
      label-suffix=":"
      :size="$btnSize"
      class="custom-class"
      :disabled="isRead"
      label-width="100px"
    >
      <el-row :gutter="5">
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentType"
          >{{ eqType || form.equipment_name }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentName"
          >{{ eqName || form.asset_name }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="mylang.equipmentNumber"
          >{{ eqNum || form.code }}</el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10">
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
        <el-col :span="10">
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
      <!-- 区域1 -->
      <el-divider content-position="left" />
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item
            prop="area_1_name"
            label="区域名称"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area_1_name"
              clearable
            />
            <span v-else class="read">{{ form.area_1_name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_gate_valve"
            label="闸阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_gate_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_gate_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_gate_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_gate_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_sustaining_valve"
            label="稳压阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_sustaining_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_sustaining_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_sustaining_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_sustaining_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_ten_filter"
            label="10#过滤器"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_ten_filter">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_ten_filter_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_ten_filter_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_ten_filter_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_pressure_gauge"
            label="压力表"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_pressure_gauge">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_pressure_gauge_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_pressure_gauge_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_pressure_gauge_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_pressure_relief_valve"
            label="泄压阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_pressure_relief_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_pressure_relief_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_pressure_relief_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_pressure_relief_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_auto_exhaust_valve"
            label="自动排气阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_auto_exhaust_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_auto_exhaust_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_auto_exhaust_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_auto_exhaust_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_pressure_meter"
            label="压差计"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_pressure_meter">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_pressure_meter_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_pressure_meter_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_pressure_meter_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_loop_sampler"
            label="闭路取样器"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_loop_sampler">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_loop_sampler_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_loop_sampler_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_loop_sampler_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_flow_meter"
            label="流量计"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_flow_meter">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_flow_meter_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_flow_meter_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_flow_meter_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_ball_valve"
            label="灌油球阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_ball_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_ball_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_ball_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_ball_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_refuel_hose"
            label="加油胶管"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_refuel_hose">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_refuel_hose_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_refuel_hose_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_refuel_hose_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_refuel_connector"
            label="加油接头"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_refuel_connector">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_refuel_connector_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_refuel_connector_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_refuel_connector_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_static_wire"
            label="导静电线"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_static_wire">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_static_wire_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_static_wire_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_static_wire_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area1_pipeline_connect"
            label="管路及连接"
            label-width="120px"
          >
            <el-radio-group v-model="form.area1_pipeline_connect">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area1_pipeline_connect_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area1_pipeline_connect_text"
              clearable
            />
            <span v-else class="read">{{ form.area1_pipeline_connect_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 区域2 -->
      <el-divider content-position="left" />
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item
            prop="area_2_name"
            label="区域名称"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area_2_name"
              clearable
            />
            <span v-else class="read">{{ form.area_2_name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_gate_valve"
            label="闸阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_gate_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_gate_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_gate_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_gate_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_sustaining_valve"
            label="稳压阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_sustaining_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_sustaining_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_sustaining_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_sustaining_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_ten_filter"
            label="10#过滤器"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_ten_filter">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_ten_filter_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_ten_filter_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_ten_filter_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_pressure_gauge"
            label="压力表"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_pressure_gauge">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_pressure_gauge_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_pressure_gauge_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_pressure_gauge_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_pressure_relief_valve"
            label="泄压阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_pressure_relief_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_pressure_relief_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_pressure_relief_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_pressure_relief_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_auto_exhaust_valve"
            label="自动排气阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_auto_exhaust_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_auto_exhaust_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_auto_exhaust_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_auto_exhaust_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_pressure_meter"
            label="压差计"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_pressure_meter">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_pressure_meter_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_pressure_meter_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_pressure_meter_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_loop_sampler"
            label="闭路取样器"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_loop_sampler">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_loop_sampler_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_loop_sampler_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_loop_sampler_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_flow_meter"
            label="流量计"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_flow_meter">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_flow_meter_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_flow_meter_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_flow_meter_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_ball_valve"
            label="灌油球阀"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_ball_valve">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_ball_valve_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_ball_valve_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_ball_valve_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_refuel_hose"
            label="加油胶管"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_refuel_hose">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_refuel_hose_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_refuel_hose_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_refuel_hose_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_refuel_connector"
            label="加油接头"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_refuel_connector">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_refuel_connector_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_refuel_connector_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_refuel_connector_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_static_wire"
            label="导静电线"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_static_wire">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_static_wire_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_static_wire_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_static_wire_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area2_pipeline_connect"
            label="管路及连接"
            label-width="120px"
          >
            <el-radio-group v-model="form.area2_pipeline_connect">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area2_pipeline_connect_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area2_pipeline_connect_text"
              clearable
            />
            <span v-else class="read">{{ form.area2_pipeline_connect_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 区域3 -->
      <el-divider content-position="left" />
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item
            prop="area_3_name"
            label="区域名称"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area_3_name"
              clearable
            />
            <span v-else class="read">{{ form.area_3_name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_electrostatic_device"
            label="静电释放装置"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_electrostatic_device">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_electrostatic_device_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_electrostatic_device_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_electrostatic_device_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_fire_extinguisher"
            label="灭火器"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_fire_extinguisher">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_fire_extinguisher_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_fire_extinguisher_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_fire_extinguisher_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_fire_blanket"
            label="灭火毯"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_fire_blanket">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_fire_blanket_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_fire_blanket_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_fire_blanket_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_fire_sandbox"
            label="消防沙箱"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_fire_sandbox">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_fire_sandbox_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_fire_sandbox_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_fire_sandbox_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_fire_shovel"
            label="消防锹"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_fire_shovel">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_fire_shovel_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_fire_shovel_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_fire_shovel_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_poisonous_signs"
            label="有毒有害标识"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_poisonous_signs">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_poisonous_signs_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_poisonous_signs_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_poisonous_signs_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_combustibles_signs"
            label="易燃物标识"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_combustibles_signs">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_combustibles_signs_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_combustibles_signs_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_combustibles_signs_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_operation_signs"
            label="作业警示牌"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_operation_signs">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_operation_signs_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_operation_signs_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_operation_signs_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_lighting"
            label="灌油棚照明"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_lighting">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_lighting_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_lighting_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_lighting_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_recycle_bucket"
            label="废弃物回收桶"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_recycle_bucket">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_recycle_bucket_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_recycle_bucket_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_recycle_bucket_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_zero_position"
            label="零位罐油高"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_zero_position">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_zero_position_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_zero_position_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_zero_position_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_high_oil"
            label="集油箱油高"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_high_oil">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_high_oil_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_high_oil_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_high_oil_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area3_lead_seal"
            label="铅封"
            label-width="120px"
          >
            <el-radio-group v-model="form.area3_lead_seal">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area3_lead_seal_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area3_lead_seal_text"
              clearable
            />
            <span v-else class="read">{{ form.area3_lead_seal_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 区域4 -->
      <el-divider content-position="left" />
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item
            prop="area_4_name"
            label="区域名称"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area_4_name"
              clearable
            />
            <span v-else class="read">{{ form.area_4_name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area4_thermometer"
            label="温度计"
            label-width="120px"
          >
            <el-radio-group v-model="form.area4_thermometer">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area4_thermometer_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area4_thermometer_text"
              clearable
            />
            <span v-else class="read">{{ form.area4_thermometer_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area4_densimeter"
            label="密度计"
            label-width="120px"
          >
            <el-radio-group v-model="form.area4_densimeter">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area4_densimeter_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area4_densimeter_text"
              clearable
            />
            <span v-else class="read">{{ form.area4_densimeter_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area4_electronic_thermometer"
            label="电子温密仪"
            label-width="120px"
          >
            <el-radio-group v-model="form.area4_electronic_thermometer">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area4_electronic_thermometer_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area4_electronic_thermometer_text"
              clearable
            />
            <span v-else class="read">{{ form.area4_electronic_thermometer_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area4_cylinder"
            label="量筒"
            label-width="120px"
          >
            <el-radio-group v-model="form.area4_cylinder">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area4_cylinder_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area4_cylinder_text"
              clearable
            />
            <span v-else class="read">{{ form.area4_cylinder_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area4_oil_sample"
            label="油样瓶"
            label-width="120px"
          >
            <el-radio-group v-model="form.area4_oil_sample">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area4_oil_sample_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area4_oil_sample_text"
              clearable
            />
            <span v-else class="read">{{ form.area4_oil_sample_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area4_water_gauge"
            label="测水器"
            label-width="120px"
          >
            <el-radio-group v-model="form.area4_water_gauge">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area4_water_gauge_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area4_water_gauge_text"
              clearable
            />
            <span v-else class="read">{{ form.area4_water_gauge_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area4_syringe"
            label="针筒"
            label-width="120px"
          >
            <el-radio-group v-model="form.area4_syringe">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area4_syringe_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area4_syringe_text"
              clearable
            />
            <span v-else class="read">{{ form.area4_syringe_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 区域5 -->
      <el-divider content-position="left" />
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item
            prop="area_5_name"
            label="区域名称"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area_5_name"
              clearable
            />
            <span v-else class="read">{{ form.area_5_name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area5_ten_filter"
            label="10#过滤器"
            label-width="120px"
          >
            <el-radio-group v-model="form.area5_ten_filter">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area5_ten_filter_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area5_ten_filter_text"
              clearable
            />
            <span v-else class="read">{{ form.area5_ten_filter_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area5_eleven_filter"
            label="11#过滤器"
            label-width="120px"
          >
            <el-radio-group v-model="form.area5_eleven_filter">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area5_eleven_filter_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area5_eleven_filter_text"
              clearable
            />
            <span v-else class="read">{{ form.area5_eleven_filter_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5" class="custom-row">
        <el-col :span="10">
          <el-form-item
            prop="area5_oil_tank"
            label="集油箱"
            label-width="120px"
          >
            <el-radio-group v-model="form.area5_oil_tank">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">异常</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item
            prop="area5_oil_tank_text"
            label="处置"
            label-width="50px"
          >
            <el-input
              v-if="!isRead"
              v-model="form.area5_oil_tank_text"
              clearable
            />
            <span v-else class="read">{{ form.area5_oil_tank_text }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  saveMaintainRegister,
  getMaintainRegisterDetail
} from '@/api/inspection'
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
    },
    eqId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    const nameRule = [
      { required: true, message: '请填写区域名称' }
    ]
    const chooseRule = [
      { required: true, message: '请选择' }
    ]
    return {
      form: {
        check_mid: '',
        check_time: '',
        area_1_name: '10号过滤器区域',
        area1_gate_valve: 1,
        area1_gate_valve_text: '',
        area1_sustaining_valve: 1,
        area1_sustaining_valve_text: '',
        area1_ten_filter: 1,
        area1_ten_filter_text: '',
        area1_pressure_gauge: 1,
        area1_pressure_gauge_text: '',
        area1_pressure_relief_valve: 1,
        area1_pressure_relief_valve_text: '',
        area1_auto_exhaust_valve: 1,
        area1_auto_exhaust_valve_text: '',
        area1_pressure_meter: 1,
        area1_pressure_meter_text: '',
        area1_loop_sampler: 1,
        area1_loop_sampler_text: '',
        area1_flow_meter: 1,
        area1_flow_meter_text: '',
        area1_ball_valve: 1,
        area1_ball_valve_text: '',
        area1_refuel_hose: 1,
        area1_refuel_hose_text: '',
        area1_refuel_connector: 1,
        area1_refuel_connector_text: '',
        area1_static_wire: 1,
        area1_static_wire_text: '',
        area1_pipeline_connect: 1,
        area1_pipeline_connect_text: '',
        area_2_name: '11号过滤器区域',
        area2_gate_valve: 1,
        area2_gate_valve_text: '',
        area2_sustaining_valve: 1,
        area2_sustaining_valve_text: '',
        area2_ten_filter: 1,
        area2_ten_filter_text: '',
        area2_pressure_gauge: 1,
        area2_pressure_gauge_text: '',
        area2_pressure_relief_valve: 1,
        area2_pressure_relief_valve_text: '',
        area2_auto_exhaust_valve: 1,
        area2_auto_exhaust_valve_text: '',
        area2_pressure_meter: 1,
        area2_pressure_meter_text: '',
        area2_loop_sampler: 1,
        area2_loop_sampler_text: '',
        area2_flow_meter: 1,
        area2_flow_meter_text: '',
        area2_ball_valve: 1,
        area2_ball_valve_text: '',
        area2_refuel_hose: 1,
        area2_refuel_hose_text: '',
        area2_refuel_connector: 1,
        area2_refuel_connector_text: '',
        area2_static_wire: 1,
        area2_static_wire_text: '',
        area2_pipeline_connect: 1,
        area2_pipeline_connect_text: '',
        area_3_name: '灌油棚区域',
        area3_electrostatic_device: 1,
        area3_electrostatic_device_text: '',
        area3_fire_extinguisher: 1,
        area3_fire_extinguisher_text: '',
        area3_fire_blanket: 1,
        area3_fire_blanket_text: '',
        area3_fire_sandbox: 1,
        area3_fire_sandbox_text: '',
        area3_fire_shovel: 1,
        area3_fire_shovel_text: '',
        area3_poisonous_signs: 1,
        area3_poisonous_signs_text: '',
        area3_combustibles_signs: 1,
        area3_combustibles_signs_text: '',
        area3_operation_signs: 1,
        area3_operation_signs_text: '',
        area3_lighting: 1,
        area3_lighting_text: '',
        area3_recycle_bucket: 1,
        area3_recycle_bucket_text: '',
        area3_zero_position: 1,
        area3_zero_position_text: '',
        area3_high_oil: 1,
        area3_high_oil_text: '',
        area3_lead_seal: 1,
        area3_lead_seal_text: '',
        area_4_name: '计量器材箱内物品',
        area4_thermometer: 1,
        area4_thermometer_text: '',
        area4_densimeter: 1,
        area4_densimeter_text: '',
        area4_electronic_thermometer: 1,
        area4_electronic_thermometer_text: '',
        area4_cylinder: 1,
        area4_cylinder_text: '',
        area4_oil_sample: 1,
        area4_oil_sample_text: '',
        area4_water_gauge: 1,
        area4_water_gauge_text: '',
        area4_syringe: 1,
        area4_syringe_text: '',
        area_5_name: '油品质量',
        area5_ten_filter: 1,
        area5_ten_filter_text: '',
        area5_eleven_filter: 1,
        area5_eleven_filter_text: '',
        area5_oil_tank: 1,
        area5_oil_tank_text: ''
      },
      formRules: {
        check_mid: [
          { required: true, message: '请选择检查人员' }
        ],
        check_time: [
          { required: true, message: '请选择维护时间' }
        ],
        area_1_name: nameRule,
        area_2_name: nameRule,
        area_3_name: nameRule,
        area_4_name: nameRule,
        area_5_name: nameRule,
        area1_gate_valve: chooseRule,
        area1_sustaining_valve: chooseRule,
        area1_ten_filter: chooseRule,
        area1_pressure_gauge: chooseRule,
        area1_pressure_relief_valve: chooseRule,
        area1_auto_exhaust_valve: chooseRule,
        area1_pressure_meter: chooseRule,
        area1_loop_sampler: chooseRule,
        area1_flow_meter: chooseRule,
        area1_ball_valve: chooseRule,
        area1_refuel_hose: chooseRule,
        area1_refuel_connector: chooseRule,
        area1_static_wire: chooseRule,
        area1_pipeline_connect: chooseRule,
        area2_gate_valve: chooseRule,
        area2_sustaining_valve: chooseRule,
        area2_ten_filter: chooseRule,
        area2_pressure_gauge: chooseRule,
        area2_pressure_relief_valve: chooseRule,
        area2_auto_exhaust_valve: chooseRule,
        area2_pressure_meter: chooseRule,
        area2_loop_sampler: chooseRule,
        area2_flow_meter: chooseRule,
        area2_ball_valve: chooseRule,
        area2_refuel_hose: chooseRule,
        area2_refuel_connector: chooseRule,
        area2_static_wire: chooseRule,
        area2_pipeline_connect: chooseRule,
        area3_electrostatic_device: chooseRule,
        area3_fire_extinguisher: chooseRule,
        area3_fire_blanket: chooseRule,
        area3_fire_sandbox: chooseRule,
        area3_fire_shovel: chooseRule,
        area3_poisonous_signs: chooseRule,
        area3_combustibles_signs: chooseRule,
        area3_operation_signs: chooseRule,
        area3_lighting: chooseRule,
        area3_recycle_bucket: chooseRule,
        area3_zero_position: chooseRule,
        area3_high_oil: chooseRule,
        area3_lead_seal: chooseRule,
        area4_thermometer: chooseRule,
        area4_densimeter: chooseRule,
        area4_electronic_thermometer: chooseRule,
        area4_cylinder: chooseRule,
        area4_oil_sample: chooseRule,
        area4_water_gauge: chooseRule,
        area4_syringe: chooseRule,
        area5_ten_filter: chooseRule,
        area5_eleven_filter: chooseRule,
        area5_oil_tank: chooseRule
      },
      memberOptions: []
    }
  },
  created() {
    this.getCheckMember()
  },
  mounted() {
    if (this.isRead) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      try {
        const { code, data } = await getMaintainRegisterDetail({ id: this.eqId })
        if (code === 200) {
          const form = {
            check_mid: data.check_member,
            check_time: data.check_time,
            equipment_name: data.equipment_name,
            code: data.code,
            asset_name: data.asset_name
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
          this.form = form
        }
      } catch (error) {
        console.log(error)
      }
    },
    async uploadData() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const area_1_value = {}
      const area_2_value = {}
      const area_3_value = {}
      const area_4_value = {}
      const area_5_value = {}
      for (const k in this.form) {
        if (k.indexOf('area1') >= 0) {
          if (k.lastIndexOf('_text') >= 0) {
            const key = k.split('_text')[0]
            area_1_value[k] = +this.form[key] === 1 ? '' : this.form[k]
          } else {
            area_1_value[k] = this.form[k]
          }
        }
        if (k.indexOf('area2') >= 0) {
          if (k.lastIndexOf('_text') >= 0) {
            const key = k.split('_text')[0]
            area_2_value[k] = +this.form[key] === 1 ? '' : this.form[k]
          } else {
            area_2_value[k] = this.form[k]
          }
        }
        if (k.indexOf('area3') >= 0) {
          if (k.lastIndexOf('_text') >= 0) {
            const key = k.split('_text')[0]
            area_3_value[k] = +this.form[key] === 1 ? '' : this.form[k]
          } else {
            area_3_value[k] = this.form[k]
          }
        }
        if (k.indexOf('area4') >= 0) {
          if (k.lastIndexOf('_text') >= 0) {
            const key = k.split('_text')[0]
            area_4_value[k] = +this.form[key] === 1 ? '' : this.form[k]
          } else {
            area_4_value[k] = this.form[k]
          }
        }
        if (k.indexOf('area5') >= 0) {
          if (k.lastIndexOf('_text') >= 0) {
            const key = k.split('_text')[0]
            area_5_value[k] = +this.form[key] === 1 ? '' : this.form[k]
          } else {
            area_5_value[k] = this.form[k]
          }
        }
      }
      const datas = {
        egi_period_id: this.eqId,
        check_mid: this.form.check_mid,
        check_time: this.form.check_time,
        area_1_name: this.form.area_1_name,
        area_2_name: this.form.area_2_name,
        area_3_name: this.form.area_3_name,
        area_4_name: this.form.area_4_name,
        area_5_name: this.form.area_5_name,
        area_1_value: JSON.stringify(area_1_value),
        area_2_value: JSON.stringify(area_2_value),
        area_3_value: JSON.stringify(area_3_value),
        area_4_value: JSON.stringify(area_4_value),
        area_5_value: JSON.stringify(area_5_value)
      }
      try {
        const { code } = await saveMaintainRegister(datas)
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.resetForm()
          this.$emit('success')
        }
      } catch (error) {
        console.log(error)
        loading.close()
      }
    },
    validate(cb) {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 验证通过
          this.$confirm('确定保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.uploadData()
          })
        }
      })
    },
    resetForm() {
      const form = {
        check_mid: '',
        check_time: '',
        area_1_name: '10号过滤器区域',
        area1_gate_valve: 1,
        area1_gate_valve_text: '',
        area1_sustaining_valve: 1,
        area1_sustaining_valve_text: '',
        area1_ten_filter: 1,
        area1_ten_filter_text: '',
        area1_pressure_gauge: 1,
        area1_pressure_gauge_text: '',
        area1_pressure_relief_valve: 1,
        area1_pressure_relief_valve_text: '',
        area1_auto_exhaust_valve: 1,
        area1_auto_exhaust_valve_text: '',
        area1_pressure_meter: 1,
        area1_pressure_meter_text: '',
        area1_loop_sampler: 1,
        area1_loop_sampler_text: '',
        area1_flow_meter: 1,
        area1_flow_meter_text: '',
        area1_ball_valve: 1,
        area1_ball_valve_text: '',
        area1_refuel_hose: 1,
        area1_refuel_hose_text: '',
        area1_refuel_connector: 1,
        area1_refuel_connector_text: '',
        area1_static_wire: 1,
        area1_static_wire_text: '',
        area1_pipeline_connect: 1,
        area1_pipeline_connect_text: '',
        area_2_name: '11号过滤器区域',
        area2_gate_valve: 1,
        area2_gate_valve_text: '',
        area2_sustaining_valve: 1,
        area2_sustaining_valve_text: '',
        area2_ten_filter: 1,
        area2_ten_filter_text: '',
        area2_pressure_gauge: 1,
        area2_pressure_gauge_text: '',
        area2_pressure_relief_valve: 1,
        area2_pressure_relief_valve_text: '',
        area2_auto_exhaust_valve: 1,
        area2_auto_exhaust_valve_text: '',
        area2_pressure_meter: 1,
        area2_pressure_meter_text: '',
        area2_loop_sampler: 1,
        area2_loop_sampler_text: '',
        area2_flow_meter: 1,
        area2_flow_meter_text: '',
        area2_ball_valve: 1,
        area2_ball_valve_text: '',
        area2_refuel_hose: 1,
        area2_refuel_hose_text: '',
        area2_refuel_connector: 1,
        area2_refuel_connector_text: '',
        area2_static_wire: 1,
        area2_static_wire_text: '',
        area2_pipeline_connect: 1,
        area2_pipeline_connect_text: '',
        area_3_name: '灌油棚区域',
        area3_electrostatic_device: 1,
        area3_electrostatic_device_text: '',
        area3_fire_extinguisher: 1,
        area3_fire_extinguisher_text: '',
        area3_fire_blanket: 1,
        area3_fire_blanket_text: '',
        area3_fire_sandbox: 1,
        area3_fire_sandbox_text: '',
        area3_fire_shovel: 1,
        area3_fire_shovel_text: '',
        area3_poisonous_signs: 1,
        area3_poisonous_signs_text: '',
        area3_combustibles_signs: 1,
        area3_combustibles_signs_text: '',
        area3_operation_signs: 1,
        area3_operation_signs_text: '',
        area3_lighting: 1,
        area3_lighting_text: '',
        area3_recycle_bucket: 1,
        area3_recycle_bucket_text: '',
        area3_zero_position: 1,
        area3_zero_position_text: '',
        area3_high_oil: 1,
        area3_high_oil_text: '',
        area3_lead_seal: 1,
        area3_lead_seal_text: '',
        area_4_name: '计量器材箱内物品',
        area4_thermometer: 1,
        area4_thermometer_text: '',
        area4_densimeter: 1,
        area4_densimeter_text: '',
        area4_electronic_thermometer: 1,
        area4_electronic_thermometer_text: '',
        area4_cylinder: 1,
        area4_cylinder_text: '',
        area4_oil_sample: 1,
        area4_oil_sample_text: '',
        area4_syringe: 1,
        area4_syringe_text: '',
        area_5_name: '油品质量',
        area5_ten_filter: 1,
        area5_ten_filter_text: '',
        area5_eleven_filter: 1,
        area5_eleven_filter_text: '',
        area5_oil_tank: 1,
        area5_oil_tank_text: ''
      }
      this.form = form
      // this.$nextTick(() => {
      //   this.$refs.form.clearValidate()
      // })
    },
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
.custom-row {
  padding-left: 50px;
}
</style>
