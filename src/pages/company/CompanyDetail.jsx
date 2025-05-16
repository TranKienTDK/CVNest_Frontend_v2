// CompanyDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import companyAPI from "../../api/company";
import jobAPI from "../../api/job";
import Header from "../../components/header/Header";
import { Typography, Card, Row, Col, Tag, Button, Divider, Empty, Spin } from "antd";
import { ClockCircleOutlined, EnvironmentOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import styles from "./CompanyDetail.module.css";

const { Title, Paragraph } = Typography;

// Helper function to parse description into sections
const parseDescription = (description) => {
    const lines = description.split("\n").filter((line) => line.trim() !== "");
    const sections = [];
    let currentSection = { title: "", content: [] };
    const seenLines = new Set(); // To track unique lines
  
    lines.forEach((line) => {
      if (line === "Về chúng tôi" || line === "Chế độ đãi ngộ") {
        if (currentSection.title) {
          sections.push(currentSection);
        }
        currentSection = { title: line, content: [] };
      } else if (!seenLines.has(line)) {
        // Add line only if it's not already seen
        currentSection.content.push(line);
        seenLines.add(line);
      }
    });
  
    if (currentSection.title) {
      sections.push(currentSection);
    }
  
    return sections;
  };

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        setLoading(true);
        const response = await companyAPI.getDetailCompany(id);
        setCompany(response.data.data);
      } catch (error) {
        console.error("Error fetching company detail:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCompanyJobs = async () => {
      try {
        setJobsLoading(true);
        const response = await jobAPI.getJobsByCompany(id);
        setJobs(response.data.data || []);
      } catch (error) {
        console.error("Error fetching company jobs:", error);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchCompanyDetail();
    fetchCompanyJobs();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <Spin size="large" />
            <p>Đang tải thông tin công ty...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!company) {
    return (
      <div className={styles.pageWrapper}>
        <Header />
        <div className={styles.container}>
          <Empty description="Không tìm thấy thông tin công ty" />
        </div>
      </div>
    );
  }

  const descriptionSections = parseDescription(company.description);

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.container}>
        <div className={styles.detailContent}>
          <div className={styles.companyHeader}>
            <div className={styles.avatarWrapper}>
              <img
                src={company.avatar}
                alt={company.name}
                className={styles.companyAvatar}
              />
            </div>
            <div className={styles.infoWrapper}>
              <Title level={2} className={styles.companyName}>
                {company.name}
              </Title>
              <Paragraph>
                <strong>Industry:</strong> {company.industry}
              </Paragraph>
              <Paragraph>
                <strong>Address:</strong> {company.address}
              </Paragraph>
              <Paragraph>
                <strong>Website:</strong>{" "}
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  {company.website}
                </a>
              </Paragraph>
            </div>
          </div>
          <div className={styles.descriptionSection}>
            {descriptionSections.map((section, index) => (
              <div key={index} className={styles.descriptionBlock}>
                <Title level={4} className={styles.sectionTitle}>
                  {section.title}
                </Title>
                <Paragraph className={styles.descriptionContent}>
                  {section.content.join("\n")}
                </Paragraph>
              </div>
            ))}
          </div>

          <Divider orientation="left">
            <Title level={3}>Danh sách vị trí đang tuyển dụng</Title>
          </Divider>

          <div className={styles.jobsSection}>
            {jobsLoading ? (
              <div className={styles.loadingContainer}>
                <Spin size="default" />
                <p>Đang tải danh sách việc làm...</p>
              </div>
            ) : jobs.length > 0 ? (
              <>
                <Row gutter={[24, 24]}>
                  {jobs.map((job) => (
                    <Col xs={24} sm={12} lg={8} key={job.id}>
                      <Link to={`/jobs/${job.id}`} className={styles.jobCardLink}>
                        <Card 
                          hoverable 
                          className={styles.jobCard}
                          cover={
                            <div className={styles.jobCardHeader}>
                              <img 
                                src={company.avatar} 
                                alt={company.name}
                                className={styles.jobCardLogo} 
                              />
                            </div>
                          }
                        >
                          <div className={styles.jobCardContent}>
                            <h3 className={styles.jobTitle}>{job.title}</h3>
                            
                            <div className={styles.jobSalary}>
                              <DollarOutlined />
                              <span>{job.salary ? `${(job.salary).toLocaleString()} VND` : 'Thỏa thuận'}</span>
                            </div>
                            
                            <div className={styles.jobMeta}>
                              <div className={styles.jobMetaItem}>
                                <ClockCircleOutlined />
                                <span>{job.contract === 'FULL_TIME' ? 'Toàn thời gian' : 
                                      job.contract === 'PART_TIME' ? 'Bán thời gian' : 'Freelance'}</span>
                              </div>
                              
                              <div className={styles.jobMetaItem}>
                                <TeamOutlined />
                                <span>{job.level === 'INTERN' ? 'Thực tập sinh' : 
                                      job.level === 'FRESHHER' ? 'Fresher' : 
                                      job.level === 'JUNIOR' ? 'Junior' :
                                      job.level === 'MIDDLE' ? 'Middle' : 
                                      job.level === 'SENIOR' ? 'Senior' : 
                                      job.level === 'LEADER' ? 'Trưởng nhóm' : 'Trưởng phòng'}</span>
                              </div>
                              
                              <div className={styles.jobMetaItem}>
                                <EnvironmentOutlined />
                                <span>{job.jobType === 'REMOTE' ? 'Làm việc từ xa' : 
                                      job.jobType === 'IN_OFFICE' ? 'Làm việc tại văn phòng' : 
                                      job.jobType === 'HYBRID' ? 'Kết hợp' : 'Linh hoạt'}</span>
                              </div>
                              
                              {job.experienceYear && (
                                <div className={styles.jobMetaItem}>
                                  <ClockCircleOutlined />
                                  <span>{job.experienceYear}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className={styles.jobSkills}>
                              {job.skillNames?.slice(0, 3).map((skill, index) => (
                                <Tag key={index} color="blue">{skill}</Tag>
                              ))}
                              {job.skillNames?.length > 3 && <Tag color="default">+{job.skillNames.length - 3}</Tag>}
                              
                              {!job.skillNames?.length && job.description && (
                                <Tag color="blue">Azure</Tag>
                              )}
                              
                              <Tag className={job.active ? styles.activeTag : styles.inactiveTag}>
                                {job.active ? 'Đang tuyển' : 'Đã đóng'}
                              </Tag>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              <Empty 
                description="Công ty hiện không có vị trí tuyển dụng nào" 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;