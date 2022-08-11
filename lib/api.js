import Axios from 'axios'

export const apiEndpoints = {
  ACCOUNT_METADATA: '/api/_/account_metadata',
  USER_REGISTER: '/api/v1/user_register',
  USER_LOGIN: '/api/v1/user_login',
  USER_LOGOUT: '/api/v1/user_logout',
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_OONI_API,
  withCredentials: true
})

export const getAPI = async (endpoint, params = {}, config = {}) => {
  return await axios.request({
    method: config.method ?? 'GET',
    url: endpoint,
    params: params,
    ...config
  })
    .then(res => res.data)
    .catch(e => {
      const error = new Error(e?.response?.data?.error ?? e.message)
      error.info = e?.response?.statusText
      error.status = e?.response?.status
      throw error
    })
}

const postAPI = async (endpoint, params, config) => {
  return await getAPI(endpoint, null, { method: 'POST', data: params })
}

export const registerUser = async (email_address, redirectUrl = 'https://explorer.ooni.org' ) => {
  const redirectTo = process.env.NODE_ENV === 'development' ? 
    'https://explorer.ooni.org' : 
    redirectUrl

  console.debug('Called registerUser with', email_address)
  const data = await postAPI(apiEndpoints.USER_REGISTER, {
    email_address,
    redirect_to: redirectTo,
  })
  return data
}

export const loginUser = async (token) => {
  return await getAPI(apiEndpoints.USER_LOGIN, { k: token })
}

export const fetcher = async (url) => {
  try {
    const res = await axios.get(url)
    return res.data.rules ?? res.data
  } catch (e) {
    const error = new Error(e?.response?.data?.error ?? e.message)
    error.info = e?.response?.statusText
    error.status = e?.response?.status
    throw error
  }
}