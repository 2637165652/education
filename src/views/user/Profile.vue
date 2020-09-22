<template>
  <div class="profile">
    <el-card class="box-card" algin="center">
      <div slot="header" class="clearfix">
        <span>用户资料</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <el-form ref="profileForm" :model="profileForm" :rules="profileRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="profileForm.username"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="profileForm.sex" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="profileForm.phonenumber"></el-input>
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input v-model="profileForm.address"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="identity">
          <el-select v-model="profileForm.identity" placeholder="请选择">
            <el-option label="家长" value="家长"></el-option>
            <el-option label="教师" value="教师"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="profileForm.identity === '教师'">
          <el-form-item label="学校" prop="schoolname">
            <el-input v-model="profileForm.schoolname"></el-input>
          </el-form-item>
          <el-form-item label="学号" prop="studentId" >
            <el-input v-model="profileForm.studentId"></el-input>
          </el-form-item>
        </template>
        <el-form-item style="text-align: right;">
          <el-button type="primary" @click="modifySubmit" :loading="isSubmitting">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getUsermessage, modifyUsermessage } from '@/api/user/index'
export default {
  name: 'Profile',
  data () {
    return {
      isSubmitting: false,
      profileForm: {},
      profileRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phonenumber: [{ required: true, message: '请填写手机号', trigger: 'blur' }],
        address: [{ required: true, message: '请填写住址', trigger: 'blur' }],
        identity: [{ required: true, message: '请选择您的角色', trigger: 'change' }],
        schoolname: [{ required: true, message: '请填写学校', trigger: 'blur' }],
        studentId: [{ required: true, message: '请填写学号', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      var userId = JSON.parse(localStorage.getItem('user')).userId
      getUsermessage(userId).then(res => {
        console.log(res.data)
        this.profileForm = res.data.user
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        //
      })
    },
    modifySubmit () {
      this.$refs.profileForm.validate(valid => {
        if (!valid) return
        this.isSubmitting = true
        if (this.profileForm.identity === '家长') {
          this.profileForm.schoolname = ''
          this.profileForm.studentId = ''
        }
        modifyUsermessage(this.profileForm).then(res => {
          console.log(res.data)
          this.$notify({
            title: '通知',
            type: 'success',
            message: '资料修改成功'
          })
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
.profile
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
    .el-select
      width 100%
</style>
