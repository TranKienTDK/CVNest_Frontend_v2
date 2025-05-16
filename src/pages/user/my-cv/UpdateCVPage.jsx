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
import { useNavigate, useParams } from "react-router-dom";
import logo1 from "../../../assets/temp1.jpg";
import logo2 from "../../../assets/temp2.jpg";
import logo3 from "../../../assets/temp3.jpg";
import logo4 from "../../../assets/temp4.jpg";
import { ROUTES } from "@/routes/routes";
import PreviewCV from "@/pages/user/my-cv/components/PreviewCV";
import cvAPI from "@/api/cv";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const isFakeData = false;

const transformApiDataToFormData = (apiData) => {
  if (!apiData) return null;

  const formattedData = {
    id: apiData.id,
    name: apiData.cvName || apiData.name,
    templateId: apiData.templateId || 1,

    // Thông tin cá nhân
    personalInfo: {
      id: apiData.info?.id,
      fullname: apiData.info?.fullName || "",
      position: apiData.info?.position || "",
      email: apiData.info?.email || "",
      phone: apiData.info?.phone || "",
      gender: apiData.info?.gender || "",
      dob: apiData.info?.dob || null,
      city: apiData.info?.city || "",
      address: apiData.info?.address || "",
      linkedin: apiData.info?.linkedin || "",
      github: apiData.info?.github || "",
      jobStatus: apiData.info?.jobStatus || "",
      expectedSalary: apiData.info?.expectedSalary || "",
      avatar: apiData.info?.avatar || "",
    },

    introduction: apiData.profile || "",

    experiences: Array.isArray(apiData.experiences)
      ? apiData.experiences.map((exp) => {
          return {
            id: exp.id || Date.now(),
            company: exp.company || "",
            position: exp.position || "",
            startDate: exp.startDate ? dayjs(exp.startDate) : null,
            endDate: exp.endDate ? dayjs(exp.endDate) : null,
            isCurrent: !exp.endDate,
            description: exp.description || "",
            usageTechnologies: exp.usageTechnologies || "",
          };
        })
      : [],

    skills: Array.isArray(apiData.skills)
      ? apiData.skills.map((skill) => ({
          id: skill.id || Date.now(),
          skill: skill.name || "",
          rate: skill.rate || 0,
        }))
      : [],

    education: Array.isArray(apiData.educations)
      ? apiData.educations.map((edu) => ({
          id: edu.id || Date.now(),
          school: edu.school || "",
          field: edu.field || "",
          startDate: edu.startDate ? dayjs(edu.startDate) : null,
          endDate: edu.endDate ? dayjs(edu.endDate) : null,
          description: edu.description || "",
        }))
      : [],

    projects: Array.isArray(apiData.projects)
      ? apiData.projects.map((p) => ({
          id: p.id || Date.now(),
          project: p.project || "",
          startDate: p.startDate ? dayjs(p.startDate) : null,
          endDate: p.endDate ? dayjs(p.endDate) : null,
          description: p.description || "",
        }))
      : [],

    interests: Array.isArray(apiData.interests)
      ? apiData.interests.map((h) => ({
          id: h.id || Date.now(),
          interest: h.interest || "",
        }))
      : [],

    hobbies: Array.isArray(apiData.interests)
      ? apiData.interests.map((h) => ({
          id: h.id || Date.now(),
          name: h.interest || "",
        }))
      : [],

    consultants: Array.isArray(apiData.consultants)
      ? apiData.consultants.map((c) => ({
          id: c.id || Date.now(),
          name: c.name || "",
          position: c.position || "",
          email: c.email || "",
          phone: c.phone || "",
        }))
      : [],

    languages: Array.isArray(apiData.languages)
      ? apiData.languages.map((l) => ({
          id: l.id || Date.now(),
          language: l.language || "",
          level: l.level || "",
        }))
      : [],

    activities: Array.isArray(apiData.activities)
      ? apiData.activities.map((a) => ({
          id: a.id || Date.now(),
          activity: a.activity || "",
          startDate: a.startDate ? dayjs(a.startDate) : null,
          endDate: a.endDate ? dayjs(a.endDate) : null,
          isCurrent: !a.endDate,
          description: a.description || "",
        }))
      : [],

    certificates: Array.isArray(apiData.certificates)
      ? apiData.certificates.map((c) => ({
          id: c.id || Date.now(),
          certificate: c.certificate || "",
          date: c.date ? dayjs(c.date) : null,
          description: c.description || "",
        }))
      : [],

    additionalInfo: apiData.additionalInfo || "",
  };

  return formattedData;
};

