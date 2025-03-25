import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Home,
  Users,
  User,
  LayoutDashboard,
  PlusSquare,
  Menu,
  X,
  Bell,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {SearchModal} from "@/components/SearchModal.tsx";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { to: "/feed", label: "Feed", icon: <Users className="h-4 w-4" /> },
    { to: "/profile", label: "Profile", icon: <User className="h-4 w-4" /> },
    { to: "/profile/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: "/profile/add", label: "New Post", icon: <PlusSquare className="h-4 w-4" /> },
  ];

  return (
      <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              scrolled
                  ? 'py-2 bg-white/90 backdrop-blur-md shadow-sm'
                  : 'py-4 bg-white'
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Mediafy
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                  <Link
                      key={item.to}
                      to={item.to}
                      className="relative px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 group"
                      activeProps={{
                        className: "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full"
                      }}
                  >
                <span className="flex items-center gap-1.5">
                  {item.icon}
                  {item.label}
                </span>
                  </Link>
              ))}
            </nav>

            {/* Actions Section */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Search Button */}
              <SearchModal />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full relative">
                    <Bell className="h-[1.2rem] w-[1.2rem]" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                        <DropdownMenuItem key={i} className="py-2 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://picsum.photos/seed/avatar${i}/32/32`} />
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm"><span className="font-medium">User{i}</span> liked your post</span>
                              <span className="text-xs text-muted-foreground">2 hours ago</span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/avatar.jpg" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile/dashboard" className="flex w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile/add" className="flex w-full">Create Post</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/*<DropdownMenuItem>*/}
                  {/*  <Link to="/settings" className="flex w-full">Settings</Link>*/}
                  {/*</DropdownMenuItem>*/}
                  <DropdownMenuItem className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="h-9 w-9"
              >
                {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            {navItems.map((item) => (
                <Link
                    key={item.to}
                    to={item.to}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                    activeProps={{
                      className: "bg-blue-50 text-blue-600"
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
                </Link>
            ))}

            <div className="flex items-center justify-between pt-2">
              {/* Mobile Search Button */}
              <SearchModal />

              {/* Mobile Notifications Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-64">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                        <DropdownMenuItem key={i} className="py-2 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://picsum.photos/seed/avatar${i}/32/32`} />
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm"><span className="font-medium">User{i}</span> liked your post</span>
                              <span className="text-xs text-muted-foreground">2 hours ago</span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatar.jpg" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/profile" className="flex w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/profile/dashboard" className="flex w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMobileMenuOpen(false)}>
                    <Link to="/profile/add" className="flex w-full">Create Post</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/*<DropdownMenuItem onClick={() => setMobileMenuOpen(false)}>*/}
                  {/*  <Link to="/settings" className="flex w-full">Settings</Link>*/}
                  {/*</DropdownMenuItem>*/}
                  <DropdownMenuItem className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
  );
}