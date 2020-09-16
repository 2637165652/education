<template>
  <div class="app-login">
    <div class="app-login-wrapper">
      <div class="app-login-logo">
        <!-- <img src="../assets/tonli_logo.png" alt=""> -->
        <span>网上自助家教系统</span>
      </div>
      <el-form class="app-login-form" ref="form" :model="form" :rules="rules"  @submit.native.prevent="submit">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="帐号" v-model="form.username"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" type="password" placeholder="密码" v-model="form.password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="app-login-btn" @click="loginSubmit" :loading="submitting1">登录</el-button>
          <el-button type="primary" class="app-login-btn" @click="registerSubmit" :loading="submitting2">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/index'
export default {
  name: 'Login',
  data () {
    return {
      submitting1: false,
      submitting2: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    loginSubmit () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.submitting1 = true
        login(this.form.username, this.form.password)
          .then(res => {
            console.log(res.data)
            if (res.data.status === 403) {
              this.$message({
                showClose: true,
                message: '账号或密码错误！请重新输入！',
                type: 'error'
              })
            } else {
              // 本地存储用户信息
              localStorage.setItem('user', JSON.stringify(res.data.user))
              this.$store.commit('setLoginStatus', true)
              this.$router.push({name: 'Home'})
            }
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.submitting1 = false
          })
      })
    },
    registerSubmit () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.submitting2 = true
        register(this.form.username, this.form.password).then(res => {
          console.log(res.data)
          if (res.data.status === 401) {
            this.$message({
              showClose: true,
              message: '此用户名已存在！',
              type: 'error'
            })
          } else {
            // 本地存储用户信息
            localStorage.setItem('user', JSON.stringify(res.data.user))
            this.$store.commit('setLoginStatus', true)
            this.$router.push({name: 'Home'})
          }
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.submitting2 = false
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.app-login
  display flex
  justify-content center
  align-items center
  min-height 100%
.app-login-wrapper
  padding-top 40px
  padding-bottom 140px
  width 360px
.app-login-logo
  margin-bottom 20px
  display flex
  align-items center
  justify-content center
  img
    display block
    height 60px
    margin-right 30px
  span
    font-size 28px

</style>
