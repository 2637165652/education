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
      component: () => import('@/views/record/Uncontact.vue')
    },
    {
      path: '/record/contacted',
      name: 'Contacted',
      component: () => import('@/views/record/Contacted.vue')
    },
    {
      path: '/message',
      name: 'Message',
      component: () => import('@/views/message/Message.vue')
    },
    {
      path: '/user/profile',
      name: 'Profile',
      component: () => import('@/views/user/Profile.vue')
    }
  ]
})
