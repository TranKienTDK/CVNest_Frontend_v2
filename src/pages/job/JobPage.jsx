import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Card, Row, Col, Pagination } from "antd";
import { FilterXIcon, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import jobAPI from "../../api/job";
import skillAPI from "../../api/skill";
import Header from "../../components/header/Header";
import MultiSelect from "@/components/ui/MultiSelect";
import {  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem } from "@/components/ui/select";
import styles from "../company/Companypage.module.css";

const { Title, Paragraph } = Typography;

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
    const fetchJobs = async () => {
      try {
        const response = await jobAPI.getAllJobs(page - 1, size);
        setJobs(response.data.data.content);
        setTotalJobs(response.data.data.page.totalElements);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const searchJobs = async () => {
    try {
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
      setJobs(response.data.data.content);
      setTotalJobs(response.data.data.page.totalElements);
    } catch (error) {
      console.error("Error searching jobs:", error);
    }
  };

  const handleSearch = async () => {
    setPage(1);
    try {
      const response = await jobAPI.searchJobs(
        title,
        contract,
        jobType,
        level,
        experienceYear,
        salaryRange,
        skillIds,
        0, // Đặt lại trang về 0
        size
      );
      setJobs(response.data.data.content);
      setTotalJobs(response.data.data.page.totalElements);
    } catch (error) {
      console.error("Error searching jobs:", error);
    }
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
    
    try {
      const response = await jobAPI.getAllJobs(0, size);
      setJobs(response.data.data.content);
      setTotalJobs(response.data.data.page.totalElements);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
    searchJobs();
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div>
        <div className={styles.introSection}>
          <Title level={2} className={styles.introTitle}>
            Khám phá cơ hội nghề nghiệp hấp dẫn
          </Title>
          <Paragraph className={styles.introText}>
            Tìm kiếm và kết nối với các công ty tuyển dụng hàng đầu. Khám phá
            các công việc phù hợp với kỹ năng và đam mê của bạn!
          </Paragraph>
        </div>
        <div className={styles.searchSection}>
          <Title level={3} className={styles.title}>
            Tìm kiếm việc làm
          </Title>
          <div className={styles.searchBox}>
            <Input
              placeholder="Nhập tên việc làm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "30%", marginRight: "10px" }}
            />
            <Select
              onValueChange={(value) => setContract(value)}
              value={contract}
            >
              <SelectTrigger className="w-1/5 mr-2">
                <SelectValue placeholder="Chọn loại hợp đồng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL_TIME">Fulltime</SelectItem>
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setJobType(value)}
              value={jobType}
            >
              <SelectTrigger className="w-1/5 mr-2">
                <SelectValue placeholder="Chọn loại công việc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_OFFICE">In Office</SelectItem>
                <SelectItem value="REMOTE">Remote</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setLevel(value)}
              value={level}
            >
              <SelectTrigger className="w-1/5 mr-2">
                <SelectValue placeholder="Chọn cấp bậc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERN">Intern</SelectItem>
                <SelectItem value="FRESHHER">Fresher</SelectItem>
                <SelectItem value="MIDDLE">Middle</SelectItem>
                <SelectItem value="JUNIOR">Junior</SelectItem>
                <SelectItem value="SENIOR">Senior</SelectItem>
                <SelectItem value="LEADER">Trưởng nhóm</SelectItem>
                <SelectItem value="DEPARTMENT_LEADER">Trưởng phòng</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setSalaryRange(value)}
              value={salaryRange}
            >
              <SelectTrigger className="w-1/5 mr-2">
                <SelectValue placeholder="Chọn mức lương" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Từ 3.000.000 đ">Từ 3.000.000 đ</SelectItem>
                <SelectItem value="Từ 5.000.000 đ">Từ 5.000.000 đ</SelectItem>
                <SelectItem value="Từ 10.000.000 đ">Từ 10.000.000 đ</SelectItem>
                <SelectItem value="Từ 20.000.000 đ">Từ 20.000.000 đ</SelectItem>
                <SelectItem value="Từ 30.000.000 đ">Từ 30.000.000 đ</SelectItem>
                <SelectItem value="Từ 50.000.000 đ">Từ 50.000.000 đ</SelectItem>
              </SelectContent>
            </Select>
            <MultiSelect
              skills={skills}
              selectedSkills={skillIds}
              onChange={setSkillIds}
            />
            <Button
              className="bg-primaryRed font-bold hover:bg-primaryRed"
              onClick={handleSearch}
              type="primary"
              style={{ marginRight: "10px" }}
            >
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
            <Button
              className="bg-primaryRed font-bold hover:bg-primaryRed text-white"
              onClick={handleClearSearch}
              type="default"
            >
              <FilterXIcon className="w-4 h-4 mr-2" />
              Xóa tìm kiếm
            </Button>
          </div>
        </div>
        <div className={styles.jobList}>
          <Row gutter={[16, 16]}>
            {jobs.map((job) => (
              <Col key={job.id} xs={24} sm={12} md={8}>
                <Card
                  title={job.title}
                  variant="outlined"
                  hoverable
                  className={styles.jobCard}
                  onClick={() => handleJobClick(job.id)}
                  style={{ cursor: "pointer" }}
                >
                  <p>
                    <strong>Cấp bậc:</strong> {job.level}
                  </p>
                  <p>
                    <strong>Lương:</strong>{" "}
                    {job.salary
                      ? `${job.salary.toLocaleString()} đ`
                      : "Thỏa thuận"}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        <div className={styles.pagination}>
          <Pagination
            current={page}
            pageSize={size}
            total={totalJobs}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      </div>
    </div>
  );
};

export default JobPage;
