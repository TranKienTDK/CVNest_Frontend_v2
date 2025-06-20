import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ArrowUpRight,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import recommendApi from "../../../api/recommend";
import companyAPI from "../../../api/company";
import { getUserData } from "../../../helper/storage";
import { ROUTES } from "../../../routes/routes";
import Header from "../../../components/header/Header";
import JobRecommendDetailsModal from "./JobRecommendDetailsModal";

const RecommendedJobs = () => {  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companiesCache, setCompaniesCache] = useState({});
  const [showAll, setShowAll] = useState(false); // State để control hiển thị
  
  // States cho modal chi tiết đánh giá
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [recommendDetails, setRecommendDetails] = useState(null);
  
  const navigate = useNavigate();
  const userData = getUserData();

  const INITIAL_JOBS_COUNT = 10;

  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  const fetchRecommendedJobs = async () => {
    try {
      setLoading(true);
      if (!userData?.id) {
        message.error("Vui lòng đăng nhập để xem việc làm được đề xuất");
        return;
      }

      const response = await recommendApi.getRecommendedJobs(userData.id);
      const jobsData = response.data.data || [];
      setJobs(jobsData);
      const companyIds = [...new Set(jobsData.map(job => job.companyId))];
      
      const companyPromises = companyIds.map(async (companyId) => {
        try {
          const companyResponse = await companyAPI.getDetailCompany(companyId);
          return { id: companyId, data: companyResponse.data.data };
        } catch (error) {
          console.error("Error fetching company:", error);
          return { id: companyId, data: null };
        }
      });

      const companiesData = await Promise.all(companyPromises);
      const companiesMap = {};
      companiesData.forEach(({ id, data }) => {
        companiesMap[id] = data;
      });
      setCompaniesCache(companiesMap);
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
      message.error("Không thể tải danh sách việc làm được đề xuất");
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    return new Intl.NumberFormat("vi-VN").format(salary) + " VNĐ";
  };

  const getContractLabel = (contract) => {
    const contractMap = {
      FULL_TIME: "Toàn thời gian",
      PART_TIME: "Bán thời gian",
      INTERNSHIP: "Thực tập",
      FREELANCE: "Freelance",
    };
    return contractMap[contract] || contract;
  };

  const getJobTypeLabel = (jobType) => {
    const jobTypeMap = {
      REMOTE: "Từ xa",
      IN_OFFICE: "Tại văn phòng",
      HYBRID: "Lai",
    };
    return jobTypeMap[jobType] || jobType;
  };

  const getLevelLabel = (level) => {
    const levelMap = {
      INTERN: "Thực tập sinh",
      JUNIOR: "Nhân viên",
      MIDDLE: "Nhân viên senior",
      SENIOR: "Chuyên gia",
      LEADER: "Trưởng nhóm",
      MANAGER: "Quản lý",
    };
    return levelMap[level] || level;
  };  const handleJobClick = (jobId) => {
    navigate(ROUTES.JOB_DETAIL.replace(":id", jobId));
  };

  const handleShowRecommendDetails = async (jobId) => {
    try {
      setModalLoading(true);
      setModalOpen(true);
      
      if (!userData?.id) {
        message.error("Vui lòng đăng nhập để xem chi tiết đánh giá");
        setModalOpen(false);
        return;
      }

      const response = await recommendApi.getJobRecommendDetails(userData.id, jobId);
      setRecommendDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching recommend details:", error);
      message.error("Không thể tải chi tiết đánh giá. Vui lòng thử lại!");
      setModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRecommendDetails(null);
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDisplayedJobs = () => {
    if (showAll) {
      return jobs;
    }
    return jobs.slice(0, INITIAL_JOBS_COUNT);
  };

  const displayedJobs = getDisplayedJobs();
  const hasMoreJobs = jobs.length > INITIAL_JOBS_COUNT;  const JobCard = ({ job }) => {
    const company = companiesCache[job.companyId];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -2 }}
        className="mb-6"
      >
        <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer"
              onClick={() => handleJobClick(job.id)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">              {/* Company Logo */}
              <div className="flex-shrink-0">
                <img
                  src={company?.logo || company?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (company?.name || job.companyId || "company")}
                  alt={company?.name || "Company"}
                  className="w-16 h-16 rounded-lg object-cover border"
                  onError={(e) => {
                    e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (company?.name || job.companyId || "company");
                  }}
                />
              </div>

              {/* Job Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {company?.name || "Đang cập nhật"}
                    </p>                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(job.id);
                      }}
                      className="flex items-center gap-2"
                    >
                      Xem chi tiết
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowRecommendDetails(job.id);
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Xem đánh giá
                    </Button>
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      {formatSalary(job.salary)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="text-sm">{getLevelLabel(job.level)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{getContractLabel(job.contract)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{getJobTypeLabel(job.jobType)}</span>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skillNames?.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Job Dates */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      Từ {new Date(job.startDate).toLocaleDateString("vi-VN")} đến{" "}
                      {new Date(job.endDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs">Kinh nghiệm: {job.experienceYear}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Đang tải việc làm được đề xuất...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Việc làm được đề xuất cho bạn
            </h1>
          </div>          <p className="text-gray-600 text-lg">
            Dựa trên hồ sơ và kỹ năng của bạn, chúng tôi đề xuất {jobs.length} công việc phù hợp
            {hasMoreJobs && !showAll && (
              <span className="text-blue-600 font-medium"> (Hiển thị {INITIAL_JOBS_COUNT} đầu tiên)</span>
            )}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{jobs.length}</div>
            <div className="text-gray-600">Việc làm phù hợp</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {[...new Set(jobs.map(job => job.companyId))].length}
            </div>
            <div className="text-gray-600">Công ty</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {[...new Set(jobs.flatMap(job => job.skillNames || []))].length}
            </div>
            <div className="text-gray-600">Kỹ năng</div>
          </Card>
        </motion.div>        {/* Jobs List */}
        <div className="max-w-4xl mx-auto">
          {jobs.length > 0 ? (
            <>
              {displayedJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
              
              {/* Show More / Show Less Button */}
              {hasMoreJobs && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mt-8"
                >
                  {!showAll ? (
                    <Button
                      onClick={handleShowMore}
                      variant="outline"
                      size="lg"
                      className="bg-white hover:bg-blue-50 border-blue-300 text-blue-600 hover:text-blue-700 font-medium px-8 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      Hiển thị thêm {jobs.length - INITIAL_JOBS_COUNT} việc làm
                      <ArrowUpRight className="w-4 h-4 ml-2 rotate-90" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleShowLess}
                      variant="outline"
                      size="lg"
                      className="bg-white hover:bg-gray-50 border-gray-300 text-gray-600 hover:text-gray-700 font-medium px-8 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      Thu gọn
                      <ArrowUpRight className="w-4 h-4 ml-2 rotate-[-90deg]" />
                    </Button>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chưa có việc làm được đề xuất
              </h3>
              <p className="text-gray-600 mb-6">
                Hãy cập nhật hồ sơ và kỹ năng của bạn để nhận được những đề xuất phù hợp nhất
              </p>
              <Button onClick={() => navigate(ROUTES.PROFILE)}>
                Cập nhật hồ sơ
              </Button>
            </motion.div>
          )}        </div>
      </div>
      
      {/* Modal chi tiết đánh giá */}
      <JobRecommendDetailsModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        recommendDetails={recommendDetails}
        loading={modalLoading}
      />
    </div>
  );
};

export default RecommendedJobs;
