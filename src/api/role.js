import request from '@/utils/request'

// 获取角色列表
export function getRoleList(params) {
  return request('/sys/role', { params })
}

// 新增角色
export function addNewRole(data) {
  return request.post('/sys/role', data)
}

// 编辑角色
export function updateRole(data) {
  return request.put(`/sys/role/${data.id}`, data)
}

// 删除角色
export function delRole(id) {
  return request.delete(`/sys/role/${id}`)
}
