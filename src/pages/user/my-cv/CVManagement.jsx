import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/header/Header.jsx";
import {
  Eye,
  Info,
  Pencil,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { Button, Pagination } from "antd";
import cvAPI from "@/api/cv";
import { cn } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import sampleDataCV4 from "./components/CVTemplate/sampleDataCV4";
import TemplateCV2 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV2";
import TemplateCV3 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV3";
import TemplateCV4 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV4";
import {Modal} from "antd";

function CVManagement() {
  const [cvs, setCv] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCvs, setTotalcvs] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(9);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentCvFormData, setCurrentCvFormData] = useState(null);
  const navigate = useNavigate();
  const handlePageChange = (page) => {
    setPage(page);
  };

  useEffect(() => {
    const fetchCvs = async () => {
      try {
        let response;
        response = await cvAPI.getCvs(page - 1, size);
        setCv(response.data.data.content);
        setTotalcvs(response.data.data.page.totalElements);
        setTotalPages(response.data.data.page.totalPages);
      } catch (error) {
        console.error("Error fetching CVs:", error);
        toast.error("Không thể tải danh sách CV. Vui lòng thử lại sau.", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    };

    fetchCvs();
  }, [page, size]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const commentIdRef = useRef(null);

  const toggleModalDeleteComment = (id) => {
    setIsModalOpen(id);
    commentIdRef.current = id;
  };

  const deleteComment = async (id) => {
    console.log("Xoá CV với ID:", id);
    try {
      await cvAPI.deleteCv(id);
      // console.log("response: ", response);
      toast.success("Delete CV successfully", {
        position: "top-right",
        autoClose: 0,
      });
      setCv((prev) => prev.filter((cv) => cv.id !== id));
      setTotalcvs((prev) => prev - 1);
      // Nếu danh sách hiện tại rỗng sau xoá thì chuyển về trang 1
      if (cvs.length - 1 === 0 && page > 1) {
        setPage((prev) => prev - 1);
      }
      setIsModalOpen(false); // Đóng modal
    } catch (error) {
      console.error("Error deleting CV:", error);
      toast.error("Error delete CV " + id, {
        position: "top-right",
        autoClose: 2000,
      });
    }
    toggleModalDeleteComment();
  };

  const DeleteModal = ({ isOpen }) => {
    if (!isOpen) return null; // Nếu modal không mở, không render gì cả

    return (
      <div
        className={cn(
          "fixed inset-0 backdrop-brightness-50 backdrop-blur-sm flex justify-center items-center z-50"
        )}
        onClick={() => toggleModalDeleteComment()}
      >
        <div
          className={cn(
            "relative bg-white p-6 rounded-lg shadow-lg w-full max-w-[500px]"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            onClick={() => toggleModalDeleteComment()}
            className={cn(
              "absolute top-2 right-0 transform -translate-x-1/2",
              "rounded-full text-gray-700 transition bg-white",
              "hover:bg-gray-200 hover:cursor-pointer"
            )}
          >
            <XMarkIcon className={cn("size-5")} />
          </Button>

          <h2 className={cn("text-lg font-semibold mb-4")}>Delete CV</h2>
          <p className={cn("text-gray-600 mb-4")}>
            CV will be deleted permanently. Are you sure?
          </p>
          <div className={cn("flex justify-end")}>
            <Button
              onClick={() => deleteComment(commentIdRef.current)}
              className={cn(
                "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              )}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const viewCVDetail = (id) => {
    navigate(ROUTES.DETAILCV.replace(":id", id));
    console.log("text", ROUTES.DETAILCV.replace(":id", id));
  };

  // Hàm để lấy chi tiết CV và mở modal preview
  const handlePreviewCV = async (id) => {
    try {
      const response = await cvAPI.getDetailCv(id);
      const cvData = response.data.data;

      console.log("CV data from API:", cvData);
      const formattedData = {
        name: cvData.cvName || "Untitled CV",
        templateId: cvData.templateId || 1,
        profile: cvData.profile || "",
        info: cvData.info || {},
        experiences: cvData.experiences || [],
        skills: (cvData.skills || []).map((skill) => ({
          id: skill.id,
          name: skill.name || skill.skill || "",
          rate: typeof skill.rate === "number" ? skill.rate : 0,
        })),
        educations: cvData.educations || [],
        languages: cvData.languages || [],
        projects: cvData.projects || [],
        certificates: cvData.certificates || [],
        consultants: cvData.consultants || [],
        activities: cvData.activities || [],
        interests: cvData.interests || [],
        additionalInfo: cvData.additionalInfo || "",
      };

      setCurrentCvFormData(formattedData);
      setShowPreviewModal(true);
    } catch (error) {
      console.error("Error fetching CV detail:", error);
      toast.error("Không thể tải thông tin CV. Vui lòng thử lại sau.");
    }
  };

  return (
    <div>
      <Header />
      <div className="w-full max-w-5xl mx-auto mt-20">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4 text-[#D83B01] font-semibold">
            <button className="hover:underline">Quản lý CV</button>
            <div className="border-l border-[#D83B01] h-5"></div>
            <button className="hover:underline">Thư giới thiệu</button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center bg-gray-800 text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-700">
              Tải CV lên
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 8l-3-3m3 3l3-3"
                />
              </svg>
            </button>
            <Link
              to={ROUTES.CREATENAMECV}
              className="flex items-center bg-[#D83B01] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#b43000]"
            >
              Tạo CV mới
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-3-3v6m2-10H7a2 2 0 00-2 2v14l4-4h8a2 2 0 002-2V7a2 2 0 00-2-2z"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold text-gray-700">
            <div className="py-3 px-4 border-r">Tên CV</div>
            <div className="py-3 px-4 border-r">Lần chỉnh sửa cuối</div>
            <div className="py-3 px-4">Tuỳ chọn</div>
          </div>

          {/* Row content */}
          {cvs.length > 0 ? (
            cvs.map((cv) => (
              <div
                key={cv.id}
                className="grid grid-cols-3 items-center text-sm border-t py-4"
              >
                {/* Tên CV */}
                <div className="text-black px-4 flex flex-col items-center text-center">
                  <div className="font-bold">{cv.cvName}</div>
                  {cv.createdFrom && (
                    <button className="mt-1 text-xs border border-red-500 text-red-500 px-2 py-0.5 rounded-md">
                      Tạo trên {cv.createdFrom}
                    </button>
                  )}
                </div>

                {/* Ngày chỉnh sửa cuối */}
                <div className="text-gray-700 px-4">
                  {cv.updatedAt
                    ? new Date(cv.updatedAt).toLocaleString("vi-VN", {
                        hour12: false,
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : new Date(cv.createdAt).toLocaleString("vi-VN", {
                        hour12: false,
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                </div>

                {/* Tuỳ chọn */}
                <div className="flex gap-3 text-gray-700 px-4 items-center justify-center">
                  <Eye
                    className="cursor-pointer hover:text-black"
                    title="Xem"
                    onClick={() => viewCVDetail(cv.id)}
                  />
                  <Pencil
                    className="cursor-pointer hover:text-black"
                    title="Sửa"
                    onClick={() =>
                      navigate(ROUTES.UPDATECVPAGE.replace(":id", cv.id))
                    }
                  />
                  <Upload
                    className="cursor-pointer hover:text-blue-600"
                    title="Xem trước CV"
                    onClick={() => handlePreviewCV(cv.id)}
                  />
                  <Trash2
                    className="cursor-pointer hover:text-red-600"
                    title="Xoá"
                    onClick={() => toggleModalDeleteComment(cv.id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-6 col-span-3">
              Không có CV nào trong danh sách.
            </div>
          )}
        </div>

        <div className="flex justify-between items-center py-4 px-4">
          {/* Hướng dẫn */}
          <a
            href="#"
            className="text-[#D83B01] font-semibold text-sm underline hover:opacity-80"
          >
            Hướng dẫn
          </a>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Pagination
              current={page}
              pageSize={size}
              total={totalCvs}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
        <DeleteModal isOpen={isModalOpen} />
      </div>

      {/* Modal xem trước CV */}
      <Modal
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        style={{ top: 0 }}
        height={"100vh"}
        width={800}
        footer={[<></>]}
        destroyOnClose
      >
        {currentCvFormData ? (
          <div className="p-4 h-[85vh] overflow-y-auto border rounded">
            <h2 className="text-xl font-bold mb-4">
              {currentCvFormData.cvName}
            </h2>
            <PDFViewer width="100%" height="90%" showToolbar>
              {(() => {
                switch (currentCvFormData.templateId) {
                  case 1:
                    return <TemplateCV1 data={currentCvFormData} />;
                  case 2:
                    return <TemplateCV2 data={currentCvFormData} />;
                  case 3:
                    return <TemplateCV3 data={sampleDataCV4} />;
                  case 4:
                    return <TemplateCV4 data={sampleDataCV4} />;
                  default:
                    return <TemplateCV1 data={currentCvFormData} />;
                }
              })()}
            </PDFViewer>
          </div>
        ) : (
          <div className="text-center py-8">Không có thông tin CV</div>
        )}
      </Modal>
    </div>
  );
}

export default CVManagement;
