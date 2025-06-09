import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import { toast } from "react-toastify";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { getUserData } from "@/helper/storage";
import applyAPI from "@/api/apply";
import cvAPI from "@/api/cv";
import jobAPI from "@/api/job";
import dayjs from "dayjs";
import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import TemplateCV2 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV2";
import TemplateCV3 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV3";
import TemplateCV4 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV4";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Filter,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  FileText,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/header/Header.jsx";

const ApplicationHeroSection = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 mb-8">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 -left-20 w-80 h-80 bg-teal-300/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-200/20 rounded-full blur-lg"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative z-10 py-12 px-8 md:py-16 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            className="md:w-1/2 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Quản lý CV ứng tuyển
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Theo dõi quá trình ứng tuyển của bạn
            </motion.h1>

            <motion.p
              className="text-lg opacity-90 mb-6 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Quản lý tất cả CV ứng tuyển của bạn tại một nơi. Theo dõi trạng
              thái, xem chi tiết công việc và CV đã nộp.
            </motion.p>
          </motion.div>

          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <motion.div
                    className="absolute inset-0 border-4 border-white/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute inset-4 border-4 border-white/30 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute inset-8 border-4 border-white/40 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-2xl rotate-45 flex items-center justify-center shadow-lg">
                      <div className="-rotate-45">
                        <FileText className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute top-0 -right-8 w-12 h-12 bg-teal-400/30 backdrop-blur-md rounded-lg"
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-10 left-10 w-16 h-16 bg-blue-400/30 backdrop-blur-md rounded-full"
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  />
                  <motion.div
                    className="absolute top-10 -left-10 w-10 h-10 bg-cyan-400/30 backdrop-blur-md rounded-lg rotate-12"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[70px]"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </div>
  );
};

