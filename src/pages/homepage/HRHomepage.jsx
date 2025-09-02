import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import HeroSection from "../../components/hero-section/HeroSection";
import Footer from "../../components/footer/Footer";
import { FeaturesSection } from "../../components/feature/FeaturesSection";
import { StatsSection } from "@/components/feature/StatsSection";
import { ArrowRight, BarChart, Users, Briefcase, Target } from "lucide-react";
import styles from "./HRHomepage.module.css";

const HRHomepage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header className="h-16" />

      {/* Hero Section */}
      <HeroSection isHR={true} />      
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`bg-white p-6 rounded-lg shadow-sm text-center ${styles['animate-fadeIn']}`}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">250+</h3>
                <p className="text-gray-500 text-sm">Ứng viên tiềm năng</p>
              </div>
              
              <div className={`bg-white p-6 rounded-lg shadow-sm text-center ${styles['animate-fadeIn']} ${styles['animation-delay-300']}`}>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">45</h3>
                <p className="text-gray-500 text-sm">Vị trí tuyển dụng</p>
              </div>
              
              <div className={`bg-white p-6 rounded-lg shadow-sm text-center ${styles['animate-fadeIn']} ${styles['animation-delay-500']}`}>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">92%</h3>
                <p className="text-gray-500 text-sm">Tỷ lệ khớp CV</p>
              </div>
              
              <div className={`bg-white p-6 rounded-lg shadow-sm text-center ${styles['animate-fadeIn']} ${styles['animation-delay-700']}`}>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">18</h3>
                <p className="text-gray-500 text-sm">Tuyển dụng trong tháng</p>
              </div>
            </div>
          </div>
        </div>
      </section>      
      
      {/* Features Section */}
      <FeaturesSection />

      {/* Stat Section */}
      <StatsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HRHomepage;
