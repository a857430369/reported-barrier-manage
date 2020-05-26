import request from '@/utils/request'
const formHeaders = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
const formDataHeaders = { 'Content-Type': 'multipart/form-data; charset=UTF-8', "X-Requested-With": "XMLHttpRequest" }
const jsonHeaders = { 'Content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
import querystring from 'querystring'

/**
 * 分页查询
 */
export function getPage(params) {
  return request({
    url: '/grouping/getPage',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 查询所属分组
 */
export function getList() {
  return request({
    url: '/grouping/getList ',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'get',
  })
}
/**
 * 新增分组
 */
export function saveInfo(params) {
  return request({
    url: '/grouping/saveInfo',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 修改分组
 */
export function editInfo(params) {
  return request({
    url: '/grouping/editInfo',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 删除分组(逻辑)
 */
export function delInfo(params) {
  const delParams = querystring.stringify(params)
  return request({
    url: '/grouping/delInfo?' + delParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 删除分组(真实)
 */
export function del(params) {
  const delParams = querystring.stringify(params)
  return request({
    url: '/grouping/del?' + delParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 单个分组关联多个用户
 */
export function relationUser(params) {
  const groupingCode = params.groupingCode
  const list = params.list
  return request({
    url: '/grouping/relationUser?groupingCode=' + groupingCode,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: list
  })
}