const prepareDataForAPI = (formData) => {
  const preparedData = {
    templateId: formData.templateId || 1,
    profile: formData.introduction || "",
    cvName: formData.name || "",
    additionalInfo: formData.additionalInfo || "",

    info: {
      id: formData.personalInfo?.id,
      fullName: formData.personalInfo?.fullname || "",
      position: formData.personalInfo?.position || "",
      email: formData.personalInfo?.email || "",
      phone: formData.personalInfo?.phone || "",
      gender: formData.personalInfo?.gender || "",
      dob: formData.personalInfo?.dob
        ? typeof formData.personalInfo.dob === "string"
          ? formData.personalInfo.dob
          : formData.personalInfo.dob.format("YYYY-MM-DD")
        : null,
      city: formData.personalInfo?.city || "",
      address: formData.personalInfo?.address || "",
      linkedin: formData.personalInfo?.linkedin || "",
      github: formData.personalInfo?.github || "",
    },

    experiences: Array.isArray(formData.workExperience)
      ? formData.workExperience.map((exp) => ({
          id: exp.id,
          company: exp.company || "",
          position: exp.position || "",
          startDate: exp.startDate
            ? typeof exp.startDate === "string"
              ? exp.startDate
              : exp.startDate.format("YYYY-MM-DD")
            : null,
          endDate: exp.endDate
            ? typeof exp.endDate === "string"
              ? exp.endDate
              : exp.endDate.format("YYYY-MM-DD")
            : null,
          description: exp.description || "",
          usageTechnologies: exp.usageTechnologies || "",
        }))
      : [],

    skills: Array.isArray(formData.skills)
      ? formData.skills.map((skill) => ({
          id: skill.id,
          skill: skill.name || "",
          rate: skill.rate || 0,
        }))
      : [],

    educations: Array.isArray(formData.education)
      ? formData.education.map((edu) => ({
          id: edu.id,
          school: edu.school || "",
          field: edu.field || edu.degree || "",
          startDate: edu.startDate
            ? typeof edu.startDate === "string"
              ? edu.startDate
              : edu.startDate.format("YYYY-MM-DD")
            : null,
          endDate: edu.endDate
            ? typeof edu.endDate === "string"
              ? edu.endDate
              : edu.endDate.format("YYYY-MM-DD")
            : null,
          description: edu.description || "",
        }))
      : [],

    projects: Array.isArray(formData.projects)
      ? formData.projects.map((p) => ({
          id: p.id,
          project: p.project || "",
          startDate: p.startDate
            ? typeof p.startDate === "string"
              ? p.startDate
              : p.startDate.format("YYYY-MM-DD")
            : null,
          endDate: p.endDate
            ? typeof p.endDate === "string"
              ? p.endDate
              : p.endDate.format("YYYY-MM-DD")
            : null,
          description: p.description || "",
        }))
      : [],

    interests: Array.isArray(formData.interests || formData.hobbies)
      ? (formData.interests || formData.hobbies).map((h) => ({
          id: h.id,
          interest: h.interest || h.name || "",
        }))
      : [],

    consultants: Array.isArray(formData.consultants || formData.references)
      ? (formData.consultants || formData.references).map((c) => ({
          id: c.id,
          name: c.name || "",
          position: c.position || "",
          email: c.email || "",
          phone: c.phone || "",
        }))
      : [],

    languages: Array.isArray(formData.languages)
      ? formData.languages.map((l) => ({
          id: l.id,
          language: l.language || "",
          level: l.level || null,
        }))
      : [],

    activities: Array.isArray(formData.activities)
      ? formData.activities.map((a) => ({
          id: a.id,
          activity: a.activity || a.name || "",
          startDate:
            a.startDate || a.from
              ? typeof (a.startDate || a.from) === "string"
                ? a.startDate || a.from
                : (a.startDate || a.from).format("YYYY-MM-DD")
              : null,
          endDate:
            a.endDate || a.to
              ? typeof (a.endDate || a.to) === "string"
                ? a.endDate || a.to
                : (a.endDate || a.to).format("YYYY-MM-DD")
              : null,
          description: a.description || "",
        }))
      : [],

    certificates: Array.isArray(formData.certificates)
      ? formData.certificates.map((c) => ({
          id: c.id,
          certificate: c.certificate || c.name || "",
          date:
            c.date || c.time
              ? typeof (c.date || c.time) === "string"
                ? c.date || c.time
                : (c.date || c.time).format("YYYY-MM-DD")
              : null,
          description: c.description || "",
        }))
      : [],
  };

  preparedData.experiences = preparedData.experiences || [];
  preparedData.skills = preparedData.skills || [];
  preparedData.educations = preparedData.educations || [];
  preparedData.projects = preparedData.projects || [];
  preparedData.interests = preparedData.interests || [];
  preparedData.consultants = preparedData.consultants || [];
  preparedData.languages = preparedData.languages || [];
  preparedData.activities = preparedData.activities || [];
  preparedData.certificates = preparedData.certificates || [];

  console.log("Data prepared for API:", preparedData);
  return preparedData;
};

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

function UpdateCVPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the CV ID from the URL
  const [cvData, setCvData] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUpdateCV = async () => {
    try {
      const currentData =
        JSON.parse(localStorage.getItem("cv_draft")) || cvData;

      if (!currentData) {
        toast.error("Không tìm thấy dữ liệu CV để cập nhật");
        return;
      }

      const dataToUpdate = prepareDataForAPI(currentData);

      console.log(`Updating CV with ID: ${id} - Data:`, dataToUpdate);

      await cvAPI.updateCV(id, dataToUpdate);

      toast.success("Cập nhật CV thành công!");

      navigate(ROUTES.CV_MANAGEMENT);
    } catch (error) {
      console.error("Error updating CV:", error);
      toast.error("Cập nhật CV thất bại. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        setLoading(true);

        if (isFakeData) {
          console.log("Using fake data for CV ID:", id);
          const mockData = {
            id: id,
            name: "Lê Văn Hoàng - Fullstack Developer",
            templateId: 2,
            status: "Chưa dùng để ứng tuyển",
            createdAt: "2025-04-01T15:30:00",
            updatedAt: "2025-04-09T17:20:03",
            completed: true,
            personalInfo: {
              fullname: "Lê Văn Hoàng",
              position: "Fullstack Developer",
              email: "hoang.le@example.com",
              phone: "0987654321",
              gender: "MALE",
              dob: "1995-05-15",
              city: "50",
              address: "123 Đường ABC, Quận 1",
              linkedin: "https://linkedin.com/in/hoangle",
              github: "https://github.com/hoangle",
              jobStatus: "Đang tìm việc",
              expectedSalary: "$300 - $500",
            },
            introduction:
              "Tôi là một Fullstack Developer với 5 năm kinh nghiệm...",
            workExperience: [
              {
                id: 1,
                company: "Tech Company A",
                position: "Senior Developer",
                startDate: "2020-01",
                endDate: "2023-04",
                description: "Phát triển và duy trì các ứng dụng web...",
              },
            ],
            skills: [
              { id: 1, name: "JavaScript", level: 5 },
              { id: 2, name: "React", level: 4 },
              { id: 3, name: "Node.js", level: 4 },
            ],
            education: [
              {
                id: 1,
                school: "Đại học Bách Khoa",
                degree: "Kỹ sư Công nghệ thông tin",
                startDate: "2013-09",
                endDate: "2017-06",
                description: "Tốt nghiệp loại giỏi",
              },
            ],
            // certificates : []
          };

          setTimeout(() => {
            setCvData(mockData);
            setSelectedTemplate(mockData.templateId || "");

            localStorage.setItem("cv_draft", JSON.stringify(mockData));

            setLoading(false);
          }, 500);
        } else {
          const response = await cvAPI.getDetailCv(id);
          console.log("Fetched CV data:", response.data.data);
          const data = transformApiDataToFormData(response.data.data);
          setCvData(data);
          setSelectedTemplate(data.templateId || "");

          localStorage.setItem("cv_draft", JSON.stringify(data));

          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching CV data:", err);
        setError("Failed to load CV data. Please try again.");
        setLoading(false);
        toast.error("Failed to load CV data. Please try again.");
      }
    };

    fetchCVData().then((r) => r);
  }, [id]);

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);
  const currentTemplateName = currentTemplate?.name || "";

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
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
                  </div>
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
                {/* FORMS */}
                <PersonalInfoForm />
                {/* TEMPLATE MODAL */}
                {showTemplateModal && (
                  <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
                    onClick={() => setShowTemplateModal(false)}
                  >
                    <div
                      className="bg-white shadow-xl rounded-lg p-4 w-[80%] h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col gap-6 p-8">
                        <h1 className="text-2xl font-bold">Chọn mẫu CV</h1>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                          {templates.map((template) => (
                            <div
                              key={template.id}
                              className={`border-2 rounded-lg overflow-hidden cursor-pointer transition ${
                                selectedTemplate === template.id
                                  ? "border-blue-500 ring-2 ring-blue-300"
                                  : "border-gray-200 hover:border-blue-300"
                              }`}
                              onClick={() => {
                                setSelectedTemplate(template.id);
                                try {
                                  const draft = JSON.parse(
                                    localStorage.getItem("cv_draft") || "{}"
                                  );
                                  draft.templateId = template.id;
                                  localStorage.setItem(
                                    "cv_draft",
                                    JSON.stringify(draft)
                                  );
                                } catch (e) {
                                  console.error(
                                    "Error updating template in localStorage",
                                    e
                                  );
                                }
                              }}
                            >
                              <div className="relative pt-[140%]">
                                <img
                                  src={template.image}
                                  alt={template.name}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-2 bg-white">
                                <h3 className="text-sm font-medium text-center">
                                  {template.name}
                                </h3>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-center mt-4">
                          <button
                            onClick={() => setShowTemplateModal(false)}
                            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            Xác nhận mẫu
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* PREVIEW MODAL - Sửa lại cấu trúc dữ liệu truyền vào */}
                <PreviewCV
                  showPreviewModal={showPreviewModal}
                  setShowPreviewModal={setShowPreviewModal}
                  cvData={cvData}
                  onSaveCV={handleUpdateCV}
                  isUpdate={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CreateCVProvider>
  );
}

export default UpdateCVPage;
