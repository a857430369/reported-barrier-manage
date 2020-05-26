import request from '@/utils/request'

const jsonHeaders = {
  'Content-type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*'
}

// orgUser
// 搜索有哪些用户
export function searchOperator(params) {
  return request({
    url: '/oper/findUser',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 查询所有的机构
export function findByOrgClass(params) {
  return request({
    url: '/org/findByOrgClass',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 查某个机构下的用户
export function findOperator(params) {
  return request({
    timeout: 60000,
    url: '/oper/findOperator',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// node
// 节点查询有哪些人员
export function listNodeAccUser(params) {
  return request({
    url: '/nodeAcc/listNodeAccUser',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 修改信息节点关系
export function changeNodeAccList(params) {
  return request({
    url: '/nodeAcc/changeNodeAccList',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 表单表查询流程人员
export function listNeedTreeByModelCode(params) {
  return request({
    url: '/tree/listNeedTreeByModelCode',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}
// 表单表查询流程人员
export function listNeedPlanAcc(params) {
  return request({
    url: '/planAcc/listNeedPlanAcc',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// oper
// 查询点单人员
export function disposeUsers(params) {
  return request({
    url: '/oper/disposeUsers',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}