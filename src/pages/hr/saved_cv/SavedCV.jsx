import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Empty, Button, Tooltip, Input, Pagination, Avatar, Tag, Typography, Space, Skeleton, notification, Popconfirm, Modal } from 'antd';
import { SearchOutlined, DeleteOutlined, FileTextOutlined, UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import cvAPI from '../../../api/cv';
import { getUserData } from '../../../helper/storage';
import { TemplateCV1 } from '@/pages/user/my-cv/components/CVTemplate/TemplateCV1';
import TemplateCV2 from '@/pages/user/my-cv/components/CVTemplate/TemplateCV2';
import TemplateCV3 from '@/pages/user/my-cv/components/CVTemplate/TemplateCV3';
import TemplateCV4 from '@/pages/user/my-cv/components/CVTemplate/TemplateCV4';
import { PDFViewer } from '@react-pdf/renderer';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const SavedCV = () => {
  const [savedCVs, setSavedCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [previewCV, setPreviewCV] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loadingCV, setLoadingCV] = useState(false);
  const [cvDetailsCache, setCvDetailsCache] = useState({});

  const navigate = useNavigate();
  const userData = getUserData();
  useEffect(() => {
    fetchSavedCVs();
  }, [currentPage, pageSize]);
  const fetchSavedCVs = async () => {
    try {
      setLoading(true);
      if (!userData || !userData.id) {
        notification.error({
          message: 'Lỗi xác thực',
          description: 'Vui lòng đăng nhập để xem danh sách CV đã lưu',
        });
        return;
      }

      const response = await cvAPI.getSavedCVs(userData.id);
      const { data } = response.data;
      setSavedCVs(data || []);
      setTotalItems(data?.length || 0);
    } catch (error) {
      console.error('Error fetching saved CVs:', error);
      notification.error({
        message: 'Không thể tải CV đã lưu',
        description: 'Đã xảy ra lỗi khi tải danh sách CV đã lưu. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleRemoveSavedCV = async (cvId) => {
    try {
      await cvAPI.removeSavedCV(userData.id, cvId);

      setSavedCVs(savedCVs.filter(cv => cv.id !== cvId));
      notification.success({
        message: 'Đã xóa khỏi danh sách lưu',
        description: 'CV đã được xóa khỏi danh sách CV đã lưu.',
      });
    } catch (error) {
      console.error('Error removing saved CV:', error);
      notification.error({
        message: 'Không thể xóa CV',
        description: 'Đã xảy ra lỗi khi xóa CV khỏi danh sách đã lưu.',
      });
    }
  };

  const handlePreviewCV = async (cvId) => {
    try {
      if (!cvId) {
        notification.error({
          message: 'Không tìm thấy thông tin CV',
          description: 'Không thể tìm thấy thông tin CV để xem trước.',
        });
        return;
      }

      setLoadingCV(true);
      setShowPreviewModal(true);

      if (cvDetailsCache[cvId]) {
        console.log("Using cached CV data:", cvDetailsCache[cvId]);

        const transformedData = transformApiDataToFormData(cvDetailsCache[cvId]);
        console.log("Transformed CV data from cache:", transformedData);

        setPreviewCV(transformedData);
        setLoadingCV(false);
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
      notification.error({
        message: 'Không thể tải thông tin CV',
        description: 'Đã xảy ra lỗi khi tải dữ liệu CV. Vui lòng thử lại sau.',
      });
    } finally {
      setLoadingCV(false);
    }
  };

  const filteredCVs = searchKeyword
    ? savedCVs.filter(cv =>
      cv.cvName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      cv.info?.fullName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      cv.info?.email?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      cv.info?.phone?.includes(searchKeyword)
    )
    : savedCVs;

  const paginatedCVs = filteredCVs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredCVs.length / pageSize);

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

  const renderSkillTags = (skills) => {
    if (!skills || !Array.isArray(skills) || skills.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {skills.slice(0, 3).map((skill, index) => (
          <Tag key={index} color="blue" className="rounded-full px-2.5 py-0.5 text-xs">
            {typeof skill === 'string' ? skill : skill.name || ''}
          </Tag>
        ))}
        {skills.length > 3 && (
          <Tag color="default" className="rounded-full px-2.5 py-0.5 text-xs">
            +{skills.length - 3}
          </Tag>
        )}
      </div>);
  };

  const SkeletonCard = () => (
    <Card className="h-full border border-gray-100 rounded-xl overflow-hidden bg-white shadow-md">
      <Skeleton avatar active paragraph={{ rows: 4 }} />
    </Card>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  const cardVariants = {
    initial: {
      scale: 1,
      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      y: 0
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
      y: -8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-6 md:mb-0">
                <Title level={2} className="text-white mb-2">CV Đã Lưu</Title>
                <Text className="text-blue-100 text-lg max-w-xl">
                  Quản lý danh sách CV ứng viên tiềm năng của bạn
                </Text>
              </div>

              <div className="flex items-center space-x-2">
                <span className="bg-blue-500/50 text-white px-4 py-2 rounded-lg flex items-center">
                  <FileTextOutlined className="mr-2" />
                  {filteredCVs.length} CV
                </span>
              </div>
            </div>

            <div className="mt-6 relative max-w-2xl">
              <Input
                placeholder="Tìm kiếm theo tên CV, tên ứng viên, email hoặc số điện thoại..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={handleSearch}
                className="py-3 pl-10 pr-4 rounded-xl shadow-lg border-0 text-base text-gray-800 bg-white"
                size="large"
                allowClear
              />
            </div>
          </div>
        </motion.div>

        {loading ? (
          <Row gutter={[24, 24]}>
            {[...Array(6)].map((_, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <SkeletonCard />
              </Col>
            ))}
          </Row>
        ) : filteredCVs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-10 text-center shadow-md"
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              imageStyle={{ height: 80 }}
              description={
                <span className="text-gray-700 text-lg font-medium">
                  {searchKeyword
                    ? "Không tìm thấy CV nào phù hợp với từ khóa tìm kiếm"
                    : "Bạn chưa lưu CV nào"}
                </span>
              }
            >
              <Button
                type="primary"
                size="large"
                className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 rounded-lg h-12 px-8 font-medium shadow-md"
                onClick={() => navigate('/jobs')}
              >
                Tìm kiếm việc làm và ứng viên
              </Button>
            </Empty>
          </motion.div>
        ) : (
          <>
            <AnimatePresence>              <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Row gutter={[24, 24]}>
                {paginatedCVs.map((cv) => (
                  <Col xs={24} sm={12} md={8} key={cv.id}>
                    <motion.div
                      layout
                      className="h-full"
                      variants={cardVariants}
                      initial="initial"
                      whileHover="hover"
                    >
                      <Card
                        className="h-full overflow-hidden border border-gray-100 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02]"
                        styles={{
                          body: {
                            padding: '24px',
                          }
                        }}
                        actions={[
                          <Tooltip title="Xem trước CV" placement="top">
                            <div className="flex justify-center items-center">
                              <FileTextOutlined
                                key="preview"
                                onClick={() => handlePreviewCV(cv.id)}
                                className="text-blue-500 hover:text-blue-700 transition-all transform hover:scale-125 ease-out duration-300 p-1"
                              />
                            </div>
                          </Tooltip>,
                          <Popconfirm
                            title="Xóa khỏi danh sách lưu?"
                            description="Bạn có chắc chắn muốn xóa CV này khỏi danh sách đã lưu không?"
                            onConfirm={() => handleRemoveSavedCV(cv.id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            placement="top"
                          >
                            <div className="flex justify-center items-center">
                              <DeleteOutlined
                                key="delete"
                                className="text-gray-500 hover:text-red-500 transition-all transform hover:scale-125 ease-out duration-300 p-1"
                              />
                            </div>
                          </Popconfirm>
                        ]}
                      >
                        <div className="flex items-start mb-4">
                          <div className="flex-shrink-0">
                            <Avatar
                              size={64}
                              src={cv.info?.avatar}
                              icon={!cv.info?.avatar && <UserOutlined />}
                              className="border border-gray-200"
                              style={{
                                backgroundColor: cv.info?.avatar ? 'transparent' : '#1890ff',
                                backgroundImage: !cv.info?.avatar ? 'linear-gradient(to bottom right, #3b82f6, #4f46e5)' : 'none'
                              }}
                            />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <Title level={5} className="m-0 text-gray-800 truncate">
                              {cv.info?.fullName || 'Chưa có tên'}
                            </Title>
                            <Text className="text-gray-500 block truncate">
                              {cv.cvName || 'Chưa có tiêu đề CV'}
                            </Text>
                          </div>
                        </div>

                        <div className="space-y-3 mb-3">
                          <div className="flex items-center text-gray-700">
                            <MailOutlined className="mr-3 text-blue-600" />
                            <Text className="truncate" style={{ maxWidth: '100%' }}>
                              {cv.info?.email || 'Chưa có email'}
                            </Text>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <PhoneOutlined className="mr-3 text-blue-600" />
                            <Text>{cv.info?.phone || 'Chưa có số điện thoại'}</Text>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <CalendarOutlined className="mr-3 text-blue-600" />
                            <Text>{cv.updatedAt || 'Chưa có ngày cập nhật'}</Text>
                          </div>
                        </div>

                        {renderSkillTags(cv.skills)}

                        <div className="mt-5 pt-3 border-t border-gray-100 flex justify-between items-center">
                          <Text type="secondary" className="flex items-center">
                            <FileTextOutlined className="mr-2 flex-shrink-0" />
                            {`Template ${cv.templateId || '1'}`}
                          </Text>
                        </div>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
            </AnimatePresence>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-10 flex justify-center"
              >
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredCVs.length}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  pageSizeOptions={['8', '16', '24', '32']}
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
                />
              </motion.div>
            )}
          </>
        )}      </div>

      <Modal
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        style={{ top: 0 }}
        width="90%"
        footer={null}
        destroyOnClose
        className="cv-preview-modal"
        closeIcon={
          <div className="bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors">
            <span className="text-gray-700">&times;</span>
          </div>
        }
      >
        {loadingCV ? (
          <div className="flex flex-col justify-center items-center py-16">
            <Spin size="large" />
            <p className="mt-4 text-gray-600 animate-pulse">Đang tải CV...</p>
          </div>
        ) : previewCV ? (
          <div className="p-6 h-[90vh] overflow-hidden border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-500 pl-3">
                {previewCV.name}
                <span className="ml-2 text-sm font-normal text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                  Template {previewCV.templateId}
                </span>
              </h2>
            </div>
            <div className="h-[80vh] border rounded-lg shadow-inner overflow-hidden bg-white">
              <PDFViewer width="100%" height="100%" showToolbar>
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
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Empty
              description="Không có thông tin CV"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SavedCV;
