// JobManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Spin,
  Tooltip,
  Radio,
  Alert,
  Empty
} from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactMarkdown from 'react-markdown';
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  TrophyOutlined,
  ExperimentOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import jobAPI from "../../api/job";
import skillAPI from "../../api/skill";
import Header from "../../components/header/Header";
import { getUserData } from "../../helper/storage";
import jobDescriptionTemplates from "./jobDescriptionTemplate";

import { 
  Table as ShadcnTable, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Card as ShadcnCard } from "@/components/ui/card";

import {
  Search,
  Filter,
  RefreshCw,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  PlusCircle,
  Briefcase,
  DollarSign,
  FileText
} from "lucide-react";

import styles from "./JobManagement.module.css";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const parseDescription = (description) => {
  if (!description) return [];

  const sectionDefinitions = [
    {
      title: "Mô tả công việc",
      key: "jobDescription",
      keywords: ["responsibilities", "mô tả công việc", "nhiệm vụ", "job description"]
    },
    {
      title: "Yêu cầu công việc",
      key: "requirements",
      keywords: ["requirements", "yêu cầu", "qualifications", "kinh nghiệm"]
    },
    {
      title: "Quyền lợi",
      key: "benefits",
      keywords: ["benefits", "quyền lợi", "chế độ", "đãi ngộ", "phúc lợi"]
    },
    {
      title: "Học vấn",
      key: "education",
      keywords: ["education", "học vấn", "bằng cấp", "bachelor", "master", "degree"]
    },
    {
      title: "Chứng chỉ",
      key: "certification",
      keywords: ["certification", "chứng chỉ"]
    },
    {
      title: "Lương thưởng",
      key: "salary",
      keywords: ["salary", "lương", "thưởng", "compensation"]
    }
  ];

  const result = {};
  let currentSection = null;
  let currentContent = [];

  const lines = description.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const isSection = line === line.toUpperCase() ||
      /^(REQUIREMENTS|RESPONSIBILITIES|BENEFITS|EDUCATION|CERTIFICATION|SALARY|YÊU CẦU|MÔ TẢ|QUYỀN LỢI|HỌC VẤN|CHỨNG CHỈ|LƯƠNG)/.test(line) ||
      /^#+\s+/.test(line);

    if (isSection) {
      if (currentSection) {
        result[currentSection] = currentContent.join('\n');
        currentContent = [];
      }

      let foundSection = null;
      for (const section of sectionDefinitions) {
        if (section.keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
          foundSection = section.key;
          currentSection = section.key;
          break;
        }
      }

      if (!foundSection) {
        currentSection = line.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        sectionDefinitions.push({
          title: line,
          key: currentSection,
          keywords: [line.toLowerCase()]
        });
      }
    } else if (currentSection) {
      currentContent.push(line);
    } else {
      if (!result.jobDescription) {
        result.jobDescription = [];
      }
      if (Array.isArray(result.jobDescription)) {
        result.jobDescription.push(line);
      }
    }
  }

  if (currentSection && currentContent.length > 0) {
    result[currentSection] = currentContent.join('\n');
  }

  if (Array.isArray(result.jobDescription)) {
    result.jobDescription = result.jobDescription.join('\n');
  }

  return sectionDefinitions
    .filter(section => result[section.key])
    .map(section => ({
      title: section.title,
      content: result[section.key],
      key: section.key
    }));
};

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentJob, setCurrentJob] = useState(null); 
  const [form] = Form.useForm();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewJob, setViewJob] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [evaluateModalVisible, setEvaluateModalVisible] = useState(false);
  const [selectedEvaluationJob, setSelectedEvaluationJob] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");  const [activeTab, setActiveTab] = useState("all");
  const [pageLoaded, setPageLoaded] = useState(false);
  
  const contractMapping = {
    fullTime: "FULL_TIME",
    partTime: "PART_TIME",
    freelance: "FREELANCE",
    hybrid: "HYBRID"
  };

  const userData = getUserData();
  const navigate = useNavigate();

  const contractOptions = [
    { value: "FULL_TIME", label: "Toàn thời gian" },
    { value: "PART_TIME", label: "Bán thời gian" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "HYBRID", label: "Kết hợp" },
  ];

  const levelOptions = [
    { value: "INTERN", label: "Thực tập sinh" },
    { value: "FRESHER", label: "Fresher" },
    { value: "JUNIOR", label: "Junior" },
    { value: "MIDDLE", label: "Middle" },
    { value: "SENIOR", label: "Senior" },
    { value: "LEADER", label: "Trưởng nhóm" },
    { value: "DEPARTMENT_MANAGER", label: "Trưởng phòng" },
  ];

  const jobTypeOptions = [
    { value: "IN_OFFICE", label: "Làm việc tại văn phòng" },
    { value: "HYBRID", label: "Kết hợp" },
    { value: "REMOTE", label: "Làm việc từ xa" },
  ];  useEffect(() => {
    fetchJobs();
    fetchSkills();

    if (userData?.role === 'HR' && userData?.companyId) {
      setCompanyId(userData.companyId);
    }
    
    setTimeout(() => setPageLoaded(true), 300);
  }, []);

  useEffect(() => {
    if (pageLoaded) {
      fetchJobs();
    }
  }, [activeTab, searchKeyword]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: viLocale });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };
  
  const getContractLabel = (contract) => {
    const option = contractOptions.find(opt => opt.value === contract);
    return option ? option.label : contract;
  };
  
  const getLevelLabel = (level) => {
    const option = levelOptions.find(opt => opt.value === level);
    return option ? option.label : level;
  };
  
  const getJobTypeLabel = (jobType) => {
    const option = jobTypeOptions.find(opt => opt.value === jobType);
    return option ? option.label : jobType;
  };
    const getStats = () => {
    const total = jobs.length;
    const fullTime = jobs.filter(job => job.contract === "FULL_TIME").length;
    const partTime = jobs.filter(job => job.contract === "PART_TIME").length;
    const freelance = jobs.filter(job => job.contract === "FREELANCE").length;
    const hybrid = jobs.filter(job => job.contract === "HYBRID").length;
    const other = freelance + hybrid;
    
    return { total, fullTime, partTime, freelance, hybrid, other };
  };
  
  const exportToExcel = () => {
    try {
      const exportData = jobs.map(job => ({
        'Tên công việc': job.title,
        'Loại hợp đồng': getContractLabel(job.contract),
        'Cấp bậc': getLevelLabel(job.level),
        'Hình thức': getJobTypeLabel(job.jobType),
        'Mức lương': job.salary ? `${job.salary.toLocaleString()} VND` : 'Thỏa thuận',
        'Ngày bắt đầu': formatDate(job.startDate),
        'Ngày kết thúc': formatDate(job.endDate),
      }));
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      XLSX.utils.book_append_sheet(wb, ws, "Danh sách việc làm");
      
      const now = new Date();
      const dateStr = format(now, "ddMMyyyy_HHmmss");
      const fileName = `Danh_sach_viec_lam_${dateStr}.xlsx`;
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
  const fetchSkills = async () => {
    try {
      const response = await skillAPI.getAllSkills();
      if (Array.isArray(response.data)) {
        setSkills(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setSkills(response.data.data);
      } else {
        console.error("Unexpected skills data format:", response.data);
        setSkills([]);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Không thể tải danh sách kỹ năng", {
        position: "top-right",
        autoClose: 2000,
      });
      setSkills([]);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let response;
      
      if (userData?.role === 'HR' && userData?.id) {
        response = await jobAPI.getHrJobs(userData.id);
      } else {
        response = await jobAPI.getAllJobs();
      }
      
      let jobsData = [];
      if (Array.isArray(response.data)) {
        jobsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        jobsData = response.data.data;
      } else {
        console.error("Unexpected jobs data format:", response.data);
      }
      if (searchKeyword && searchKeyword.trim() !== "") {
        const keyword = searchKeyword.toLowerCase();
        jobsData = jobsData.filter(job => 
          job.title.toLowerCase().includes(keyword) || 
          (job.description && job.description.toLowerCase().includes(keyword))
        );
      }
      if (activeTab !== "all") {
        if (activeTab === "fullTime") {
          jobsData = jobsData.filter(job => job.contract === "FULL_TIME");
        } else if (activeTab === "partTime") {
          jobsData = jobsData.filter(job => job.contract === "PART_TIME");
        } else if (activeTab === "freelance") {
          jobsData = jobsData.filter(job => job.contract === "FREELANCE");
        } else if (activeTab === "hybrid") {
          jobsData = jobsData.filter(job => job.contract === "HYBRID");
        } else if (activeTab === "other") {
          jobsData = jobsData.filter(job => 
            job.contract === "FREELANCE" || job.contract === "HYBRID"
          );
        }
      }
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Không thể tải danh sách việc làm", {
        position: "top-right",
        autoClose: 2000,
      });
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  
  const showAddModal = () => {
    setIsEditing(false);
    setCurrentJob(null);
    form.resetFields();
    setModalVisible(true);
  };
  const loadInfoSecTemplate = () => {
    form.setFieldsValue({
      title: "Chuyên viên An toàn thông tin",
      description: jobDescriptionTemplates.informationSecurity,
    });
    toast.success("Đã tải mẫu mô tả việc làm!", {
      position: "top-right",
      autoClose: 2000,
    });
  };
  const showEditModal = (job) => {
    setIsEditing(true);
    setCurrentJob(job);    let skillValues = [];
    if (job.skills && Array.isArray(job.skills)) {
      skillValues = job.skills.map(skill => {
        if (typeof skill === 'object' && skill !== null) {
          return skill.id || skill.name;
        }
        return skill;
      });
    } else if (job.skillNames && Array.isArray(job.skillNames)) {
      skillValues = job.skillNames;
    } else if (job.skillIds && Array.isArray(job.skillIds)) {
      skillValues = job.skillIds;
    }

    form.setFieldsValue({
      title: job.title,
      contract: job.contract,
      level: job.level,
      jobType: job.jobType,
      dateRange: job.startDate && job.endDate
        ? [dayjs(job.startDate), dayjs(job.endDate)]
        : undefined,
      description: job.description,
      experienceYear: job.experienceYear,
      salary: job.salary,
      skills: skillValues,
    });
    setModalVisible(true);
  };
  const showViewModal = async (jobId) => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobDetail(jobId);
      setViewJob(response.data.data);
      setViewModalVisible(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Không thể tải thông tin chi tiết việc làm", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };  const handleSubmit = async (values) => {
    try {
      if (!isEditing && !companyId) {
        toast.error("Không tìm thấy thông tin công ty, vui lòng tải lại trang", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }      const jobData = {
        title: values.title,
        contract: values.contract,
        level: values.level,
        jobType: values.jobType,
        startDate: values.dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: values.dateRange?.[1]?.format("YYYY-MM-DD"),
        description: values.description,
        experienceYear: values.experienceYear,
        salary: values.salary,
        skillIds: values.skills || [],
        companyId: isEditing && currentJob ? currentJob.companyId : companyId,
      };
      
      if (isEditing && currentJob) {
        const updatedJobData = {
          ...jobData,
          id: currentJob.id
        };
        await jobAPI.updateJob(currentJob.id, updatedJobData);
        toast.success("Cập nhật việc làm thành công!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        await jobAPI.createJob(jobData);
        toast.success("Tạo việc làm mới thành công!", {
          position: "top-right",
          autoClose: 2000,
        });
      }

      setModalVisible(false);
      fetchJobs();
    } catch (error) {
      console.error("Error submitting job:", error);
      toast.error("Có lỗi xảy ra khi lưu thông tin việc làm", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  const handleDelete = async (jobId) => {
    try {
      await jobAPI.deleteJob(jobId);
      toast.success("Xóa việc làm thành công!", {
        position: "top-right",
        autoClose: 2000,
      });
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Không thể xóa việc làm", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const columns = [
    {
      title: "Tên công việc",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Text strong>{text}</Text>
      ),
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "contract",
      key: "contract",
      render: (contract) => {
        const option = contractOptions.find(opt => opt.value === contract);
        return <Tag color="blue">{option ? option.label : contract}</Tag>;
      },
    },
    {
      title: "Cấp bậc",
      dataIndex: "level",
      key: "level",
      render: (level) => {
        const option = levelOptions.find(opt => opt.value === level);
        return <Tag color="green">{option ? option.label : level}</Tag>;
      },
    },
    {
      title: "Hình thức",
      dataIndex: "jobType",
      key: "jobType",
      render: (jobType) => {
        const option = jobTypeOptions.find(opt => opt.value === jobType);
        return <Tag color="purple">{option ? option.label : jobType}</Tag>;
      },
    },
    {
      title: "Mức lương",
      dataIndex: "salary",
      key: "salary",
      render: (salary) => salary ? `${salary.toLocaleString()} VND` : 'Thỏa thuận',
    },
    {
      title: "Thời hạn",
      key: "dates",
      render: (_, record) => (
        <>
          {record.startDate && record.endDate ? (
            <Text>
              {dayjs(record.startDate).format("DD/MM/YYYY")} - {dayjs(record.endDate).format("DD/MM/YYYY")}
            </Text>
          ) : (
            <Text>Không xác định</Text>
          )}
        </>
      ),
    },
    {      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => showViewModal(record.id)}
              type="default"
            />
          </Tooltip>
          <Tooltip title="Quản lý ứng viên">
            <Button
              icon={<TeamOutlined />}
              onClick={() => navigate(`/hr/job-applications/${record.id}`)}
              type="default"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              type="primary"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa việc làm"
            description="Bạn có chắc chắn muốn xóa việc làm này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
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
      >
        {/* Header Section */}
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
                  Quản lý việc làm
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Tạo và quản lý việc làm trong công ty của bạn để thu hút nhân tài phù hợp
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ShadcnButton 
                  className={`${styles['gradient-blue']} text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                  onClick={() => setEvaluateModalVisible(true)}
                >
                  <FileSearchOutlined className="w-5 h-5 mr-2" />
                  Đánh giá CV
                </ShadcnButton>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={styles['stats-card-container']}
            >
              <ShadcnCard className={`${styles['stats-card']} ${styles['glass-card']} p-6 border-0 shadow-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Tổng việc làm</p>
                    <p className="text-3xl font-bold text-gray-900">{getStats().total}</p>
                  </div>
                  <div className={`${styles['gradient-blue']} p-3 rounded-xl`}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                </div>
              </ShadcnCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={styles['stats-card-container']}
            >
              <ShadcnCard className={`${styles['stats-card']} ${styles['glass-card']} p-6 border-0 shadow-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Toàn thời gian</p>
                    <p className="text-3xl font-bold text-blue-600">{getStats().fullTime}</p>
                  </div>
                  <div className={`${styles['gradient-blue']} p-3 rounded-xl`}>
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </ShadcnCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className={styles['stats-card-container']}
            >
              <ShadcnCard className={`${styles['stats-card']} ${styles['glass-card']} p-6 border-0 shadow-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Bán thời gian</p>
                    <p className="text-3xl font-bold text-purple-600">{getStats().partTime}</p>
                  </div>
                  <div className={`${styles['gradient-purple']} p-3 rounded-xl`}>
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </ShadcnCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className={styles['stats-card-container']}
            >
              <ShadcnCard className={`${styles['stats-card']} ${styles['glass-card']} p-6 border-0 shadow-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Freelance</p>
                    <p className="text-3xl font-bold text-amber-600">{getStats().freelance}</p>
                  </div>
                  <div className={`${styles['gradient-amber']} p-3 rounded-xl`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </ShadcnCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className={styles['stats-card-container']}
            >
              <ShadcnCard className={`${styles['stats-card']} ${styles['glass-card']} p-6 border-0 shadow-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Kết hợp</p>
                    <p className="text-3xl font-bold text-green-600">{getStats().hybrid}</p>
                  </div>
                  <div className={`${styles['gradient-green']} p-3 rounded-xl`}>
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </ShadcnCard>
            </motion.div>
          </div>

          {/* Action Buttons & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <ShadcnCard className={`${styles['glass-card']} p-6 mb-8 border-0 shadow-xl`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <ShadcnButton 
                  className={`${styles['gradient-blue']} text-white px-6 py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto`}
                  onClick={showAddModal}
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Thêm việc làm mới
                </ShadcnButton>
                
                <div className={`flex gap-3 w-full lg:w-auto ${styles['search-wrapper']}`}>
                  <div className="relative flex-1 lg:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />                    <ShadcnInput 
                      placeholder="Tìm kiếm việc làm..." 
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className={`${styles['search-input']} pl-10 pr-4 py-5 rounded-xl border-0 w-full`}
                    />
                  </div>
                  <ShadcnButton 
                    variant="outline"
                    className={`${styles['action-button']} px-4 py-5 rounded-xl border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80`}
                    onClick={() => fetchJobs()}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </ShadcnButton>
                </div>
              </div>
            </ShadcnCard>
          </motion.div>

          {/* Jobs Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <ShadcnCard className={`${styles['glass-card']} border-0 shadow-xl overflow-hidden`}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">                <div className={`p-6 border-b border-gray-100 ${styles['tabs-container']}`}>
                  <TabsList className={`grid w-full grid-cols-5 bg-gray-100 rounded-xl p-1 ${styles['tabs-list']}`}>                    
                    <TabsTrigger 
                      value="all" 
                      className={`${styles['tab-item']} data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium`}
                    >
                      <Filter className={`w-4 h-4 mr-2 ${styles['tab-icon']}`} />
                      <span>Tất cả</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="fullTime" 
                      className={`${styles['tab-item']} data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium`}
                    >
                      <Clock className={`w-4 h-4 mr-2 ${styles['tab-icon']}`} />
                      <span>Toàn thời gian</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="partTime" 
                      className={`${styles['tab-item']} data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium`}
                    >
                      <Calendar className={`w-4 h-4 mr-2 ${styles['tab-icon']}`} />
                      <span>Bán thời gian</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="freelance" 
                      className={`${styles['tab-item']} data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium`}
                    >
                      <FileText className={`w-4 h-4 mr-2 ${styles['tab-icon']}`} />
                      <span>Freelance</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="hybrid" 
                      className={`${styles['tab-item']} data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg px-4 py-2 font-medium`}
                    >
                      <Users className={`w-4 h-4 mr-2 ${styles['tab-icon']}`} />
                      <span>Kết hợp</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="p-0">
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
                  ) : jobs.length > 0 ? (
                    <div className={`${styles['custom-scrollbar']} overflow-x-auto`}>
                      <ShadcnTable className={`${styles['custom-table']}`}>
                        <TableHeader>
                          <TableRow className="border-b border-gray-100">
                            <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['job-title-header']}`}>Tên công việc</TableHead>
                            <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['contract-header']}`}>Loại hợp đồng</TableHead>
                            <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['level-header']}`}>Cấp bậc</TableHead>
                            <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['salary-header']}`}>Mức lương</TableHead>
                            <TableHead className={`font-semibold text-gray-700 py-4 px-6 ${styles['date-header']}`}>Thời hạn</TableHead>
                            <TableHead className={`font-semibold text-gray-700 py-4 px-6 text-center ${styles['action-header']}`}>Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>                          {jobs
                            .filter(job => {
                              const matchesSearch = searchKeyword === "" || 
                                job.title?.toLowerCase().includes(searchKeyword.toLowerCase());
                              
                              let matchesTab = true;
                              if (activeTab !== "all") {
                                if (activeTab === "fullTime") {
                                  matchesTab = job.contract === "FULL_TIME";
                                } else if (activeTab === "partTime") {
                                  matchesTab = job.contract === "PART_TIME";
                                } else if (activeTab === "freelance") {
                                  matchesTab = job.contract === "FREELANCE";
                                } else if (activeTab === "hybrid") {
                                  matchesTab = job.contract === "HYBRID";
                                } else if (activeTab === "other") {
                                  matchesTab = job.contract === "FREELANCE" || job.contract === "HYBRID";
                                }
                              }
                              
                              return matchesSearch && matchesTab;
                            })
                            .map((job, index) => (
                              <TableRow 
                                key={job.id}
                                className={`${styles['table-row-animate']} border-b border-gray-50 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-200`}
                                style={{ 
                                  animationDelay: `${index * 50}ms` 
                                }}
                              >
                                <TableCell className="py-4 px-6">
                                  <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold ${styles['job-avatar']}`}>
                                      {job.title?.charAt(0) || "J"}
                                    </div>
                                    <div className={`${styles['job-info']}`}>
                                      <p className="font-semibold text-gray-900">{job.title}</p>                                      <p className="text-sm text-gray-500">
                                        {job.skills && Array.isArray(job.skills) && job.skills.length > 0 ? (
                                          <span className="flex flex-wrap gap-1 mt-1">
                                            {job.skills.slice(0, 2).map((skill, idx) => (
                                              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                {typeof skill === 'object' ? skill.name : skill}
                                              </span>
                                            ))}
                                            {job.skills.length > 2 && (
                                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                                +{job.skills.length - 2}
                                              </span>
                                            )}
                                          </span>
                                        ) : job.skillNames && Array.isArray(job.skillNames) && job.skillNames.length > 0 ? (
                                          <span className="flex flex-wrap gap-1 mt-1">
                                            {job.skillNames.slice(0, 2).map((skillName, idx) => (
                                              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                                {skillName}
                                              </span>
                                            ))}
                                            {job.skillNames.length > 2 && (
                                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                                +{job.skillNames.length - 2}
                                              </span>
                                            )}
                                          </span>
                                        ) : "Không có kỹ năng"}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className={`py-4 px-6 ${styles['contract-cell']}`}>
                                  <Badge 
                                    className={`px-3 py-1 ${
                                      job.contract === "FULL_TIME" ? "bg-blue-100 text-blue-700" : 
                                      job.contract === "PART_TIME" ? "bg-purple-100 text-purple-700" : 
                                      job.contract === "FREELANCE" ? "bg-amber-100 text-amber-700" : 
                                      "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {getContractLabel(job.contract)}
                                  </Badge>
                                </TableCell>
                                <TableCell className={`py-4 px-6 ${styles['level-cell']}`}>
                                  <Badge className="bg-green-100 text-green-700 px-3 py-1">
                                    {getLevelLabel(job.level)}
                                  </Badge>
                                </TableCell>
                                <TableCell className={`py-4 px-6 ${styles['salary-cell']}`}>
                                  <div className="flex items-center text-gray-600">
                                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                                    {job.salary ? job.salary.toLocaleString() + ' VND' : 'Thỏa thuận'}
                                  </div>
                                </TableCell>
                                <TableCell className={`py-4 px-6 ${styles['date-cell']}`}>
                                  <div className="flex items-center text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {job.startDate && job.endDate 
                                      ? `${formatDate(job.startDate)} - ${formatDate(job.endDate)}` 
                                      : "Không xác định"
                                    }
                                  </div>
                                </TableCell>
                                <TableCell className={`py-4 px-6 ${styles['action-cell']}`}>
                                  <div className="flex justify-center space-x-2">
                                    <ShadcnButton
                                      variant="outline"
                                      size="sm"
                                      className={`${styles['action-button']} bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg`}
                                      onClick={() => showViewModal(job.id)}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </ShadcnButton>
                                    
                                    <ShadcnButton
                                      variant="outline"
                                      size="sm"
                                      className={`${styles['action-button']} bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 rounded-lg`}
                                      onClick={() => navigate(`/hr/job-applications/${job.id}`)}
                                    >
                                      <Users className="w-4 h-4" />
                                    </ShadcnButton>
                                    
                                    <ShadcnButton
                                      variant="outline"
                                      size="sm"
                                      className={`${styles['action-button']} bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg`}
                                      onClick={() => showEditModal(job)}
                                    >
                                      <EditOutlined className="w-4 h-4" />
                                    </ShadcnButton>
                                    
                                    <Popconfirm
                                      title="Xóa việc làm"
                                      description="Bạn có chắc chắn muốn xóa việc làm này không?"
                                      onConfirm={() => handleDelete(job.id)}
                                      okText="Xóa"
                                      cancelText="Hủy"
                                    >
                                      <ShadcnButton
                                        variant="outline"
                                        size="sm"
                                        className={`${styles['action-button']} bg-red-50 border-red-200 text-red-700 hover:bg-red-100 rounded-lg`}
                                      >
                                        <DeleteOutlined className="w-4 h-4" />
                                      </ShadcnButton>
                                    </Popconfirm>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </ShadcnTable>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-12"
                    >
                      <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có việc làm nào</h3>                      <p className="text-gray-500">
                        {activeTab !== "all" 
                          ? `Không có việc làm nào thuộc loại "${
                              activeTab === "fullTime" ? "toàn thời gian" : 
                              activeTab === "partTime" ? "bán thời gian" :
                              activeTab === "freelance" ? "freelance" :
                              activeTab === "hybrid" ? "kết hợp" : "khác"
                            }"`
                          : "Chưa có việc làm nào được tạo"
                        }
                      </p>
                    </motion.div>
                  )}

                  {jobs.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Hiển thị {jobs.length} việc làm</span>
                        <div className="flex items-center space-x-2">
                          <ShadcnButton 
                            variant="outline" 
                            size="sm" 
                            className="rounded-lg"
                            onClick={exportToExcel}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Xuất Excel
                          </ShadcnButton>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </ShadcnCard>
          </motion.div>
        </div>
      </motion.div>      {/* Modal for add/edit job */}
      <Modal
        title={isEditing ? "Chỉnh sửa việc làm" : "Thêm việc làm mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
        className={`${styles['job-modal']}`}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tên công việc"
            rules={[{ required: true, message: "Vui lòng nhập tên công việc" }]}
          >
            <Input placeholder="Nhập tên công việc" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="contract"
                label="Loại hợp đồng"
                rules={[{ required: true, message: "Vui lòng chọn loại hợp đồng" }]}
              >
                <Select placeholder="Chọn loại hợp đồng">
                  {contractOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="level"
                label="Cấp bậc"
                rules={[{ required: true, message: "Vui lòng chọn cấp bậc" }]}
              >
                <Select placeholder="Chọn cấp bậc">
                  {levelOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="jobType"
                label="Hình thức làm việc"
                rules={[{ required: true, message: "Vui lòng chọn hình thức làm việc" }]}
              >
                <Select placeholder="Chọn hình thức làm việc">
                  {jobTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateRange"
                label="Thời hạn tuyển dụng"
                rules={[{ required: true, message: "Vui lòng chọn thời hạn tuyển dụng" }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="experienceYear"
                label="Kinh nghiệm"
              >
                <Input placeholder="Ví dụ: 1-2 năm" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="salary"
                label="Mức lương (VND)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Nhập mức lương"
                />
              </Form.Item>
            </Col>
          </Row>          <Form.Item
            name="skills"
            label="Kỹ năng yêu cầu"
            rules={[{ required: true, message: "Vui lòng chọn ít nhất một kỹ năng" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn kỹ năng"
              style={{ width: '100%' }}
            >
              {Array.isArray(skills) && skills.map(skill => (
                <Option key={skill.id || skill.name} value={skill.id || skill.name}>
                  {skill.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả công việc"
            rules={[{ required: true, message: "Vui lòng nhập mô tả công việc" }]}
          >
            <TextArea rows={10} placeholder="Nhập mô tả công việc" />
          </Form.Item>          <Form.Item>            <div className={styles.formButtons}>
            <Button onClick={() => setModalVisible(false)}>
              Hủy
            </Button>
            {!isEditing && (
              <Button
                icon={<FileTextOutlined />}
                onClick={loadInfoSecTemplate}
                style={{ marginRight: 8 }}
              >
                Tải mẫu An toàn thông tin
              </Button>
            )}
            <Button type="primary" htmlType="submit">
              {isEditing ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết việc làm */}
      <Modal
        title="Chi tiết việc làm"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setViewModalVisible(false);
              showEditModal(viewJob);
            }}
          >
            Chỉnh sửa
          </Button>
        ]}
        width={800}
      >
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : viewJob && (
          <div className={styles.jobDetailView}>
            <Title level={3} className={styles.jobTitle}>{viewJob.title}</Title>

            <Row gutter={[16, 16]} className={styles.jobInfoRow}>
              <Col xs={24} sm={12} md={8}>
                <div className={styles.jobInfoItem}>
                  <DollarOutlined style={{ fontSize: '16px', color: '#fa8c16' }} />
                  <span>{viewJob.salary ? `${viewJob.salary.toLocaleString()} VND` : 'Thỏa thuận'}</span>
                </div>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <div className={styles.jobInfoItem}>
                  <ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                  <span>
                    {viewJob.contract === 'FULL_TIME' ? 'Toàn thời gian' :
                      viewJob.contract === 'PART_TIME' ? 'Bán thời gian' :
                        viewJob.contract === 'FREELANCE' ? 'Freelance' : 'Kết hợp'}
                  </span>
                </div>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <div className={styles.jobInfoItem}>
                  <TeamOutlined style={{ fontSize: '16px', color: '#722ed1' }} />
                  <span>
                    {viewJob.level === 'INTERN' ? 'Thực tập sinh' :
                      viewJob.level === 'FRESHER' ? 'Fresher' :
                        viewJob.level === 'JUNIOR' ? 'Junior' :
                          viewJob.level === 'MIDDLE' ? 'Middle' :
                            viewJob.level === 'SENIOR' ? 'Senior' :
                              viewJob.level === 'LEADER' ? 'Trưởng nhóm' : 'Trưởng phòng'}
                  </span>
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div className={styles.jobInfoItem}>
                  <EnvironmentOutlined style={{ fontSize: '16px', color: '#52c41a' }} />
                  <span>
                    {viewJob.jobType === 'REMOTE' ? 'Làm việc từ xa' :
                      viewJob.jobType === 'IN_OFFICE' ? 'Làm việc tại văn phòng' : 'Kết hợp'}
                  </span>
                </div>
              </Col>

              {viewJob.experienceYear && (
                <Col xs={24} sm={12} md={8}>
                  <div className={styles.jobInfoItem}>
                    <CalendarOutlined style={{ fontSize: '16px', color: '#2f54eb' }} />
                    <span>Kinh nghiệm: {viewJob.experienceYear}</span>
                  </div>
                </Col>
              )}

              <Col xs={24} sm={12} md={8}>
                <div className={styles.jobInfoItem}>
                  <CalendarOutlined style={{ fontSize: '16px', color: '#13c2c2' }} />
                  <span>
                    {viewJob.startDate && viewJob.endDate
                      ? `${dayjs(viewJob.startDate).format("DD/MM/YYYY")} - ${dayjs(viewJob.endDate).format("DD/MM/YYYY")}`
                      : 'Không xác định'}
                  </span>
                </div>
              </Col>
            </Row>            <div className={styles.jobDescriptionSection}>
              {viewJob.description && (
                parseDescription(viewJob.description).length > 0 ? (
                  parseDescription(viewJob.description).map((section, index) => (
                    <div key={index} className={`${styles.descriptionBlock} ${styles[section.key + 'Section'] || ''}`}>                      <Title level={4} className={styles.sectionTitle}>
                      <div className={styles.sectionTitleWithIcon}>
                        {section.key === 'requirements' && <ExclamationCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                        {section.key === 'benefits' && <CheckCircleOutlined style={{ fontSize: '20px', color: '#52c41a' }} />}
                        {section.key === 'jobDescription' && <FileTextOutlined style={{ fontSize: '20px', color: '#205781' }} />}
                        {section.key === 'education' && <TeamOutlined style={{ fontSize: '20px', color: '#2f54eb' }} />}
                        {section.key === 'certification' && <TrophyOutlined style={{ fontSize: '20px', color: '#722ed1' }} />}
                        {section.key === 'salary' && <DollarOutlined style={{ fontSize: '20px', color: '#fa8c16' }} />}
                        {!['requirements', 'benefits', 'jobDescription', 'education', 'certification', 'salary'].includes(section.key) &&
                          <FileSearchOutlined style={{ fontSize: '20px', color: '#205781' }} />}
                        <span className={styles.sectionTitleText}>{section.title}</span>
                      </div>
                    </Title>

                      {section.key === 'requirements' ? (
                        <div className={styles.requirementsList}>
                          {section.content.split('\n').filter(line => line.trim()).map((item, i) => (
                            <div key={i} className={styles.requirementItem}>
                              <div className={styles.requirementBullet}></div>
                              <div className={styles.requirementText}>{item}</div>
                            </div>
                          ))}
                        </div>
                      ) : section.key === 'benefits' ? (
                        <div className={styles.benefitsList}>
                          {section.content.split('\n').filter(line => line.trim()).map((item, i) => (
                            <div key={i} className={styles.benefitItem}>
                              <CheckCircleOutlined className={styles.benefitIcon} />
                              <div className={styles.benefitText}>{item}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`${styles.descriptionContent} ${styles[section.key + 'Content'] || ''}`}>
                          <ReactMarkdown>{section.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={styles.descriptionBlock}>
                    <Title level={4} className={styles.sectionTitle}>
                      <div className={styles.sectionTitleWithIcon}>
                        <FileTextOutlined style={{ fontSize: '20px', color: '#205781' }} />
                        <span className={styles.sectionTitleText}>Mô tả công việc</span>
                      </div>
                    </Title>
                    <div className={styles.descriptionContent}>
                      <ReactMarkdown>{viewJob.description}</ReactMarkdown>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className={styles.jobSkillsSection}>
              <Title level={4} className={styles.sectionTitle}>
                <div className={styles.sectionTitleWithIcon}>
                  <ExperimentOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                  <span className={styles.sectionTitleText}>Kỹ năng yêu cầu</span>
                </div>
              </Title>
              <div className={styles.skillTagsContainer}>
                {viewJob.skills && Array.isArray(viewJob.skills) && viewJob.skills.length > 0 ? (
                  viewJob.skills.map((skill, index) => {
                    if (typeof skill === 'object' && skill !== null && skill.name) {
                      return (
                        <Tag
                          key={skill.id || index}
                          className={styles.skillTag}
                        >
                          {skill.name}
                        </Tag>
                      );
                    }
                    return (
                      <Tag
                        key={index}
                        className={styles.skillTag}
                      >
                        {skill}
                      </Tag>
                    );
                  })
                ) : viewJob.skillNames && Array.isArray(viewJob.skillNames) && viewJob.skillNames.length > 0 ? (
                  viewJob.skillNames.map((skillName, index) => (
                    <Tag
                      key={`name-${index}`}
                      className={styles.skillTag}
                    >
                      {skillName}
                    </Tag>
                  ))
                ) : (
                  <div className={styles.noSkills}>
                    <AlertOutlined className={styles.noSkillsIcon} />
                    <span>Không có kỹ năng yêu cầu cụ thể</span>
                  </div>
                )}
                {viewJob.skillIds && Array.isArray(viewJob.skillIds) && viewJob.skillIds.map((skillId, index) => {
                  const matchingSkill = skills.find(s => s.id === skillId);
                  return <Tag key={`id-${index}`} color="blue" className={styles.skillTag}>{matchingSkill ? matchingSkill.name : skillId}</Tag>;
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal đánh giá CV phù hợp */}
      <Modal
        title={
          <div className={styles.evaluateModalTitle}>
            <FileSearchOutlined className={styles.evaluateModalIcon} />
            <span>Đánh giá CV phù hợp</span>
          </div>
        }
        open={evaluateModalVisible}
        onCancel={() => setEvaluateModalVisible(false)}
        footer={null}
        width={700}
        className={styles.evaluateModal}
      >
        <div className={styles.evaluateModalContent}>
          <div className={styles.evaluateDescription}>
            <Alert
              message="Chọn vị trí tuyển dụng để đánh giá"
              description="Hệ thống sẽ sử dụng thông tin từ vị trí tuyển dụng để đánh giá và xếp hạng các CV ứng viên phù hợp nhất."
              type="info"
              showIcon
              className={styles.evaluateAlert}
            />
          </div>

          <div className={styles.jobSelectionSection}>
            <Title level={4}>Vị trí tuyển dụng</Title>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Spin />
              </div>
            ) : (
              <Radio.Group
                onChange={(e) => setSelectedEvaluationJob(e.target.value)}
                value={selectedEvaluationJob}
                className={styles.jobRadioGroup}
              >
                {jobs.map(job => (
                  <Card
                    key={job.id}
                    className={`${styles.jobSelectionCard} ${selectedEvaluationJob === job.id ? styles.selectedJobCard : ''}`}
                    hoverable
                  >
                    <Radio value={job.id} className={styles.jobRadio}>
                      <div className={styles.jobSelectionInfo}>
                        <div className={styles.jobSelectionTitle}>{job.title}</div>
                        <div className={styles.jobSelectionMeta}>
                          <Tag color="blue">
                            {contractOptions.find(opt => opt.value === job.contract)?.label || job.contract}
                          </Tag>
                          <Tag color="green">
                            {levelOptions.find(opt => opt.value === job.level)?.label || job.level}
                          </Tag>
                          {job.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
                            <div className={styles.jobSelectionSkills}>
                              {job.skills.slice(0, 2).map((skill, index) => (
                                <Tag
                                  key={index}
                                  className={styles.skillTag}
                                  color="purple"
                                >
                                  {typeof skill === 'object' ? skill.name : skill}
                                </Tag>
                              ))}
                              {job.skills.length > 2 && (
                                <Tag className={styles.moreSkillsTag}>+{job.skills.length - 2}</Tag>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Radio>
                  </Card>
                ))}
              </Radio.Group>
            )}
          </div>

          <div className={styles.evaluateButtonContainer}>
            <Button onClick={() => setEvaluateModalVisible(false)}>
              Hủy
            </Button>
            <Button
              type="primary"
              icon={<FileSearchOutlined />}
              disabled={!selectedEvaluationJob}
              onClick={() => {
                setEvaluateModalVisible(false);
                navigate(`/hr/cv-evaluate/${selectedEvaluationJob}`, { state: { job: jobs.find(job => job.id === selectedEvaluationJob) } });
              }}
            >
              Bắt đầu đánh giá
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobManagement;
