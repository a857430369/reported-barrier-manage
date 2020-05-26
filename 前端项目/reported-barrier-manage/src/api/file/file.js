import request from '@/utils/request'
const formHeaders = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
const formDataHeaders = { 'Content-Type': 'multipart/form-data; charset=UTF-8', "X-Requested-With": "XMLHttpRequest" }
const jsonHeaders = { 'Content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }

/* 
* 获取附件
*/
export function getAll(data) {
  return request({
    url: '/file/getPage ',
    headers: jsonHeaders,
    method: 'post',
    data: data
  })
}

/* 
  修改附件名
*/
export function updateFileName(data) {
  return request({
    url: '/file/editInfo',
    method: 'post',
    headers: jsonHeaders,
    data: data
  })
}

/* 
  删除附件
*/

export function deleteFile(data) {
  return request({
    url: '/file/delInfo',
    method: 'POST',
    headers: jsonHeaders,
    data: data
  })
}

/* 
  新增附件
*/
export function addFile(data) {
  return request({
    url: '/file/saveInfo ',
    method: 'POST',
    headers: jsonHeaders,
    data: data
  })
}

/* 
  下载附件
*/
export function downloadExcel(data) {
  return request({
    url: '/file/downloadFile?fileId=' + data,
    method: 'POST',
    headers: jsonHeaders,
    responseType: 'blob'
  })
}

/* 
  批量下载附件
*/
export function downloadMoreFile(data) {
  return request({
    url: '/file/downloadallFiles',
    method: 'POST',
    responseType: 'blob',
    headers: jsonHeaders,
    data
  })
}

/* 
  批量移动
*/
export function removeMoreFile(data) {
  return request({
    url: '/file/batchEditInfo' + data.menuCode,
    headers: jsonHeaders,
    method: 'POST',
    data: data.list
  })
}

/* 
  上传文件
*/
export function uploadFile(form, data) {
  let str = '/file/uploadFile?fileType=F&menuCode=' + data.menucode + '&fileRemark=' + data.fileRemark
  return request({
    url: str,
    headers: jsonHeaders,
    method: "POST",
    data: form
  })
}