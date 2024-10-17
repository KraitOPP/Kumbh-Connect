import {
  Home,
  LineChart,
  User2,
  UserPenIcon,
} from "lucide-react"

import { Link, Outlet, useNavigate } from "react-router-dom"
import {  selectUser } from "@/slices/authSlice"
import {  useSelector } from "react-redux"
import { useEffect } from "react"
import { useLocation } from 'react-router-dom';
import icon from '../assets/icon.png';
import Navbar from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout() {

  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUser);
  const path = location.pathname;

  useEffect(() => {
    if (!userInfo && path != '/') {
      navigate('/accounts/sign-in', { replace: true });
    }
  }, [navigate, userInfo, path]);


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="w-32"><img className="w-full h-full" src={icon} alt="" /></span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to="/"
                className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${path === '/' ? 'text-primary' : 'text-muted-foreground'
                  }`}              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              {userInfo ? (
                  <>
                    <Link
                      to="/u/profile"
                      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${path === '/u/profile' ? 'text-primary' : 'text-muted-foreground'
                        }`}
                    >
                      <UserPenIcon className="h-4 w-4" />
                      Profile
                    </Link>
                    {userInfo.role === "admin" && (
                      <Link
                        to="/dashboard"
                        className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${path === '/admin/dashboard' ? 'text-primary' : 'text-muted-foreground'
                          }`}
                      >
                        <LineChart className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                  </>
                ):(
                  <>
                    <Link
                      to="/accounts/sign-in"
                      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${path === '/accounts/sign-in' ? 'text-primary' : 'text-muted-foreground'
                        }`}
                    >
                      <User2 className="h-4 w-4" />
                      Sign In
                    </Link>
                    <Link
                      to="/accounts/sign-up"
                      className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${path === '/accounts/sign-up' ? 'text-primary' : 'text-muted-foreground'
                        }`}
                    >
                      <UserPenIcon className="h-4 w-4" />
                      Sign Up
                    </Link>
                  </>
                )}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Toaster />
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}
