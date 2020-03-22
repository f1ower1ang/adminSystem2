import path from '@/assets/js/path'
import request from '@/utils/request'

export function getRuleDefinition(data) {
  return request({
    url: path.ruleManage.define,
    method: 'post',
    data
  })
}

export function aptManage(data) {
  return request({
    url: path.ruleManage.organise,
    method: 'post',
    data
  })
}

export function targetManage(data) {
  return request({
    url: path.ruleManage.target,
    method: 'post',
    data
  })
}
