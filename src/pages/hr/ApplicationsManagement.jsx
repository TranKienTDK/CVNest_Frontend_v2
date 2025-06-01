import React, { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import TemplateCV2 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV2";
import TemplateCV3 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV3";
import TemplateCV4 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV4";
import { PDFViewer } from "@react-pdf/renderer";
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Typography,
  Modal,
  message,
  Empty,
  Spin,
  Space,
  Tooltip,
} from "antd";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Filter,
  RefreshCw,
  Users,
  Clock,
  FileText,
  Download,
  Star
} from "lucide-react";
import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";
import { getUserData } from "@/helper/storage";
import applyAPI from "@/api/apply";
import jobAPI from "@/api/job";
import cvAPI from "@/api/cv";
import styles from "./ApplicationsManagement.module.css";
import dayjs from "dayjs";

const transformApiDataToFormData = (apiData) => {
  if (!apiData) return null;

  const formattedData = {
    id: apiData.id,
    name: apiData.cvName || apiData.name,
    templateId: apiData.templateId || 1,
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
      ? apiData.experiences.map((exp) => ({
          id: exp.id || Date.now(),
          company: exp.company || "",
          position: exp.position || "",
          startDate: exp.startDate ? dayjs(exp.startDate) : null,
          endDate: exp.endDate ? dayjs(exp.endDate) : null,
          isCurrent: !exp.endDate,
          description: exp.description || "",
        }))
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

const { Title, Text } = Typography;

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewCV, setPreviewCV] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");  const [applicationsWithJobDetails, setApplicationsWithJobDetails] = useState([]);
  const [loadingCV, setLoadingCV] = useState(false);
  const [cvDetailsCache, setCvDetailsCache] = useState({});
  const [jobDetailsCache, setJobDetailsCache] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);  
  
  const userData = getUserData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    fetchApplications();
  }, [activeTab]);
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applyAPI.getHRApplications(userData.id);
      
      let filteredApps = response.data.data || [];
      
      if (activeTab !== "all") {
        const tabStatus = activeTab === "pending" ? "PENDING" : 
                         activeTab === "approved" ? "APPROVED" : 
                         activeTab === "rejected" ? "REJECTED" : null;
        if (tabStatus) {
          filteredApps = filteredApps.filter(app => app.status === tabStatus);
        }
      }

      if (searchKeyword) {
        filteredApps = filteredApps.filter(app => 
          app.applicantName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          app.email?.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }
      
      setApplications(filteredApps);
    } catch (error) {
      console.error("Error fetching applications:", error);      toast.error("Không thể tải danh sách đơn ứng tuyển. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };  useEffect(() => {
    const fetchJobTitlesAndCvDetails = async () => {
      const updatedApps = await Promise.all(
        applications.map(async (app) => {
          let jobTitle = "Đang tải...";
          if (jobDetailsCache[app.jobId]) {
            jobTitle = jobDetailsCache[app.jobId].title;
          } else {
            try {
              const jobResponse = await jobAPI.getJobDetail(app.jobId);
              const jobData = jobResponse.data.data;
              jobTitle = jobData.title;
              
              setJobDetailsCache(prev => ({
                ...prev,
                [app.jobId]: jobData
              }));
            } catch (error) {
              console.error(`Error fetching job details for ID ${app.jobId}:`, error);
              jobTitle = "Không thể tải thông tin";
            }
          }
          
          let cvData = cvDetailsCache[app.cvId];
          if (!cvData && app.cvId) {
            try {
              const response = await cvAPI.getDetailCv(app.cvId);
              cvData = response.data.data;
              
              setCvDetailsCache(prev => ({
                ...prev,
                [app.cvId]: cvData
              }));
            } catch (error) {
              console.error(`Error fetching CV details for ID ${app.cvId}:`, error);
              cvData = null;
            }
          }
          
          const fullName = cvData?.info?.fullName || app.applicantName || "Chưa có thông tin";
          const email = cvData?.info?.email || app.email || "Chưa có thông tin";
          
          return { 
            ...app, 
            jobTitle, 
            applicantName: fullName,
            email: email
          };
        })
      );
      
      setApplicationsWithJobDetails(updatedApps);
    };
    
    if (applications.length > 0) {
      fetchJobTitlesAndCvDetails();
    }
  }, [applications, cvDetailsCache]);
  const handleApproveApplication = async (applyId) => {
    try {
      await applyAPI.approveApplication(applyId);
        toast.success("Đã duyệt đơn ứng tuyển thành công.", {
        position: "top-right",
        autoClose: 2000,
      });
      
      fetchApplications();
    } catch (err) {
      console.error("Error approving application:", err);
        toast.error("Không thể duyệt đơn ứng tuyển. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleRejectApplication = async (applyId) => {
    try {
      await applyAPI.rejectApplication(applyId);
        toast.success("Đã từ chối đơn ứng tuyển thành công.", {
        position: "top-right",
        autoClose: 2000,
      });
      
      fetchApplications();
    } catch (err) {
      console.error("Error rejecting application:", err);
        toast.error("Không thể từ chối đơn ứng tuyển. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };  const handlePreviewCV = async (cvId) => {
    try {
      setLoadingCV(true);
      let cvData;
      
      if (cvDetailsCache[cvId]) {
        cvData = cvDetailsCache[cvId];
      } else {
        const response = await cvAPI.getDetailCv(cvId);
        cvData = response.data.data;
        
        setCvDetailsCache(prev => ({
          ...prev,
          [cvId]: cvData
        }));
      }
      
      const formattedData = transformApiDataToFormData(cvData);
      setPreviewCV(formattedData);
      setShowPreviewModal(true);
    } catch (error) {
      console.error("Error fetching CV details:", error);      toast.error("Không thể tải thông tin CV. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoadingCV(false);
    }
  };

  const ModalContent = () => (
    <Modal
      open={showPreviewModal}
      onCancel={() => setShowPreviewModal(false)}
      centered
      width="95%"
      style={{
        top: 20,
        maxWidth: 1200,
        margin: '0 auto'
      }}
      bodyStyle={{
        height: 'calc(95vh - 40px)',
        padding: 0,
        overflow: 'hidden'
      }}
      footer={null}
      destroyOnClose
      className={`${styles['modal-container']} custom-preview-modal`}
    >
      <motion.div className="h-full bg-white rounded-lg overflow-hidden">
        <motion.div className="h-full">
          <PDFViewer width="100%" height="100%" showToolbar>
            {previewCV && <CVTemplate formData={previewCV} />}
          </PDFViewer>
        </motion.div>
      </motion.div>
    </Modal>
  );
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: viLocale });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className={`${styles['status-pending']} px-3 py-1 rounded-full`}>Đang chờ duyệt</Badge>;
      case "APPROVED":
        return <Badge variant="secondary" className={`${styles['status-approved']} px-3 py-1 rounded-full`}>Đã duyệt</Badge>;
      case "REJECTED":
        return <Badge variant="secondary" className={`${styles['status-rejected']} px-3 py-1 rounded-full`}>Đã từ chối</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };
    const getStats = () => {
    const total = applicationsWithJobDetails.length;
    const pending = applicationsWithJobDetails.filter(app => app.status === "PENDING").length;
    const approved = applicationsWithJobDetails.filter(app => app.status === "APPROVED").length;
    const rejected = applicationsWithJobDetails.filter(app => app.status === "REJECTED").length;
    
    return { total, pending, approved, rejected };
  };
  
  const exportToExcel = () => {
    try {
      const filteredApplications = applicationsWithJobDetails.filter(app => {
        const matchesTab = activeTab === "all" || 
          (activeTab === "pending" && app.status === "PENDING") ||
          (activeTab === "approved" && app.status === "APPROVED") ||
          (activeTab === "rejected" && app.status === "REJECTED");
        
        return matchesTab;
      });
      
      const exportData = filteredApplications.map(app => ({
        'Họ và tên': app.applicantName,
        'Email': app.email,
        'Vị trí ứng tuyển': app.jobTitle,
        'Ngày ứng tuyển': formatDate(app.appliedAt),
        'Trạng thái': app.status === "PENDING" ? "Đang chờ duyệt" : 
                      app.status === "APPROVED" ? "Đã duyệt" : 
                      app.status === "REJECTED" ? "Đã từ chối" : "Không xác định"
      }));
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách ứng viên");
      
      const now = new Date();
      const dateStr = format(now, "ddMMyyyy_HHmmss");
      const fileName = `Danh_sach_ung_vien_${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
        toast.success(`Đã xuất file "${fileName}" thành công.`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
        toast.error("Có lỗi khi xuất file Excel. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const columns = [
    {
      title: "Tên ứng viên",
      dataIndex: "applicantName",
      key: "applicantName",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vị trí ứng tuyển",
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (jobTitle) => jobTitle || "Đang tải...",
    },
    {
      title: "Ngày ứng tuyển",
      dataIndex: "appliedAt",
      key: "appliedAt",
      render: (appliedAt) => formatDate(appliedAt),
    },    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem CV">
            <Button
              type="primary"
              icon={<Eye size={16} />}
              onClick={() => handlePreviewCV(record.cvId)}
              className="bg-blue-500"
            />
          </Tooltip>
          
          {record.status === "PENDING" && (
            <>
              <Tooltip title="Phê duyệt">
                <Button
                  type="primary"
                  icon={<CheckCircle size={16} />}
                  onClick={() => handleApproveApplication(record.id)}
                  className="bg-green-500"
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button
                  type="primary"
                  danger
                  icon={<XCircle size={16} />}
                  onClick={() => handleRejectApplication(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: pageLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >{/* Header Section */}
      <div className={`${styles['glass-card']} border-b border-white/20 backdrop-blur-xl`}>
        <div className="container mx-auto px-6 py-8 pt-24">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Quản lý CV ứng tuyển
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Theo dõi và quản lý tất cả các đơn ứng tuyển vào công ty của bạn một cách hiệu quả
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                className={`${styles['gradient-blue']} text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                onClick={() => window.location.href = '/hr/jobs'}
              >
                <FileText className="w-5 h-5 mr-2" />
                Quản lý việc làm
              </Button>
            </motion.div>
          </div>
        </div>
      </div><div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={styles['stats-card-container']}
          >
            <Card className={`${styles['stats-card']} ${styles['glass-card']} p-6 border-0 shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tổng đơn ứng tuyển</p>
                  <p className="text-3xl font-bold text-gray-900">{getStats().total}</p>
                </div>
                <div className={`${styles['gradient-blue']} p-3 rounded-xl`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={styles['stats-card-container']}
          >
            <Card className={`${styles['stats-card']} ${styles['glass-card']} p-6 border-0 shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Đang chờ duyệt</p>
                  <p className="text-3xl font-bold text-amber-600">{getStats().pending}</p>
                </div>
                <div className={`${styles['gradient-amber']} p-3 rounded-xl`}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className={styles['stats-card-container']}
          >
            <Card className={`${styles['stats-card']} ${styles['glass-card']} p-6 border-0 shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Đã phê duyệt</p>
                  <p className="text-3xl font-bold text-green-600">{getStats().approved}</p>
                </div>
                <div className={`${styles['gradient-green']} p-3 rounded-xl`}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className={styles['stats-card-container']}
          >
            <Card className={`${styles['stats-card']} ${styles['glass-card']} p-6 border-0 shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Đã từ chối</p>
                  <p className="text-3xl font-bold text-red-600">{getStats().rejected}</p>
                </div>
                <div className={`${styles['gradient-red']} p-3 rounded-xl`}>
                  <XCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >          <Card className={`${styles['glass-card']} p-6 mb-8 border-0 shadow-xl`}>
            <div className={`flex justify-end items-center ${styles['filter-container']}`}>
              <div className={`flex gap-3 w-full lg:w-auto ${styles['search-wrapper']}`}>
                <div className="relative flex-1 lg:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    placeholder="Tìm kiếm ứng viên..." 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onPressEnter={fetchApplications}
                    className={`${styles['search-input']} pl-10 pr-4 py-3 rounded-xl border-0 w-full`}
                  />
                </div>
                <Button 
                  variant="outline"
                  className={`${styles['action-button']} px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80`}
                  onClick={fetchApplications}
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>              
              </div>
            </div>          
          </Card>        </motion.div>

        {/* Applications Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className={`${styles['glass-card']} border-0 shadow-xl overflow-hidden`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className={`p-6 border-b border-gray-100 ${styles['tabs-container']}`}>
              <TabsList className={`grid w-full grid-cols-4 bg-gray-100 rounded-xl p-1 ${styles['tabs-list']}`}>
                <TabsTrigger 
                  value="all" 
                  className={`${styles['tab-item']} data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium`}
                >
                  <Filter className={`w-4 h-4 mr-2 ${styles['tab-icon']}`} />
                  <span>Tất cả</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="pending" 
                  className={`${styles['tab-item']} data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium`}
                >
                  <Calendar className={`w-4 h-4 mr-2 ${styles['tab-icon']}`} />
                  <span>Chờ duyệt</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="approved" 
                  className={`${styles['tab-item']} data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium`}
                >
                  <CheckCircle className={`w-4 h-4 mr-2 ${styles['tab-icon']}`} />
                  <span>Đã duyệt</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected" 
                  className={`${styles['tab-item']} data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium`}
                >
                  <XCircle className={`w-4 h-4 mr-2 ${styles['tab-icon']}`} />
                  <span>Đã từ chối</span>
                </TabsTrigger>
              </TabsList>
            </div>            <TabsContent value={activeTab} className="p-0">
              {loading ? (
                <div className="p-8 space-y-6">
                  <div className="flex justify-center mb-4">
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                  </div>
                  
                  {/* Skeleton loaders */}
                  {[1, 2, 3, 4].map((item) => (
                    <motion.div 
                      key={item}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: item * 0.1 }}
                      className="animate-pulse flex items-center border-b border-gray-100 pb-4"
                    >
                      <div className="flex items-center space-x-3 w-1/4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="w-1/4 ml-8">
                        <div className="h-4 bg-gray-200 rounded w-36"></div>
                      </div>
                      <div className="w-1/4 ml-8">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="w-1/8 ml-8">
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="w-1/8 ml-auto flex space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : applicationsWithJobDetails.length > 0 ? (
                <div className={`${styles['custom-scrollbar']} overflow-x-auto`}>
                  <Table className={`${styles['custom-table']}`}>
                    <TableHeader>
                      <TableRow className="border-b border-gray-100">
                        <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['applicant-header']}`}>Ứng viên</TableHead>
                        <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['job-header']}`}>Vị trí ứng tuyển</TableHead>
                        <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['date-header']}`}>Ngày ứng tuyển</TableHead>
                        <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['status-header']}`}>Trạng thái</TableHead>
                        <TableHead className={`font-semibold text-gray-700 py-4 px-6 text-center ${styles['action-header']}`}>Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicationsWithJobDetails
                        .filter(app => {
                          const matchesSearch = searchKeyword === "" || 
                            app.applicantName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                            app.email?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                            app.jobTitle?.toLowerCase().includes(searchKeyword.toLowerCase());
                          
                          const matchesTab = activeTab === "all" || 
                            (activeTab === "pending" && app.status === "PENDING") ||
                            (activeTab === "approved" && app.status === "APPROVED") ||
                            (activeTab === "rejected" && app.status === "REJECTED");
                          
                          return matchesSearch && matchesTab;
                        })
                        .map((application, index) => (
                          <TableRow 
                            key={application.id}
                            className={`${styles['table-row-animate']} border-b border-gray-50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-200`}
                            style={{ 
                              animationDelay: `${index * 50}ms` 
                            }}
                          >
                            <TableCell className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold ${styles['applicant-avatar']}`}>
                                  {application.applicantName?.charAt(0) || "?"}
                                </div>
                                <div className={`${styles['applicant-info']}`}>
                                  <p className="font-semibold text-gray-900">{application.applicantName}</p>
                                  <p className="text-sm text-gray-500">{application.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className={`py-4 px-6 ${styles['job-title-cell']}`}>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                <span className="font-medium text-gray-800">{application.jobTitle || "Đang tải..."}</span>
                              </div>
                            </TableCell>
                            <TableCell className={`py-4 px-6 ${styles['date-cell']}`}>
                              <div className="flex items-center text-gray-600">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(application.appliedAt)}
                              </div>
                            </TableCell>
                            <TableCell className={`py-4 px-6 ${styles['status-cell']}`}>
                              {getStatusBadge(application.status)}
                            </TableCell>
                            <TableCell className={`py-4 px-6 ${styles['action-cell']}`}>
                              <div className="flex justify-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`${styles['action-button']} bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg`}
                                  onClick={() => handlePreviewCV(application.cvId)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                
                                {application.status === "PENDING" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`${styles['action-button']} bg-green-50 border-green-200 text-green-700 hover:bg-green-100 rounded-lg`}
                                      onClick={() => handleApproveApplication(application.id)}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={`${styles['action-button']} bg-red-50 border-red-200 text-red-700 hover:bg-red-100 rounded-lg`}
                                      onClick={() => handleRejectApplication(application.id)}
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có đơn ứng tuyển nào</h3>
                  <p className="text-gray-500">
                    {activeTab !== "all" 
                      ? `Không có đơn ứng tuyển nào có trạng thái "${activeTab === "pending" ? "đang chờ duyệt" : activeTab === "approved" ? "đã phê duyệt" : "đã từ chối"}"`
                      : "Chưa có đơn ứng tuyển nào được gửi đến"
                    }
                  </p>
                </motion.div>
              )}

              {applicationsWithJobDetails.length > 0 && (                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Hiển thị {applicationsWithJobDetails.length} đơn ứng tuyển</span>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg"
                        onClick={exportToExcel}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Xuất Excel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>          </Tabs>
        </Card>
        </motion.div>
      </div>

      {/* Modal xem trước CV */}
      <Modal
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        centered
        width="95%"
        style={{
          top: 20,
          maxWidth: 1200,
          margin: '0 auto'
        }}
        bodyStyle={{
          height: 'calc(95vh - 40px)',
          padding: 0,
          overflow: 'hidden'
        }}
        footer={null}
        destroyOnClose
        className={`${styles['modal-container']} custom-preview-modal`}
      >
        {loadingCV ? (
          <div className="flex justify-center py-8">
            <Spin size="large" tip="Đang tải CV..." />
          </div>
        ) : previewCV ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-white rounded-lg overflow-hidden"
          >
            <motion.div className="h-full">
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
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            Không có thông tin CV
          </motion.div>
        )}
      </Modal>
      </motion.div>
    </div>
  );
};

export default ApplicationsManagement;