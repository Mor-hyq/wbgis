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
        <el-col :span="16">
          <el-form-item
            :label="mylang.equipmentName"
          >{{ eqName || form.asset_name }}</el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left"><span class="t-blue">基本信息</span></el-divider>
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
            label="检查时间"
          >
            <el-date-picker
              v-model="form.check_time"
              prefix-icon="none"
              clearable
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="检查时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        :gutter="10"
      >
        <el-col :span="10">
          <el-form-item
            prop="shift"
            label="班次"
          >
            <el-input
              v-if="!isRead"
              v-model="form.shift"
              clearable
            />
            <span v-else class="read">{{ form.shift }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left"><span class="t-blue">车辆底盘设备</span></el-divider>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_fuel"
            label="燃油"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_fuel">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_fuel === 2"
                    prop="chass_equipment_fuel_text"
                  >
                    <el-input v-model="form.chass_equipment_fuel_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_fuel === 2" class="read">
                    {{ form.chass_equipment_fuel_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_oil"
            label="机油"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_oil">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_oil === 2"
                    prop="chass_equipment_oil_text"
                  >
                    <el-input v-model="form.chass_equipment_oil_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_oil === 2" class="read">
                    {{ form.chass_equipment_oil_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_cool_water"
            label="冷却水"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_cool_water">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_cool_water === 2"
                    prop="chass_equipment_cool_water_text"
                  >
                    <el-input v-model="form.chass_equipment_cool_water_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_cool_water === 2" class="read">
                    {{ form.chass_equipment_cool_water_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_light"
            label="灯光"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_light">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_light === 2"
                    prop="chass_equipment_light_text"
                  >
                    <el-input v-model="form.chass_equipment_light_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_light === 2" class="read">
                    {{ form.chass_equipment_light_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_brake"
            label="制动"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_brake">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_brake === 2"
                    prop="chass_equipment_brake_text"
                  >
                    <el-input v-model="form.chass_equipment_brake_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_brake === 2" class="read">
                    {{ form.chass_equipment_brake_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_turn"
            label="转向"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_turn">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_turn === 2"
                    prop="chass_equipment_turn_text"
                  >
                    <el-input v-model="form.chass_equipment_turn_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_turn === 2" class="read">
                    {{ form.chass_equipment_turn_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_tyre"
            label="轮胎"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_tyre">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_tyre === 2"
                    prop="chass_equipment_tyre_text"
                  >
                    <el-input v-model="form.chass_equipment_tyre_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_tyre === 2" class="read">
                    {{ form.chass_equipment_tyre_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_hydraulic_oil"
            label="液压油"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_hydraulic_oil">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_hydraulic_oil === 2"
                    prop="chass_equipment_hydraulic_oil_text"
                  >
                    <el-input v-model="form.chass_equipment_hydraulic_oil_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_hydraulic_oil === 2" class="read">
                    {{ form.chass_equipment_hydraulic_oil_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_leakage"
            label="渗漏"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_leakage">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_leakage === 2"
                    prop="chass_equipment_leakage_text"
                  >
                    <el-input v-model="form.chass_equipment_leakage_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_leakage === 2" class="read">
                    {{ form.chass_equipment_leakage_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="chass_equipment_noise"
            label="异响"
            label-width="70px"
          >
            <el-radio-group v-model="form.chass_equipment_noise">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.chass_equipment_noise === 2"
                    prop="chass_equipment_noise_text"
                  >
                    <el-input v-model="form.chass_equipment_noise_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.chass_equipment_noise === 2" class="read">
                    {{ form.chass_equipment_noise_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="chass_equipment_remark"
        label="备注"
      >
        <el-input
          v-model="form.chass_equipment_remark"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
      <el-divider content-position="left"><span class="t-blue">车辆上装设备</span></el-divider>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_valve"
            label="阀门"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_valve">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_valve === 2"
                    prop="body_equipment_valve_text"
                  >
                    <el-input v-model="form.body_equipment_valve_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_valve === 2" class="read">
                    {{ form.body_equipment_valve_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_interlock"
            label="联锁"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_interlock">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_interlock === 2"
                    prop="body_equipment_interlock_text"
                  >
                    <el-input v-model="form.body_equipment_interlock_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_interlock === 2" class="read">
                    {{ form.body_equipment_interlock_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_deadman"
            label="呆德曼"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_deadman">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_deadman === 2"
                    prop="body_equipment_deadman_text"
                  >
                    <el-input v-model="form.body_equipment_deadman_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_deadman === 2" class="read">
                    {{ form.body_equipment_deadman_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_connector"
            label="接头"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_connector">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_connector === 2"
                    prop="body_equipment_connector_text"
                  >
                    <el-input v-model="form.body_equipment_connector_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_connector === 2" class="read">
                    {{ form.body_equipment_connector_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_hose"
            label="胶管"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_hose">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_hose === 2"
                    prop="body_equipment_hose_text"
                  >
                    <el-input v-model="form.body_equipment_hose_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_hose === 2" class="read">
                    {{ form.body_equipment_hose_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_tow_line"
            label="导电线及拖线胶带"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_tow_line">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_tow_line === 2"
                    prop="body_equipment_tow_line_text"
                  >
                    <el-input v-model="form.body_equipment_tow_line_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_tow_line === 2" class="read">
                    {{ form.body_equipment_tow_line_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_filter"
            label="过滤器"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_filter">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_filter === 2"
                    prop="body_equipment_filter_text"
                  >
                    <el-input v-model="form.body_equipment_filter_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_filter === 2" class="read">
                    {{ form.body_equipment_filter_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_lead_seal"
            label="铅封"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_lead_seal">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_lead_seal === 2"
                    prop="body_equipment_lead_seal_text"
                  >
                    <el-input v-model="form.body_equipment_lead_seal_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_lead_seal === 2" class="read">
                    {{ form.body_equipment_lead_seal_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_car_monitoring"
            label="车载监控"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_car_monitoring">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_car_monitoring === 2"
                    prop="body_equipment_car_monitoring_text"
                  >
                    <el-input v-model="form.body_equipment_car_monitoring_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_car_monitoring === 2" class="read">
                    {{ form.body_equipment_car_monitoring_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_flameout_device"
            label="熄火装置"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_flameout_device">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_flameout_device === 2"
                    prop="body_equipment_flameout_device_text"
                  >
                    <el-input v-model="form.body_equipment_flameout_device_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_flameout_device === 2" class="read">
                    {{ form.body_equipment_flameout_device_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_height_limit"
            label="限高装置"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_height_limit">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_height_limit === 2"
                    prop="body_equipment_height_limit_text"
                  >
                    <el-input v-model="form.body_equipment_height_limit_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_height_limit === 2" class="read">
                    {{ form.body_equipment_height_limit_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_hydraulic_device"
            label="液压装置"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_hydraulic_device">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_hydraulic_device === 2"
                    prop="body_equipment_hydraulic_device_text"
                  >
                    <el-input v-model="form.body_equipment_hydraulic_device_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_hydraulic_device === 2" class="read">
                    {{ form.body_equipment_hydraulic_device_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_leakage"
            label="渗漏"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_leakage">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_leakage === 2"
                    prop="body_equipment_leakage_text"
                  >
                    <el-input v-model="form.body_equipment_leakage_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_leakage === 2" class="read">
                    {{ form.body_equipment_leakage_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="body_equipment_anticollision"
            label="防撞"
            label-width="70px"
          >
            <el-radio-group v-model="form.body_equipment_anticollision">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.body_equipment_anticollision === 2"
                    prop="body_equipment_anticollision_text"
                  >
                    <el-input v-model="form.body_equipment_anticollision_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.body_equipment_anticollision === 2" class="read">
                    {{ form.body_equipment_anticollision_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="body_equipment_remark"
        label="备注"
      >
        <el-input
          v-model="form.body_equipment_remark"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
      <el-divider content-position="left"><span class="t-blue">油品质量</span></el-divider>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="oil_quality_sample"
            label="取样器"
            label-width="70px"
          >
            <el-radio-group v-model="form.oil_quality_sample">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.oil_quality_sample === 2"
                    prop="oil_quality_sample_text"
                  >
                    <el-input v-model="form.oil_quality_sample_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.oil_quality_sample === 2" class="read">
                    {{ form.oil_quality_sample_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        prop="oil_quality_visual"
        label="目视情况"
      >
        <el-radio-group v-model="form.oil_quality_visual">
          <el-radio
            v-for="item in visualOptions"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="oil_quality_water_detector"
        label="化学测水器"
      >
        <el-radio-group v-model="form.oil_quality_water_detector">
          <el-radio
            v-for="item in waterOptions"
            :key="item.id"
            :label="item.id"
          >{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="oil_quality_visual_result"
        label="目视结果"
      >
        <el-input
          v-model="form.oil_quality_visual_result"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
      <el-divider content-position="left"><span class="t-blue">随车工具</span></el-divider>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="vehicle_tool_ladder"
            label="梯子"
            label-width="70px"
          >
            <el-radio-group v-model="form.vehicle_tool_ladder">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.vehicle_tool_ladder === 2"
                    prop="vehicle_tool_ladder_text"
                  >
                    <el-input v-model="form.vehicle_tool_ladder_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.vehicle_tool_ladder === 2" class="read">
                    {{ form.vehicle_tool_ladder_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="vehicle_tool_wheel"
            label="轮档"
            label-width="70px"
          >
            <el-radio-group v-model="form.vehicle_tool_wheel">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.vehicle_tool_wheel === 2"
                    prop="vehicle_tool_wheel_text"
                  >
                    <el-input v-model="form.vehicle_tool_wheel_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.vehicle_tool_wheel === 2" class="read">
                    {{ form.vehicle_tool_wheel_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="vehicle_tool_fire_extinguisher"
            label="灭火器"
            label-width="70px"
          >
            <el-radio-group v-model="form.vehicle_tool_fire_extinguisher">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.vehicle_tool_fire_extinguisher === 2"
                    prop="vehicle_tool_fire_extinguisher_text"
                  >
                    <el-input v-model="form.vehicle_tool_fire_extinguisher_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.vehicle_tool_fire_extinguisher === 2" class="read">
                    {{ form.vehicle_tool_fire_extinguisher_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="vehicle_tool_oil_list"
            label="油单"
            label-width="70px"
          >
            <el-radio-group v-model="form.vehicle_tool_oil_list">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.vehicle_tool_oil_list === 2"
                    prop="vehicle_tool_oil_list_text"
                  >
                    <el-input v-model="form.vehicle_tool_oil_list_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.vehicle_tool_oil_list === 2" class="read">
                    {{ form.vehicle_tool_oil_list_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="vehicle_tool_oil_barrel"
            label="油样桶"
            label-width="70px"
          >
            <el-radio-group v-model="form.vehicle_tool_oil_barrel">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.vehicle_tool_oil_barrel === 2"
                    prop="vehicle_tool_oil_barrel_text"
                  >
                    <el-input v-model="form.vehicle_tool_oil_barrel_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.vehicle_tool_oil_barrel === 2" class="read">
                    {{ form.vehicle_tool_oil_barrel_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="vehicle_tool_oil_felt"
            label="吸油毡"
            label-width="70px"
          >
            <el-radio-group v-model="form.vehicle_tool_oil_felt">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.vehicle_tool_oil_felt === 2"
                    prop="vehicle_tool_oil_felt_text"
                  >
                    <el-input v-model="form.vehicle_tool_oil_felt_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.vehicle_tool_oil_felt === 2" class="read">
                    {{ form.vehicle_tool_oil_felt_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="vehicle_tool_water_detector"
            label="测水器"
            label-width="70px"
          >
            <el-radio-group v-model="form.vehicle_tool_water_detector">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.vehicle_tool_water_detector === 2"
                    prop="vehicle_tool_water_detector_text"
                  >
                    <el-input v-model="form.vehicle_tool_water_detector_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.vehicle_tool_water_detector === 2" class="read">
                    {{ form.vehicle_tool_water_detector_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="vehicle_tool_oil_filling"
            label="加油单"
            label-width="70px"
          >
            <el-radio-group v-model="form.vehicle_tool_oil_filling">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.vehicle_tool_oil_filling === 2"
                    prop="vehicle_tool_oil_filling_text"
                  >
                    <el-input v-model="form.vehicle_tool_oil_filling_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.vehicle_tool_oil_filling === 2" class="read">
                    {{ form.vehicle_tool_oil_filling_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            prop="vehicle_tool_warning_device"
            label="警示装置"
            label-width="70px"
          >
            <el-radio-group v-model="form.vehicle_tool_warning_device">
              <el-radio :label="1">正常</el-radio>
              <div class="inline-radio">
                <el-radio :label="2">异常</el-radio>
                <template v-if="!isRead">
                  <el-form-item
                    v-if="form.vehicle_tool_warning_device === 2"
                    prop="vehicle_tool_warning_device_text"
                  >
                    <el-input v-model="form.vehicle_tool_warning_device_text" clearable />
                  </el-form-item>
                </template>
                <template v-else>
                  <span v-if="form.vehicle_tool_warning_device === 2" class="read">
                    {{ form.vehicle_tool_warning_device_text }}
                  </span>
                </template>
              </div>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left"><span class="t-blue">其他设备</span></el-divider>
      <el-form-item
        prop="low_check"
        label="罐体"
        label-width="70px"
      >
        <el-radio-group v-model="form.low_check">
          <el-radio :label="1">正常</el-radio>
          <div class="inline-radio">
            <el-radio :label="2">异常</el-radio>
            <template v-if="!isRead">
              <el-form-item
                v-if="form.low_check === 2"
                prop="low_check_text"
              >
                <el-input v-model="form.low_check_text" clearable />
              </el-form-item>
            </template>
            <template v-else>
              <span v-if="form.low_check === 2" class="read">
                {{ form.low_check_text }}
              </span>
            </template>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="other_content"
        label="检查内容"
      >
        <el-input
          v-model="form.other_content"
          clearable
        />
      </el-form-item>
      <el-form-item
        prop="other_result"
        label="检查结果"
      >
        <el-input
          v-model="form.other_result"
          clearable
        />
      </el-form-item>
      <el-form-item
        prop="remark"
        label="备注"
      >
        <el-input
          v-model="form.remark"
          :rows="3"
          type="textarea"
        />
      </el-form-item>
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
    const abnormalRule = [
      { required: true, message: '请填写异常原因' },
      { pattern: new RegExp(/^.*[^\d].*$/), trigger: 'blur', message: '不能填写纯数字' }
    ]
    return {
      form: {
        check_mid: '',
        check_time: '',
        shift: '',
        chass_equipment_fuel: 1,
        chass_equipment_fuel_text: '',
        chass_equipment_oil: 1,
        chass_equipment_oil_text: '',
        chass_equipment_cool_water: 1,
        chass_equipment_cool_water_text: '',
        chass_equipment_light: 1,
        chass_equipment_light_text: '',
        chass_equipment_brake: 1,
        chass_equipment_brake_text: '',
        chass_equipment_turn: 1,
        chass_equipment_turn_text: '',
        chass_equipment_tyre: 1,
        chass_equipment_tyre_text: '',
        chass_equipment_hydraulic_oil: 1,
        chass_equipment_hydraulic_oil_text: '',
        chass_equipment_leakage: 1,
        chass_equipment_leakage_text: '',
        chass_equipment_noise: 1,
        chass_equipment_noise_text: '',
        chass_equipment_remark: '',
        body_equipment_valve: 1,
        body_equipment_valve_text: '',
        body_equipment_interlock: 1,
        body_equipment_interlock_text: '',
        body_equipment_deadman: 1,
        body_equipment_deadman_text: '',
        body_equipment_connector: 1,
        body_equipment_connector_text: '',
        body_equipment_hose: 1,
        body_equipment_hose_text: '',
        body_equipment_tow_line: 1,
        body_equipment_tow_line_text: '',
        body_equipment_filter: 1,
        body_equipment_filter_text: '',
        body_equipment_lead_seal: 1,
        body_equipment_lead_seal_text: '',
        body_equipment_car_monitoring: 1,
        body_equipment_car_monitoring_text: '',
        body_equipment_flameout_device: 1,
        body_equipment_flameout_device_text: '',
        body_equipment_height_limit: 1,
        body_equipment_height_limit_text: '',
        body_equipment_hydraulic_device: 1,
        body_equipment_hydraulic_device_text: '',
        body_equipment_leakage: 1,
        body_equipment_leakage_text: '',
        body_equipment_anticollision: 1,
        body_equipment_anticollision_text: '',
        body_equipment_remark: '',
        oil_quality_sample: 1,
        oil_quality_sample_text: '',
        oil_quality_visual: 1,
        oil_quality_water_detector: 1,
        oil_quality_visual_result: '',
        vehicle_tool_ladder: 1,
        vehicle_tool_ladder_text: '',
        vehicle_tool_wheel: 1,
        vehicle_tool_wheel_text: '',
        vehicle_tool_fire_extinguisher: 1,
        vehicle_tool_fire_extinguisher_text: '',
        vehicle_tool_oil_list: 1,
        vehicle_tool_oil_list_text: '',
        vehicle_tool_oil_barrel: 1,
        vehicle_tool_oil_barrel_text: '',
        vehicle_tool_oil_felt: 1,
        vehicle_tool_oil_felt_text: '',
        vehicle_tool_water_detector: 1,
        vehicle_tool_water_detector_text: '',
        vehicle_tool_oil_filling: 1,
        vehicle_tool_oil_filling_text: '',
        vehicle_tool_warning_device: 1,
        vehicle_tool_warning_device_text: '',
        other_content: '',
        other_result: '',
        low_check: 1,
        low_check_text: '',
        remark: ''
      },
      formRules: {
        check_mid: [
          { required: true, message: '请选择检查人员' }
        ],
        check_time: [
          { required: true, message: '请选择维护时间' }
        ],
        shift: [
          { required: true, trigger: 'blur', message: '请填写班次' }
        ],
        chass_equipment_fuel: [
          { required: true, message: '请选择燃油状态' }
        ],
        chass_equipment_fuel_text: abnormalRule,
        chass_equipment_oil: [
          { required: true, message: '请选择机油状态' }
        ],
        chass_equipment_oil_text: abnormalRule,
        chass_equipment_cool_water: [
          { required: true, message: '请选择冷却水状态' }
        ],
        chass_equipment_cool_water_text: abnormalRule,
        chass_equipment_light: [
          { required: true, message: '请选择灯光状态' }
        ],
        chass_equipment_light_text: abnormalRule,
        chass_equipment_brake: [
          { required: true, message: '请选择制动状态' }
        ],
        chass_equipment_brake_text: abnormalRule,
        chass_equipment_turn: [
          { required: true, message: '请选择转向状态' }
        ],
        chass_equipment_turn_text: abnormalRule,
        chass_equipment_tyre: [
          { required: true, message: '请选择轮胎状态' }
        ],
        chass_equipment_tyre_text: abnormalRule,
        chass_equipment_hydraulic_oil: [
          { required: true, message: '请选择液压油状态' }
        ],
        chass_equipment_hydraulic_oil_text: abnormalRule,
        chass_equipment_leakage: [
          { required: true, message: '请选择渗漏状态' }
        ],
        chass_equipment_leakage_text: abnormalRule,
        chass_equipment_noise: [
          { required: true, message: '请选择异响状态' }
        ],
        chass_equipment_noise_text: abnormalRule,
        body_equipment_valve: [
          { required: true, message: '请选择阀门状态' }
        ],
        body_equipment_valve_text: abnormalRule,
        body_equipment_interlock: [
          { required: true, message: '请选择联锁状态' }
        ],
        body_equipment_interlock_text: abnormalRule,
        body_equipment_deadman: [
          { required: true, message: '请选择呆德曼状态' }
        ],
        body_equipment_deadman_text: abnormalRule,
        body_equipment_connector: [
          { required: true, message: '请选择接头状态' }
        ],
        body_equipment_connector_text: abnormalRule,
        body_equipment_hose: [
          { required: true, message: '请选择胶管状态' }
        ],
        body_equipment_hose_text: abnormalRule,
        body_equipment_tow_line: [
          { required: true, message: '请选择导电线及拖线胶带状态' }
        ],
        body_equipment_tow_line_text: abnormalRule,
        body_equipment_filter: [
          { required: true, message: '请选择过滤器状态' }
        ],
        body_equipment_filter_text: abnormalRule,
        body_equipment_lead_seal: [
          { required: true, message: '请选择铅封状态' }
        ],
        body_equipment_lead_seal_text: abnormalRule,
        body_equipment_car_monitoring: [
          { required: true, message: '请选择车载监控状态' }
        ],
        body_equipment_car_monitoring_text: abnormalRule,
        body_equipment_flameout_device: [
          { required: true, message: '请选择熄火装置状态' }
        ],
        body_equipment_flameout_device_text: abnormalRule,
        body_equipment_height_limit: [
          { required: true, message: '请选择限高装置状态' }
        ],
        body_equipment_height_limit_text: abnormalRule,
        body_equipment_hydraulic_device: [
          { required: true, message: '请选择液压装置状态' }
        ],
        body_equipment_hydraulic_device_text: abnormalRule,
        body_equipment_leakage: [
          { required: true, message: '请选择渗漏状态' }
        ],
        body_equipment_leakage_text: abnormalRule,
        body_equipment_anticollision: [
          { required: true, message: '请选择防撞状态' }
        ],
        body_equipment_anticollision_text: abnormalRule,
        oil_quality_sample: [
          { required: true, message: '请选择取样器状态' }
        ],
        oil_quality_sample_text: abnormalRule,
        oil_quality_visual: [
          { required: true, message: '请选择目视状态' }
        ],
        oil_quality_water_detector: [
          { required: true, message: '请选择化学测水器状态' }
        ],
        oil_quality_visual_result: [
          { required: true, message: '请填写目视结果' }
        ],
        vehicle_tool_ladder: [
          { required: true, message: '请选择梯子状态' }
        ],
        vehicle_tool_ladder_text: abnormalRule,
        vehicle_tool_wheel: [
          { required: true, message: '请选择轮档状态' }
        ],
        vehicle_tool_wheel_text: abnormalRule,
        vehicle_tool_fire_extinguisher: [
          { required: true, message: '请选择灭火器状态' }
        ],
        vehicle_tool_fire_extinguisher_text: abnormalRule,
        vehicle_tool_oil_list: [
          { required: true, message: '请选择油单状态' }
        ],
        vehicle_tool_oil_list_text: abnormalRule,
        vehicle_tool_oil_barrel: [
          { required: true, message: '请选择油样桶状态' }
        ],
        vehicle_tool_oil_barrel_text: abnormalRule,
        vehicle_tool_oil_felt: [
          { required: true, message: '请选择吸油毡状态' }
        ],
        vehicle_tool_oil_felt_text: abnormalRule,
        vehicle_tool_water_detector: [
          { required: true, message: '请选择测水器状态' }
        ],
        vehicle_tool_water_detector_text: abnormalRule,
        vehicle_tool_oil_filling: [
          { required: true, message: '请选择加油单状态' }
        ],
        vehicle_tool_oil_filling_text: abnormalRule,
        vehicle_tool_warning_device: [
          { required: true, message: '请选择警示装置状态' }
        ],
        low_check: [
          { required: true, message: '请选择罐体状态' }
        ],
        low_check_text: abnormalRule,
        vehicle_tool_warning_device_text: abnormalRule
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
      ]
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
            remark: data.remark,
            shift: data.shift,
            low_check: +data.low_check === 1 ? 1 : 2,
            low_check_text: +data.low_check !== 1 ? data.low_check : '',
            equipment_name: data.equipment_name,
            code: data.code,
            asset_name: data.asset_name
          }
          if (data.chass_equipment) {
            const chass_equipment = JSON.parse(data.chass_equipment)
            for (const k in chass_equipment) {
              form[k] = chass_equipment[k]
            }
          }
          if (data.body_equipment) {
            const body_equipment = JSON.parse(data.body_equipment)
            for (const k in body_equipment) {
              form[k] = body_equipment[k]
            }
          }
          if (data.oil_quality) {
            const oil_quality = JSON.parse(data.oil_quality)
            for (const k in oil_quality) {
              form[k] = oil_quality[k]
            }
          }
          if (data.vehicle_tool) {
            const vehicle_tool = JSON.parse(data.vehicle_tool)
            for (const k in vehicle_tool) {
              form[k] = vehicle_tool[k]
            }
          }
          if (data.other) {
            const other = JSON.parse(data.other)
            for (const k in other) {
              form[k] = other[k]
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
      const chass_equipment = {}
      const body_equipment = {}
      const oil_quality = {}
      const vehicle_tool = {}
      const other = {}
      for (const k in this.form) {
        if (k.indexOf('chass_equipment') >= 0) {
          chass_equipment[k] = this.form[k]
        }
        if (k.indexOf('body_equipment') >= 0) {
          body_equipment[k] = this.form[k]
        }
        if (k.indexOf('oil_quality') >= 0) {
          oil_quality[k] = this.form[k]
        }
        if (k.indexOf('vehicle_tool') >= 0) {
          vehicle_tool[k] = this.form[k]
        }
        if (k.indexOf('other') >= 0) {
          other[k] = this.form[k]
        }
      }
      const datas = {
        egi_period_id: this.eqId,
        check_mid: this.form.check_mid,
        check_time: this.form.check_time,
        shift: this.form.shift,
        remark: this.form.remark,
        chass_equipment: JSON.stringify(chass_equipment),
        body_equipment: JSON.stringify(body_equipment),
        oil_quality: JSON.stringify(oil_quality),
        vehicle_tool: JSON.stringify(vehicle_tool),
        other: JSON.stringify(other),
        low_check: this.form.low_check === 1 ? 1 : this.form.low_check_text
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
        shift: '',
        chass_equipment_fuel: 1,
        chass_equipment_fuel_text: '',
        chass_equipment_oil: 1,
        chass_equipment_oil_text: '',
        chass_equipment_cool_water: 1,
        chass_equipment_cool_water_text: '',
        chass_equipment_light: 1,
        chass_equipment_light_text: '',
        chass_equipment_brake: 1,
        chass_equipment_brake_text: '',
        chass_equipment_turn: 1,
        chass_equipment_turn_text: '',
        chass_equipment_tyre: 1,
        chass_equipment_tyre_text: '',
        chass_equipment_hydraulic_oil: 1,
        chass_equipment_hydraulic_oil_text: '',
        chass_equipment_leakage: 1,
        chass_equipment_leakage_text: '',
        chass_equipment_noise: 1,
        chass_equipment_noise_text: '',
        chass_equipment_remark: '',
        body_equipment_valve: 1,
        body_equipment_valve_text: '',
        body_equipment_interlock: 1,
        body_equipment_interlock_text: '',
        body_equipment_deadman: 1,
        body_equipment_deadman_text: '',
        body_equipment_connector: 1,
        body_equipment_connector_text: '',
        body_equipment_hose: 1,
        body_equipment_hose_text: '',
        body_equipment_tow_line: 1,
        body_equipment_tow_line_text: '',
        body_equipment_filter: 1,
        body_equipment_filter_text: '',
        body_equipment_lead_seal: 1,
        body_equipment_lead_seal_text: '',
        body_equipment_car_monitoring: 1,
        body_equipment_car_monitoring_text: '',
        body_equipment_flameout_device: 1,
        body_equipment_flameout_device_text: '',
        body_equipment_height_limit: 1,
        body_equipment_height_limit_text: '',
        body_equipment_hydraulic_device: 1,
        body_equipment_hydraulic_device_text: '',
        body_equipment_leakage: 1,
        body_equipment_leakage_text: '',
        body_equipment_anticollision: 1,
        body_equipment_anticollision_text: '',
        body_equipment_remark: '',
        oil_quality_sample: 1,
        oil_quality_sample_text: '',
        oil_quality_visual: 1,
        oil_quality_water_detector: 1,
        oil_quality_visual_result: '',
        vehicle_tool_ladder: 1,
        vehicle_tool_ladder_text: '',
        vehicle_tool_wheel: 1,
        vehicle_tool_wheel_text: '',
        vehicle_tool_fire_extinguisher: 1,
        vehicle_tool_fire_extinguisher_text: '',
        vehicle_tool_oil_list: 1,
        vehicle_tool_oil_list_text: '',
        vehicle_tool_oil_barrel: 1,
        vehicle_tool_oil_barrel_text: '',
        vehicle_tool_oil_felt: 1,
        vehicle_tool_oil_felt_text: '',
        vehicle_tool_water_detector: 1,
        vehicle_tool_water_detector_text: '',
        vehicle_tool_oil_filling: 1,
        vehicle_tool_oil_filling_text: '',
        vehicle_tool_warning_device: 1,
        vehicle_tool_warning_device_text: '',
        other_content: '',
        other_result: '',
        low_check: 1,
        low_check_text: '',
        remark: ''
      }
      this.form = form
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

</style>
