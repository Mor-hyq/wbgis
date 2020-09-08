import request from '@/utils/request'
import formApi from './apiMap'
import { replacePlaceHolder } from '@/utils/index'

// 创建活动模板接口
export function saveForm({
  template
} = {}) {
  return request({
    url: formApi.createForm,
    method: 'post',
    data: {
      template
    }
  })
}

// 根据模板id获取模板具体表单信息
export function getFormData({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(formApi.getFormData, { id }),
    method: 'get'
  })
}

// 修改活动模板信息接口
export function updateFormData({
  id,
  template
} = {}) {
  return request({
    url: replacePlaceHolder(formApi.updateForm, { id }),
    method: 'put',
    data: {
      template
    }
  })
}

// 删除活动模板
export function deleteFormData({
  delete_ids
} = {}) {
  return request({
    url: formApi.deleteForm,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
