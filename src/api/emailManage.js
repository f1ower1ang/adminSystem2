import path from '@/assets/js/path'
import request from '@/utils/request'

export function getEmailList(data) {
  return request({
    url: path.emailManage.emailList,
    method: 'post',
    data
  })
}

export function getAttachmentList(data) {
  return request({
    url: path.emailManage.attachList,
    method: 'post',
    data
  })
}

export function delEmail(id) {
  return request({
    url: path.emailManage.deleteEmailById,
    method: 'get',
    params: { id }
  })
}

export function delEmails(ids) {
  return request({
    url: path.emailManage.deleteEmailByIds,
    method: 'post',
    data: { ids }
  })
}

export function delAttachment(id) {
  return request({
    url: path.emailManage.deleteAttachmentById,
    method: 'get',
    params: { id }
  })
}

export function delAttachments(ids) {
  return request({
    url: path.emailManage.deleteAttachmentById,
    method: 'post',
    data: { ids }
  })
}

export function checkRule(id) {
  return request({
    url: path.emailManage.checkRule,
    method: 'get',
    params: { id }
  })
}
