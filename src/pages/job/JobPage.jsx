import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, LayoutList, ArrowDownUp, Loader2 } from "lucide-react";
import jobAPI from "../../api/job";
import skillAPI from "../../api/skill";
import Header from "../../components/header/Header";
import BannerJob from "./BannerJob";
import JobCard from "./JobCard";
import JobSearchFilters from "./JobSearchFilters";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [contract, setContract] = useState(undefined);
  const [jobType, setJobType] = useState(undefined);
  const [level, setLevel] = useState(undefined);
  const [experienceYear, setExperienceYear] = useState(undefined);
  const [salaryRange, setSalaryRange] = useState(undefined);
  const [skillIds, setSkillIds] = useState([]);
  const [skills, setSkills] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(9);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortOrder, setSortOrder] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillAPI.getAllSkills();
        setSkills(response.data.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (isSearchActive) {
          const response = await jobAPI.searchJobs(
            title,
            contract,
            jobType,
            level,
            experienceYear,
            salaryRange,
            skillIds,
            page - 1,
            size
          );
          
          let jobsData = response.data.data.content;
          
          if (sortOrder === "newest") {
          } else if (sortOrder === "oldest") {
            jobsData = [...jobsData].reverse();
          } else if (sortOrder === "highestPaid") {
            jobsData = [...jobsData].sort((a, b) => b.salary - a.salary);
          }
          
          setJobs(jobsData);
          setTotalJobs(response.data.data.page.totalElements);
        } else {
          const response = await jobAPI.getAllJobs(page - 1, size);
          
          let jobsData = response.data.data.content;
          
          if (sortOrder === "newest") {
          } else if (sortOrder === "oldest") {
            jobsData = [...jobsData].reverse();
          } else if (sortOrder === "highestPaid") {
            jobsData = [...jobsData].sort((a, b) => b.salary - a.salary);
          }
          
          setJobs(jobsData);
          setTotalJobs(response.data.data.page.totalElements);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, size, isSearchActive, searchTrigger, title, contract, jobType, level, experienceYear, salaryRange, skillIds, sortOrder]);

  const handleSearch = async () => {
    setPage(1);
    setIsSearchActive(true);
    setSearchTrigger(prev => prev + 1);
  };

  const handleClearSearch = async () => {
    setTitle("");
    setContract(undefined);
    setJobType(undefined);
    setLevel(undefined);
    setExperienceYear(undefined);
    setSalaryRange(undefined);
    setSkillIds([]);
    setPage(1);
    setIsSearchActive(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };
  
  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Banner section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <BannerJob 
          title="Khám phá cơ hội nghề nghiệp hấp dẫn"
          description="Tìm kiếm và kết nối với các công ty tuyển dụng hàng đầu. Khám phá các công việc phù hợp với kỹ năng và đam mê của bạn!"
        />
        
        {/* Search filters */}
        <div className="mb-8">
          <JobSearchFilters 
            title={title}
            setTitle={setTitle}
            contract={contract}
            setContract={setContract}
            jobType={jobType}
            setJobType={setJobType}
            level={level}
            setLevel={setLevel}
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
            skillIds={skillIds}
            setSkillIds={setSkillIds}
            skills={skills}
            handleSearch={handleSearch}
            handleClearSearch={handleClearSearch}
          />
        </div>
        
        {/* Jobs section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isSearchActive ? "Kết quả tìm kiếm" : "Việc làm mới nhất"}
              </h2>
              <p className="text-gray-500">
                Tìm thấy {totalJobs} công việc phù hợp
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid size={16} className="mr-1" />
                  <span className="text-sm">Grid</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList size={16} className="mr-1" />
                  <span className="text-sm">List</span>
                </Button>
              </div>
              
              {/* Sort dropdown */}
              <div className="relative group">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-lg border-gray-200 gap-2"
                  onClick={() => document.getElementById('sortMenu').classList.toggle('hidden')}
                >
                  <ArrowDownUp size={14} />
                  <span>
                    {sortOrder === 'newest' && 'Mới nhất'}
                    {sortOrder === 'oldest' && 'Cũ nhất'}
                    {sortOrder === 'highestPaid' && 'Lương cao nhất'}
                  </span>
                </Button>
                
                <div 
                  id="sortMenu"
                  className="hidden absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-20"
                >
                  <button 
                    className={`w-full text-left px-4 py-2 text-sm ${sortOrder === 'newest' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => {
                      handleSortChange('newest');
                      document.getElementById('sortMenu').classList.add('hidden');
                    }}
                  >
                    Mới nhất
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 text-sm ${sortOrder === 'oldest' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => {
                      handleSortChange('oldest');
                      document.getElementById('sortMenu').classList.add('hidden');
                    }}
                  >
                    Cũ nhất
                  </button>
                  <button 
                    className={`w-full text-left px-4 py-2 text-sm ${sortOrder === 'highestPaid' ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => {
                      handleSortChange('highestPaid');
                      document.getElementById('sortMenu').classList.add('hidden');
                    }}
                  >
                    Lương cao nhất
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading indicator */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={36} className="animate-spin text-red-500 opacity-70" />
              <span className="ml-3 text-gray-500 text-lg">Đang tải việc làm...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy việc làm</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Không có công việc nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại với các bộ lọc khác.
              </p>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  layout
                >
                  <JobCard
                    id={job.id}
                    title={job.title}
                    level={job.level}
                    salary={job.salary}
                    company={job.companyName}
                    companyId={job.companyId}
                    location={job.companyCity}
                    jobType={job.type}
                    contract={job.contract}
                    skills={job.skills ? job.skills.map(s => s.name) : []}
                    logo={job.companyLogo}
                    onClick={handleJobClick}
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {!isLoading && jobs.length > 0 && (
            <div className="flex justify-center mt-10">
              <Pagination
                current={page}
                pageSize={size}
                total={totalJobs}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper
                className="custom-pagination-red"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPage;
