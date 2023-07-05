import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('../views/welcome/welcome.vue'),
        meta:{
          title:'首页'
        }
      },
      {
        path: '/videoManage',
        name: 'VideoManage',
        component: () => import('../views/videoManage/VideoManage.vue'),
        meta:{
          title:'电影管理'
        }
      },
      {
        path: '/report',
        name: 'Report',
        component: () => import('../views/examine/Report.vue'),
        meta:{
          title:'举报审核'
        }
      },
      {
        path: '/publishVideoExamine',
        name: 'PublishVideoExamine',
        component: () => import('../views/examine/videoPublisExamine/VideoPublisExamine.vue'),
        meta:{
          title:'视频发布审核'
        }
      },
     {
       path: '/shortVideoManage',
           name: 'ShortVideoManage',
           component: () => import('../views/shortVideoManage/ShortVideoManage.vue'),
           meta:{
             title:'微视管理'
           }
     },
      {
        path: '/videoTalke',
        name: 'VideoTalke',
        component: () => import('../views/videoTalke/VideoTalke.vue'),
        meta:{
          title:'影评管理'
        }
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: () => import('../views/userManage/UserManage.vue'),
        meta:{
          title:'手机用户管理'
        }
      }
    ]
  },
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/login/Login.vue')
  },
  {
    path: '/lockSystem',
    name: 'LockSystem',
    component: () => import('../views/lockSystem/lockSystem.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
