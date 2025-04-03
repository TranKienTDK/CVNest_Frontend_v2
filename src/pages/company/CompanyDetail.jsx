// CompanyDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import companyAPI from "../../api/company";
import Header from "../../components/header/Header";
import { Typography } from "antd";
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

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        const response = await companyAPI.getDetailCompany(id);
        setCompany(response.data.data);
      } catch (error) {
        console.error("Error fetching company detail:", error);
      }
    };
    fetchCompanyDetail();
  }, [id]);

  if (!company) {
    return <div>Loading...</div>;
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
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;