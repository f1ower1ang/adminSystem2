import path from '@/assets/js/path'
import request from '@/utils/request'

export function emailManage(data) {
  return request({
    url: path.emailManage.default,
    method: 'post',
    data
  })
}
