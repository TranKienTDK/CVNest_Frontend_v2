import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Space, Tooltip, Table, Empty, Modal, Radio, Spin, Tag } from "antd";
import { BookmarkPlus, BookmarkCheck, Eye, CheckCircle, XCircle } from "lucide-react";
import dayjs from "dayjs";
import { isAuthenticated, getUserRole, getUserData } from "@/helper/storage";
import AuthModal from "@/components/modals/AuthModal";

import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import TemplateCV2 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV2";
import TemplateCV3 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV3";
import TemplateCV4 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV4";
import { PDFViewer } from "@react-pdf/renderer";
import {
  Briefcase,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  GraduationCap,
  MapPin,
  Users,
  Bookmark,
  FileText,
  AlertCircle,
  Clock8,
  Star,
  Share2,
} from "lucide-react";
import jobAPI from "../../api/job";
import companyAPI from "../../api/company";
import cvAPI from "../../api/cv";
import applyAPI from "../../api/apply";
import Header from "../../components/header/Header";
import styles from "./JobDetail.module.css";
import { toast } from "react-toastify";
import { ROUTES } from "@/routes/routes";
import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";
import { CreateCVProvider } from "../user/my-cv/providers/CreateCVProvider";

const { Title, Paragraph, Text } = Typography;

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
      /^(REQUIREMENTS|RESPONSIBILITIES|BENEFITS|EDUCATION|CERTIFICATION|SALARY)/.test(line);

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
        currentSection = line.toLowerCase().replace(/\s+/g, '_');
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

const formatContract = (contract) => {
  if (!contract) return "Không xác định";

  const contractMapping = {
    FULL_TIME: "Toàn thời gian",
    PART_TIME: "Bán thời gian",
    FREELANCE: "Freelance",
  };

  return contractMapping[contract] || contract;
};

const formatJobType = (jobType) => {
  if (!jobType) return "Không xác định";

  const jobTypeMapping = {
    REMOTE: "Làm việc từ xa",
    IN_OFFICE: "Làm việc tại văn phòng",
    HYBRID: "Kết hợp",
  };

  return jobTypeMapping[jobType] || jobType;
};

