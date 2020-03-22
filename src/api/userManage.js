import path from '@/assets/js/path'
import request from '@/utils/request'

export function getAccounts(data) {
  return request({
    url: path.userManage.accountManage,
    method: 'post',
    data
  })
}

export function getPermissions(data) {
  return request({
    url: path.userManage.permissionManage,
    method: 'post',
    data
  })
}

export function getRoles(data) {
  return request({
    url: path.userManage.roleManage,
    method: 'post',
    data
  })
}
