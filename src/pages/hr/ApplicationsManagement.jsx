import React, { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import TemplateCV2 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV2";
import TemplateCV3 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV3";
import TemplateCV4 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV4";
import sampleDataCV4 from "@/pages/user/my-cv/components/CVTemplate/sampleDataCV4";
import { PDFViewer } from "@react-pdf/renderer";
import {
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Input,
  Select,
  Badge,
  Tooltip,
  Card,
  Tabs,
  Empty,
  Spin,
} from "antd";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  UserCheck,
  Filter,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";
import { getUserData } from "@/helper/storage";
import applyAPI from "@/api/apply";
import jobAPI from "@/api/job";
import cvAPI from "@/api/cv"; // Import CV API
import styles from "./ApplicationsManagement.module.css";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewCV, setPreviewCV] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [jobTitles, setJobTitles] = useState({});
  const [applicationsWithJobDetails, setApplicationsWithJobDetails] = useState([]);
  const [loadingCV, setLoadingCV] = useState(false);
  const [cvDetailsCache, setCvDetailsCache] = useState({});
  const userData = getUserData();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId, activeTab]);

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getJobs({ page: 0, size: 100 });
      const companyJobs = response.data.data.content.filter(
        job => job.companyId === userData.companyId
      );
      setJobs(companyJobs);
      
      if (!selectedJobId && companyJobs.length > 0) {
        setSelectedJobId(companyJobs[0].id);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      message.error("Không thể tải danh sách công việc");
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let response;
      
      if (selectedJobId) {
        response = await applyAPI.getJobApplications(selectedJobId);
      } else {
        response = await applyAPI.getHRApplications(userData.id);
      }
      
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
      console.error("Error fetching applications:", error);
      message.error("Không thể tải danh sách đơn ứng tuyển");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchJobTitlesAndCvDetails = async () => {
      const updatedApps = await Promise.all(
        applications.map(async (app) => {
          // Fetch job title if not already cached
          let jobTitle = jobTitles[app.jobId];
          if (!jobTitle) {
            try {
              const response = await jobAPI.getJobDetail(app.jobId);
              jobTitle = response.data.data.title;
              
              setJobTitles(prev => ({
                ...prev,
                [app.jobId]: jobTitle
              }));
            } catch (error) {
              console.error(`Error fetching job details for ID ${app.jobId}:`, error);
              jobTitle = "Không xác định";
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
  }, [applications, jobTitles, cvDetailsCache]);

  const handleApproveApplication = async (applyId) => {
    try {
      await applyAPI.approveApplication(applyId);
      message.success("Đã duyệt đơn ứng tuyển");
      fetchApplications();
    } catch (err) {
      console.error("Error approving application:", err);
      message.error("Không thể duyệt đơn ứng tuyển");
    }
  };

  const handleRejectApplication = async (applyId) => {
    try {
      await applyAPI.rejectApplication(applyId);
      message.success("Đã từ chối đơn ứng tuyển");
      fetchApplications();
    } catch (err) {
      console.error("Error rejecting application:", err);
      message.error("Không thể từ chối đơn ứng tuyển");
    }
  };
  const handlePreviewCV = async (cvId) => {
    try {
      setLoadingCV(true);
      if (cvDetailsCache[cvId]) {
        setPreviewCV(cvDetailsCache[cvId]);
        setShowPreviewModal(true);
      } else {
        const response = await cvAPI.getDetailCv(cvId);
        console.log("CV Data:", response.data.data);
        
        setCvDetailsCache(prev => ({
          ...prev,
          [cvId]: response.data.data
        }));
        
        setPreviewCV(response.data.data);
        setShowPreviewModal(true);
      }
    } catch (error) {
      console.error("Error fetching CV details:", error);
      message.error("Không thể tải thông tin CV");
    } finally {
      setLoadingCV(false);
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

  const getStatusTag = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag color="processing">Đang chờ duyệt</Tag>;
      case "APPROVED":
        return <Tag color="success">Đã duyệt</Tag>;
      case "REJECTED":
        return <Tag color="error">Đã từ chối</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
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
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
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
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto pt-24 px-4 pb-8">        <div className="mb-6 flex justify-between items-center">
          <div>
            <Title level={2} className="mb-2">Quản lý CV ứng tuyển</Title>
            <Text type="secondary">
              Xem và quản lý tất cả các đơn ứng tuyển vào công ty của bạn
            </Text>
          </div>
          <Button 
            type="primary" 
            onClick={() => window.location.href = '/hr/jobs'}
          >
            Quản lý việc làm
          </Button>
        </div>

        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-4">
              <Select
                placeholder="Chọn vị trí công việc"
                style={{ width: 250 }}
                onChange={(value) => setSelectedJobId(value)}
                value={selectedJobId}
              >
                {jobs.map((job) => (
                  <Option key={job.id} value={job.id}>{job.title}</Option>
                ))}
              </Select>
            </div>

            <div className="flex gap-2">
              <Input 
                placeholder="Tìm kiếm ứng viên" 
                prefix={<Search size={16} className="mr-1" />} 
                style={{ width: 250 }} 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={fetchApplications}
              />
              <Button 
                icon={<RefreshCw size={16} />} 
                onClick={fetchApplications}
                title="Làm mới"
              />
            </div>
          </div>
        </Card>

        <Card>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="mb-4"
          >
            <TabPane 
              tab={
                <span className="flex items-center gap-1">
                  <Filter size={16} />
                  Tất cả
                </span>
              } 
              key="all" 
            />
            <TabPane 
              tab={
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Đang chờ duyệt
                </span>
              } 
              key="pending" 
            />
            <TabPane 
              tab={
                <span className="flex items-center gap-1">
                  <CheckCircle size={16} />
                  Đã phê duyệt
                </span>
              } 
              key="approved" 
            />
            <TabPane 
              tab={
                <span className="flex items-center gap-1">
                  <XCircle size={16} />
                  Đã từ chối
                </span>
              }
              key="rejected" 
            />
          </Tabs>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" tip="Đang tải..." />
            </div>
          ) : applicationsWithJobDetails.length > 0 ? (
            <Table 
              columns={columns} 
              dataSource={applicationsWithJobDetails}
              rowKey="id"
              pagination={{ 
                pageSize: 10, 
                showTotal: (total) => `Tổng cộng ${total} đơn ứng tuyển` 
              }}
            />
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={
                <span>
                  Không có đơn ứng tuyển nào {activeTab !== "all" ? "có trạng thái " + 
                  (activeTab === "pending" ? "đang chờ duyệt" : 
                   activeTab === "approved" ? "đã phê duyệt" : 
                   activeTab === "rejected" ? "đã từ chối" : "") : ""}
                </span>
              }
            />
          )}
        </Card>
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
          {loadingCV ? (
            <div className="flex justify-center py-8">
              <Spin size="large" tip="Đang tải CV..." />
            </div>
          ) : previewCV ? (
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

export default ApplicationsManagement;