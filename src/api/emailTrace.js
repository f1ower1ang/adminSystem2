import path from '@/assets/js/path'
import request from '@/utils/request'

export function analyseRecord(data) {
  return request({
    url: path.emailTrace.record,
    method: 'post',
    data
  })
}
