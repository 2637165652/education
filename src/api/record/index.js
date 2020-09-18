import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/'

export function getUncontectList (userId) {
  return axios({
    url: '/get_uncontact',
    method: 'get',
    params: {
      userId
    }
  })
}

export function getContectedList (userId) {
  return axios({
    url: '/get_contacted',
    method: 'get',
    params: {
      userId
    }
  })
}

/**
 * 重新编辑发布
 */
export function republish ({ studentsex, grade, subject, requirement, address, linkname, linkphone, publisherId }) {
  return axios({
    url: '/re_release',
    method: 'post',
    data: {
      studentsex,
      grade,
      subject,
      requirement,
      address,
      linkname,
      linkphone,
      publisherId
    }
  })
}

/**
 * 修改家教信息
 */
export function modify ({ recordNum, studentsex, grade, subject, requirement, address, linkname, linkphone }) {
  return axios({
    url: '/modify',
    method: 'post',
    data: {
      recordNum,
      studentsex,
      grade,
      subject,
      requirement,
      address,
      linkname,
      linkphone
    }
  })
}

/**
 * 修改家教信息
 */
export function cancel (record = {}) {
  return axios({
    url: '/cancel',
    method: 'post',
    data: {
      record
    }
  })
}
