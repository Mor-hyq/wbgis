import request from '@/utils/request'
import api from './apiMap'
// 当接口返回不显示toast时 params: { notShowToast: true }
// 替换请求链接中的占位符的方法
// import { replacePlaceHolder } from '@/utils/index'

// 上传图片
export function uploadImage({
  img
}, uploadProgress = () => {}) {
  return request({
    url: api.uploadImage,
    method: 'post',
    data: img,
    onUploadProgress: uploadProgress
  })
}

// 获取管道状态字典列表接口
export function getPipeState() {
  return request({
    url: api.getPipeState,
    method: 'get'
  })
}

// 获取管道下拉列表接口
export function getBelongPipe() {
  return request({
    url: api.getBelongPipe,
    method: 'get'
  })
}

// 获取事故类型列表
export function getAccidentType() {
  return request({
    url: api.getAccidentType,
    method: 'get'
  })
}

// 获取事故等级列表
export function getAccidentLevel() {
  return request({
    url: api.getAccidentLevel,
    method: 'get'
  })
}

// 应急预案下拉选择列表接口
export function getResultPlanType({
  type
} = {}) {
  return request({
    url: api.getResultPlanType,
    method: 'get',
    params: {
      type
    }
  })
}

// 计划状态下拉列表
export function getExercisePlanState() {
  return request({
    url: api.getExercisePlanState,
    method: 'get'
  })
}

// 获取维修方式列表(下拉)
export function getInspectTypeState() {
  return request({
    url: api.getInspectTypeState,
    method: 'get'
  })
}

// 获取故障类型列表
export function getFaultTypeState() {
  return request({
    url: api.getFaultTypeState,
    method: 'get',
    params: {
      page: 1,
      paginate: 100
    }
  })
}

// 上传文件
export function uploadFile(file) {
  return request({
    url: api.uploadFile,
    method: 'post',
    data: file
  })
}
// 获取维护表单下拉列表
export function getMaintainSelect() {
  return request({
    url: api.getMaintainSelect,
    method: 'get'
  })
}
// 维护|报警弹窗提示
export function getWarinig() {
  return request({
    url: api.getWarinig,
    method: 'get'
  })
}

// 获取风险等级下拉
export function getAccidentLevelSelect() {
  return request({
    url: api.getAccidentLevelSelect,
    method: 'get'
  })
}

// export function downFile(sha1) {
//   return request({
//     url: api.downFile,
//     method: 'get',
//     params: {
//       sha1
//     }
//   })
// }
