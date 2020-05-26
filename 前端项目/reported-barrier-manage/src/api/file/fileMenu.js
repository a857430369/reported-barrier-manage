import request from '@/utils/request'
const formHeaders = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
const formDataHeaders = { 'Content-Type': 'multipart/form-data; charset=UTF-8', "X-Requested-With": "XMLHttpRequest" }
const jsonHeaders = { 'Content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }

/**
 * 获取所有目录--树形结构
 */
export function getMenuAll() {
  return request({
    url: '/fileMenu/findAllFileMenuTree',
    headers: jsonHeaders,
    method: 'post'
  })
}

/* 
  添加目录
*/
export function addMenu(data) {
  return request({
    url: '/fileMenu/saveInfo',
    headers: jsonHeaders,
    method: 'POST',
    data
  })
}

/* 
  获取父类菜单
*/
export function getAllFMenu() {
  return request({
    url: '/fileMenu/findByPatherCode?patherCode=0',
    headers: jsonHeaders,
    method: 'POST'
  })
}

/* 
  获取所有菜单--列表结构
*/
export function getAll() {
  return request({
    url: '/fileMenu/findAllFileMenu',
    headers: jsonHeaders,
    method: 'POST'
  })
}
/* 
  菜单重命名
*/
export function editMenuInfo(data) {
  return request({
    url: '/fileMenu/editInfo',
    headers: jsonHeaders,
    method: 'POST',
    data
  })
}

/* 
  删除菜单
*/
export function deletMenuInfo(data) {
  return request({
    url: '/fileMenu/delInfo?menuCode=' + data,
    headers: jsonHeaders,
    method: 'POST'
  })
}


