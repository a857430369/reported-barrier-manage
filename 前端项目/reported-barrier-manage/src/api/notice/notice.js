import request from '@/utils/request'
const formHeaders = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
const formDataHeaders = { 'Content-Type': 'multipart/form-data; charset=UTF-8', "X-Requested-With": "XMLHttpRequest" }
const jsonHeaders = { 'Content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
import querystring from 'querystring'
/**
 * 查询通知分页
 */
export function getPage(params) {
  return request({
    url: '/notice/getPage',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 上传富文本图片视频
 */
export function Upload(params) {
  return request({
    url: '/file/uploadFile?fileType=P',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 查询所有机构
 */
export function findAllOrg(params) {
  return request({
    url: '/notice/findAllOrg',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 查询所有保障机构
 */
export function findAllBZXTOrg(params) {
  return request({
    url: '/notice/findAllBZXTOrg',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 查询指定机构所有人员
 */
export function findUserByOrg(params) {
  return request({
    url: '/notice/findUserByOrg?orgNo=' + params.orgNo + '&userName=' + params.userName,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 查询指定机构所有人员
 */
export function findUserAndPhone(params) {
  return request({
    url: '/notice/findUserAndPhone?orgCode=' + params.orgCode + '&userName=' + params.userName,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 
 */
export function findUserAndEMPByUserCode(params) {
  return request({
    url: '/notice/findUserAndEMPByUserCode',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 查询所有用户
 */
export function findUserAll(params) {
  return request({
    url: '/notice/findUserAndPhone',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 新增通知
 */
export function saveInfo(params) {
  return request({
    url: '/notice/saveInfo',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 新增通知
 */
export function saveKnowledgeInfo(params) {
  return request({
    url: 'notice/saveKnowledgeInfo?orgCode='+params.data,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params.notice
  })
}
/**
 * 修改通知
 */
export function editInfo(params) {
  return request({
    url: '/notice/editInfo?noticeCode=' + params,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
* 删除通知
*/
export function delInfo(params) {
  return request({
    url: '/notice/delInfo?noticeCode=' + params,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post'
  })
}
/**
 * 查询通知详情
 */
export function findNoticeDetiles(params) {
  return request({
    url: '/notice/findNoticeDetiles',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}

/**
 * 
 */
export function findBZUserAndEMPByUserCode(params) {
  return request({
    url: '/notice/findBZUserAndEMPByUserCode',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}