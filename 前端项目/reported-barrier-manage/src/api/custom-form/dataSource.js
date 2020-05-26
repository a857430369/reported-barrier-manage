import request from '@/utils/request'

const jsonHeaders = {
  'Content-type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*'
}

// 查询数据源
export function datasourceList(params) {
  return request({
    url: '/datasource/datasourceList',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 新增数据源
export function insertDatasource(params) {
  return request({
    url: '/datasource/insertDatasource',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 修改数据源
export function updateDatasource(params) {
  return request({
    url: '/datasource/updateDatasource',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 删除数据源
export function deleteDatasource(params) {
  return request({
    url: '/datasource/deleteDatasource',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 测试连接
export function checkConnection(params) {
  return request({
    timeout: 10000,
    url: '/datasource/checkConnection',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 测试SQL连接
export function dataList(params) {
  return request({
    timeout: 10000,
    url: '/datasource/dataList',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

// 检查数据源是否被引用
export function checkDatasourceReference(params) {
  return request({
    url: '/datasource/checkDatasourceReference',
    headers: jsonHeaders,
    method: 'post',
    data: params
  })
}

