import {
    CircleUser,
    Home,
    Menu,
    Package2,
    Search,
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
  import { Link, useNavigate } from "react-router-dom";
  import { logout, selectUser } from "@/slices/authSlice";
  import { useDispatch, useSelector } from "react-redux";
  import { useLocation } from "react-router-dom";
  import { toast } from "@/components/ui/use-toast";
  import { useState, useEffect } from "react";
  import { useGetItemMutation } from "@/slices/itemSlice";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Check, ChevronsUpDown } from "lucide-react";
  import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
  
  export default function Navbar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector(selectUser);
    const path = location.pathname;
    const [items, setItems] = useState([]);
    const [getItems, { isLoading: isProcessing }] = useGetItemMutation();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
  
    const handleLogout = () => {
      dispatch(logout());
      toast({
        title: "Logout Successfully.",
      });
    };
  
    useEffect(() => {
      const fetchItems = async () => {
        try {
          const res = await getItems().unwrap();
          if (res.success) {
            setItems(res.items);
          } else {
            toast({
              title: "Failed to Search Items",
              description: res.message,
            });
          }
        } catch (error) {
          toast({
            title: "Failed to Search Items",
            description: res.message,
          });
        }
      };
  
      fetchItems();
    }, []);
  
    const handleItemClick = (id) => {
      navigate(`/item/${id}`);
      setSearchQuery("");
      setFilteredItems([]);
      setValue("")
    };
  
    const handleSelect = (currentValue) => {
        const selectedItem = items.find(item => item.name === currentValue);
        if (selectedItem) {
          handleItemClick(selectedItem._id);
        }
        setValue("");
        setOpen(false);
      };
      
  
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
                  <span className="text-muted-foreground">
                    Mahakumbh Lost & Found
                  </span>
                </Link>
                <Link
                  to="/"
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                    path === "/" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] md:w-[400px] lg:w-[600px] justify-between"
                >
                  {value
                    ? items.find(item => item.name === value)?.name
                    : "Search items..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] md:w-[400px] lg:w-[600px] p-0">
                <Command>
                  <CommandInput placeholder="Search items..." onChange={(e) => setSearchQuery(e.target.value)} />
                  <CommandList>
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandGroup>
                      {items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                        <CommandItem
                          key={item._id}
                          value={item.name}
                          onSelect={() => handleSelect(item.name)}
                        >
                          <Check className={`mr-2 h-4 w-4 ${value === item.name ? "opacity-100" : "opacity-0"}`} />
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-46">
              {userInfo ? (
                <>
                  <DropdownMenuLabel>
                    <p className="font-bold text-2xl"> Hi {userInfo?.firstName},</p>
                    {userInfo.role === "admin" ? (
                      <div className="mt-2 ">
                        <Link to={"/dashboard"}>
                          <p className="text-sm">View Admin Dashboard</p>
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-2 ">
                        <Link to={"/u/profile"}>
                          <p className="text-sm">View Profile</p>
                        </Link>
                      </div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="w-46 flex justify-center">
                    <Button onClick={() => handleLogout()} className="m-0 w-40">
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <Link to={"/accounts/sign-in"}>
                    <DropdownMenuItem>Login</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link to={"/accounts/sign-up"}>
                    <DropdownMenuItem>Register</DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </>
    );
  }
  