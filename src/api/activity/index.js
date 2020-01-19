import request from '@/utils/request'
import formApi from './apiMap'
// 替换请求链接中的占位符的方法
import { replacePlaceHolder } from '@/utils/index'

// 获取活动模板列表接口
export function getFormList({
  page = 1,
  pageSize = 10
} = {}) {
  return request({
    url: formApi.getFormList,
    method: 'get',
    params: {
      page,
      pageSize
    }
  })
}

// 创建活动接口
export function saveAct({
  values
} = {}) {
  return request({
    url: formApi.saveActivity,
    method: 'post',
    data: {
      values
    }
  })
}

// 获取活动详情接口
export function getActDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(formApi.getActivityDetail, { id }),
    method: 'get'
  })
}

// 编辑活动接口
export function editAct({
  id,
  values
} = {}) {
  return request({
    url: replacePlaceHolder(formApi.editActivity, { id }),
    method: 'put',
    data: {
      values
    }
  })
}

// 获取我创建的活动列表
export function getMyActList({
  type = 1,
  page = 1,
  pageSize = 10,
  name = ''
} = {}) {
  const params = {
    type,
    page,
    pageSize
  }
  name && (params.name = name)
  return request({
    url: formApi.getMyActivityList,
    method: 'get',
    params
  })
}

// 删除我创建的活动
export function deleteMyAct({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(formApi.deleteMyActivity, { id }),
    method: 'delete'
  })
}

// 发布活动
export function publishMyAct({
  id,
  add_member_ids,
  remove_member_ids,
  sync_main,
  on_site,
  banner
} = {}) {
  const data = {
    add_member_ids,
    remove_member_ids
  }
  on_site && (data.on_site = on_site)
  banner && (data.banner = banner);
  (sync_main || sync_main === 0) && (data.sync_main = +sync_main)
  return request({
    url: replacePlaceHolder(formApi.publishActivity, { id }),
    method: 'put',
    data
  })
}
// 催办审核接口
export function urgeMyAct({
  id
} = {}) {
  return request({
    url: formApi.urgeExamine,
    method: 'post',
    data: {
      id
    }
  })
}
// 下架活动接口
export function underMyAct({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(formApi.underActivity, { id }),
    method: 'put'
  })
}
