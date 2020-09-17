import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/'

export function getUncontectList (publisherId) {
  return axios({
    url: '/get_uncontact',
    method: 'get',
    params: {
      publisherId
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
