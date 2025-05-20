import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

const HeroSection = ({
  title = "Build Your Perfect CV & Land Your Dream Job",
  description = "Create a professional CV in minutes with our easy-to-use builder and connect with thousands of employers looking for talent like you.",
  createCVButtonText = "Create Your CV",
  findJobsButtonText = "Find Jobs",
  backgroundImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
}) => {
  const navigate = useNavigate();
  return (
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
  );
};

export default HeroSection;