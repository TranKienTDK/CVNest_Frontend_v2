import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import TemplateCV2 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV2";
import TemplateCV3 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV3";
import TemplateCV4 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV4";
import sampleDataCV4 from "@/pages/user/my-cv/components/CVTemplate/sampleDataCV4";
import { PDFViewer } from "@react-pdf/renderer";
import {
  Typography,
  Tag,
  Button,
  Modal,
  Radio,
  Space,
  List,
  Spin,
  Empty,
  Table,
  Badge,
  Tooltip,
  message,
} from "antd";
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
  Share2,
  FileText,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock8,
} from "lucide-react";
import { isAuthenticated, getUserRole, getUserData } from "@/helper/storage";
import jobAPI from "../../api/job";
import companyAPI from "../../api/company";
import cvAPI from "../../api/cv";
import applyAPI from "../../api/apply"; // Import API ứng tuyển
import Header from "../../components/header/Header";
import styles from "./JobDetail.module.css";
import { toast } from "react-toastify";
import { ROUTES } from "@/routes/routes";
import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";
import { CreateCVProvider } from "../user/my-cv/providers/CreateCVProvider";

const { Title, Paragraph, Text } = Typography;

// Hàm helper để phân tích mô tả thành các phần
const parseDescription = (description) => {
  if (!description) return [];

  // Định nghĩa các section với title hiển thị và các từ khóa để match
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

  // Phân tách mô tả thành các phần riêng biệt dựa trên tiêu đề
  const result = {};
  let currentSection = null;
  let currentContent = [];
  
  const lines = description.split("\n");
  
  // Tìm các section dựa vào từ khóa viết hoa hoặc chữ in đậm
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Kiểm tra xem dòng hiện tại có phải là tiêu đề section không
    const isSection = line === line.toUpperCase() || 
                     /^(REQUIREMENTS|RESPONSIBILITIES|BENEFITS|EDUCATION|CERTIFICATION|SALARY)/.test(line);
    
    if (isSection) {
      // Nếu đã có section trước đó, lưu content vào result
      if (currentSection) {
        result[currentSection] = currentContent.join('\n');
        currentContent = [];
      }
      
      // Tìm section phù hợp
      let foundSection = null;
      for (const section of sectionDefinitions) {
        if (section.keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
          foundSection = section.key;
          currentSection = section.key;
          break;
        }
      }
      
      // Nếu không tìm thấy section cụ thể, tạo một section với tên là dòng hiện tại
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
      // Nếu chưa có section nào và cũng không phải tiêu đề, đưa vào phần mô tả công việc
      if (!result.jobDescription) {
        result.jobDescription = [];
      }
      if (Array.isArray(result.jobDescription)) {
        result.jobDescription.push(line);
      }
    }
  }
  
  // Lưu nội dung của section cuối cùng
  if (currentSection && currentContent.length > 0) {
    result[currentSection] = currentContent.join('\n');
  }
  
  // Xử lý trường hợp jobDescription là array
  if (Array.isArray(result.jobDescription)) {
    result.jobDescription = result.jobDescription.join('\n');
  }

  // Tạo mảng các section để hiển thị
  return sectionDefinitions
    .filter(section => result[section.key])
    .map(section => ({
      title: section.title,
      content: result[section.key],
      key: section.key
    }));
};

// Hàm helper để định dạng loại hợp đồng
const formatContract = (contract) => {
  if (!contract) return "Không xác định";

  const contractMapping = {
    FULL_TIME: "Toàn thời gian",
    PART_TIME: "Bán thời gian",
    FREELANCE: "Freelance",
  };

  return contractMapping[contract] || contract;
};

// Hàm helper để định dạng loại công việc
const formatJobType = (jobType) => {
  if (!jobType) return "Không xác định";

  const jobTypeMapping = {
    REMOTE: "Làm việc từ xa",
    IN_OFFICE: "Làm việc tại văn phòng",
    HYBRID: "Kết hợp",
  };

  return jobTypeMapping[jobType] || jobType;
};

