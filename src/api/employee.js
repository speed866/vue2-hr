import request from '@/utils/request'

// 获取员工列表
export function getEmployeeList(params) {
  return request(`/sys/user`, {
    params
  })
}

// 导出员工excel
export function exportEmployee() {
  return request('/sys/user/export', {
    responseType: 'blob'
  })
}

// 下载员工导入模版
export function getExportTemplate() {
  return request('/sys/user/import/template', {
    responseType: 'blob'
  })
}

// 上传excel
export function uploadExcel(data) {
  return request.post('/sys/user/import', data)
}

// 删除员工
export function delEmployee(id) {
  return request.delete(`/sys/user/${id}`)
}

// 新增员工
export function addEmployee(data) {
  return request.post('/sys/user', data)
}

// 获取员工信息
export function getEmployeeDetail(id) {
  return request(`/sys/user/${id}`)
}

// 更新员工信息
export function updateEmployee(data) {
  return request.put(`/sys/user/${data.id}`, data)
}
