import React, { useState, useEffect } from "react";
import { Input, Button, Typography, Card, Row, Col, Pagination } from "antd";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FilterXIcon, Search } from "lucide-react";
import jobAPI from "../../api/job";
import skillAPI from "../../api/skill";
import Header from "../../components/header/Header";
import styles from "../company/Companypage.module.css";

const { Title, Paragraph } = Typography;

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState(""); // Updated from 'name' to 'title'
  const [contract, setContract] = useState(undefined);
  const [jobType, setJobType] = useState(undefined);
  const [level, setLevel] = useState(undefined);
  const [experienceYear, setExperienceYear] = useState(undefined);
  const [salaryRange, setSalaryRange] = useState(undefined);
  const [skillIds, setSkillIds] = useState([]);
  const [skills, setSkills] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(9);
  const [isSearching, setIsSearching] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0); // Total number of jobs
  const [totalPages, setTotalPages] = useState(1); // Total number of pages

  // Fetch all skills when the component mounts
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
        let response;
        if (isSearching) {
          // Call searchJobs API when searching
          response = await jobAPI.searchJobs(
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
        } else {
          // Call getAllJobs API when not searching
          response = await jobAPI.getAllJobs(page - 1, size);
        }

        // Update jobs, totalJobs, and totalPages based on the response
        setJobs(response.data.data.content);
        setTotalJobs(response.data.data.page.totalElements); // Update total jobs
        setTotalPages(response.data.data.page.totalPages); // Update total pages
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [
    title,
    contract,
    jobType,
    level,
    experienceYear,
    salaryRange,
    skillIds,
    page,
    size,
    isSearching,
  ]);

  const handleSearch = () => {
    setIsSearching(true);
    setPage(1);
  };

  const handleSkillSelection = (skillId) => {
    setSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleClearSearch = () => {
    setTitle("");
    setContract(undefined); // Reset to empty string to show placeholder
    setJobType(undefined);
    setLevel(undefined);
    setExperienceYear(undefined);
    setSalaryRange(undefined);
    setSkillIds([]);
    setIsSearching(false);
    setPage(1);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div style={{ paddingTop: "80px" }}>
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
              value={title} // Updated from 'search' to 'title'
              onChange={(e) => setTitle(e.target.value)} // Updated from 'setSearch' to 'setTitle'
              style={{ width: "30%", marginRight: "10px" }}
            />
            <Select onValueChange={(value) => setContract(value)}>
              <SelectTrigger className="w-1/5 mr-2">
                <SelectValue placeholder="Chọn loại hợp đồng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL_TIME">Fulltime</SelectItem>
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="FREELANCE">Freelance</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setJobType(value)}>
              <SelectTrigger className="w-1/5 mr-2">
                <SelectValue placeholder="Chọn loại công việc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IN_OFFICE">In Office</SelectItem>
                <SelectItem value="REMOTE">Remote</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setLevel(value)}>
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
            <Select onValueChange={(value) => setSalaryRange(value)}>
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
            <Select>
              <SelectTrigger className="w-1/5 mr-2">
                <SelectValue placeholder="Chọn kỹ năng" />
              </SelectTrigger>
              <SelectContent className="absolute top-full">
                {skills.map((skill) => (
                  <SelectItem
                    key={skill.id}
                    value={skill.id}
                    onClick={() => handleSkillSelection(skill.id)}
                  >
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            total={totalJobs} // Dynamically updated total jobs
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default JobPage;
