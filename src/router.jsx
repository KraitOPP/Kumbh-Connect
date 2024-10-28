import React from 'react';
import {createBrowserRouter} from 'react-router-dom'

import MainLayout from './layout/mainLayout'
import AuthLayout from './layout/authLayout'
import HomePage from './Pages/Home'
import { LoginPage } from './Pages/Login';
import { RegisterPage } from './Pages/Register';
import { ForgetPasswordPage } from './Pages/ForgetPassword';
import Error404Page from './Pages/Error404';
import { ProfilePage } from './Pages/UserPages/Profile';
import AdminDashboardPage from './Pages/AdminPages/AdminDashboard';
import { AddItemCategoryPage } from './Pages/AdminPages/ItemCategory';
import ReportItemPage  from './Pages/UserPages/reportItem';
import CategoryItems from './Pages/CategoryItems';
import ItemPage from './Pages/Item';
import UserListingPage from './Pages/AdminPages/UsersPage/users-listing-page';


export const router = createBrowserRouter([
    {
      path:"*",
      element: <Error404Page />
    },
    {
      path: "/accounts/",
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
    {
      path:"/dashboard/",
      element: <MainLayout />,
      children:[
        {
          path: "",
          element:<AdminDashboardPage />
        },
        {
          path: "users",
          element:<UserListingPage />
        },
        {
          path: "category/add-new",
          element:<AddItemCategoryPage />
        }
      ]
    },
    {
      path: "/",
      element: <MainLayout />,
      children:[
        {
            path: "/",
            element: <HomePage />
        },
        {
            path: "/u/profile",
            element: <ProfilePage />
        },
        {
            path: "/category/:categoryId",
            element: <CategoryItems />
        },
        {
            path: "/item/:itemId",
            element: <ItemPage />
        },
        {
            path: "/report/item",
            element: <ReportItemPage />
        },
      ]
    },

]);