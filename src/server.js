var express = require('express')
var app = express()
var mysql = require('mysql')
var bodyParser = require('body-parser')
// var multer = require('multer')
// var upload = multer() // for parsing multipart/form-data 上传文件
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

// 设置跨域访问
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.sendStatus(200) /* 让options请求快速返回 */
  } else {
    next()
  }
})

// 需要修改 user和password 为当前电脑数据库的用户名和密码
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 需修改为当前电脑数据库的用户名
  password: '123456', // 需修改为当前电脑数据库的密码
  port: '3306',
  database: 'familyeducationsystem'
})
// 连接数据库
connection.connect()

// 获取家教信息
app.get('/family_education', (req, res) => {
  // console.log(req.query)
  var page = parseInt(req.query.page)
  var pageSize = parseInt(req.query.pageSize)
  var index = (page - 1) * pageSize
  // 多条件查询，动态拼接sql
  var sql = 'select * from record_uncontacted where 1=1'
  if (req.query.recordNum !== '') sql = sql + " and recordNum= '" + req.query.recordNum + "'"
  if (req.query.grade !== '') sql = sql + " and grade= '" + req.query.grade + "'"
  if (req.query.subject !== '') sql = sql + " and subject= '" + req.query.subject + "'"
  if (req.query.studentsex !== '') sql = sql + " and studentsex= '" + req.query.studentsex + "'"
  sql = sql + ' order by releaseDate desc' // 降序，最新发布的显示在上面
  connection.query(sql, function (err, result) {
    if (err) {
      console.log('[查询出错] - ', err.message)
      res.send({code: 101})
    } else {
      console.log('查询成功')
      var response = {
        code: 100,
        pageHolder: {
          pageSize: pageSize,
          currentPage: page,
          count: result.length,
          list: result.slice(index, index + pageSize)
        }
      }
      res.send(response)
    }
  })
})
// 用户登录
app.post('/login', function (req, res) {
  // console.log(req.body)
  var sql = 'select userId,username,password from usermessage where username = ? and password = ?'
  var sqlParams = [req.body.username, req.body.password]
  var response = {}
  connection.query(sql, sqlParams, function (err, result) {
    if (err) {
      console.log('[登录认证出错] - ', err.message)
      res.send({code: 101})
    }
    if (result.length === 1) {
      console.log('登陆认证成功')
      response = {
        status: 200,
        user: result[0]
      }
      res.send(response)
    } else {
      console.log('账号或密码错误')
      response = {
        status: 403
      }
      res.send(response)
    }
  })
})
// 用户注册
app.post('/register', function (req, res) {
  // console.log(req.body)
  // 判断用户名是否已经存在
  var sql = 'select * from usermessage where username = ?'
  var sqlParams = [req.body.username]
  var response = {}
  connection.query(sql, sqlParams, function (err, result) {
    if (err) {
      console.log(err.message)
      res.send({code: 101})
    }
    if (result.length === 1) {
      console.log('此用户名已存在！')
      response = {
        status: 401
      }
      res.send(response)
    } else {
      // 将用户注册信息插入用户表
      sql = 'insert into usermessage(username,password) values(?,?)'
      sqlParams = [req.body.username, req.body.password]
      connection.query(sql, sqlParams, function (err2, result2) {
        if (err2) {
          console.log(err2.message)
          res.send({code: 101})
        } else {
          console.log('用户注册成功')
          sql = 'select userId,username,password from usermessage where username=?'
          sqlParams = [req.body.username]
          connection.query(sql, sqlParams, function (err3, result3) {
            response = {
              status: 200,
              // 将用户id，name，password返回
              user: result3[0]
            }
            res.send(response)
          })
        }
      })
    }
  })
})

// 领取家教
app.post('/receive', function (req, res) {
  console.log(req.body)
  var date = new Date(req.body.releaseDate)
  var releaseDate = date.toLocaleDateString()
  // 将该份家教移入已联系记录表
  var insertSql = 'insert into record_contacted values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  var sqlParams1 = [req.body.recordNum, req.body.studentsex, req.body.grade, req.body.subject, req.body.requirement,
    req.body.address, req.body.linkname, req.body.linkphone, req.body.publisherId, releaseDate,
    req.body.teachername, req.body.teacherphone, req.body.teacherId]
  date = new Date()
  var receiveDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  sqlParams1.push(receiveDate)
  connection.query(insertSql, sqlParams1, function (err1, result1) {
    if (err1) {
      console.log('插入记录出错-' + err1.message)
      res.send({code: 101})
    } else {
      // 从未联系表中删除该份家教
      var deleteSql = 'delete from record_uncontacted where recordNum=?'
      var sqlParams2 = [req.body.recordNum]
      connection.query(deleteSql, sqlParams2, function (err2, result2) {
        if (err2) {
          console.log('删除出错' + err2.message)
          res.send({code: 102})
        } else {
          console.log('插入已联系并删除未联系记录成功')
          res.send({code: 100})
        }
      })
    }
  })
})

// 发布家教
app.post('/release', function (req, res) {
  // console.log(req.body)
  var date = new Date()
  var releaseDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  var sql = 'insert into record_uncontacted(studentsex,grade,subject,requirement,address,linkname,linkphone,publisherId,releaseDate) value(?,?,?,?,?,?,?,?,?)'
  var sqlParams = [req.body.studentsex, req.body.grade, req.body.subject, req.body.requirement, req.body.address,
    req.body.linkname, req.body.linkphone, req.body.publisherId, releaseDate]
  connection.query(sql, sqlParams, function (err, result) {
    if (err) {
      console.log('[登记家教出错] - ', err.message)
      res.send({code: 101})
    } else {
      console.log('登记家教成功')
      res.send({code: 100})
    }
  })
})
// 我的家教 > 未联系
app.get('/get_uncontact', (req, res) => {
  // console.log(req.query)
  var sql = 'select * from record_uncontacted where publisherId=? order by releaseDate desc' // 降序
  var sqlParams = [req.query.publisherId]
  connection.query(sql, sqlParams, function (err, result) {
    if (err) {
      console.log('[查询记录出错] - ' + err.message)
      res.send({code: 101})
    } else {
      console.log('查询记录成功')
      var response = {
        code: 100,
        list: result
      }
      res.send(response)
    }
  })
})
// 我的家教 > 已联系
app.get('/get_contacted', (req, res) => {
  // console.log(req.query)
  var sql = 'select * from record_contacted where publisherId=? or teacherId=? order by receiveDate desc'
  var sqlParams = [req.query.userId, req.query.userId]
  connection.query(sql, sqlParams, function (err, result) {
    if (err) {
      console.log('[查询记录出错] - ' + err.message)
      res.send({code: 101})
    } else {
      console.log('查询记录成功')
      var response = {
        code: 100,
        list: result
      }
      res.send(response)
    }
  })
})

// 已联系 -> 重新编辑发布
app.post('/re_release', (req, res) => {
  console.log(req.body)
  var date = new Date()
  var releaseDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  var sql = 'insert into record_uncontacted(studentsex,grade,subject,requirement,address,linkname,linkphone,publisherId,releaseDate) value(?,?,?,?,?,?,?,?,?)'
  var sqlParams = [req.body.studentsex, req.body.grade, req.body.subject, req.body.requirement,
    req.body.address, req.body.linkname, req.body.linkphone, req.body.publisherId, releaseDate]
  connection.query(sql, sqlParams, function (err, result) {
    if (err) {
      console.log('[发布家教出错] - ', err.message)
      res.send({code: 101})
    } else {
      console.log('发布家教成功')
      res.send({code: 100})
    }
  })
})

app.listen(8888, function () {
  console.log('Your app is running at http://127.0.0.1:8888')
})
