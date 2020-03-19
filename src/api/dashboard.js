import path from '@/assets/js/path'
import request from '@/utils/request'

export function systemState() {
  return request({
    url: path.dashboard,
    method: 'post'
  })
}
