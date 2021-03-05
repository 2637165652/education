<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/home">家教信息</el-menu-item>
          <template v-if="isLogined">
            <el-submenu index="/record">
              <template slot="title">我的家教</template>
              <el-menu-item index="/record/uncontact">未联系家教</el-menu-item>
              <el-menu-item index="/record/contacted">已联系家教</el-menu-item>
              <el-menu-item index="/record/canceled">已撤销家教</el-menu-item>
            </el-submenu>
            <el-menu-item index="/message" disabled>消息管理</el-menu-item>
            <el-submenu index="/user">
              <template slot="title">个人中心</template>
              <el-menu-item index="/user/profile">用户资料</el-menu-item>
              <el-menu-item index="/user/modify_password">密码修改</el-menu-item>
              <el-menu-item index="/logout" @click="logout">退出</el-menu-item>
            </el-submenu>
          </template>
          <el-menu-item index="/login" v-else>登录/注册</el-menu-item>
        </el-menu>
      </el-header>
      <el-main><router-view/></el-main>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'App',
  data () {
    return {
      // activeIndex: '/home',
      user: {}
    }
  },
  components: {
    Header
  },
  computed: {
    isLogined: {
      get: function () {
        return this.$store.state.isLogined
      },
      set: function (newV) {
        this.$store.commit('setLoginStatus', newV)
      }
    },
    activeIndex: {
      get () {
        return this.$route.path
      },
      set (newV) {
        // this.activeIndex = newV
      }
    }
  },
  created () {
    if (localStorage.getItem('user')) {
      this.isLogined = true
      this.user = JSON.parse(localStorage.getItem('user'))
    } else {
      this.isLogined = false
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
      // this.activeIndex = key
      // console.log(this.activeIndex)
      if (key === '/home') {
        this.$router.push({ name: 'Home' })
      }
      if (key === '/record/uncontact') {
        this.$router.push({ name: 'Uncontact' })
      }
      if (key === '/record/contacted') {
        this.$router.push({ name: 'Contacted' })
      }
      if (key === '/record/canceled') {
        this.$router.push({ name: 'Canceled' })
      }
      if (key === '/message') {
        this.$router.push({ name: 'Message' })
        console.log(this.$route.path)
      }
      if (key === '/user/profile') {
        this.$router.push({ name: 'Profile' })
      }
      if (key === '/user/modify_password') {
        this.$router.push({ name: 'ModifyPassword' })
      }
      if (key === '/logout') {
        localStorage.removeItem('user')
        this.isLogined = false
        this.$router.push({ name: 'Login' })
        this.activeIndex = '/login'
      }
      if (key === '/login') {
        this.$router.push({ name: 'Login' })
      }
    },
    logout () {
      //
    }
  }
}
</script>

<style lang="stylus">
#app
  min-width 1200px
  height 100%
  background-color #e9eef3
.el-header
  background-color #B3C0D1
  color #333
  text-align center
  line-height 60px
  padding 0px
  position sticky
  top 0
  z-index 1000
.el-main
  background-color #E9EEF3
  color #333
  text-align center
  // padding 10px 0px
</style>
