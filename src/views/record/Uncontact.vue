<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>我的家教</el-breadcrumb-item>
      <el-breadcrumb-item>未联系家教</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="dataList" stripe style="width: 100%" border v-loading="isLoading">
      <el-table-column prop="recordNum" label="编号" width="100"></el-table-column>
      <el-table-column prop="studentsex" label="学生性别" width="100"></el-table-column>
      <el-table-column prop="grade" label="年级" width="100"></el-table-column>
      <el-table-column prop="subject" label="科目" width="100"></el-table-column>
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
  </div>
</template>

<script>
import { getUncontectList } from '@/api/record/index'
export default {
  name: 'Uncontact',
  data () {
    return {
      isLogined: false,
      isLoading: false,
      dataList: []
    }
  },
  created () {
    this.isLogined = this.$store.state.isLogined
    var publisherId = JSON.parse(localStorage.getItem('user')).userId
    this.getDataList(publisherId)
  },
  methods: {
    getDataList (publisherId) {
      this.isLoading = true
      getUncontectList(publisherId).then(res => {
        console.log(res.data)
        this.dataList = res.data.list
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.isLoading = false
      })
    },
    // 点击修改
    handleModify () {
      //
    },
    // 点击撤销
    handleCancel () {
      //
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-breadcrumb
  margin 10px 0 20px 0
  font-weight bold

</style>
