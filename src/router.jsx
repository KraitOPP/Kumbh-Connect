import React from 'react';
import {createBrowserRouter} from 'react-router-dom'

import MainLayout from './layout/mainLayout'
import AuthLayout from './layout/authLayout'
import HomePage from './Pages/Home'
import { LoginPage } from './Pages/Login';
import { RegisterPage } from './Pages/Register';
import { ForgetPasswordPage } from './Pages/ForgetPassword';


export const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children:[
        {
            path: "/",
            element: <HomePage />
        },
      ]
    },
    {
      path: "/user/",
      element: <AuthLayout />,
      children:[
        {
            path: "sign-in",
            element: <LoginPage />
        },
        {
            path: "sign-up",
            element: <RegisterPage />
        },
        {
            path: "forget-password",
            element: <ForgetPasswordPage />
        },
      ]
    },

]);