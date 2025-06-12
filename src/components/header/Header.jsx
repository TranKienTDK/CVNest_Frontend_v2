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
  Star,
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
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
import { useNotifications } from "@/hooks/useNotifications"

export default function Header({ className }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showCongCuDropdown, setShowCongCuDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  
  const congCuRef = useRef(null)
  const notificationRef = useRef(null)
  const navigate = useNavigate()
  
  const authenticated = isAuthenticated()
  const userData = getUserData()
  const userRole = getUserRole()
  const isHR = userRole === "HR"

  // Use the custom notifications hook
  const {
    notifications,
    unreadCount,
    isLoading: isLoadingNotifications,
    markAsRead: handleMarkAsRead,
    refreshNotifications
  } = useNotifications(userData);

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

  const handleNotificationClick = (notif) => {
    if (notif.status === "UNREAD") {
      handleMarkAsRead(notif.id)
    }
    
    // Different navigation based on user role
    if (isHR) {
      navigate(ROUTES.HR_APPLICATIONS)
    } else {
      // For regular users, navigate to applications page
      navigate(ROUTES.APPLICATIONS)
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

  const handleLogout = async () => {
    try {
      websocketService.disconnect();
      
      await auth.logout()
      clearAuthData()
      toast.success("Đăng xuất thành công!", {
        position: "top-right",
        autoClose: 2000,
      })
      navigate(ROUTES.HOME)
    } catch (error) {
      console.error("Logout error:", error)
      websocketService.disconnect();
      clearAuthData()
      navigate(ROUTES.HOME)
    }
  }

  // HR menu items
  const hrMenuItems = [
    { icon: UserCog, title: "Quản lý thông tin cá nhân", link: ROUTES.PROFILE },
    { icon: ClipboardList, title: "Quản lý tin tuyển dụng", link: ROUTES.HR_JOBS },
    { icon: FileText, title: "Quản lý CV ứng tuyển", link: ROUTES.HR_APPLICATIONS },
    { icon: Star, title: "CV Đã Lưu", link: ROUTES.SAVED_CVS },
  ]

  // User menu items
  const userMenuItems = [
    { icon: UserCog, title: "Quản lý thông tin cá nhân", link: ROUTES.PROFILE },
    { icon: FileText, title: "Quản lý CV", link: ROUTES.CVMANAGEMENT },
    { icon: ClipboardList, title: "Quản lý CV ứng tuyển", link: ROUTES.APPLICATIONS },
  ]

  const menuItems = userRole === "HR" ? hrMenuItems : userMenuItems

  const renderNotificationItem = (notif) => {
    // Different icons and styles based on notification content and user role
    const getNotificationData = () => {
      if (!isHR) {
        // For regular users - check if notification is about application approval/rejection
        if (notif.content && notif.content.includes('được chấp nhận')) {
          return {
            icon: <Check className="h-5 w-5" />,
            iconBg: 'bg-gradient-to-br from-green-400 to-green-600',
            borderColor: 'border-l-green-500',
            textColor: 'text-green-700',
            bgGradient: 'from-green-50 to-emerald-50'
          };
        } else if (notif.content && notif.content.includes('chưa phù hợp')) {
          return {
            icon: <X className="h-5 w-5" />,
            iconBg: 'bg-gradient-to-br from-red-400 to-red-600',
            borderColor: 'border-l-red-500',
            textColor: 'text-red-700',
            bgGradient: 'from-red-50 to-rose-50'
          };
        }
      }
      // Default for HR or other notifications
      return {
        icon: <FileText className="h-5 w-5" />,
        iconBg: 'bg-gradient-to-br from-red-400 to-red-600',
        borderColor: 'border-l-red-500',
        textColor: 'text-red-700',
        bgGradient: 'from-red-50 to-rose-50'
      };
    };

    const notifData = getNotificationData();
    const isUnread = notif.status === "UNREAD";

    return (
      <div 
        key={notif.id}
        onClick={() => handleNotificationClick(notif)}
        className={`notification-item relative group cursor-pointer transition-all duration-200 hover:shadow-md ${
          isUnread 
            ? `bg-gradient-to-r ${notifData.bgGradient} border-l-4 ${notifData.borderColor}` 
            : 'hover:bg-gray-50'
        }`}
      >
        <div className="p-4 flex gap-3">
          {/* Icon with animation */}
          <div className="flex-shrink-0 relative">
            <div className={`w-11 h-11 rounded-full ${notifData.iconBg} flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-105`}>
              {notifData.icon}
            </div>
            {isUnread && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className={`text-sm font-semibold ${isUnread ? notifData.textColor : 'text-gray-900'} line-clamp-1`}>
                {notif.title || (isHR ? 'Đơn ứng tuyển mới' : 'Cập nhật đơn ứng tuyển')}
              </h4>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatNotificationTime(notif.createdAt)}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
              {notif.content}
            </p>

            {/* Action indicator */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">              {!isHR && notif.content && notif.content.includes('được chấp nhận') && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Được chấp nhận
                </span>
              )}
              {!isHR && notif.content && notif.content.includes('chưa phù hợp') && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Chưa phù hợp
                </span>
              )}
              {isHR && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Đơn ứng tuyển
                </span>
              )}
              </div>
              
              {isUnread && (
                <div className="text-xs text-red-600 font-medium">
                  Mới
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-50 opacity-0 group-hover:opacity-30 transition-opacity duration-200 pointer-events-none"></div>
      </div>
    );
  };

  return (
    <header className={`${className} border-b fixed top-0 left-0 w-full bg-white z-50`}>
      <div className="container mx-auto flex h-[var(--header-height)] items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link to={isHR ? ROUTES.HR_HOME : ROUTES.HOME}>
            <img src={logo || "/placeholder.svg"} className="h-12 w-12" alt="CVNest" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:flex-1">
          <NavigationMenu className="mx-6">
            <NavigationMenuList>
              {/* Việc làm IT */}
              <NavigationMenuItem>
                <Link to={ROUTES.JOBS} className={navigationMenuTriggerStyle()}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Việc làm IT
                </Link>
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
              >
                <button 
                  className={`${navigationMenuTriggerStyle()} flex items-center justify-between`}
                  onClick={() => setShowCongCuDropdown(!showCongCuDropdown)}
                >
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
                    <Link 
                      to={ROUTES.CREATENAMECV} 
                      className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                      onClick={() => {
                        setShowCongCuDropdown(false);
                        localStorage.removeItem('cv_draft');
                      }}
                    >
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
              {/* Notification button with dropdown - For both HR and regular users */}
              <div className="relative" ref={notificationRef}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`relative rounded-full transition-all duration-200 hover:bg-red-50 hover:scale-105 ${
                    showNotifications ? 'bg-red-50 text-red-600' : ''
                  }`}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    // Refresh notifications when opening dropdown
                    if (!showNotifications) {
                      refreshNotifications();
                    }
                  }}
                >
                  <Bell className={`h-5 w-5 transition-colors duration-200 ${
                    unreadCount > 0 ? 'text-red-600' : ''
                  }`} />
                  {unreadCount > 0 && (
                    <>
                      {/* Pulsing background */}
                      <div className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-400 animate-ping opacity-75"></div>
                      {/* Count badge */}
                      <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold shadow-lg transform transition-transform hover:scale-110">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    </>
                  )}
                </Button>
                
                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-gray-200 bg-white shadow-2xl z-50 overflow-hidden backdrop-blur-sm animate-slideInFromTop">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-white" />
                          <h3 className="font-semibold text-white">Thông báo</h3>
                          {unreadCount > 0 && (
                            <span className="bg-white bg-opacity-20 text-white text-xs px-2 py-1 rounded-full font-medium">
                              {unreadCount} mới
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white hover:bg-white hover:bg-opacity-20 text-xs h-auto py-1.5 px-3 rounded-lg transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              notifications
                                .filter(n => n.status === "UNREAD")
                                .forEach(n => handleMarkAsRead(n.id));
                            }}
                          >
                            <Check className="h-3 w-3 mr-1" /> 
                            <span>Đọc tất cả</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {isLoadingNotifications ? (
                        <div className="p-8 text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                          <p className="text-gray-500 text-sm">Đang tải thông báo...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {notifications.map(renderNotificationItem)}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium mb-1">Chưa có thông báo</p>
                          <p className="text-gray-400 text-sm">Các thông báo mới sẽ xuất hiện ở đây</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="bg-gray-50 border-t border-gray-100 p-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-red-600 hover:bg-red-50 font-medium rounded-lg transition-all duration-200" 
                          onClick={() => {
                            navigate("/notifications");
                            setShowNotifications(false);
                          }}
                        >
                          Xem tất cả thông báo
                          <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User avatar and dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 rounded-full">
                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      {userData?.avatar ? (
                        <img 
                          src={userData.avatar} 
                          alt={userData?.username || "User"} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary text-white flex items-center justify-center">
                          {userData?.username?.charAt(0) || <User className="h-4 w-4" />}
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:block max-w-[150px] truncate">{userData?.username || "User"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col space-y-1 p-2">
                    <div className="flex gap-3 items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        {userData?.avatar ? (
                          <img 
                            src={userData.avatar} 
                            alt={userData?.username || "User"} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-primary text-white flex items-center justify-center">
                            {userData?.username?.charAt(0) || <User className="h-5 w-5" />}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{userData?.username || "User"}</p>
                        <p className="text-xs text-muted-foreground">{userData?.email || ""}</p>
                      </div>
                    </div>
                    {userData?.phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 mt-1 pl-1">
                        <Phone className="h-3 w-3" />
                        <span>{userData.phone}</span>
                      </div>
                    )}
                    <p className="text-xs font-semibold text-primary pl-1">{userRole || ""}</p>
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
              <div className="flex flex-col gap-6 py-4">                  <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xl">
                    <Link to={isHR ? ROUTES.HR_HOME : ROUTES.HOME}>
                      <img src={logo || "/placeholder.svg"} className="h-8 w-8" alt="CVNest" />
                    </Link>
                    <span>CVNest</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile user info (if authenticated) */}
                {authenticated && (
                  <div className="flex items-center gap-3 p-2 border-b pb-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      {userData?.avatar ? (
                        <img 
                          src={userData.avatar} 
                          alt={userData?.username || "User"} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary text-white flex items-center justify-center">
                          {userData?.username?.charAt(0) || <User className="h-5 w-5" />}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{userData?.username || "User"}</p>
                      <p className="text-xs text-muted-foreground">{userData?.email}</p>
                      {userData?.phone && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          <span>{userData.phone}</span>
                        </p>
                      )}
                      <p className="text-xs font-medium text-primary">{userRole}</p>
                    </div>
                  </div>
                )}

                {/* Notifications for mobile - for both HR and regular users */}
                {authenticated && (
                  <Collapsible className="w-full border-b pb-2">
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Bell className="h-5 w-5 text-red-600" />
                          {unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium">Thông báo</span>
                        {unreadCount > 0 && (
                          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-3">
                      {isLoadingNotifications ? (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500">Đang tải...</p>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {notifications.slice(0, 5).map(notif => {
                            const isUnread = notif.status === "UNREAD";
                            const isApproved = notif.content && notif.content.includes('được chấp nhận');
                            const isRejected = notif.content && notif.content.includes('chưa phù hợp');
                            
                            return (
                              <div 
                                key={notif.id} 
                                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                                  isUnread 
                                    ? isApproved 
                                      ? 'bg-green-50 border-green-200' 
                                      : isRejected 
                                        ? 'bg-red-50 border-red-200'
                                        : 'bg-red-50 border-red-200'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }`}
                                onClick={() => handleNotificationClick(notif)}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isApproved ? 'bg-green-500' : isRejected ? 'bg-red-500' : 'bg-red-500'
                                  }`}>
                                    {isApproved ? (
                                      <Check className="h-4 w-4 text-white" />
                                    ) : isRejected ? (
                                      <X className="h-4 w-4 text-white" />
                                    ) : (
                                      <FileText className="h-4 w-4 text-white" />
                                    )}
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <h4 className="font-medium text-sm text-gray-900 truncate">
                                        {notif.title || (isHR ? 'Đơn ứng tuyển mới' : 'Cập nhật đơn ứng tuyển')}
                                      </h4>
                                      {isUnread && (
                                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.content}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="text-xs text-gray-500">
                                        {formatNotificationTime(notif.createdAt)}
                                      </span>
                                      {isApproved && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                          Được duyệt
                                        </span>
                                      )}
                                      {isRejected && (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                          Từ chối
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Chưa có thông báo</p>
                        </div>
                      )}
                      {notifications.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-red-600 hover:bg-red-50 font-medium mt-3 rounded-lg"
                          onClick={() => {
                            navigate("/notifications");
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          Xem tất cả thông báo
                          <ChevronDown className="h-4 w-4 ml-1 rotate-[-90deg]" />
                        </Button>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                )}

                <div className="flex flex-col space-y-1">
                  {/* Việc làm IT */}
                  <Link to={ROUTES.JOBS} className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                    <Briefcase className="h-4 w-4" />
                    <span>Việc làm IT</span>
                  </Link>

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
                      <Link 
                        to={ROUTES.CREATENAMECV} 
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-muted"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          localStorage.removeItem('cv_draft');
                        }}
                      >
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

