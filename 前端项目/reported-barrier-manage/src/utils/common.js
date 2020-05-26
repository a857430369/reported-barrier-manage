export function downloadFile (blob, fileName) {
  const downloadElement = document.createElement('a')
  const objectUrl = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = objectUrl
  downloadElement.download = fileName || 'data.xls' // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(objectUrl) // 释放blob对象
}
