"use client"

import { useState, useRef, useEffect } from "react"
import {
  Briefcase,
  Building2,
  ChevronDown,
  Compass,
  FileEdit,
  GraduationCap,
  Hammer,
  LogOut,
  MapPin,
  Menu,
  Phone,
  Settings,
  User,
  FileText,
  Bell,
  UserCog,
  ClipboardList,
  X,
  Check,
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/CVNest_logo.jpg"
import { ROUTES } from "@/routes/routes"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { isAuthenticated, getUserData, getUserRole, clearAuthData } from "@/helper/storage"
import { toast } from "react-toastify"
import auth from "@/api/auth"
import notification from "@/api/notification"
import websocketService from "@/api/websocket"
import { formatDistanceToNow } from "date-fns"
import viLocale from "date-fns/locale/vi"

const CategoryItem = ({ icon: Icon, title, onMouseOver }) => (
  <Link to="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted" onMouseOver={onMouseOver}>
    <Icon className="h-4 w-4" />
    <div className="text-sm font-medium">{title}</div>
  </Link>
)

// Subitem component for category dropdowns
const SubItem = ({ title }) => (
  <Link to="#" className="block py-1 hover:underline">
    {title}
  </Link>
)

export default function Header({ className }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState("capbac")
  const [showCongCuDropdown, setShowCongCuDropdown] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notificationSubscription, setNotificationSubscription] = useState(null)
  
  const congCuRef = useRef(null)
  const notificationRef = useRef(null)
  const navigate = useNavigate()
  
  const authenticated = isAuthenticated()
  const userData = getUserData()
  const userRole = getUserRole()
  const isHR = userRole === "HR"

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (congCuRef.current && !congCuRef.current.contains(event.target)) {
        setShowCongCuDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (authenticated && userData?.id && isHR) {
      websocketService.connect();
      
      const subscription = websocketService.subscribeToUserNotifications(
        userData.id,
        handleNewNotification
      );
      
      setNotificationSubscription(subscription);
      
      fetchNotifications();
    }
    
    return () => {
      if (notificationSubscription) {
        const topic = `/user/${userData?.id}/topic/notifications`;
        websocketService.unsubscribeFromTopic(topic);
      }
    };
  }, [authenticated, userData?.id, isHR])

  const handleNewNotification = (notification) => {
    console.log('New notification received:', notification);
    
    setNotifications(prev => [notification, ...prev]);
    
    setUnreadCount(prev => prev + 1);
    
    toast.info(notification.content, {
      position: "top-right",
      autoClose: 5000,
    });
  }

  const fetchNotifications = async () => {
    if (!userData?.id) return
    
    setIsLoadingNotifications(true)
    try {
      const response = await notification.getNotifications(userData.id)
      console.log("Fetched notifications:", response.data)
      if (response.data?.data) {
        const notificationData = response.data.data
        setNotifications(notificationData)
        
        const unreadNotifications = notificationData.filter(
          notif => notif.status === "UNREAD"
        )
        setUnreadCount(unreadNotifications.length)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoadingNotifications(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notification.markAsRead(notificationId)
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: "READ" } 
            : notif
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
      
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleNotificationClick = (notif) => {
    if (notif.status === "UNREAD") {
      handleMarkAsRead(notif.id)
    }
    
    if (notif.type === "JOB_APPLICATION") {
      navigate(`/hr/applications/${notif.entityId}`)
    }
    
    setShowNotifications(false)
  }

  const formatNotificationTime = (timeString) => {
    try {
      const date = new Date(timeString)
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: viLocale
      })
    } catch (error) {
      console.error("Error formatting notification time:", error)
      return "unknown time"
    }
  }

  // Data for categories and their subitems
  const categories = {
    capbac: {
      title: "Theo cấp bậc",
      icon: GraduationCap,
      items: ["Intern", "Fresher", "Junior", "Middle", "Senior"],
    },
    loaihinh: {
      title: "Theo loại hình",
      icon: Settings,
      items: ["Toàn thời gian", "Bán thời gian", "Từ xa"],
    },
    diadiem: {
      title: "Theo địa điểm",
      icon: MapPin,
      items: ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"],
    },
    kynang: {
      title: "Theo kỹ năng",
      icon: Hammer,
      items: ["JavaScript", "React", "Node.js"],
    },
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      websocketService.disconnect();
      
      await auth.logout()
      clearAuthData()
      toast.success("Đăng xuất thành công!", {
        position: "top-right",
        autoClose: 2000,
      })
      navigate("/")
    } catch (error) {
      console.error("Logout error:", error)
      websocketService.disconnect();
      clearAuthData()
      navigate("/")
    }
  }

  // HR menu items
  const hrMenuItems = [
    { icon: UserCog, title: "Quản lý thông tin cá nhân", link: "/profile" },
    { icon: ClipboardList, title: "Quản lý tin tuyển dụng", link: "/hr/jobs" },
    { icon: FileText, title: "Quản lý CV ứng tuyển", link: ROUTES.HR_APPLICATIONS },
  ]

  // User menu items
  const userMenuItems = [
    { icon: UserCog, title: "Quản lý thông tin cá nhân", link: "/profile" },
    { icon: FileText, title: "Quản lý CV", link: ROUTES.CVMANAGEMENT },
    { icon: ClipboardList, title: "Quản lý CV ứng tuyển", link: ROUTES.APPLICATIONS },
  ]

  const menuItems = userRole === "HR" ? hrMenuItems : userMenuItems

  const renderNotificationItem = (notif) => {
    return (
      <div 
        key={notif.id}
        onClick={() => handleNotificationClick(notif)}
        className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${
          notif.status === "UNREAD" ? "bg-blue-50" : ""
        }`}
      >
        <div className="flex-shrink-0">
          {/* You can use different icons based on notification type */}
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <FileText className="h-5 w-5" />
          </div>
        </div>
        <div className="flex-grow">
          <div className="text-sm font-medium">{notif.title}</div>
          <p className="text-xs text-gray-600 line-clamp-2">{notif.content}</p>
          <div className="text-xs text-gray-500 mt-1">{formatNotificationTime(notif.createdAt)}</div>
        </div>
        {notif.status === "UNREAD" && (
          <div className="flex-shrink-0 self-center">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className={`${className} border-b fixed top-0 left-0 w-full bg-white z-50`}>
      <div className="container mx-auto flex h-[var(--header-height)] items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link to="/">
            <img src={logo || "/placeholder.svg"} className="h-12 w-12" alt="CVNest" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:flex-1">
          <NavigationMenu className="mx-6">
            <NavigationMenuList>
              {/* Việc làm IT */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Việc làm IT
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-5 p-4">
                    <div className="col-span-2 space-y-2 border-r pr-4">
                      {Object.entries(categories).map(([key, category]) => (
                        <CategoryItem
                          key={key}
                          icon={category.icon}
                          title={category.title}
                          onMouseOver={() => setHoveredItem(key)}
                        />
                      ))}
                    </div>
                    <div className="col-span-3 pl-4">
                      {categories[hoveredItem] && (
                        <div className="space-y-2">
                          <div className="font-medium mb-2">{categories[hoveredItem].title}</div>
                          {categories[hoveredItem].items.map((item) => (
                            <SubItem key={item} title={item} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Công ty IT */}
              <NavigationMenuItem>
                <Link to={ROUTES.COMPANIES} className={navigationMenuTriggerStyle()}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Công ty IT
                </Link>
              </NavigationMenuItem>
              
              {/* HR Job Management - Only visible for HR users */}
              {isHR && (
                <NavigationMenuItem>
                  <Link to={ROUTES.HR_JOBS} className={navigationMenuTriggerStyle()}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Quản lý việc làm
                  </Link>
                </NavigationMenuItem>
              )}
              
              {/* HR Applications Management - Only visible for HR users */}
              {isHR && (
                <NavigationMenuItem>
                  <Link to={ROUTES.HR_APPLICATIONS} className={navigationMenuTriggerStyle()}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Quản lý ứng viên
                  </Link>
                </NavigationMenuItem>
              )}

              {/* Custom Công cụ dropdown */}
              {!isHR && <div
                ref={congCuRef}
                className="relative"
                onMouseEnter={() => setShowCongCuDropdown(true)}
                onMouseLeave={() => setShowCongCuDropdown(false)}
              >
                <button className={`${navigationMenuTriggerStyle()} flex items-center justify-between`}>
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Công cụ
                  </div>
                  <ChevronDown
                    className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                      showCongCuDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showCongCuDropdown && (
                  <div className="absolute left-0 top-full z-10 mt-1 w-[200px] rounded-md border bg-popover p-1 shadow-md">
                    <Link to={ROUTES.CREATENAMECV} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                      <FileEdit className="h-4 w-4" />
                      <div className="text-sm font-medium">Tạo CV</div>
                    </Link>
                    <Link to="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                      <FileEdit className="h-4 w-4" />
                      <div className="text-sm font-medium">Chuẩn hóa CV</div>
                    </Link>
                    <Link to="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                      <Compass className="h-4 w-4" />
                      <div className="text-sm font-medium">Trắc nghiệm</div>
                    </Link>
                  </div>
                )}
              </div> }
              
              {authenticated && !isHR && (
                <NavigationMenuItem>
                  <Link to={ROUTES.CVMANAGEMENT} className={navigationMenuTriggerStyle()}>
                    <FileText className="mr-2 h-4 w-4" />
                    Danh sách CV
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side items */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">0123 456 789</span>
          </div>

          {authenticated ? (
            <div className="flex items-center gap-3">
              {/* Notification button with dropdown - Only for HR users */}
              {isHR && (
                <div className="relative" ref={notificationRef}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                  
                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-1 w-80 rounded-md border bg-white shadow-lg z-50 overflow-hidden">
                      <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="font-medium">Thông báo</h3>
                        {unreadCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs flex items-center gap-1 h-auto py-1 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              notifications
                                .filter(n => n.status === "UNREAD")
                                .forEach(n => handleMarkAsRead(n.id));
                            }}
                          >
                            <Check className="h-3 w-3" /> 
                            <span>Đánh dấu đã đọc tất cả</span>
                          </Button>
                        )}
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {isLoadingNotifications ? (
                          <div className="p-4 text-center">Đang tải thông báo...</div>
                        ) : notifications.length > 0 ? (
                          notifications.map(renderNotificationItem)
                        ) : (
                          <div className="p-4 text-center text-gray-500">Không có thông báo</div>
                        )}
                      </div>
                      
                      <div className="p-2 border-t text-center">
                        <Button variant="ghost" size="sm" className="w-full text-primary text-sm" onClick={() => navigate("/notifications")}>
                          Xem tất cả thông báo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User avatar and dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden">
                      {userData?.username?.charAt(0) || <User className="h-4 w-4" />}
                    </div>
                    <span className="hidden sm:block max-w-[150px] truncate">{userData?.username || "User"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{userData?.username || "User"}</p>
                    <p className="text-xs text-muted-foreground">{userData?.email || ""}</p>
                    <p className="text-xs font-semibold text-primary">{userRole || ""}</p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Dynamic menu items based on role */}
                  {menuItems.map((item, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <Link to={item.link} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" className="text-primaryRed border-primaryRed">
                Nhà tuyển dụng
              </Button>
              <Button size="sm" className="bg-primaryRed font-bold" onClick={() => navigate("/login")}>
                <User className="mr-2 h-4 w-4" />
                Đăng nhập
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className="lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xl">
                    <img src={logo || "/placeholder.svg"} className="h-8 w-8" alt="CVNest" />
                    <span>CVNest</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile user info (if authenticated) */}
                {authenticated && (
                  <div className="flex items-center gap-3 p-2 border-b pb-4">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      {userData?.username?.charAt(0) || <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{userData?.username || "User"}</p>
                      <p className="text-xs text-muted-foreground">{userData?.email}</p>
                      <p className="text-xs font-medium text-primary">{userRole}</p>
                    </div>
                  </div>
                )}

                {/* Notifications for mobile - only for HR */}
                {authenticated && isHR && (
                  <Collapsible className="w-full border-b pb-2">
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span>Thông báo</span>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-2">
                      {isLoadingNotifications ? (
                        <div className="p-2 text-center text-sm">Đang tải...</div>
                      ) : notifications.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.slice(0, 5).map(notif => (
                            <div 
                              key={notif.id} 
                              className={`p-2 text-sm border-b last:border-b-0 ${
                                notif.status === "UNREAD" ? "bg-blue-50" : ""
                              }`}
                              onClick={() => handleNotificationClick(notif)}
                            >
                              <div className="font-medium">{notif.title}</div>
                              <p className="text-xs text-gray-600">{notif.content}</p>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatNotificationTime(notif.createdAt)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 text-center text-sm text-gray-500">
                          Không có thông báo
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-primary text-sm"
                        onClick={() => {
                          navigate("/notifications");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Xem tất cả
                      </Button>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                <div className="flex flex-col space-y-1">
                  {/* Việc làm IT */}
                  <Collapsible className="w-full">
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Việc làm IT</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 space-y-1">
                      {/* Map through categories for mobile */}
                      {Object.entries(categories).map(([key, category]) => (
                        <Collapsible key={key} className="w-full">
                          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-muted">
                            <div className="flex items-center gap-2">
                              <category.icon className="h-4 w-4" />
                              <span>{category.title}</span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-6 space-y-1">
                            {category.items.map((item) => (
                              <Link key={item} to="#" className="block rounded-md p-2 hover:bg-muted">
                                {item}
                              </Link>
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  <Link to={ROUTES.COMPANIES} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                    <Building2 className="h-4 w-4" />
                    <span className="hover:text-primaryRed">Công ty IT</span>
                  </Link>

                  {/* HR specific navigation links for mobile */}
                  {isHR && (
                    <>
                      <Link to={ROUTES.HR_JOBS} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                        <Briefcase className="h-4 w-4" />
                        <span>Quản lý việc làm</span>
                      </Link>
                      <Link to={ROUTES.HR_APPLICATIONS} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                        <ClipboardList className="h-4 w-4" />
                        <span>Quản lý ứng viên</span>
                      </Link>
                    </>
                  )}

                  {/* Công cụ header with collapsible */}
                  {!isHR && <Collapsible className="w-full">
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Công cụ</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 space-y-1">
                      <Link to={ROUTES.CREATENAMECV} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                        <FileEdit className="h-4 w-4" />
                        <span>Tạo CV</span>
                      </Link>
                      <Link to="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                        <FileEdit className="h-4 w-4" />
                        <span>Chuẩn hóa CV</span>
                      </Link>
                      <Link to="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                        <Compass className="h-4 w-4" />
                        <span>Trắc nghiệm</span>
                      </Link>
                    </CollapsibleContent>
                  </Collapsible> }

                  {authenticated && !isHR &&(
                    <Link to={ROUTES.CVMANAGEMENT} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                      <FileText className="h-4 w-4" />
                      <span>Danh sách CV</span>
                    </Link>
                  )}

                  {/* User-specific menu items in mobile view */}
                  {authenticated && (
                    <>
                      {menuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.link}
                          className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                      <Button 
                        variant="ghost"
                        className="flex w-full items-center justify-start rounded-md p-2 text-red-500 hover:bg-muted"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Đăng xuất</span>
                      </Button>
                    </>
                  )}
                </div>

                {!authenticated && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2 p-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">0123 456 789</span>
                    </div>
                    <Button variant="outline" className="w-full justify-start">
                      Nhà tuyển dụng
                    </Button>
                    <Button className="w-full justify-start" onClick={() => navigate("/login")}>
                      <User className="mr-2 h-4 w-4" />
                      Đăng nhập
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

