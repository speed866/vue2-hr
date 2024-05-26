import request from '@/utils/request'

// 获取部门列表
export function getDepartment() {
  return request('/company/department')
}

// 获取部门负责人列表
export function getManagerList() {
  return request('/sys/user/simple')
}

// 新增部门
export function addDepartment(data) {
  return request.post('/company/department', data)
}

// 获取部门信息
export function getDepartmentDetail(id) {
  return request(`/company/department/${id}`)
}

// 更新部门
export function updateDepartment(data) {
  return request.put(`/company/department/${data.id}`, data)
}

// 删除部门
export function delDepartment(id) {
  return request.delete(`/company/department/${id}`)
}
