import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const CreateCVModal = ({ isOpen, onClose }) => {
  const [cvName, setCvName] = useState("");
  const [language, setLanguage] = useState("Tiếng Việt");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store CV name in session or local storage to use in CreateCV page
    sessionStorage.setItem("newCVName", cvName);
    navigate("/user/my-cv/create");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#D83B01] mb-2">Tạo CV chuẩn dành riêng cho Lập trình viên</h2>
          <p className="text-gray-600">
            Hãy tạo ngay CV chuẩn Developer trên CVNest, chúng tôi sẽ gợi ý công việc IT phù hợp với bạn
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-1">
              <span className="text-red-500">*</span> Tên CV:
            </label>
            <Input
              type="text"
              placeholder="Ví dụ: Nguyễn Văn A - Kĩ sư phần mềm"
              value={cvName}
              onChange={(e) => setCvName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-1">
              <span className="text-red-500">*</span> Ngôn ngữ:
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded appearance-none bg-white pr-10"
              >
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="English">English</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!cvName.trim()}
              className={`px-6 py-2 rounded-md text-white ${
                cvName.trim() ? "bg-[#D83B01] hover:bg-[#b43000]" : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Bắt đầu tạo
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCVModal;