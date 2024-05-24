import request from '@/utils/request'

// 登录
export function login(data) {
  return request.post('/sys/login', data)
}

// 获取用户信息
export function getUserInfo() {
  return request('/sys/profile')
}

// 修改密码
export function updatePassword(data) {
  return request.put('/sys/user/updatePass', data)
}
