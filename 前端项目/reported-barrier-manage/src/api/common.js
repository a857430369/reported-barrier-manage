import request from '@/utils/request'
const formHeaders = { 'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8' }
const formDataHeaders = { 'Content-Type': 'multipart/form-data; charset=UTF-8', "X-Requested-With": "XMLHttpRequest" }
const jsonHeaders = { 'Content-type': 'application/json;charset=UTF-8', 'Access-Control-Allow-Origin': '*' }
import queryStr from 'querystring'

// 上传附件
export function uploadFile(file, params) {
  let str = queryStr.stringify(params)
  return request({
    url: `/file/uploadFile?${str}`,
    headers: formHeaders,
    method: 'post',
    data: file
  })
}

// 下载附件
export function downloadFile(params) {
  let str = queryStr.stringify(params)
  return request({
    url: '/file/downloadFile?' + str,
    headers: jsonHeaders,
    method: 'post',
    responseType: 'blob'
  })
}