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
    url: '/noticeRecord/getPage?flag=' + params.flag,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params.noticeRecord
  })
}
/**
 * 查询所有机构
 */
export function findByNoticeCode(params) {
  return request({
    url: '/noticeRecord/findByNoticeCode',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 根据阅读状态查询
 */
export function findGroupByIsRead(params) {
  return request({
    url: '/noticeRecord/findGroupByIsRead',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 修改阅读状态
 */
export function editInfo(params) {
  return request({
    url: '/noticeRecord/editInfo?noticeCode=' + params.noticeCode + '&noticeAppoint=' + params.noticeAppoint,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 数组排序
 */
export function findPageByList(params) {
  return request({
    url: '/noticeRecord/findPageByList?pageNumber=' + params.pageNum + '&pageSize=' + params.pageSize,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params.noticeRecord
  })
}