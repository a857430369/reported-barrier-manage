import request from '@/utils/request'
const formHeaders = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
const formDataHeaders = { 'Content-Type': 'multipart/form-data; charset=UTF-8', "X-Requested-With": "XMLHttpRequest" }
const jsonHeaders = { 'Content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
import querystring from 'querystring'
/**
 * 查询分类分页
 */
export function getPage(params) {
  return request({
    url: '/classify/getPage',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 新增分类 
 */
export function saveInfo(params) {
  return request({
    url: '/classify/saveInfo',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 修改分类
 */
export function editInfo(params) {
  return request({
    url: '/classify/editInfo',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
* 删除分类(逻辑删除)
*/
export function delInfo(params) {
  let delParams = querystring.stringify(params)
  return request({
    url: '/classify/delInfo?' + delParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post'
  })
}
/**
* 删除分类(真实删除)
*/
export function del(params) {
  let delParams = querystring.stringify(params)
  return request({
    url: '/classify/del?' + delParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post'
  })
}
/**
* 用户与分类关联
*/
export function relationUser(params) {
  return request({
    url: '/classify/relationUser',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
* 获取分类关联的用户
*/
export function getUser(params) {
  let str = querystring.stringify(params)
  return request({
    url: '/classify/getUser?' + str,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'get'
  })
}
