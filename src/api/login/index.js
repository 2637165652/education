import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/'

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
