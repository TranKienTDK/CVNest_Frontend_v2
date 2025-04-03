import React from "react";
import Header from "../../components/header/Header";
import styles from "./Homepage.module.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

const Homepage = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header className="h-16" /> {/* Hiển thị Header */}
      <div className="relative w-full mt-60">
        <div className="relative w-3/4 mx-auto ">
          <Input type="text" placeholder="Tìm kiếm theo các Kỹ năng, Vị trí, Công ty,..." className="pr-20 p-9" />
          <Button
            size="sm"
            className="absolute border-none focus:border-none right-1 top-1/2 -translate-y-1/2 h-9 p-7 flex items-center gap-2  text-primary-foreground bg-red-600 font-bold"
          >
            <Search className="h-4 w-4 font-bold" />
            <span>Tìm kiếm</span>
          </Button>
        </div>


        {/* row items  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8 w-3/4 mx-auto bg-white border-red-100 shadow-md rounded-lg border ">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex flex-col items-left p-4 hover:bg-gray-100 hover:cursor-pointer mt-6 mb-6 rounded-lg">
          <Search className="h-4 w-4 text-gray-700" />
          <h3 className="mt-4 text-lg font-semibold">Tạo CV</h3>
          <p className="text-gray-500 text-sm">Tạo CV ấn tượng với thao tác dễ dàng</p>
          <a href="#" className="mt-3 flex items-center text-primaryRed text-sm font-bold underline hover:cursor-pointer">
            Tạo ngay <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      ))}
    </div>

      </div>
    </div>
  );
};

export default Homepage;
