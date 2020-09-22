<template>
  <div class="home">
    <el-form class="filter-form" inline label-width="80px">
      <el-row>
        <el-col :xl="6" :lg="8" :md="8">
          <el-form-item label="家教编号">
            <el-input placeholder="请输入" v-model="query.recordNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8">
          <el-form-item label="年级">
            <el-select v-model="query.grade" placeholder="请选择" class="w-100">
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
        </el-col>
        <el-col :xl="6" :lg="8" :md="8">
          <el-form-item label="科目">
            <el-select v-model="query.subject" placeholder="请选择" class="w-100">
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
        </el-col>
        <el-col :xl="6" :lg="8" :md="8">
          <el-form-item label="学生性别">
            <el-select v-model="query.studentsex" placeholder="请选择" class="w-100">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8">
          <el-form-item label=" ">
            <el-button type="primary" icon="el-icon-search"
            @click="handleQuery">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :xl="6" :lg="8" :md="8">
          <el-form-item label=" ">
            <el-button type="primary" @click="handleRelease">发布家教</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="dataList" stripe style="width: 100%" border v-loading="isLoading">
      <el-table-column prop="recordNum" label="编号" width="80"></el-table-column>
      <el-table-column prop="studentsex" label="学生性别" width="100"></el-table-column>
      <el-table-column prop="grade" label="年级" width="100"></el-table-column>
      <el-table-column prop="subject" label="科目" width="100"></el-table-column>
      <el-table-column prop="requirement" label="具体情况及要求" width="400"></el-table-column>
      <el-table-column prop="address" label="辅导地点" ></el-table-column>
      <el-table-column prop="" label="操作" >
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleReceive(row)">领取家教</el-button>
        </template>
      </el-table-column>
    </el-table>
      <!-- hide-on-single-page -->
    <el-pagination
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handlePageChange"
      layout="prev, pager, next, total"
      :total="count"
    >
    </el-pagination>
    <!-- 领取家教 -->
    <el-dialog class="receive-dialog" title="领取家教"
      :visible.sync="receive_visibleDialog" width="400px"
      @closed = "receiveForm = { recordNum: '', name: '', phone: ''}">
      <el-form :model="receiveForm" label-width="80px" ref="receiveForm" :rules="receiveRules">
        <el-form-item label="编号" style="text-align: left;">
          <span >{{ receiveItem.recordNum }}</span>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="receiveForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="text" v-model="receiveForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="receive_visibleDialog = false">取消</el-button>
        <el-button type="primary" :loading="isSubmitting" @click="receiveSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 发布家教 -->
    <el-dialog class="release-dialog" title="发布家教"
      :visible.sync="release_visibleDialog" width="800px"
      @closed = "releaseForm = { name: '', phone: ''}">
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
import { getList, receive, release } from '@/api/home/index'
export default {
  name: 'Home',
  data () {
    return {
      isLogined: false,
      isLoading: false,
      isSubmitting: false,
      dataList: [],
      query: {
        recordNum: '',
        grade: '',
        subject: '',
        studentsex: ''
      },
      saveQuery: {},
      receive_visibleDialog: false,
      receiveForm: {
        name: '',
        phone: ''
      },
      receiveRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      },
      receiveItem: {
        studentsex: '',
        grade: '',
        subject: '',
        requirement: '',
        address: '',
        linkname: '',
        linkphone: '',
        publisherId: ''
      },
      release_visibleDialog: false,
      releaseForm: {
        studentsex: '',
        grade: '',
        subject: '',
        requirement: '',
        address: '',
        linkname: '',
        linkphone: ''
      },
      releaseRules: {
        studentsex: [{ required: true, message: '请选择学生性别', trigger: 'change' }],
        grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
        subject: [{ required: true, message: '请选择科目', trigger: 'change' }],
        requirement: [{ required: true, message: '请填写学生情况及教师要求', trigger: 'blur' }],
        address: [{ required: true, message: '请填写地址', trigger: 'blur' }],
        linkname: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
        linkphone: [{ required: true, message: '请填写联系方式', trigger: 'blur' }]
      },
      pageSize: 5,
      currentPage: 1,
      count: 11
    }
  },
  created () {
    this.isLogined = this.$store.state.isLogined
    this.getDataList()
  },
  methods: {
    getDataList (recordNum = '', grade = '', subject = '', studentsex = '', page = 1, pageSize = 5) {
      this.isLoading = true
      getList(recordNum, grade, subject, studentsex, page, pageSize).then(res => {
        console.log(res.data.pageHolder)
        this.pageSize = res.data.pageHolder.pageSize
        this.currentPage = res.data.pageHolder.currentPage
        this.count = res.data.pageHolder.count
        this.dataList = res.data.pageHolder.list
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.isLoading = false
      })
    },
    handlePageChange () {
      this.dataList = []
      console.log(this.currentPage)
      this.getDataList(this.saveQuery.recordNum, this.saveQuery.grade, this.saveQuery.subject, this.saveQuery.studentsex, this.currentPage)
    },
    handleQuery () {
      this.saveQuery = this.query
      this.getDataList(this.saveQuery.recordNum, this.saveQuery.grade, this.saveQuery.subject, this.saveQuery.studentsex)
    },
    handleReset () {
      this.query = { recordNum: '', grade: '', subject: '', studentsex: '' }
      this.saveQuery = this.query
      this.getDataList()
    },
    // 点击领取家教
    handleReceive (row) {
      if (!this.isLogined) {
        this.$confirm('您尚未登录, 是否前往登录/注册?', '提示', {
          confirmButtonText: '前往',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({ name: 'Login' })
        })
      } else {
        this.receiveItem = row
        this.receive_visibleDialog = true
      }
    },
    // 领取家教提交
    receiveSubmit () {
      this.$refs.receiveForm.validate(valid => {
        if (!valid) return
        this.isSubmitting = true
        var teacherId = JSON.parse(localStorage.getItem('user')).userId
        var query = Object.assign({}, this.receiveItem, { teacherId: teacherId, teachername: this.receiveForm.name, teacherphone: this.receiveForm.phone })
        receive(query).then(res => {
          console.log(res.data)
          if (res.data.code === 101 || res.data.code === 102) {
            this.$message({
              showClose: true,
              message: '领取家教失败，请重新尝试！',
              type: 'error'
            })
            return
          }
          this.receive_visibleDialog = false
          this.$alert(`领取家教成功！请尽快联系家长！联系信息请到 [我的家教] -> [已联系家教] 查看。`, '提示', {
            confirmButtonText: '确定'
          })
          this.getDataList()
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.isSubmitting = false
        })
      })
    },
    // 点击发布家教
    handleRelease () {
      if (!this.isLogined) {
        this.$confirm('您尚未登录, 是否前往登录/注册?', '提示', {
          confirmButtonText: '前往',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({ name: 'Login' })
        })
      } else {
        this.release_visibleDialog = true
      }
    },
    // 发布家教提交
    releaseSubmit () {
      this.$refs.releaseForm1.validate(valid => {
        if (!valid) return
        this.$refs.releaseForm2.validate(vali => {
          if (!vali) return
          this.isSubmitting = true
          var publisherId = JSON.parse(localStorage.getItem('user')).userId
          var query = Object.assign({}, this.releaseForm, { publisherId: publisherId })
          release(query).then(res => {
            console.log(res.data)
            if (res.data.code === 101) {
              this.$message({
                showClose: true,
                message: '发布家教失败，请重新尝试！',
                type: 'error'
              })
              return
            }
            this.release_visibleDialog = false
            this.$alert(`发布家教成功！可在 [家教信息] 或 [我的家教] -> [未联系家教] 查看。`, '提示', {
              confirmButtonText: '确定'
            })
            this.getDataList()
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
body{padding-right:0px!important}
.home
  // border 1px red solid
  padding 15px
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
