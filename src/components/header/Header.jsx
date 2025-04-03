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
  MapPin,
  Menu,
  Phone,
  Settings,
  User,
  X,
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
import { Link } from "react-router-dom"
import logo from "../../assets/CVNest_logo.jpg"

// Category item component for Việc làm IT dropdown
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
  const congCuRef = useRef(null)

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (congCuRef.current && !congCuRef.current.contains(event.target)) {
        setShowCongCuDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  return (
    <div className={`${className} border-b fixed top-0 left-0 w-full bg-white z-50`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <img src={logo || "/placeholder.svg"} className="h-12 w-12" alt="CVNest" />
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
                <Link to="#" className={navigationMenuTriggerStyle()}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Công ty IT
                </Link>
              </NavigationMenuItem>

              {/* Custom Công cụ dropdown */}
              <div
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
                    <Link to="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
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
              </div>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side items */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">0123 456 789</span>
          </div>
          <Button variant="outline" size="sm" className="text-primaryRed border-primaryRed">
            Nhà tuyển dụng
          </Button>
          <Button size="sm" className="bg-primaryRed font-bold ">
            <User className="mr-2 h-4 w-4 " />
            Đăng nhập
          </Button>
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

                  <Link to="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
                    <Building2 className="h-4 w-4" />
                    <span className="hover:text-primaryRed">Công ty IT</span>
                  </Link>

                  {/* Công cụ header with collapsible */}
                  <Collapsible className="w-full">
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-2 hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Công cụ</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-6 space-y-1">
                      <Link to="#" className="flex items-center gap-2 rounded-md p-2 hover:bg-muted">
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
                  </Collapsible>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 p-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">0123 456 789</span>
                  </div>
                  <Button variant="outline" className="w-full justify-start">
                    Nhà tuyển dụng
                  </Button>
                  <Button className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

