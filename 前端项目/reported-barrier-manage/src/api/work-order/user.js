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
    url: '/user/getPage',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 获取所有用户
 */
export function getPageInfo() {
  return request({
    url: '/user/getPageInfo  ',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'get',
  })
}