const formatLevel = (level) => {
  if (!level) return "Không xác định";

  const levelMapping = {
    INTERN: "Thực tập sinh",
    FRESHHER: "Fresher",
    JUNIOR: "Junior",
    MIDDLE: "Middle",
    SENIOR: "Senior",
    LEADER: "Trưởng nhóm",
    DEPARTMENT_LEADER: "Trưởng phòng",
  };

  return levelMapping[level] || level;
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [userCVs, setUserCVs] = useState([]);
  const [loadingCVs, setLoadingCVs] = useState(false);
  const [previewCV, setPreviewCV] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationsWithDetails, setApplicationsWithDetails] = useState([]);
  const [cvDetailsCache, setCvDetailsCache] = useState({});
  const [userApplications, setUserApplications] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);
  const [loadingUserApplications, setLoadingUserApplications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isLoggedIn = isAuthenticated();
  const userRole = getUserRole();
  const userData = getUserData();
  const isUser = userRole === "USER";
  const isHR = userRole === "HR";

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const response = await jobAPI.getJobDetail(id);
        setJob(response.data.data);

        console.log("Job detail response:", response.data.data);
        const companyResponse = await companyAPI.getDetailCompany(
          response.data.data.companyId
        );
        setCompany(companyResponse.data.data);

        if (isLoggedIn) {
          if (isUser) {
            setLoadingCVs(true);
            const cvsResponse = await cvAPI.getCvs(getUserData().id);
            setUserCVs(cvsResponse.data.data || []);
            setLoadingCVs(false);

            setLoadingUserApplications(true);
            try {
              const userApplicationsResponse = await applyAPI.getUserApplications(getUserData().id);
              console.log("User applications:", userApplicationsResponse.data.data);
              const userApps = userApplicationsResponse.data.data || [];
              setUserApplications(userApps);
              
              const appliedToCurrentJob = userApps.some(app => app.jobId === parseInt(id) || app.jobId === id);
              setHasApplied(appliedToCurrentJob);
              console.log("User has applied to this job:", appliedToCurrentJob);
            } catch (error) {
              console.error("Error fetching user applications:", error);
            }
            setLoadingUserApplications(false);
          }
          if (isHR) {
            setLoadingApplications(true);
            try {
              const applicationsResponse = await applyAPI.getJobApplications(id);
              console.log("Applications data:", applicationsResponse.data.data);
              setApplications(applicationsResponse.data.data || []);
            } catch (error) {
              console.error("Error fetching applications:", error);
            }
            setLoadingApplications(false);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id, isLoggedIn, isHR, isUser]);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!applications.length) return;

      try {
        const updatedApps = await Promise.all(
          applications.map(async (app) => {
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
                console.error("Error fetching CV details:", error);
              }
            }

            const fullName = cvData?.info?.fullName || app.applicantName || "Chưa có thông tin";
            const email = cvData?.info?.email || app.email || "Chưa có thông tin";

            return {
              ...app,
              applicantName: fullName,
              email: email,
              cv: cvData
            };
          })
        );

        setApplicationsWithDetails(updatedApps);
      } catch (error) {
        console.error("Error processing applications:", error);
      }
    };

    fetchApplicationDetails();
  }, [applications, cvDetailsCache]);

  const handleApproveApplication = async (applyId) => {
    try {
      await applyAPI.approveApplication(applyId);
      const applicationsResponse = await applyAPI.getJobApplications(id);
      setApplications(applicationsResponse.data.data || []);
      message.success("Đã duyệt đơn ứng tuyển");
    } catch (err) {
      console.error("Error approving application:", err);
      message.error("Không thể duyệt đơn ứng tuyển");
    }
  };

  const handleRejectApplication = async (applyId) => {
    try {
      await applyAPI.rejectApplication(applyId);
      const applicationsResponse = await applyAPI.getJobApplications(id);
      setApplications(applicationsResponse.data.data || []);
      message.success("Đã từ chối đơn ứng tuyển");
    } catch (err) {
      console.error("Error rejecting application:", err);
      message.error("Không thể từ chối đơn ứng tuyển");
    }
  };  const fetchUserCVs = async () => {
    if (!isLoggedIn || !isUser) return;

    try {
      setLoadingCVs(true);
      
      const response = await cvAPI.getCvs(0, 100);
      const cvList = response.data.data.content || [];
      
      // Look for the default CV in the list
      const defaultCv = cvList.find(cv => cv.default === true);
      if (defaultCv) {
        setSelectedCV(defaultCv.id);
      }
      
      setUserCVs(cvList);
    } catch (error) {
      console.error("Error fetching user CVs:", error);
      toast.error("Không thể tải danh sách CV. Vui lòng thử lại sau.");
    } finally {
      setLoadingCVs(false);
    }
  };
  const handleBookmark = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    setIsBookmarked(!isBookmarked);
    const message = isBookmarked
      ? "Đã xóa công việc khỏi danh sách đã lưu"
      : "Đã lưu công việc này";
    toast.success(message);
  };
  const handleApply = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!isUser) {
      toast.warning("Chỉ người dùng mới có thể ứng tuyển");
      return;
    }

    if (hasApplied) {
      toast.info("Bạn đã ứng tuyển vào vị trí này");
      return;
    }

    fetchUserCVs();
    setShowApplyModal(true);
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết vào clipboard");
  }; const handlePreviewCV = async (cv) => {
    try {
      const cvId = typeof cv === 'object' ? cv.id : cv;

      if (!cvId) {
        message.error("Không tìm thấy thông tin CV");
        return;
      }

      setLoadingCVs(true);
      setShowPreviewModal(true);

      if (cvDetailsCache[cvId]) {
        console.log("Using cached CV data:", cvDetailsCache[cvId]);

        const transformedData = transformApiDataToFormData(cvDetailsCache[cvId]);
        console.log("Transformed CV data from cache:", transformedData);

        setPreviewCV(transformedData);
        setLoadingCVs(false);
        return;
      }

      const response = await cvAPI.getDetailCv(cvId);
      console.log("CV Data from API:", response.data.data);

      const cvData = response.data.data ? { ...response.data.data } : {};

      setCvDetailsCache(prev => ({
        ...prev,
        [cvId]: cvData
      }));

      const transformedData = transformApiDataToFormData(cvData);
      console.log("Transformed CV data from API:", transformedData);

      setPreviewCV(transformedData);
    } catch (error) {
      console.error("Error fetching CV details:", error);
      message.error("Không thể tải thông tin CV");
    } finally {
      setLoadingCVs(false);
    }
  };
  const handleSubmitApplication = async () => {
    if (!selectedCV) {
      toast.warning("Vui lòng chọn CV để ứng tuyển");
      return;
    }

    try {
      setApplyLoading(true);
      const userId = userData?.id;

      if (!userId) {
        toast.error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
        );
        return;
      }

      await applyAPI.applyJob(userId, job.id, selectedCV);

      setHasApplied(true);
      
      const newApplication = { 
        userId, 
        jobId: job.id, 
        cvId: selectedCV,
        status: "PENDING",
        appliedAt: new Date().toISOString()
      };
      setUserApplications(prev => [...prev, newApplication]);

      toast.success("Ứng tuyển thành công!");
      setShowApplyModal(false);
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Có lỗi xảy ra khi ứng tuyển. Vui lòng thử lại sau.");
    } finally {
      setApplyLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: viLocale });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className={styles.container}>
          <div className="text-center py-10">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className={styles.container}>
          <div className="text-center py-10">
            Không tìm thấy thông tin công việc này
          </div>
        </div>
      </div>
    );
  }

  const descriptionSections = parseDescription(job.description);

  const columns = [{
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
    title: "Trạng thái",
    dataIndex: "status",
    key: "status", render: (status) => {
      let color = "default";
      let text = "Đang chờ";

      if (status === "APPROVED") {
        color = "green";
        text = "Đã duyệt";
      } else if (status === "REJECTED") {
        color = "red";
        text = "Đã từ chối";
      } else if (status === "PENDING") {
        color = "blue";
        text = "Đang chờ duyệt";
      }

      return <Badge status={color} text={text} />;
    },
  },
  {
    title: "Ngày ứng tuyển",
    dataIndex: "appliedAt",
    key: "appliedAt",
    render: (appliedAt) => formatDate(appliedAt),
  },
  {
    title: "Hành động",
    key: "action", render: (_, record) => (
      <Space size="small">
        <Tooltip title="Xem CV">
          <Button
            type="primary"
            icon={<Eye size={16} />}
            onClick={() => handlePreviewCV(record.cv)}
            className="bg-blue-500"
          />
        </Tooltip>
        {record.status === "PENDING" && (
          <>
            <Tooltip title="Duyệt">
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
  ];

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.container}>
        <div className={styles.detailContent}>
          <div className={styles.jobHeader}>
            <div className={styles.companyLogoWrapper}>
              <img
                src={company?.avatar || "/company-placeholder.png"}
                alt={company?.name || "Company Logo"}
                className={styles.companyLogo}
              />
            </div>
            <div className={styles.infoWrapper}>
              <Title level={2} className={styles.jobTitle}>
                {job.title}
              </Title>
              <div className={styles.companyName}>{company?.name}</div>

              <div className={styles.tags}>
                {job.contract && (
                  <span className={styles.tag}>
                    <Briefcase size={16} />
                    {formatContract(job.contract)}
                  </span>
                )}
                {job.jobType && (
                  <span className={styles.tag}>
                    <Building2 size={16} />
                    {formatJobType(job.jobType)}
                  </span>
                )}
                {job.level && (
                  <span className={styles.tag}>
                    <GraduationCap size={16} />
                    {formatLevel(job.level)}
                  </span>
                )}
                {job.experienceYear && (
                  <span className={styles.tag}>
                    <Users size={16} />
                    {job.experienceYear} năm kinh nghiệm
                  </span>
                )}
              </div>

              <div className={styles.jobMeta}>
                {job.salary && (
                  <div className={styles.metaItem}>
                    <CreditCard size={18} />
                    <span className={styles.metaLabel}>Mức lương:</span>
                    <span className={styles.metaValue}>
                      {job.salary.toLocaleString()} ₫
                    </span>
                  </div>
                )}
                {job.location && (
                  <div className={styles.metaItem}>
                    <MapPin size={18} />
                    <span className={styles.metaLabel}>Địa điểm:</span>
                    <span className={styles.metaValue}>{job.location}</span>
                  </div>
                )}
                {job.deadlineTime && (
                  <div className={styles.metaItem}>
                    <Calendar size={18} />
                    <span className={styles.metaLabel}>Hạn nộp:</span>
                    <span className={styles.metaValue}>
                      {new Date(job.deadlineTime).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {job.updatedAt && (
                  <div className={styles.metaItem}>
                    <Clock size={18} />
                    <span className={styles.metaLabel}>Cập nhật:</span>
                    <span className={styles.metaValue}>
                      {new Date(job.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>              <div className={styles.actionsBar}>
                {isLoggedIn && isUser && (
                  <Button
                    type={hasApplied ? "default" : "primary"}
                    size="large"
                    onClick={handleApply}
                    className={hasApplied 
                      ? "bg-green-100 text-green-600 border-green-300 hover:bg-green-200"
                      : "bg-primaryRed hover:bg-primaryRed/80"}
                    icon={hasApplied ? <CheckCircle size={16} /> : null}
                    disabled={loadingUserApplications}
                  >
                    {hasApplied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
                  </Button>
                )}
                <Button
                  className={isBookmarked ? "text-yellow-500" : ""}
                  icon={<Bookmark size={16} />}
                  onClick={handleBookmark}
                >
                  {isBookmarked ? "Đã lưu" : "Lưu tin"}
                </Button>
                <Button icon={<Share2 size={16} />} onClick={handleShare}>
                  Chia sẻ
                </Button>
              </div>
            </div>

            <button
              className={`${styles.bookmark} ${isBookmarked ? styles.bookmarked : ""
                }`}
              onClick={handleBookmark}
              aria-label={
                isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
              }
            >
              <Bookmark fill={isBookmarked ? "#f5a623" : "none"} />
            </button>
          </div>          <div className={styles.descriptionSection}>
            {descriptionSections.length > 0 ? (
              descriptionSections.map((section, index) => (
                <div key={index} className={`${styles.descriptionBlock} ${styles[section.key + 'Section']}`}>
                  <Title level={4} className={styles.sectionTitle}>
                    <div className={styles.sectionTitleWithIcon}>
                      {section.key === 'requirements' && <AlertCircle size={20} />}
                      {section.key === 'benefits' && <CheckCircle size={20} />}
                      {section.key === 'jobDescription' && <FileText size={20} />}
                      {section.key === 'education' && <GraduationCap size={20} />}
                      {section.key === 'certification' && <FileText size={20} />}
                      {section.key === 'salary' && <CreditCard size={20} />}
                      {!['requirements', 'benefits', 'jobDescription', 'education', 'certification', 'salary'].includes(section.key) && <AlertCircle size={20} />}
                      {section.title}
                    </div>
                  </Title>

                  {section.key === 'requirements' ? (
                    <div className={styles.requirementsList}>
                      {section.content.split('\n').filter(line => line.trim()).map((item, i) => (
                        <div key={i} className={styles.requirementItem}>
                          <div className={styles.requirementBullet}></div>
                          <div>{item}</div>
                        </div>
                      ))}
                    </div>
                  ) : section.key === 'benefits' ? (
                    <div className={styles.benefitsList}>
                      {section.content.split('\n').filter(line => line.trim()).map((item, i) => (
                        <div key={i} className={styles.benefitItem}>
                          <CheckCircle size={16} className={styles.benefitIcon} />
                          <div>{item}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Paragraph className={`${styles.descriptionContent} ${styles[section.key + 'Content']}`}>
                      {section.content}
                    </Paragraph>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.descriptionBlock}>
                <Title level={4} className={styles.sectionTitle}>
                  <div className={styles.sectionTitleWithIcon}>
                    <FileText size={20} />
                    Mô tả công việc
                  </div>
                </Title>
                <Paragraph className={styles.descriptionContent}>
                  {job.description ||
                    "Không có mô tả chi tiết cho công việc này."}
                </Paragraph>
              </div>
            )}
            <div className={styles.skillsSection}>
              <Title level={4} className={styles.sectionTitle}>
                <div className={styles.sectionTitleWithIcon}>
                  <GraduationCap size={20} />
                  Kỹ năng yêu cầu
                </div>
              </Title>

              {job.skillNames && job.skillNames.length > 0 ? (
                <div className={styles.skillTagsContainer}>
                  {job.skillNames.map((skillName, index) => (
                    <Tag key={index} className={styles.skillTag}>
                      {skillName}
                    </Tag>
                  ))}
                </div>
              ) : (
                <div className={styles.noSkills}>
                  <AlertCircle size={18} className={styles.noSkillsIcon} />
                  <span>Công việc này chưa có yêu cầu kỹ năng cụ thể</span>
                </div>
              )}
            </div>

            {job.deadlineTime && (
              <div className={styles.deadline}>
                <Calendar size={20} color="#faad14" />
                <span>
                  Hạn nộp hồ sơ:{" "}
                  <strong>
                    {new Date(job.deadlineTime).toLocaleDateString()}
                  </strong>
                </span>
              </div>
            )}
          </div>          {isHR && (
            <div className={styles.applicationsSection}>
              <Title level={4} className={styles.sectionTitle}>
                <FileText size={20} />
                Danh sách đơn ứng tuyển
              </Title>
              {loadingApplications ? (
                <div className="flex justify-center py-4">
                  <Spin size="large" tip="Đang tải..." />
                </div>
              ) : applicationsWithDetails.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={applicationsWithDetails}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Tổng cộng ${total} đơn ứng tuyển`
                  }}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có đơn ứng tuyển nào cho vị trí này"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal chọn CV để ứng tuyển */}
      <Modal
        title="Chọn CV để ứng tuyển"
        open={showApplyModal}
        onCancel={() => setShowApplyModal(false)}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setShowApplyModal(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={applyLoading}
            onClick={handleSubmitApplication}
            disabled={!selectedCV}
            className="bg-primaryRed hover:bg-primaryRed/80"
          >
            Ứng tuyển
          </Button>,
        ]}
        destroyOnClose
      >
        {loadingCVs ? (
          <div className="flex justify-center py-10">
            <Spin tip="Đang tải danh sách CV..." />
          </div>
        ) : userCVs.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{ height: 120 }}
            description={
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <AlertCircle size={18} />
                  <span className="font-medium">Bạn chưa có CV nào</span>
                </div>
                <p>Hãy tạo CV để có thể ứng tuyển vào vị trí này.</p>
              </div>
            }
          >
            <Button
              type="primary"
              onClick={() => navigate(ROUTES.CREATENAMECV)}
              className="bg-primaryRed hover:bg-primaryRed/80"
            >
              Tạo CV mới
            </Button>
          </Empty>
        ) : (
          <Radio.Group
            onChange={(e) => setSelectedCV(e.target.value)}
            value={selectedCV}
            className="w-full"
          >            <List
              dataSource={userCVs}
              renderItem={(item) => (
                <List.Item 
                  className={`border p-4 rounded-lg mb-4 hover:bg-gray-50 transition-colors ${item.default ? 'bg-orange-50' : ''}`}
                >
                  <div className="flex items-center w-full">
                    <Radio value={item.id} className="mr-4" />
                    <div className="flex-grow">
                      <div className="font-medium text-base flex items-center gap-1">
                        {item.default && (
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        )}
                        {item.cvName}
                        {item.default && (
                          <span className="ml-2 text-xs text-orange-600 font-medium border border-orange-300 px-2 py-0.5 rounded-full">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-sm">
                        Cập nhật: {formatDate(item.updatedAt || item.createdAt)}
                      </div>
                    </div>
                    <Button
                      type="default"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePreviewCV(item);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Eye size={16} />
                      Xem trước
                    </Button>
                  </div>
                </List.Item>
              )}
            />
          </Radio.Group>
        )}
      </Modal>
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
        {loadingCVs ? (
          <div className="flex justify-center py-8">
            <Spin size="large" tip="Đang tải CV..." />
          </div>) : previewCV ? (
            <div className="p-4 h-[85vh] overflow-y-auto border rounded">
              <h2 className="text-xl font-bold mb-4">{previewCV.name}</h2>
              <PDFViewer width="100%" height="90%" showToolbar>
                {(() => {
                  try {
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
                  } catch (error) {
                    console.error("Error rendering CV template:", error);
                    return <div>Có lỗi khi hiển thị CV. Vui lòng thử lại.</div>;
                  }
                })()}
              </PDFViewer>
            </div>) : (
          <div className="text-center py-8">Không có thông tin CV</div>
        )}
      </Modal>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        title="Yêu cầu đăng nhập" 
        description="Bạn cần đăng nhập để thực hiện chức năng này." 
      />
    </div>
  );
};

export default JobDetail;
