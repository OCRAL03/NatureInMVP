import axios from 'axios'

const base = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL: base,
  timeout: 8000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

function onRefreshed(token: string) {
  pendingRequests.forEach((cb) => cb(token))
  pendingRequests = []
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh')
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status
    const originalRequest = error.config
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refresh = localStorage.getItem('refresh')
      if (!refresh) {
        logout()
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }
      isRefreshing = true
      try {
        const { data } = await axios.post('/api/auth/token/refresh/', { refresh })
        const newToken = data?.access
        if (newToken) {
          localStorage.setItem('token', newToken)
          isRefreshing = false
          onRefreshed(newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch (e) {
        logout()
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default api
