import request from '@/utils/request'

const jsonHeaders = {
  'Content-type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*'
}

// 分类 classify
export function listModelByAll(params) {
  return request({
    url: '/model/listModelByAll',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 查询大类小类
export function getTree() {
  return request({
    url: '/classify/getTree',
    headers: jsonHeaders,
    method: 'get'
  })
}

// 字段 model
//分页查询
export function listModel(params) {
  return request({
    url: '/model/listModel',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
//修改模板状态
export function updateStatus(params) {
  return request({
    url: '/model/updateStatus',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
//修改模板对象
export function updateModel(params) {
  return request({
    url: '/model/updateModel',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
//添加模板
export function insertModel(params) {
  return request({
    url: '/model/insertModel',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
//查询单个model对象
export function getModel(params) {
  return request({
    url: '/model/getModel',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 分页查询表单集合
export function pageNeedForm(params) {
  return request({
    url: '/needForm/pageNeedForm',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 查询可填写的需求模板
export function pageOperModel(params) {
  return request({
    url: '/model/pageOperModel',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 查询最新通知
export function noticeSecurityList(params) {
  return request({
    url: '/notice/noticeSecurityList',
    headers: jsonHeaders,
    method: 'get',
    data: params
  })
}

