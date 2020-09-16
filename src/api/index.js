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

export function register (username, password) {
  return axios({
    url: '/register',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function receive ({ recordNum, grade, subject, studentsex, requirement, address, linkname, linkphone, releaseDate, publisherId, teacherId, teachername, teacherphone }) {
  return axios({
    url: '/receive',
    method: 'post',
    data: {
      recordNum,
      grade,
      subject,
      studentsex,
      requirement,
      address,
      linkname,
      linkphone,
      releaseDate,
      publisherId,
      teacherId,
      teachername,
      teacherphone
    }
  })
}

export function release ({ grade, subject, studentsex, requirement, address, linkname, linkphone, publisherId }) {
  return axios({
    url: '/release',
    method: 'post',
    data: {
      grade,
      subject,
      studentsex,
      requirement,
      address,
      linkname,
      linkphone,
      publisherId
    }
  })
}
