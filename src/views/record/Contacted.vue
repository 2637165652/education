<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的家教</el-breadcrumb-item>
      <el-breadcrumb-item>已联系家教</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="dataList" stripe style="width: 100%" border v-loading="isLoading">
      <el-table-column prop="recordNum" label="编号" width="80"></el-table-column>
      <el-table-column prop="studentsex" label="学生性别" ></el-table-column>
      <el-table-column prop="grade" label="年级" ></el-table-column>
      <el-table-column prop="subject" label="科目" ></el-table-column>
      <el-table-column prop="requirement" label="具体情况及要求" width="250"></el-table-column>
      <el-table-column prop="address" label="辅导地点" ></el-table-column>
      <el-table-column prop="linkname" label="家长" ></el-table-column>
      <el-table-column prop="linkphone" label="家长电话" ></el-table-column>
      <el-table-column prop="releaseDate" label="发布日期" >
        <template slot-scope="{ row }">
          {{ row.releaseDate | moment }}
        </template>
      </el-table-column>
      <el-table-column prop="teachername" label="教师" ></el-table-column>
      <el-table-column prop="teacherphone" label="教师电话" ></el-table-column>
      <el-table-column prop="receiveDate" label="领取日期" >
        <template slot-scope="{ row }">
          {{ row.receiveDate | moment }}
        </template>
      </el-table-column>
      <el-table-column label="我的角色" >
        <template slot-scope="{ row }">
          <span v-if="user.userId === row.publisherId" >家长</span>
          <span v-else>教师</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" >
        <template slot-scope="{ row }">
          <el-button v-if="user.userId === row.publisherId" type="text" @click="handleRepublish(row)">重新发布</el-button>
          <span v-else>//</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 发布家教 -->
    <el-dialog class="release-dialog" title="发布家教"
      :visible.sync="release_visibleDialog" width="800px"
      @closed = "releaseForm = {}">
      <el-form :inline="true" ref="releaseForm1" :model="releaseForm" :rules="releaseRules" class="inline-form">
        <el-form-item label="学生性别" prop="studentsex">
          <el-select v-model="releaseForm.studentsex" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="releaseForm.grade" placeholder="请选择">
            <el-option label="一年级" value="一年级"></el-option>
            <el-option label="二年级" value="二年级"></el-option>
            <el-option label="三年级" value="三年级"></el-option>
            <el-option label="四年级" value="四年级"></el-option>
            <el-option label="五年级" value="五年级"></el-option>
            <el-option label="六年级" value="六年级"></el-option>
            <el-option label="初一" value="初一"></el-option>
            <el-option label="初二" value="初二"></el-option>
            <el-option label="初三" value="初三"></el-option>
            <el-option label="高一" value="高一"></el-option>
            <el-option label="高二" value="高二"></el-option>
            <el-option label="高三" value="高三"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-select v-model="releaseForm.subject" placeholder="请选择">
            <el-option label="语文" value="语文"></el-option>
            <el-option label="数学" value="数学"></el-option>
            <el-option label="英语" value="英语"></el-option>
            <el-option label="物理" value="物理"></el-option>
            <el-option label="化学" value="化学"></el-option>
            <el-option label="生物" value="生物"></el-option>
            <el-option label="历史" value="历史"></el-option>
            <el-option label="地理" value="地理"></el-option>
            <el-option label="政治" value="政治"></el-option>
            <el-option label="理综" value="理综"></el-option>
            <el-option label="文综" value="文综"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="releaseForm2" :model="releaseForm" :rules="releaseRules" label-width="150px">
        <el-form-item label="学生情况及教师要求" prop="requirement">
          <el-input type="textarea" :rows="5" v-model="releaseForm.requirement"  placeholder="请参考下面的格式填写此项"></el-input>
        </el-form-item>
        <el-form-item label="参考格式">
          <el-input type="textarea" :rows="4" resize="none" value="学生是一名初二的女生，性格文静，成绩中等，想找一位教师辅导数学。要求教师认真负责，有辅导经验，有学习方法。 辅导时间：每周2次，每次2小时，周三晚6:00-8:00和周五晚7:00-9:00。辅导价格：每小时60元，报销车费(公交地铁)。具体协商。"  ></el-input>
        </el-form-item>
        <el-form-item label="辅导地点" prop="address">
          <el-input v-model="releaseForm.address"  placeholder="例如：广州市xx区xxxxx"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkname">
          <el-input v-model="releaseForm.linkname" placeholder="例如：何先生/陈小姐"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="linkphone">
          <el-input v-model="releaseForm.linkphone" placeholder="手机号/电话号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="release_visibleDialog = false">取消</el-button>
        <el-button type="primary" :loading="isSubmitting" @click="releaseSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getContectedList, republish } from '@/api/record/index'
export default {
  name: 'Contacted',
  data () {
    return {
      isLogined: false,
      isLoading: false,
      isSubmitting: false,
      user: {},
      dataList: [],
      release_visibleDialog: false,
      releaseForm: {},
      releaseRules: {
        studentsex: [{ required: true, message: '请选择学生性别', trigger: 'change' }],
        grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
        subject: [{ required: true, message: '请选择科目', trigger: 'change' }],
        requirement: [{ required: true, message: '请填写学生情况及教师要求', trigger: 'blur' }],
        address: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        linkname: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
        linkphone: [{ required: true, message: '请填写联系方式', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.isLogined = this.$store.state.isLogined
    this.user = JSON.parse(localStorage.getItem('user'))
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.isLoading = true
      getContectedList(this.user.userId).then(res => {
        console.log(res.data)
        this.dataList = res.data.list
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.isLoading = false
      })
    },
    // 点击重新发布
    handleRepublish (row) {
      this.release_visibleDialog = true
      this.releaseForm = { studentsex: row.studentsex, grade: row.grade, subject: row.subject, requirement: row.requirement, address: row.address, linkname: row.linkname, linkphone: row.linkphone, publisherId: row.publisherId }
    },
    // 重新发布提交
    releaseSubmit () {
      this.$refs.releaseForm1.validate(valid => {
        if (!valid) return
        this.$refs.releaseForm2.validate(vali => {
          if (!vali) return
          this.isSubmitting = true
          republish(this.releaseForm).then(res => {
            console.log(res.data)
            this.release_visibleDialog = false
            this.$alert(`发布家教成功！可在 [家教信息] 或 [我的家教] -> [未联系家教] 查看。`, '提示', {
              confirmButtonText: '确定'
            })
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.isSubmitting = false
          })
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-breadcrumb
  margin 10px 0 20px 0
  font-weight bold
.release-dialog
  position fixed
  top -80px !important
  >>> .el-dialog__body
    .inline-form
      .el-form-item
        .el-form-item__content
          width 140px
          .el-select
            width 100%
</style>
