import path from '@/assets/js/path'
import request from '@/utils/request'

export function getRuleList(data) {
  return request({
    url: path.ruleManage.ruleList,
    method: 'post',
    data
  })
}

export function addRule(data) {
  return request({
    url: path.ruleManage.ruleAdd,
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

export function getTargetList(data) {
  return request({
    url: path.ruleManage.targetList,
    method: 'post',
    data
  })
}

export function addTarget(data) {
  return request({
    url: path.ruleManage.addTarget,
    method: 'post',
    data
  })
}

export function delTarget(id) {
  return request({
    url: path.ruleManage.deleteTarget,
    method: 'get',
    params: { id }
  })
}

export function delTargets(ids) {
  return request({
    url: path.ruleManage.deleteTargets,
    method: 'post',
    data: { ids }
  })
}
