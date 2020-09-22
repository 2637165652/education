import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/'

/**
 * 获取用户资料
 */
export function getUsermessage (userId) {
  return axios({
    url: '/get_usermessage',
    method: 'get',
    params: {
      userId
    }
  })
}

/**
 * 修改用户资料
 */
export function modifyUsermessage ({ userId, username, sex, phonenumber, address, identity, schoolname, studentId }) {
  return axios({
    url: '/modify_usermessage',
    method: 'post',
    data: {
      userId,
      username,
      sex,
      phonenumber,
      address,
      identity,
      schoolname,
      studentId
    }
  })
}

/**
 * 密码修改
 */
export function modifyPassword (userId, oldpassword, newpassword) {
  return axios({
    url: '/modify_password',
    method: 'post',
    data: {
      userId,
      oldpassword,
      newpassword
    }
  })
}
