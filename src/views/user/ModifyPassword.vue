<template>
  <div class="resetpwd">
    <el-card class="box-card" algin="center">
      <div slot="header" class="clearfix">
        <span>密码修改</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <el-form ref="pwdForm" :model="pwdForm" :rules="pwdRules" label-width="100px">
        <el-form-item label="原密码" prop="oldpassword">
          <el-input type="password" v-model="pwdForm.oldpassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input type="password" v-model="pwdForm.newpassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmpwd">
          <el-input type="password" v-model="pwdForm.confirmpwd"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button type="primary" @click="modifySubmit" :loading="isSubmitting">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { modifyPassword } from '@/api/user/index'
export default {
  name: 'ModifyPassword',
  data () {
    return {
      isSubmitting: false,
      user: {},
      pwdForm: {
        oldpassword: '',
        newpassword: '',
        confirmpwd: ''
      },
      pwdRules: {
        oldpassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newpassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmpwd: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.user = JSON.parse(localStorage.getItem('user'))
  },
  methods: {
    modifySubmit () {
      this.$refs.pwdForm.validate(valid => {
        if (!valid) return
        if (this.pwdForm.newpassword !== this.pwdForm.confirmpwd) {
          return this.$message.error('两次输入的新密码不一致！')
        }
        this.isSubmitting = true
        modifyPassword(this.user.userId, this.pwdForm.oldpassword, this.pwdForm.newpassword).then(res => {
          console.log(res.data)
          if (res.data.code === 102) {
            return this.$message.error('原密码不正确，请重新输入！')
          } else if (res.data.code === 100) {
            this.$notify({
              title: '通知',
              message: '密码修改成功',
              type: 'success'
            })
            this.user.password = this.pwdForm.newpassword
            localStorage.setItem('user', JSON.stringify(this.user))
            this.pwdForm = { oldpassword: '', newpassword: '', confirmpwd: '' }
          }
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.isSubmitting = false
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.resetpwd
  text-align: center; /*IE*/
  text-align: -moz-center; /*Firefox*/
  text-align: -webkit-center; /*Chrome*/
.clearfix:before
.clearfix:after
  display table
  content ""
.clearfix:after
  clear both
.box-card
  text-align left
  width 480px
.el-form-item
  >>> .el-form-item__content
    width: 300px
</style>