// Hàm helper để định dạng cấp bậc
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

  // Lấy thông tin đăng nhập và vai trò người dùng
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
          // Get user CVs
          if (isUser) {
            setLoadingCVs(true);
            const cvsResponse = await cvAPI.getCvs(getUserData().id);
            setUserCVs(cvsResponse.data.data || []);
            setLoadingCVs(false);
          }

          // Fetch applications if user is HR
          if (isHR) {
            setLoadingApplications(true);
            try {
              const applicationsResponse = await applyAPI.getApplicationsByJob(
                id
              );
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

  const handleApproveApplication = async (applyId) => {
    try {
      await applyAPI.approveApplication(applyId);
      // Refresh applications list
      const applicationsResponse = await applyAPI.getApplicationsByJob(id);
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
      // Refresh applications list
      const applicationsResponse = await applyAPI.getApplicationsByJob(id);
      setApplications(applicationsResponse.data.data || []);
      message.success("Đã từ chối đơn ứng tuyển");
    } catch (err) {
      console.error("Error rejecting application:", err);
      message.error("Không thể từ chối đơn ứng tuyển");
    }
  };

  const fetchUserCVs = async () => {
    if (!isLoggedIn || !isUser) return;

    try {
      setLoadingCVs(true);
      const response = await cvAPI.getCvs(0, 100); // Lấy tối đa 100 CV
      setUserCVs(response.data.data.content || []);
    } catch (error) {
      console.error("Error fetching user CVs:", error);
      toast.error("Không thể tải danh sách CV. Vui lòng thử lại sau.");
    } finally {
      setLoadingCVs(false);
    }
  };

  const handleBookmark = () => {
    if (!isLoggedIn) {
      toast.warning("Vui lòng đăng nhập để lưu công việc này");
      return;
    }

    setIsBookmarked(!isBookmarked);
    // TODO: Gọi API lưu/bỏ lưu job
    const message = isBookmarked
      ? "Đã xóa công việc khỏi danh sách đã lưu"
      : "Đã lưu công việc này";
    toast.success(message);
  };

  const handleApply = () => {
    if (!isLoggedIn) {
      toast.warning("Vui lòng đăng nhập để ứng tuyển");
      return;
    }

    if (!isUser) {
      toast.warning("Chỉ người dùng mới có thể ứng tuyển");
      return;
    }

    // Lấy danh sách CV của người dùng
    fetchUserCVs();
    setShowApplyModal(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã sao chép liên kết vào clipboard");
  };

  const handlePreviewCV = (cv) => {
    setPreviewCV(cv);
    setShowPreviewModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedCV) {
      toast.warning("Vui lòng chọn CV để ứng tuyển");
      return;
    }

    try {
      setApplyLoading(true);
      // Đảm bảo có userId từ userData
      const userId = userData?.id;

      if (!userId) {
        toast.error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
        );
        return;
      }

      // Gọi API ứng tuyển với đầy đủ các tham số: userId, jobId, cvId
      await applyAPI.applyJob(userId, job.id, selectedCV);

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

  const columns = [
    {
      title: "Tên ứng viên",
      dataIndex: "applicantName",
      key: "applicantName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        let text = "Đang chờ";
        if (status === "APPROVED") {
          color = "green";
          text = "Đã duyệt";
        } else if (status === "REJECTED") {
          color = "red";
          text = "Đã từ chối";
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
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem CV">
            <Button
              icon={<Eye size={16} />}
              onClick={() => handlePreviewCV(record.cv)}
            />
          </Tooltip>
          <Tooltip title="Duyệt">
            <Button
              icon={<CheckCircle size={16} />}
              onClick={() => handleApproveApplication(record.id)}
            />
          </Tooltip>
          <Tooltip title="Từ chối">
            <Button
              icon={<XCircle size={16} />}
              onClick={() => handleRejectApplication(record.id)}
            />
          </Tooltip>
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
              </div>

              <div className={styles.actionsBar}>
                {isLoggedIn && isUser && (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleApply}
                    className="bg-primaryRed hover:bg-primaryRed/80"
                  >
                    Ứng tuyển ngay
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
              className={`${styles.bookmark} ${
                isBookmarked ? styles.bookmarked : ""
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
            )}{/* Hiển thị skillNames dưới dạng list với thiết kế mới */}
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
          </div>

          {isHR && (
            <div className={styles.applicationsSection}>
              <Title level={4} className={styles.sectionTitle}>
                Danh sách đơn ứng tuyển
              </Title>
              <Table
                columns={columns}
                dataSource={applications}
                rowKey="id"
                pagination={false}
              />
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
          >
            <List
              dataSource={userCVs}
              renderItem={(item) => (
                <List.Item className="border p-4 rounded-lg mb-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center w-full">
                    <Radio value={item.id} className="mr-4" />
                    <div className="flex-grow">
                      <div className="font-medium text-base">{item.cvName}</div>
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
        footer={[
          <></>
        ]}
        destroyOnClose
      >
        {previewCV ? (
          <div className="p-4 h-[85vh] overflow-y-auto border rounded">
            <h2 className="text-xl font-bold mb-4">{previewCV.cvName}</h2>
            <PDFViewer width="100%" height="90%" showToolbar>
              {(() => {
                switch (previewCV.templateId) {
                  case 1:
                    return <TemplateCV1 data={previewCV} />;
                  case 2:
                    return <TemplateCV2 data={previewCV} />;
                  case 3:
                    return <TemplateCV3 data={sampleDataCV4} />;
                  case 4:
                    return <TemplateCV4 data={sampleDataCV4} />;
                  default:
                    return <TemplateCV1 data={previewCV} />;
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
};

export default JobDetail;
