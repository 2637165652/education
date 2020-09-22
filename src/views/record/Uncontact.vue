<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的家教</el-breadcrumb-item>
      <el-breadcrumb-item>未联系家教</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="dataList" stripe style="width: 100%" border v-loading="isLoading">
      <el-table-column prop="recordNum" label="编号" width="80"></el-table-column>
      <el-table-column prop="studentsex" label="学生性别" ></el-table-column>
      <el-table-column prop="grade" label="年级" ></el-table-column>
      <el-table-column prop="subject" label="科目" ></el-table-column>
      <el-table-column prop="requirement" label="具体情况及要求" width="300"></el-table-column>
      <el-table-column prop="address" label="辅导地点" ></el-table-column>
      <el-table-column prop="linkname" label="家长" ></el-table-column>
      <el-table-column prop="linkphone" label="家长电话" ></el-table-column>
      <el-table-column prop="releaseDate" label="发布日期" >
        <template slot-scope="{ row }">
          {{ row.releaseDate | moment }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" >
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleModify(row)">修改</el-button>
          <el-button type="text" @click="handleCancel(row)">撤销</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改家教 -->
    <el-dialog class="modify-dialog" title="修改家教信息"
      :visible.sync="modify_visibleDialog" width="800px"
      @closed = "modifyForm = {}">
      <el-form :inline="true" ref="modifyForm1" :model="modifyForm" :rules="modifyRules" class="inline-form">
        <el-form-item label="学生性别" prop="studentsex">
          <el-select v-model="modifyForm.studentsex" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <el-select v-model="modifyForm.grade" placeholder="请选择">
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
          <el-select v-model="modifyForm.subject" placeholder="请选择">
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
      <el-form ref="modifyForm2" :model="modifyForm" :rules="modifyRules" label-width="140px">
        <el-form-item label="学生情况及教师要求" prop="requirement">
          <el-input type="textarea" :rows="5" v-model="modifyForm.requirement"  placeholder="请参考下面的格式填写此项"></el-input>
        </el-form-item>
        <el-form-item label="参考格式">
          <el-input type="textarea" :rows="4" resize="none" value="学生是一名初二的女生，性格文静，成绩中等，想找一位教师辅导数学。要求教师认真负责，有辅导经验，有学习方法。 辅导时间：每周2次，每次2小时，周三晚6:00-8:00和周五晚7:00-9:00。辅导价格：每小时60元，报销车费(公交地铁)。具体协商。"  ></el-input>
        </el-form-item>
        <el-form-item label="辅导地点" prop="address">
          <el-input v-model="modifyForm.address"  placeholder="例如：广州市xx区xxxxx"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkname">
          <el-input v-model="modifyForm.linkname" placeholder="例如：何先生/陈小姐"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="linkphone">
          <el-input v-model="modifyForm.linkphone" placeholder="手机号/电话号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modify_visibleDialog = false">取消</el-button>
        <el-button type="primary" :loading="isSubmitting" @click="modifySubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUncontectList, modify, cancel } from '@/api/record/index'
export default {
  name: 'Uncontact',
  data () {
    return {
      isLogined: false,
      isLoading: false,
      isSubmitting: false,
      dataList: [],
      modify_visibleDialog: false,
      modifyForm: {},
      modifyRules: {
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
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.isLoading = true
      var userId = JSON.parse(localStorage.getItem('user')).userId
      getUncontectList(userId).then(res => {
        console.log(res.data)
        this.dataList = res.data.list
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.isLoading = false
      })
    },
    // 点击修改
    handleModify (row) {
      this.modify_visibleDialog = true
      this.modifyForm = { recordNum: row.recordNum, studentsex: row.studentsex, grade: row.grade, subject: row.subject, requirement: row.requirement, address: row.address, linkname: row.linkname, linkphone: row.linkphone }
    },
    // 修改家教提交
    modifySubmit () {
      this.$refs.modifyForm1.validate(valid => {
        if (!valid) return
        this.$refs.modifyForm2.validate(vali => {
          if (!vali) return
          this.isSubmitting = true
          modify(this.modifyForm).then(res => {
            console.log(res.data)
            this.modify_visibleDialog = false
            this.$notify({
              title: '通知',
              type: 'success',
              message: '修改成功'
            })
            this.getDataList()
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.isSubmitting = false
          })
        })
      })
    },
    // 点击撤销
    handleCancel (row) {
      this.$confirm('您将撤销该份家教信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancel(row).then(res => {
          console.log(res)
          this.$notify({
            title: '通知',
            type: 'success',
            message: '撤销成功'
          })
          this.getDataList()
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          //
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
.modify-dialog
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
