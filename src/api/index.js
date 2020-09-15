import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/'

/**
 * @param {string} name
 */
export function getList (recordNum = '111', grade = '', subject = '', studentsex = '', page = 1, pageSize = 6) {
  return axios({
    url: '/family_education',
    method: 'get',
    params: {
      recordNum,
      grade,
      subject,
      studentsex,
      page,
      pageSize
    }
  })
}

export function login (username, password) {
  return axios({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
