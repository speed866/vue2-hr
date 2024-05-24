import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

// 白名单(不需要token也能访问的页面)
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
      nprogress.done()
    } else {
      const hasGetUserInfo = store.getters.userId
      if (hasGetUserInfo) {
        next()
      } else {
        await store.dispatch('user/getUserInfo')
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      nprogress.done()
    }
  }
})

router.afterEach((to, from, next) => {
  nprogress.done()
})