const ApplicationSearchFilters = ({
  searchText = "",
  setSearchText = () => {},
  status = "ALL",
  setStatus = () => {},
  handleSearch = () => {},
  handleClearSearch = () => {},
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg relative z-10 mb-6">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />

        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center">
              <Filter size={18} className="text-cyan-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Bộ lọc tìm kiếm CV ứng tuyển
            </h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex items-center gap-2 mb-1.5">
                <Search size={14} className="text-cyan-600" />
                <label className="text-sm font-medium text-gray-700">
                  Tìm kiếm theo tên công việc
                </label>
              </div>              <div className="relative">                <Input
                  placeholder="Nhập tên công việc..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSearch();
                      console.log("Enter pressed in search input");
                    }
                  }}
                  className="w-full h-11 rounded-xl border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-20 transition-all pl-4 pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                  <Search size={12} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/4 space-y-2">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock size={14} className="text-cyan-600" />
                <label className="text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
              </div>
              <Select onValueChange={setStatus} value={status}>
                <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-20 transition-all">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-lg">
                  <SelectItem
                    value="ALL"
                    className="rounded-lg my-0.5 focus:bg-cyan-50 focus:text-cyan-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                        <Filter size={12} className="text-gray-600" />
                      </div>
                      Tất cả
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="PENDING"
                    className="rounded-lg my-0.5 focus:bg-cyan-50 focus:text-cyan-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-50 flex items-center justify-center">
                        <Clock size={12} className="text-yellow-600" />
                      </div>
                      Đang chờ
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="APPROVED"
                    className="rounded-lg my-0.5 focus:bg-cyan-50 focus:text-cyan-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle size={12} className="text-green-600" />
                      </div>
                      Đã duyệt
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="REJECTED"
                    className="rounded-lg my-0.5 focus:bg-cyan-50 focus:text-cyan-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                        <XCircle size={12} className="text-red-600" />
                      </div>
                      Từ chối
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                onClick={handleSearch}
                className="h-11 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 flex-1 md:flex-none shadow-md hover:shadow-lg"
              >
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>

              <Button
                onClick={handleClearSearch}
                variant="outline"
                className="h-11 px-6 border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-300 flex-1 md:flex-none"
              >
                <Filter className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ApplicationCard = ({ application, jobDetails, cvDetails, onViewJob, onViewCV }) => {
  const [loadingCV, setLoadingCV] = useState(false);
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 px-2 py-1">
            <Clock className="h-3 w-3" />
            <span>Đang chờ</span>
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 px-2 py-1">
            <CheckCircle className="h-3 w-3" />
            <span>Đã duyệt</span>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1 px-2 py-1">
            <XCircle className="h-3 w-3" />
            <span>Từ chối</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 px-2 py-1">
            Unknown
          </Badge>
        );
    }
  };

  const job = jobDetails[application.jobId];
  const cv = cvDetails[application.cvId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card className="overflow-hidden border border-gray-100 rounded-xl transition-all duration-300 hover:shadow-md group">
        <CardContent className="p-0">
          <div className="p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="hidden md:block w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-50 flex-shrink-0 flex items-center justify-center border border-blue-200">
                    <Briefcase className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {job?.title || "Đang tải..."}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {job?.company?.name || ""}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                        <FileText className="h-3 w-3 mr-1 text-blue-500" />
                        {cv?.cvName || "Đang tải..."}
                      </div>
                      <div className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                        <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                        {formatDate(application.appliedAt)}
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => onViewJob(application.jobId)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Xem công việc
                </Button>                <Button
                  variant="outline"
                  size="sm" 
                  className="rounded-lg border-cyan-200 text-cyan-600 hover:bg-cyan-50"
                  onClick={() => {
                    setLoadingCV(true);
                    onViewCV(application.cvId);
                    setTimeout(() => setLoadingCV(false), 1000);
                  }}
                  disabled={loadingCV}
                >
                  {loadingCV ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                  ) : (
                    <Eye className="h-3.5 w-3.5 mr-1" />
                  )}
                  Xem CV
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function ApplicationsManagement() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [jobDetails, setJobDetails] = useState({});
    const [cvDetails, setCvDetails] = useState({});
    const [searchText, setSearchText] = useState("");
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewCV, setPreviewCV] = useState(null);
    const [filters, setFilters] = useState({
        status: "ALL"
    });
    
    const navigate = useNavigate();
    const userData = getUserData();
    
    // Get template name
    const getTemplateName = (templateId) => {
        const templates = {
            1: "Professional CV",
            2: "Modern CV",
            3: "Creative CV",
            4: "Minimal CV",
        };
        return templates[templateId] || "CV Template";
    };
    
    // Transform CV API data to form data compatible with CV templates
    const transformCVDataForPreview = (cvData) => {
        if (!cvData) return null;
        
        return {
            id: cvData.id,
            name: cvData.cvName || cvData.name,
            templateId: cvData.templateId || 1,
            
            personalInfo: {
                id: cvData.info?.id,
                fullname: cvData.info?.fullName || "",
                position: cvData.info?.position || "",
                email: cvData.info?.email || "",
                phone: cvData.info?.phone || "",
                gender: cvData.info?.gender || "",
                dob: cvData.info?.dob || null,
                city: cvData.info?.city || "",
                address: cvData.info?.address || "",
                linkedin: cvData.info?.linkedin || "",
                github: cvData.info?.github || "",
                jobStatus: cvData.info?.jobStatus || "",
                expectedSalary: cvData.info?.expectedSalary || "",
                avatar: cvData.info?.avatar || "",
            },
            
            introduction: cvData.profile || "",
            
            experiences: Array.isArray(cvData.experiences)
                ? cvData.experiences.map((exp) => ({
                    id: exp.id || Date.now(),
                    company: exp.company || "",
                    position: exp.position || "",
                    startDate: exp.startDate ? dayjs(exp.startDate) : null,
                    endDate: exp.endDate ? dayjs(exp.endDate) : null,
                    isCurrent: !exp.endDate,
                    description: exp.description || "",
                }))
                : [],
                
            skills: Array.isArray(cvData.skills)
                ? cvData.skills.map((skill) => ({
                    id: skill.id || Date.now(),
                    skill: skill.name || "",
                    rate: skill.rate || 0,
                }))
                : [],
                
            education: Array.isArray(cvData.educations)
                ? cvData.educations.map((edu) => ({
                    id: edu.id || Date.now(),
                    school: edu.school || "",
                    field: edu.field || "",
                    startDate: edu.startDate ? dayjs(edu.startDate) : null,
                    endDate: edu.endDate ? dayjs(edu.endDate) : null,
                    description: edu.description || "",
                }))
                : [],
                
            projects: Array.isArray(cvData.projects)
                ? cvData.projects.map((p) => ({
                    id: p.id || Date.now(),
                    project: p.project || "",
                    startDate: p.startDate ? dayjs(p.startDate) : null,
                    endDate: p.endDate ? dayjs(p.endDate) : null,
                    description: p.description || "",
                }))
                : [],
                
            interests: Array.isArray(cvData.interests)
                ? cvData.interests.map((h) => ({
                    id: h.id || Date.now(),
                    interest: h.interest || "",
                }))
                : [],
                
            hobbies: Array.isArray(cvData.interests)
                ? cvData.interests.map((h) => ({
                    id: h.id || Date.now(),
                    name: h.interest || "",
                }))
                : [],
                
            languages: Array.isArray(cvData.languages)
                ? cvData.languages.map((l) => ({
                    id: l.id || Date.now(),
                    language: l.language || "",
                    level: l.level || "",
                }))
                : [],
                
            activities: Array.isArray(cvData.activities)
                ? cvData.activities.map((a) => ({
                    id: a.id || Date.now(),
                    activity: a.activity || "",
                    startDate: a.startDate ? dayjs(a.startDate) : null,
                    endDate: a.endDate ? dayjs(a.endDate) : null,
                    isCurrent: !a.endDate,
                    description: a.description || "",
                }))
                : [],
                
            certificates: Array.isArray(cvData.certificates)
                ? cvData.certificates.map((c) => ({
                    id: c.id || Date.now(),
                    certificate: c.certificate || "",
                    date: c.date ? dayjs(c.date) : null,
                    description: c.description || "",
                }))
                : [],
                
            additionalInfo: cvData.additionalInfo || "",
        };
    };
    
    useEffect(() => {
        const fetchApplications = async () => {
            if (!userData?.id) return;
            
            setLoading(true);
            try {
                const response = await applyAPI.getUserApplications(userData.id);
                
                if (response.data?.data) {
                    const applicationsData = response.data.data || [];
                    setApplications(applicationsData);
                    
                    await fetchAssociatedData(applicationsData);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
                toast.error("Không thể tải danh sách CV ứng tuyển. Vui lòng thử lại sau.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [userData?.id]);

    const fetchAssociatedData = async (applications) => {
        const jobPromises = applications.map(app => 
            jobAPI.getJobDetail(app.jobId)
                .then(res => {
                    setJobDetails(prev => ({
                        ...prev,
                        [app.jobId]: res.data?.data
                    }));
                })
                .catch(err => console.error(`Error fetching job ${app.jobId}:`, err))
        );
        
        const cvPromises = applications.map(app => 
            cvAPI.getDetailCv(app.cvId)
                .then(res => {
                    setCvDetails(prev => ({
                        ...prev,
                        [app.cvId]: res.data?.data
                    }));
                })
                .catch(err => console.error(`Error fetching CV ${app.cvId}:`, err))
        );
        
        await Promise.all([...jobPromises, ...cvPromises]);
    };
    
    const handleStatusChange = (value) => {
        setFilters(prev => ({ ...prev, status: value }));
    };
    const handleSearchChange = (e) => {
        if (e && e.target && e.target.value !== undefined) {
            console.log("Search input changed (event):", e.target.value);
            setSearchText(e.target.value);
        } else {
            console.log("Search input changed (direct value):", e);
            setSearchText(e);
        }
    };
    const filteredApplications = applications.filter(app => {
        const job = jobDetails[app.jobId];
        
        const statusMatch = filters.status === "ALL" || app.status === filters.status;
        
        const jobTitle = job?.title || "";
        const searchMatch = !searchText || (
            jobTitle.toLowerCase().includes(searchText.toLowerCase())
        );
        
        if (searchText && !searchMatch && job) {
            console.log(`Job "${jobTitle}" doesn't match search "${searchText}"`);
        }
        
        return statusMatch && searchMatch;
    });

    const viewJobDetails = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };    // Preview CV
    const handlePreviewCV = (cvId) => {
        const cv = cvDetails[cvId];
        if (cv) {
            console.log("Original CV data:", cv);
            const formattedCVData = transformCVDataForPreview(cv);
            console.log("Formatted CV data for preview:", formattedCVData);
            setPreviewCV(formattedCVData);
            setShowPreviewModal(true);
        } else {
            console.error("CV not found with ID:", cvId);
            toast.error("Không thể tải thông tin CV. Vui lòng thử lại sau.");
        }
    };

    const handleSearch = () => {
    };

    const handleClearSearch = () => {
        setSearchText("");
        setFilters({ status: "ALL" });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="w-full max-w-7xl mx-auto px-4 pt-20 pb-16">
                <ApplicationHeroSection />                  <ApplicationSearchFilters 
                    searchText={searchText}
                    setSearchText={handleSearchChange}
                    status={filters.status}
                    setStatus={handleStatusChange}
                    handleSearch={handleSearch}
                    handleClearSearch={handleClearSearch}
                />
                
                <div className="mb-6">                <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {filteredApplications.length > 0 
                                    ? `Danh sách CV ứng tuyển (${filteredApplications.length})` 
                                    : "Danh sách CV ứng tuyển"}
                            </h2>
                            {searchText && (
                                <span className="ml-3 px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded-full flex items-center">
                                    <Search size={12} className="mr-1" />
                                    Đang tìm: "{searchText}"
                                </span>
                            )}
                        </div>  
                        
                    </div>
                    
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4 opacity-70" />
                            <p className="text-gray-500 text-lg">Đang tải danh sách CV ứng tuyển...</p>
                        </div>
                    ) : filteredApplications.length > 0 ? (
                        <div className="space-y-4">
                            {filteredApplications.map(application => (
                                <ApplicationCard 
                                    key={application.id}
                                    application={application}
                                    jobDetails={jobDetails}
                                    cvDetails={cvDetails}
                                    onViewJob={viewJobDetails}
                                    onViewCV={handlePreviewCV}
                                />
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-10 w-10 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy CV ứng tuyển</h3>
                            <p className="text-gray-500 max-w-md text-center mb-6">
                                Không có CV ứng tuyển nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các bộ lọc khác.
                            </p>
                            <Button 
                                onClick={() => navigate('/jobs')}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <Briefcase className="w-4 h-4 mr-2" />
                                Tìm việc ngay
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
            
            {/* CV Preview Dialog */}
            <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
                <DialogContent className="max-w-4xl h-[90vh] p-6">                    {previewCV ? (
                        <div className="h-full flex flex-col">                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {previewCV.name} 
                                        <span className="ml-2 text-sm font-normal text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                                            {getTemplateName(previewCV.templateId)}
                                        </span>
                                    </h2>
                                    {previewCV.personalInfo && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {previewCV.personalInfo.fullname} {previewCV.personalInfo.position && `• ${previewCV.personalInfo.position}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden rounded-lg border border-gray-200">
                                <PDFViewer width="100%" height="100%" showToolbar>
                                    {(() => {
                                        switch (previewCV.templateId) {
                                            case 1:
                                                return <TemplateCV1 data={previewCV} />;
                                            case 2:
                                                return <TemplateCV2 data={previewCV} />;
                                            case 3:
                                                return <TemplateCV3 data={previewCV} />;
                                            case 4:
                                                return <TemplateCV4 data={previewCV} />;
                                            default:
                                                return <TemplateCV1 data={previewCV} />;
                                        }
                                    })()}
                                </PDFViewer>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8">
                            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-500">Đang tải thông tin CV...</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ApplicationsManagement;