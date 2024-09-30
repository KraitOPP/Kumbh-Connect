import {
    CircleUser,
    Home,
    Menu,
    Package2,
    Search,
  } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Input } from "@/components/ui/input"
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
  import { Link, useNavigate } from "react-router-dom"
  import { logout, selectUser } from "@/slices/authSlice"
  import { useDispatch, useSelector } from "react-redux"
  import { useLocation } from 'react-router-dom';
  import { toast } from "@/components/ui/use-toast"
import { Toaster } from "./ui/toaster"
  
export default function Navbar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const userInfo = useSelector(selectUser);
    const path = location.pathname;
    
  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logout Successfully."
    });
  }

    return (
        <>
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                        <nav className="grid gap-2 text-lg font-medium">
                            <Link
                                to="/"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6" />
                                <span className="text-muted-foreground">Mahakumbh Lost & Found</span>
                            </Link>
                            <Link
                                to="/"
                                className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${path === '/' ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                <Home className="h-5 w-5" />
                                Home
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="w-full flex-1">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                        />
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-46">
                        {
                            userInfo ? <>
                                <DropdownMenuLabel>
                                    <p className="font-bold text-2xl"> Hi {userInfo?.firstName},</p>
                                    {
                                        userInfo.role == 'admin' ? <>
                                            <div className="mt-2 ">
                                                <Link to={'/dashboard'} >
                                                    <p className="text-sm">View Admin Dashboard</p>
                                                </Link>
                                            </div>
                                        </> : <>
                                            <div className="mt-2 ">
                                                <Link to={'/u/profile'} >
                                                    <p className="text-sm">View Profile</p>
                                                </Link>
                                            </div>
                                        </>
                                    }

                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="w-46 flex justify-center">
                                    <Button onClick={() => handleLogout()} className="m-0 w-40">
                                        Logout
                                    </Button>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="w-46">
                                </DropdownMenuItem>
                            </> :
                                <>
                                    <Link to={'/accounts/sign-in'}>
                                        <DropdownMenuItem>
                                            Login
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <Link to={'/accounts/sign-up'}>
                                        <DropdownMenuItem>
                                            Register
                                        </DropdownMenuItem>
                                    </Link>
                                </>
                        }

                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
        </>
    )
}
