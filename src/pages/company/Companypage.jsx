import React, { useState, useEffect } from "react";
import { Pagination, Row, Col, Typography } from "antd";
import companyAPI from "../../api/company";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import styles from "./Companypage.module.css";
import BannerCompany from "./BannerCompany";
import SearchFilters from "./SearchFilters";
import CompanyCard from "./CompanyCard";

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [address, setAddress] = useState(undefined);
  const [industry, setIndustry] = useState(undefined);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [size] = useState(9);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSearchActive) {
          const response = await companyAPI.searchCompanies(
            search,
            address,
            industry,
            page - 1,
            size
          );
          setCompanies(response.data.data.content);
          setTotalElements(response.data.data.page.totalElements);
        } else {
          const response = await companyAPI.getAllCompanies(page - 1, size);
          setCompanies(response.data.data.content);
          setTotalElements(response.data.data.page.totalElements);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchData();
  }, [page, size, isSearchActive, searchTrigger, search, address, industry]);

  const handleCompanyClick = (id) => {
    navigate(`/companies/${id}`);
  };

  const handleSearch = () => {
    setPage(1);
    setIsSearchActive(true);
    setSearchTrigger(prev => prev + 1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setAddress(undefined);
    setIndustry(undefined);
    setPage(1);
    setIsSearchActive(false);
  };

  return (
    <div className={styles.container}>
      <Header />
      <div>
        <BannerCompany 
          title="Khám phá các công ty hàng đầu"
          description="Tìm kiếm và kết nối với các công ty hàng đầu trong nhiều lĩnh vực khác nhau."
        />

        <div className="container mx-auto px-4 mb-8">
          <SearchFilters
            search={search}
            setSearch={setSearch}
            address={address}
            setAddress={setAddress}
            industry={industry}
            setIndustry={setIndustry}
            handleSearch={handleSearch}
            handleClearSearch={handleClearSearch}
          />
        </div>

        <div className="container mx-auto px-4 mb-8">
          <Row gutter={[16, 24]}>
            {companies.map((company) => (
              <Col key={company.id} xs={24} sm={12} md={8}>
                <CompanyCard
                  id={company.id}
                  name={company.name}
                  avatar={company.avatar}
                  industry={company.industry}
                  location={company.address}
                  onClick={handleCompanyClick}
                />
              </Col>
            ))}
          </Row>
        </div>

        <div className="container mx-auto px-4 flex justify-center my-8">
          <Pagination
            current={page}
            total={totalElements}
            pageSize={size}
            onChange={(newPage) => {
              setPage(newPage);
            }}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
