import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

type Result<T> = {
  data: T
  message: string
  status: number
}

const config = {
  // 默认地址请求地址，可在 .env 开头文件中修改
  baseURL: '/api',
  // 设置超时时间（10s）
  timeout: 60000,
  // 跨域时候允许携带凭证
  withCredentials: true
}

export class Request {
  instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.instance.defaults.withCredentials = true

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token') as string
        if (token !== '') {
          config.headers.Authorization = token
        }

        return config
      },
      async (err: any) => {
        console.log('err: ', err)
        return await Promise.reject(err)
      }
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return res.data.data
      },
      async (err: any) => {
        let message = ''
        switch (err.response.status) {
          case 400:
            message = '请求错误(400)'
            break
          case 401:
            message = '未授权，请重新登录(401)'
            break
          case 403:
            message = '拒绝访问(403)'
            break
          case 404:
            message = '请求出错(404)'
            break
          case 408:
            message = '请求超时(408)'
            break
          case 500:
            message = '服务器错误(500)'
            break
          case 501:
            message = '服务未实现(501)'
            break
          case 502:
            message = '网络错误(502)'
            break
          case 503:
            message = '服务不可用(503)'
            break
          case 504:
            message = '网络超时(504)'
            break
          case 505:
            message = 'HTTP版本不受支持(505)'
            break
          default:
            message = `连接出错(${err.response.status as string})!`
        }
        console.error(message)

        return await Promise.reject(err.response)
      }
    )
  }

  public async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return await this.instance.request(config)
  }

  public async get<T = any>(
    url: string,
    params?: object,
    config: AxiosRequestConfig = {}
  ): Promise<T> {
    return await this.instance.get(url, { params, ...config })
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return await this.instance.post(url, data, config)
  }

  // https://axios-http.com/docs/multipart
  public async postForm<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return await this.instance.postForm(url, data, config)
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return await this.instance.put(url, data, config)
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Result<T>>> {
    return await this.instance.delete(url, config)
  }
}

export default new Request(config)
