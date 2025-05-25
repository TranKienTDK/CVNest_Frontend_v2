import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

const HeroSection = ({
  title = "Build Your Perfect CV & Land Your Dream Job",
  description = "Create a professional CV in minutes with our easy-to-use builder and connect with thousands of employers looking for talent like you.",
  createCVButtonText = "Create Your CV",
  findJobsButtonText = "Find Jobs",
  backgroundImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
  isHR = false,
}) => {
  const navigate = useNavigate();  return (
    <>
      {!isHR ? (
        <div className="relative w-full bg-background overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 flex flex-col items-center md:items-start">
            <div className="max-w-2xl text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">{description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-medium text-base px-6"
                  onClick={() => {
                    localStorage.removeItem('cv_draft');
                    navigate(ROUTES.CREATENAMECV);
                  }}
                >
                  {createCVButtonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-medium text-base px-6"
                  onClick={() => navigate(ROUTES.JOBS)}
                >
                  {findJobsButtonText}
                </Button>
              </div>
            </div>

            {/* Optional floating stats or features */}
            <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 w-full max-w-md md:absolute md:right-8 md:bottom-16 md:mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">100+</p>
                  <p className="text-sm text-white/80">CV Templates</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">10k+</p>
                  <p className="text-sm text-white/80">Job Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">85%</p>
                  <p className="text-sm text-white/80">Success Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="text-sm text-white/80">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fadeIn">
                Tìm kiếm nhân tài cho doanh nghiệp của bạn
              </h1>
              <p className="text-xl text-blue-100 mb-10 animate-fadeIn animation-delay-300">
                Hệ thống quản lý tuyển dụng toàn diện giúp bạn tìm kiếm, đánh giá và
                tuyển dụng những ứng viên xuất sắc nhất.
              </p>
              <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col md:flex-row items-center max-w-2xl mx-auto animate-fadeIn animation-delay-500">
                <div className="flex items-center flex-1 w-full border-b md:border-b-0 md:border-r border-gray-200 p-2">
                  <SearchIcon size={20} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Vị trí công việc hoặc kỹ năng..."
                    className="w-full outline-none text-gray-700"
                  />
                </div>
                <div className="flex items-center p-2 w-full md:w-auto">
                  <select className="w-full md:w-48 outline-none text-gray-700 bg-transparent">
                    <option>Tất cả vị trí</option>
                    <option>IT & Công nghệ</option>
                    <option>Marketing</option>
                    <option>Kinh doanh</option>
                    <option>Thiết kế</option>
                  </select>
                </div>
                <button className="mt-4 md:mt-0 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors">
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#F9FAFB"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>
      )}
    </>
  );
};

export default HeroSection;