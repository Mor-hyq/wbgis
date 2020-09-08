import request from '@/utils/request'
import api from './api'
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
