import React from 'react'
import { Login } from '@/pages'
import Layout from '@/layouts'
import { loginAuthLoader, rootAuthLoader } from './utils/loaders'
import lazyLoad from './utils/lazyLoad'
import { Navigate } from 'react-router-dom'

const routes = [
  {
    id: 'Login',
    path: '/login',
    loader: loginAuthLoader,
    element: <Login />,
    meta: {
      needAuth: false,
      title: '登录页',
      key: 'login'
    }
  },
  // {
  //   id: 'LoginByToken',
  //   path: '/login-by-token',
  //   loader: loginAuthLoader,
  //   element: lazyLoad(React.lazy(async () => import('@/pages/login/loginByToken')))
  // },
  {
    id: 'root',
    path: '/',
    loader: rootAuthLoader,
    element: <Layout />,
    children: [
      {
        id: 'redirect to /home',
        path: '',
        element: <Navigate replace to="/home" />
      },
      {
        id: '主页',
        path: 'home',
        handle: {
          title: '主页',
          icon: 'appstore-outlined'
        },
        element: lazyLoad(React.lazy(async () => import('@/pages/home')))
      },
      {
        handle: {
          title: 'FFmpeg',
          icon: 'appstore-outlined'
        },
        id: 'FFmpeg',
        path: 'FFmpeg',
        element: lazyLoad(React.lazy(async () => import('@/pages/home/FFmpeg')))
      }
    ]
  },
  {
    id: '/404',
    path: '*',
    element: lazyLoad(React.lazy(async () => import('@/pages/404')))
  }
]

export default routes
