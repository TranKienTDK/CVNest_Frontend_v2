import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import Header from "../../components/header/Header";
import HeroSection from "../../components/hero-section/HeroSection";
import TemplateCarousel from "../../components/template-carousel/TemplateCarousel";
import StatisticsSection from "@/components/statistics-section/StatisticsSection";
import Footer from "../../components/footer/Footer";
import { ArrowRight } from "lucide-react";

const Homepage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header className="h-16" />

      {/* Hero Section */}
      <HeroSection
        title="Xây dựng CV chuyên nghiệp & Tìm kiếm công việc mơ ước"
        description="Tạo CV chuyên nghiệp trong vài phút với công cụ dễ sử dụng của chúng tôi và kết nối với hàng nghìn nhà tuyển dụng đang tìm kiếm tài năng như bạn."
        createCVButtonText="Tạo CV của bạn"
        findJobsButtonText="Tìm việc làm"
      />

      {/* Template Carousel */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Mẫu CV Đẹp
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chọn từ bộ sưu tập các mẫu thiết kế chuyên nghiệp của chúng tôi để làm CV của bạn nổi bật.
            </p>
          </div>
          <TemplateCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Tại Sao Chọn Nền Tảng Của Chúng Tôi
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tất cả những gì bạn cần để tạo một CV chuyên nghiệp
              và tìm được công việc mơ ước.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <div 
              className="flex flex-col items-center text-center p-8 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                localStorage.removeItem('cv_draft');
                navigate(ROUTES.CREATENAMECV);
              }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Tạo CV Dễ Dàng</h3>
              <p className="text-muted-foreground">
                Xây dựng một CV chuyên nghiệp chỉ trong vài phút
                với trình chỉnh sửa trực quan và các mẫu thiết kế có sẵn.
              </p>
            </div>

            <div 
              className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                localStorage.removeItem('cv_draft');
                navigate(ROUTES.CREATENAMECV);
              }}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Tương Thích Với Hệ Thống ATS</h3>
              <p className="text-muted-foreground">
                Các mẫu của chúng tôi được tối ưu hóa
                để vượt qua Hệ Thống Quản Lý Ứng Viên (ATS) mà các nhà tuyển dụng sử dụng.
              </p>
            </div>

            <div 
              className="flex flex-col items-center text-center p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(ROUTES.JOBS)}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Job Matching</h3>
              <p className="text-muted-foreground">
                Nhận các cơ hội việc làm phù hợp dựa trên kỹ năng và kinh nghiệm của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;