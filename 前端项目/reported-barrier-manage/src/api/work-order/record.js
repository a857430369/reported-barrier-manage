import request from '@/utils/request'
const formHeaders = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
const formDataHeaders = { 'Content-Type': 'multipart/form-data; charset=UTF-8', "X-Requested-With": "XMLHttpRequest" }
const jsonHeaders = { 'Content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
import querystring from 'querystring'


/**
 * 查询全部工单分页
 */
export function getAllPage(params) {
  return request({
    url: '/record/getAllPage',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 查询待处理工单分页
 */
export function getPage(params) {
  return request({
    url: '/record/getPage',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 抢单
 */
export function grabRecord(params) {
  //使用querystring将json对象转成key/value串
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/grabRecord?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post'
  })
}
/**
 * 员工个人工单池分页查询
 */
export function getHandlePage(params) {
  return request({
    url: '/record/getHandlePage ',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 接单
 */
export function acceptedRecord(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/acceptedRecord?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 拒绝接单
 */
export function refuseRecord(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/refuseRecord?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 转省处理
 */
export function transferProvince(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/transferProvince?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 转单
 */
export function transferRecord(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/transferRecord?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 子单
 */
export function branchRecord(params) {
  return request({
    url: '/record/branchRecord',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 暂缓订单 
 */
export function deferRecord(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/deferRecord?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 恢复订单
 */
export function recoverRecord(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/recoverRecord?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 申请撤单
 */
export function applyRecallRecord(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/applyRecallRecord?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 确认撤单
 */
export function confirmRecallRecord(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/confirmRecallRecord?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 退单
 */
export function retreatRecord(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/retreatRecord?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 处理完成
 */
export function finishedProcessing(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/finishedProcessing?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 确认完成
 */
export function confirmCompletion(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/confirmCompletion?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}
/**
 * 个人下单工单池分页查询
 */
export function getPersonalPage(params) {
  return request({
    url: '/record/getPersonalPage',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
    data: params
  })
}
/**
 * 获取工单流程记录
 */
export function getRecordStep(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/getRecordStep?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'post',
  })
}

/**
 * 获取支撑机构树
 */
export function getOrgTree(params) {
  return request({
    url: '/record/getOrgTree',
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'get',
  })
}
/**
 * 根据机构获取对应的用户
 */
export function getOnLineUser(params) {
  let getParams = querystring.stringify(params)
  return request({
    url: '/record/getOnLineUser?' + getParams,
    headers: jsonHeaders,
    timeout: 60 * 1000,
    method: 'get',
  })
}