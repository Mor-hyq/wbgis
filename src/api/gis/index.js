import request from '@/utils/request'
import api from './api'
// 替换请求链接中的占位符的方法
import { replacePlaceHolder } from '@/utils/index'

// 获取管道线路所有坐标接口
export function getGis({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getGis, { id }),
    method: 'get'
  })
}
