import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/Login.vue')
    },
    {
      path: '/record/uncontact',
      name: 'Uncontact',
      meta: { auth: true },
      component: () => import('@/views/record/Uncontact.vue')
    },
    {
      path: '/record/contacted',
      name: 'Contacted',
      meta: { auth: true },
      component: () => import('@/views/record/Contacted.vue')
    },
    {
      path: '/record/canceled',
      name: 'Canceled',
      meta: { auth: true },
      component: () => import('@/views/record/Canceled.vue')
    },
    {
      path: '/message',
      name: 'Message',
      meta: { auth: true },
      component: () => import('@/views/message/Message.vue')
    },
    {
      path: '/user/profile',
      name: 'Profile',
      meta: { auth: true },
      component: () => import('@/views/user/Profile.vue')
    },
    {
      path: '/user/modify_password',
      name: 'ModifyPassword',
      meta: { auth: true },
      component: () => import('@/views/user/ModifyPassword.vue')
    }
  ]
})
