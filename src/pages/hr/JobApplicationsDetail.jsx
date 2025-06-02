import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/header/Header";
import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import TemplateCV2 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV2";
import TemplateCV3 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV3";
import TemplateCV4 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV4";
import { PDFViewer } from "@react-pdf/renderer";
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import styles from "./JobApplicationsDetail.module.css";
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
  Breadcrumb,
  Row,
  Col,
  Tag,
  Divider,
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
  Star,
  Briefcase,
  DollarSign,
  Building,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";
import { getUserData } from "@/helper/storage";
import applyAPI from "@/api/apply";
import jobAPI from "@/api/job";
import cvAPI from "@/api/cv";
import dayjs from "dayjs";

const { Title, Text } = Typography;

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
    profile: apiData.profile || "",
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

const JobApplicationsDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(true);
  const [previewCV, setPreviewCV] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [applicationsWithDetails, setApplicationsWithDetails] = useState([]);  const [loadingCV, setLoadingCV] = useState(false);
  const [cvDetailsCache, setCvDetailsCache] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);
  
  const userData = getUserData();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchJobDetail();
    fetchApplications();
  }, [jobId]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobDetail(jobId);
      setJob(response.data.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Không thể tải thông tin công việc. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchApplications = async () => {
    setApplicationLoading(true);
    try {
      const response = await applyAPI.getJobApplications(jobId);
      
      const allApplications = response.data.data || [];
      setApplications(allApplications);
      
      const allAppsWithDetails = await Promise.all(
        allApplications.map(async (app) => {
          let cvData = null;
          
          if (app.cvId) {
            if (cvDetailsCache[app.cvId]) {
              cvData = cvDetailsCache[app.cvId];
            } else {
              try {
                const cvResponse = await cvAPI.getDetailCv(app.cvId);
                cvData = cvResponse.data.data;
                
                setCvDetailsCache(prev => ({
                  ...prev,
                  [app.cvId]: cvData
                }));
              } catch (error) {
                console.error("Error fetching CV details:", error);
              }
            }
          }
          
          return {
            ...app,
            applicantName: cvData?.info?.fullName || app.applicantName || "Chưa có thông tin",
            email: cvData?.info?.email || app.email || "Chưa có thông tin",
            cvData
          };
        })
      );
      
      setApplicationsWithDetails(allAppsWithDetails);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Không thể tải danh sách đơn ứng tuyển. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setApplicationLoading(false);
    }
  };

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
  };

  const handlePreviewCV = async (cvId) => {
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
      console.error("Error fetching CV for preview:", error);
      toast.error("Không thể tải CV. Vui lòng thử lại sau.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoadingCV(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: viLocale });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Chờ duyệt</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Đã duyệt</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800 border-red-300">Đã từ chối</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Không xác định</Badge>;
    }
  };

  const getJobTypeLabel = (type) => {
    switch (type) {
      case "REMOTE":
        return "Làm việc từ xa";
      case "IN_OFFICE":
        return "Làm việc tại văn phòng";
      case "HYBRID":
        return "Kết hợp";
      default:
        return type;
    }
  };

  const getContractLabel = (contract) => {
    switch (contract) {
      case "FULL_TIME":
        return "Toàn thời gian";
      case "PART_TIME":
        return "Bán thời gian";
      case "FREELANCE":
        return "Freelance";
      case "HYBRID":
        return "Kết hợp";
      default:
        return contract;
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case "INTERN":
        return "Thực tập sinh";
      case "FRESHER":
        return "Fresher";
      case "JUNIOR":
        return "Junior";
      case "MIDDLE":
        return "Middle";
      case "SENIOR":
        return "Senior";
      case "LEADER":
        return "Trưởng nhóm";
      case "DEPARTMENT_MANAGER":
        return "Trưởng phòng";
      default:
        return level;
    }
  };

  const getStats = () => {
    const total = applicationsWithDetails.length;
    const pending = applicationsWithDetails.filter(app => app.status === "PENDING").length;
    const approved = applicationsWithDetails.filter(app => app.status === "APPROVED").length;
    const rejected = applicationsWithDetails.filter(app => app.status === "REJECTED").length;
    
    return { total, pending, approved, rejected };
  };

  const exportToExcel = () => {
    const filteredApplications = applicationsWithDetails.filter(app => {
      const matchesSearch = searchKeyword === "" || 
        app.applicantName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchKeyword.toLowerCase());
      
      const matchesTab = activeTab === "all" || 
        (activeTab === "pending" && app.status === "PENDING") ||
        (activeTab === "approved" && app.status === "APPROVED") ||
        (activeTab === "rejected" && app.status === "REJECTED");
      
      return matchesSearch && matchesTab;
    });
    
    const exportData = filteredApplications.map(app => ({
      'Họ và tên': app.applicantName,
      'Email': app.email,
      'Ngày ứng tuyển': formatDate(app.appliedAt),
      'Trạng thái': app.status === "PENDING" ? "Đang chờ duyệt" : 
                    app.status === "APPROVED" ? "Đã duyệt" : 
                    app.status === "REJECTED" ? "Đã từ chối" : "Không xác định"
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    const wscols = [
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
    ];
    
    ws['!cols'] = wscols;
    
    XLSX.utils.book_append_sheet(wb, ws, "Đơn ứng tuyển");
    
    const jobTitle = job?.title || "job";
    const fileName = `danh_sach_ung_tuyen_${jobTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
    
    toast.success("Đã xuất dữ liệu thành công!", {
      position: "top-right",
      autoClose: 2000,
    });
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
      {loadingCV ? (
        <div className="h-full flex items-center justify-center bg-white">
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: pageLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`${styles['glass-card']} border-b border-white/20 backdrop-blur-xl`}>
          <div className="container mx-auto px-6 py-8 pt-12">            <div className="mb-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className={`${styles['back-button-container']}`}
              >
                <Button 
                  variant="outline" 
                  className={`${styles['back-button']} mb-4 bg-white/70 hover:bg-white flex items-center gap-2 pr-4 transition-all duration-300 hover:translate-x-[-5px]`}
                  onClick={() => navigate('/hr/jobs')}
                >
                  <div className={`${styles['icon-wrapper']} rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1`}>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span>Quay lại danh sách việc làm</span>
                </Button>
              </motion.div>
              
              <Breadcrumb className="text-gray-600 mb-4">
                <Breadcrumb.Item>
                  <a onClick={() => navigate('/hr/jobs')}>Quản lý việc làm</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {job?.title || 'Đang tải...'}
                </Breadcrumb.Item>
                <Breadcrumb.Item>Danh sách ứng tuyển</Breadcrumb.Item>
              </Breadcrumb>
            
              {loading ? (
                <div className="py-6 flex justify-center">
                  <Spin size="large" />
                </div>
              ) : job ? (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Title level={2} className="text-2xl font-bold mb-4">{job.title}</Title>
                    
                    <Row gutter={[16, 16]} className="mb-4">
                      <Col xs={24} sm={12} md={6}>
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-yellow-500 mr-2" />
                          <span className="text-gray-700">
                            {job.salary 
                              ? `${job.salary.toLocaleString()} VNĐ` 
                              : 'Thỏa thuận'}
                          </span>
                        </div>
                      </Col>
                      
                      <Col xs={24} sm={12} md={6}>
                        <div className="flex items-center">
                          <Briefcase className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-gray-700">
                            {getContractLabel(job.contract)}
                          </span>
                        </div>
                      </Col>
                      
                      <Col xs={24} sm={12} md={6}>
                        <div className="flex items-center">
                          <Users className="w-5 h-5 text-purple-500 mr-2" />
                          <span className="text-gray-700">
                            {getLevelLabel(job.level)}
                          </span>
                        </div>
                      </Col>
                      
                      <Col xs={24} sm={12} md={6}>
                        <div className="flex items-center">
                          <Building className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-gray-700">
                            {getJobTypeLabel(job.jobType)}
                          </span>
                        </div>
                      </Col>
                    </Row>
                    
                    <Divider className="my-4" />
                    
                    <div className="mb-4">
                      <Title level={4} className="text-lg font-medium mb-2">Kỹ năng yêu cầu:</Title>
                      <div className="flex flex-wrap gap-2">
                        {job.skills && job.skills.length > 0 ? (
                          job.skills.map((skill, index) => (
                            <Tag color="blue" key={index}>
                              {typeof skill === 'object' ? skill.name : skill}
                            </Tag>
                          ))
                        ) : job.skillNames && job.skillNames.length > 0 ? (
                          job.skillNames.map((name, index) => (
                            <Tag color="blue" key={index}>{name}</Tag>
                          ))
                        ) : (
                          <span className="text-gray-500">Không có kỹ năng được chỉ định</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <Title level={4} className="text-lg font-medium mb-2">Thời hạn tuyển dụng:</Title>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                        {job.startDate && job.endDate ? (
                          <span>
                            {formatDate(job.startDate)} - {formatDate(job.endDate)}
                          </span>
                        ) : (
                          <span>Không xác định</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy thông tin công việc</h3>
                </div>
              )}
            </div>

            {job && (
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-2xl font-bold text-gray-800">
                    Danh sách ứng viên đã ứng tuyển
                  </h1>
                  <p className="text-gray-600">
                    Quản lý và duyệt các đơn ứng tuyển cho vị trí <span className="font-medium">{job.title}</span>
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {job && (
          <div className="container mx-auto px-6 py-6">
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
                      <p className="text-sm font-medium text-gray-600 mb-1">Chờ duyệt</p>
                      <p className="text-3xl font-bold text-yellow-500">{getStats().pending}</p>
                    </div>
                    <div className={`${styles['gradient-yellow']} p-3 rounded-xl`}>
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
                      <p className="text-sm font-medium text-gray-600 mb-1">Đã duyệt</p>
                      <p className="text-3xl font-bold text-green-500">{getStats().approved}</p>
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
                      <p className="text-3xl font-bold text-red-500">{getStats().rejected}</p>
                    </div>
                    <div className={`${styles['gradient-red']} p-3 rounded-xl`}>
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card className={`${styles['glass-card']} p-6 mb-8 border-0 shadow-xl`}>
                <div className={`flex justify-end items-center ${styles['filter-container']}`}>
                  <div className={`flex gap-3 w-full lg:w-auto ${styles['search-wrapper']}`}>
                    <div className="relative flex-1 lg:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input 
                        placeholder="Tìm kiếm ứng viên..." 
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchApplications()}
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
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <Card className={`${styles['glass-card']} border-0 shadow-xl overflow-hidden`}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className={`p-6 border-b border-gray-100 ${styles['tabs-container']}`}>
                    <TabsList className={`grid w-full grid-cols-4 bg-gray-100 rounded-xl p-1 ${styles['tabs-list']}`}>                      <TabsTrigger 
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
                  </div>

                  <TabsContent value="all" className="p-0">
                    {applicationLoading ? (
                      <div className="p-6 space-y-6">
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
                    ) : applicationsWithDetails.length > 0 ? (
                      <div className={`${styles['custom-scrollbar']} overflow-x-auto`}>
                        <Table className={`${styles['custom-table']}`}>
                          <TableHeader>
                            <TableRow className="border-b border-gray-100">
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['applicant-header']}`}>Ứng viên</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['date-header']}`}>Ngày ứng tuyển</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['status-header']}`}>Trạng thái</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 text-center ${styles['action-header']}`}>Hành động</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applicationsWithDetails
                              .filter(app => {
                                const matchesSearch = searchKeyword === "" || 
                                  app.applicantName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                                  app.email?.toLowerCase().includes(searchKeyword.toLowerCase());
                                
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
                      </div>
                    ) : (
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
                            : "Chưa có đơn ứng tuyển nào được gửi đến cho vị trí này"
                          }
                        </p>
                      </motion.div>
                    )}

                    {applicationsWithDetails.length > 0 && (
                      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Hiển thị {applicationsWithDetails.length} đơn ứng tuyển</span>
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
                  </TabsContent>                  <TabsContent value="pending" className="p-0">
                    {applicationLoading ? (
                      <div className="p-6 space-y-6">
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
                    ) : applicationsWithDetails.filter(app => app.status === "PENDING").length > 0 ? (
                      <div className={`${styles['custom-scrollbar']} overflow-x-auto`}>
                        <Table className={`${styles['custom-table']}`}>
                          <TableHeader>
                            <TableRow className="border-b border-gray-100">
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['applicant-header']}`}>Ứng viên</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['date-header']}`}>Ngày ứng tuyển</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['status-header']}`}>Trạng thái</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 text-center ${styles['action-header']}`}>Hành động</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applicationsWithDetails
                              .filter(app => {
                                const matchesSearch = searchKeyword === "" || 
                                  app.applicantName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                                  app.email?.toLowerCase().includes(searchKeyword.toLowerCase());
                                
                                return matchesSearch && app.status === "PENDING";
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
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-12"
                      >
                        <Clock className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có đơn ứng tuyển nào đang chờ duyệt</h3>
                        <p className="text-gray-500">
                          {searchKeyword ? 
                            `Không tìm thấy đơn ứng tuyển nào đang chờ duyệt với từ khóa "${searchKeyword}"` : 
                            "Tất cả các đơn ứng tuyển đã được xử lý"
                          }
                        </p>
                      </motion.div>
                    )}

                    {applicationsWithDetails.filter(app => app.status === "PENDING").length > 0 && (
                      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Hiển thị {applicationsWithDetails.filter(app => app.status === "PENDING").length} đơn ứng tuyển đang chờ duyệt</span>
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
                  </TabsContent>
                  
                  <TabsContent value="approved" className="p-0">
                    {applicationLoading ? (
                      <div className="p-6 space-y-6">
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
                    ) : applicationsWithDetails.filter(app => app.status === "APPROVED").length > 0 ? (
                      <div className={`${styles['custom-scrollbar']} overflow-x-auto`}>
                        <Table className={`${styles['custom-table']}`}>
                          <TableHeader>
                            <TableRow className="border-b border-gray-100">
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['applicant-header']}`}>Ứng viên</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['date-header']}`}>Ngày ứng tuyển</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['status-header']}`}>Trạng thái</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 text-center ${styles['action-header']}`}>Hành động</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applicationsWithDetails
                              .filter(app => {
                                const matchesSearch = searchKeyword === "" || 
                                  app.applicantName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                                  app.email?.toLowerCase().includes(searchKeyword.toLowerCase());
                                
                                return matchesSearch && app.status === "APPROVED";
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
                                      <div className={`w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold ${styles['applicant-avatar']}`}>
                                        {application.applicantName?.charAt(0) || "?"}
                                      </div>
                                      <div className={`${styles['applicant-info']}`}>
                                        <p className="font-semibold text-gray-900">{application.applicantName}</p>
                                        <p className="text-sm text-gray-500">{application.email}</p>
                                      </div>
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
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-12"
                      >
                        <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có đơn ứng tuyển nào đã được duyệt</h3>
                        <p className="text-gray-500">
                          {searchKeyword ? 
                            `Không tìm thấy đơn ứng tuyển nào đã được duyệt với từ khóa "${searchKeyword}"` : 
                            "Chưa có đơn ứng tuyển nào được duyệt cho vị trí này"
                          }
                        </p>
                      </motion.div>
                    )}

                    {applicationsWithDetails.filter(app => app.status === "APPROVED").length > 0 && (
                      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Hiển thị {applicationsWithDetails.filter(app => app.status === "APPROVED").length} đơn ứng tuyển đã được duyệt</span>
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
                  </TabsContent>
                  
                  <TabsContent value="rejected" className="p-0">
                    {applicationLoading ? (
                      <div className="p-6 space-y-6">
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
                    ) : applicationsWithDetails.filter(app => app.status === "REJECTED").length > 0 ? (
                      <div className={`${styles['custom-scrollbar']} overflow-x-auto`}>
                        <Table className={`${styles['custom-table']}`}>
                          <TableHeader>
                            <TableRow className="border-b border-gray-100">
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['applicant-header']}`}>Ứng viên</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['date-header']}`}>Ngày ứng tuyển</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['status-header']}`}>Trạng thái</TableHead>
                              <TableHead className={`font-semibold text-gray-700 py-4 px-6 text-center ${styles['action-header']}`}>Hành động</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applicationsWithDetails
                              .filter(app => {
                                const matchesSearch = searchKeyword === "" || 
                                  app.applicantName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                                  app.email?.toLowerCase().includes(searchKeyword.toLowerCase());
                                
                                return matchesSearch && app.status === "REJECTED";
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
                                      <div className={`w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold ${styles['applicant-avatar']}`}>
                                        {application.applicantName?.charAt(0) || "?"}
                                      </div>
                                      <div className={`${styles['applicant-info']}`}>
                                        <p className="font-semibold text-gray-900">{application.applicantName}</p>
                                        <p className="text-sm text-gray-500">{application.email}</p>
                                      </div>
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
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-12"
                      >
                        <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có đơn ứng tuyển nào bị từ chối</h3>
                        <p className="text-gray-500">
                          {searchKeyword ? 
                            `Không tìm thấy đơn ứng tuyển nào bị từ chối với từ khóa "${searchKeyword}"` : 
                            "Chưa có đơn ứng tuyển nào bị từ chối cho vị trí này"
                          }
                        </p>
                      </motion.div>
                    )}

                    {applicationsWithDetails.filter(app => app.status === "REJECTED").length > 0 && (
                      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span>Hiển thị {applicationsWithDetails.filter(app => app.status === "REJECTED").length} đơn ứng tuyển đã bị từ chối</span>
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
                  </TabsContent>
                </Tabs>
              </Card>
            </motion.div>
          </div>
        )}

        {/* CV Preview Modal */}
        <ModalContent />
      </motion.div>
    </div>
  );
};

export default JobApplicationsDetail;
