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
  if (req.query.recordNum === '') console.log('空')
  console.log(req.query, req.query.recordNum, req.query.grade, req.query.subject, req.query.studentsex)
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
  console.log(req.body)
  var sql = 'select * from usermessage where username = ? and password = ?'
  var sqlParams = [req.body.username, req.body.password]
  var response = {}
  connection.query(sql, sqlParams, function (err, result) {
    if (err) {
      console.log('[登录认证出错] - ', err.message)
      return
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

app.listen(8888, function () {
  console.log('Your app is running at http://127.0.0.1:8888')
})
