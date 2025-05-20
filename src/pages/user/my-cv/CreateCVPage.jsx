import { cn } from "@/lib/utils.js";
import {
  BuildingOffice2Icon,
  ListBulletIcon,
  PencilSquareIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/20/solid/index.js";
import OtherInfoSection from "@/pages/user/my-cv/components/OtherInfoSection.jsx";
import PersonalInfoForm from "@/pages/user/my-cv/components/PersonalInfoForm.jsx";
import React, { useEffect, useState } from "react";
import { CreateCVProvider } from "@/pages/user/my-cv/providers/CreateCVProvider";
import { useNavigate } from "react-router-dom";
import logo1 from "../../../assets/temp1.jpg";
import logo2 from "../../../assets/temp2.jpg";
import logo3 from "../../../assets/temp3.jpg";
import logo4 from "../../../assets/temp4.jpg";
import { ROUTES } from "@/routes/routes";
import PreviewCV from "@/pages/user/my-cv/components/PreviewCV";

const templates = [
  { id: 1, name: "Mẫu CV 1", image: logo1 },
  { id: 2, name: "Mẫu CV 2", image: logo2 },
  { id: 3, name: "Mẫu CV 3", image: logo3 },
  { id: 4, name: "Mẫu CV 4", image: logo4 },
];

const items = [
  {
    label: "Thông tin cá nhân",
    icon: <UserIcon className="size-6" />,
  },
  {
    label: "Giới thiệu bản thân",
    icon: <PencilSquareIcon className="size-6" />,
  },
  {
    label: "Kinh nghiệm làm việc",
    icon: <BuildingOffice2Icon className="size-6" />,
  },
  {
    label: "Kỹ năng lập trình",
    icon: <StarIcon className="size-6" />,
  },
  {
    label: "Học vấn",
    icon: <ListBulletIcon className="size-6" />,
  },
];

function CreateCVPage() {
  const navigate = useNavigate();
  const [cvData, setCvData] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    const draft = localStorage.getItem("cv_draft");
    if (draft) {
      console.log("Using data from localStorage:", JSON.parse(draft));
      setCvData(JSON.parse(draft));
      setSelectedTemplate(JSON.parse(draft).templateId || "");
    } else {
      navigate(ROUTES.CREATENAMECV);
    }
  }, []);

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);
  const currentTemplateName = currentTemplate?.name || "";

  if (!cvData) return null;

  return (
    <CreateCVProvider initialData={cvData}>
      <div
        className={cn(
          "relative min-h-screen",
          "before:absolute before:w-3/12 before:h-full before:left-0 before:top-0 before:bg-[#faebe8]",
          "after:absolute after:w-9/12 after:h-full after:right-0 after:top-0 after:bg-[#f2f2f2]"
        )}
      >
        <div className="container max-w-6xl mx-auto relative z-[1]">
          <div className="grid grid-cols-12">
            {/* SIDEBAR */}
            <div className="col-span-4 bg-[#faebe8]">
              <div className="sticky top-0 max-h-screen p-6 overflow-auto">
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="mb-4 text-sm text-[#D34127] border border-[#D34127] px-3 py-3 rounded hover:bg-[#D34127] hover:text-white transition w-full"
                >
                  Đổi mẫu thiết kế
                </button>
                <h2 className="text-lg font-semibold mb-4 text-[#d34127]">
                  Thông tin cơ bản
                </h2>
                <div className="space-y-2 mb-6">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        "group flex items-center justify-between bg-white p-3 rounded-md shadow-sm",
                        "transition hover:bg-[#d34127] hover:cursor-pointer"
                      )}
                    >
                      <div className="flex items-center">
                        <div className="text-xl text-gray-600 mr-3 group-hover:text-white">
                          {item.icon}
                        </div>
                        <p
                          className={cn(
                            "text-[#d34127] group-hover:font-bold group-hover:text-white"
                          )}
                        >
                          {item.label}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "text-sm italic text-gray-500",
                          "group-hover:text-white"
                        )}
                      >
                        (Mặc định)
                      </p>
                    </div>
                  ))}
                </div>

                <OtherInfoSection />
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="col-span-8 bg-[#f2f2f2] px-5 py-3">
              <div className="rounded-md space-y-3">
                {/* HEADER */}
                <div className="flex justify-between items-center bg-white border border-[#979797] py-[11px] px-[21px]">
                  <p className="text-lg font-semibold">{cvData.name}</p>
                  <div className="text-right">
                    <p className="text-gray-700">
                      Ngôn ngữ: <span>Tiếng Việt</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <p className="text-[#D83B01] font-semibold">
                      {currentTemplateName}
                    </p>
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="text-sm text-white bg-[#D34127] px-3 py-2 rounded hover:bg-[#b83520] transition"
                    >
                      Xem trước CV
                    </button>
                    {/* Removed green "Lưu CV" button */}
                  </div>
                  {/* Xóa thông báo tự động lưu */}
                </div>

                {/* HƯỚNG DẪN */}
                <div className="text-sm text-gray-700 italic space-y-1 p-4">
                  <p>
                    <span className="font-semibold">Hướng dẫn</span> (<u>ẩn</u>)
                  </p>
                  <ul className="list-none list-inside space-y-1">
                    <li>
                      - Các trường thông tin có dấu (*) là trường thông tin quan
                      trọng bắt buộc, giúp Nhà tuyển dụng đánh giá ứng viên.
                    </li>
                    <li>
                      - Chỉ điền vào thông tin bạn muốn hiển thị trong hồ sơ của
                      bạn (trừ các trường bắt buộc), các trường để trống sẽ
                      không được hiển thị trên CV.
                    </li>
                    <li>
                      - Các mục: Thông tin cá nhân, Giới thiệu bản thân, Kinh
                      nghiệm làm việc, Kỹ năng lập trình và Học vấn là 05 mục
                      mặc định, không được tùy chỉnh thứ tự hiển thị trên CV.
                      Các mục ở phần Thông tin khác có thể tùy chỉnh thứ tự và
                      chọn Thêm/Xóa.
                    </li>
                    <li>
                      - Chọn <strong>Xem trước</strong> để xem các mẫu CV của
                      bạn, chọn <strong>Mẫu</strong> và <strong>Lưu CV</strong>.
                      Bạn cũng có thể tải xuống CV dưới dạng PDF.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <PersonalInfoForm />
              </div>
            </div>
          </div>
        </div>

        {showTemplateModal && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 flex justify-start items-start"
            onClick={() => setShowTemplateModal(false)}
          >
            <div
              className="bg-white shadow-xl rounded-lg mt-20 ml-10 p-4 w-[400px] max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
                onClick={() => setShowTemplateModal(false)}
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold mb-4 text-center">
                Chọn lại mẫu CV
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {templates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      const updated = { ...cvData, templateId: tpl.id };
                      localStorage.setItem("cv_draft", JSON.stringify(updated));
                      setCvData(updated);
                      setSelectedTemplate(tpl.id);
                      setShowTemplateModal(false); // ✅ tự đóng popup
                    }}
                    className={`cursor-pointer border p-2 rounded shadow-lg ${
                      selectedTemplate === tpl.id
                        ? "border-[#D34127] ring-2 ring-[#D34127]"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="w-full h-40 object-cover rounded"
                    />
                    <p className="text-center mt-2 text-sm font-medium">
                      {tpl.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <PreviewCV
          showPreviewModal={showPreviewModal}
          setShowPreviewModal={setShowPreviewModal}
          cvData={cvData}
          isUpdate={true}
        />
      </div>
    </CreateCVProvider>
  );
}

export default CreateCVPage;
