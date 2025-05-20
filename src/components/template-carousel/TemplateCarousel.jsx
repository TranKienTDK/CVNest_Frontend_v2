import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

import template1 from "../../assets/temp1.jpg";
import template2 from "../../assets/temp2.jpg";
import template3 from "../../assets/temp3.jpg";
import template4 from "../../assets/temp4.jpg";

const TemplateCarousel = ({
  templates = [
    {
      id: "1",
      name: "Modern Clean",
      image: template1,
      description: "Thiết kế hiện đại và chuyên nghiệp phù hợp với mọi ngành nghề"
    },
    {
      id: "2",
      name: "Professional Dark",
      image: template2,
      description: "Mẫu CV nổi bật với tông màu tối sang trọng và cấu trúc rõ ràng"
    },
    {
      id: "3",
      name: "Creative Accent",
      image: template3,
      description: "Thiết kế sáng tạo với điểm nhấn màu sắc dành cho các ngành sáng tạo"
    },
    {
      id: "4",
      name: "Minimal Purple",
      image: template4,
      description: "Mẫu CV tối giản với điểm nhấn màu tím hiện đại và chuyên nghiệp"
    }  ],
  onSelectTemplate = () => {},
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= templates.length - (itemsPerPage - 1) 
        ? 0 
        : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 
        ? Math.max(0, templates.length - itemsPerPage) 
        : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <div className="w-full">
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Template Cards */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / templates.length)}%)`,
              width: `${templates.length * (100 / Math.min(itemsPerPage, templates.length))}%`
            }}
          >
            {templates.map((template) => (
              <div 
                key={template.id}
                className="px-3"
                style={{ width: `${100 / templates.length}%` }}  
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-2">{template.name}</h3>                    
                    <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                    <button
                      onClick={() => {
                        const form = { templateId: template.id };
                        localStorage.setItem('cv_draft', JSON.stringify(form));
                        navigate(ROUTES.CREATENAMECV);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Sử dụng mẫu này
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Previous template"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Next template"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-6 space-x-2">
        {templates.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentIndex === index ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to template ${index + 1}`}
          />
        ))}
      </div>      {/* Action Buttons */}
      <div className="text-center mt-8">
        <button 
          className="mr-4 border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 py-2 px-6 rounded transition-colors font-medium"
          onClick={() => {
            // Xóa bất kỳ template nào đã chọn trước đó
            localStorage.removeItem('cv_draft');
            navigate(ROUTES.CREATENAMECV);
          }}
        >
          Xem tất cả mẫu
        </button>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition-colors font-medium"
          onClick={() => {
            // Xóa bất kỳ template nào đã chọn trước đó
            localStorage.removeItem('cv_draft');
            navigate(ROUTES.CREATENAMECV);
          }}
        >
          Tạo CV ngay
        </button>
      </div>
    </div>
  );
};

export default TemplateCarousel;