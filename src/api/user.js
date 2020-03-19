import request from '@/utils/request'
import path from '@/assets/js/path'

export function login(data) {
  return request({
    url: path.user.login,
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: path.user.info,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: path.user.logout,
    method: 'post'
  })
}
