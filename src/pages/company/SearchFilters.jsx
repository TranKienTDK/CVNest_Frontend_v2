import React from "react";
import {
  Search,
  FilterXIcon,
  SlidersHorizontal,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchFilters = ({
  search = "",
  setSearch = () => {},
  address = undefined,
  setAddress = () => {},
  industry = undefined,
  setIndustry = () => {},
  handleSearch = () => {},
  handleClearSearch = () => {},
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >      <Card className="w-full bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-orange-400" />

        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <SlidersHorizontal size={18} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Bộ lọc tìm kiếm
            </h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">            <div className="w-full md:w-1/3 space-y-2">
              <div className="flex items-center gap-2 mb-1.5">
                <Search size={14} className="text-red-600" />
                <label className="text-sm font-medium text-gray-700">
                  Tên công ty
                </label>
              </div>
              <div className="relative">
                <Input
                  placeholder="Nhập tên công ty"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all pl-4 pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                  <Search size={12} className="text-gray-400" />
                </div>
              </div>
            </div>            <div className="w-full md:w-1/4 space-y-2">
              <div className="flex items-center gap-2 mb-1.5">
                <MapPin size={14} className="text-red-600" />
                <label className="text-sm font-medium text-gray-700">
                  Địa điểm
                </label>
              </div>
              <Select onValueChange={setAddress} value={address}>
                <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all">
                  <SelectValue placeholder="Chọn địa điểm" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                  <div className="p-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-500">
                      Địa điểm phổ biến
                    </p>
                  </div>
                  <SelectItem
                    value="Hà Nội"
                    className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                        <MapPin size={12} className="text-red-600" />
                      </div>
                      Hà Nội
                    </div>
                  </SelectItem>                  <SelectItem
                    value="Hồ Chí Minh"
                    className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                        <MapPin size={12} className="text-red-600" />
                      </div>
                      TP HCM
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="Đà Nẵng"
                    className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                        <MapPin size={12} className="text-red-600" />
                      </div>
                      Đà Nẵng
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>            <div className="w-full md:w-1/4 space-y-2">
              <div className="flex items-center gap-2 mb-1.5">
                <Briefcase size={14} className="text-red-600" />
                <label className="text-sm font-medium text-gray-700">
                  Lĩnh vực
                </label>
              </div>
              <Select onValueChange={setIndustry} value={industry}>
                <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all">
                  <SelectValue placeholder="Chọn lĩnh vực" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto rounded-xl border-gray-100 shadow-lg">
                  <div className="p-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-500">
                      Lĩnh vực phổ biến
                    </p>
                  </div>
                  {[
                    "Phần mềm",
                    "Software",
                    "Ngân hàng",
                    "Viễn thông",
                    "Edtech",
                    "Bất động sản",
                    "Fintech",
                    "Giáo dục",
                    "Thương mại điện tử",
                    "Gia công phần mềm",
                    "Kinh doanh",
                    "Bảo hiểm",
                    "Game",
                  ].map((item) => (
                    <SelectItem
                      key={item}
                      value={item}                      className="rounded-lg my-0.5 focus:bg-red-50 focus:text-red-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                          <Briefcase size={12} className="text-red-600" />
                        </div>
                        {item}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto md:self-end">              <Button
                onClick={handleSearch}
                className="h-11 px-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-xl transition-all duration-300 flex-1 md:flex-none shadow-md hover:shadow-lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>

              <Button
                onClick={handleClearSearch}
                variant="outline"
                className="h-11 px-6 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-300 flex-1 md:flex-none"
              >
                <FilterXIcon className="w-4 h-4 mr-2" />
                Xóa tìm kiếm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SearchFilters;
