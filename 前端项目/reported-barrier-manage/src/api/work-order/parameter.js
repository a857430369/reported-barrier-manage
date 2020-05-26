import request from '@/utils/request'
const formHeaders = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
const formDataHeaders = { 'Content-Type': 'multipart/form-data; charset=UTF-8', "X-Requested-With": "XMLHttpRequest" }
const jsonHeaders = { 'Content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
import querystring from 'querystring'

/**
 * 查询参数分页
 */
export function getPage(params) {
  return request({
    url: '/parameter/getPage',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 新增参数
 */
export function saveInfo(params) {
  return request({
    url: '/parameter/saveInfo',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 修改参数
 */
export function editInfo(params) {
  return request({
    url: '/parameter/editInfo',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 删除参数(逻辑)
 */
export function delInfo(params) {
  //使用querystring将json对象转成key/value串
  let delParams = querystring.stringify(params)
  return request({
    url: '/parameter/delInfo?' + delParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post'
  })
}
/**
 * 删除参数(真实)
 */
export function del(params) {
  //使用querystring将json对象转成key/value串
  let delParams = querystring.stringify(params)
  return request({
    url: '/parameter/del?' + delParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post'
  })
}
/**
 * 获取参数键值对
 */
export function getListPar(params) {
  //使用querystring将json对象转成key/value串
  let getParams = querystring.stringify(params)
  return request({
    url: '/parameter/getListPar?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'get'
  })
}
/**
 * 查询分类树
 */
export function getTree() {
  return request({
    url: '/classify/getTree',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'get',
  })
}

