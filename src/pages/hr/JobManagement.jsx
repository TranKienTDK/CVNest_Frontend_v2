// JobManagement.jsx
import React, { useState, useEffect } from "react";
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
  Tooltip
} from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactMarkdown from 'react-markdown';
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
  ExclamationCircleOutlined, // Replacing AlertCircleOutlined
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
  const userData = getUserData();

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
  }, []);
  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (!userData?.id) {
        toast.error("Không tìm thấy thông tin người dùng", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }
      const response = await jobAPI.getHrJobs(userData.id);
      const jobsData = response.data.data || [];
      setJobs(jobsData);
      
      if (jobsData.length > 0 && jobsData[0].companyId) {
        setCompanyId(jobsData[0].companyId);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Không thể tải danh sách việc làm", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
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
      }    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Không thể tải danh sách kỹ năng", {
        position: "top-right",
        autoClose: 2000,
      });
      setSkills([]);
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
  };// Show edit job modal
  const showEditModal = (job) => {
    setIsEditing(true);
    setCurrentJob(job);
    
    let skillValues = [];
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
  };  // Show view job modal
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
  };
  const handleSubmit = async (values) => {
    try {
      if (!companyId) {
        toast.error("Không tìm thấy thông tin công ty, vui lòng tải lại trang", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }
      
      const jobData = {
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
        companyId: companyId, // Thêm companyId vào dữ liệu công việc
      };
      
      if (isEditing && currentJob) {
        await jobAPI.updateJob(currentJob.id, jobData);
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
  };// Handle job deletion
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
    {
      title: "Thao tác",
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
    <div className="page-wrapper">
      <Header />
      <div className="container">
        <Card className={styles.jobManagementCard}>
          <div className={styles.jobManagementHeader}>
            <Title level={2}>Quản lý việc làm</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showAddModal}
              className={styles.addJobBtn}
            >
              Thêm việc làm mới
            </Button>
          </div>          <Table
            columns={columns}
            dataSource={jobs}
            rowKey="id"
            loading={loading}
            pagination={false}
            className={styles.jobTable}
          /></Card>
      </div>

      {/* Modal thêm/sửa việc làm */}
      <Modal
        title={isEditing ? "Chỉnh sửa việc làm" : "Thêm việc làm mới"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
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
                    // Handle if skill is an object with id and name properties
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
    </div>
  );
};

export default JobManagement;
