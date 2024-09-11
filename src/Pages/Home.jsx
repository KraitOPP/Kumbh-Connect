import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { logout, selectUser } from "@/slices/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { Link, replace } from "react-router-dom";


export default function HomePage() {

  const dispatch = useDispatch();
  const userInfo = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logout Successfully!",
      variant: "default",
    });
  }

  return (
    <div className="w-full flex justify-center items-center flex-col gap-5">
      <h1 className="text-3xl font-bold">
        Home Page
      </h1>
    </div>
  )
}