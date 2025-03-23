  import React, { useState, useEffect } from "react";
  import { Input, Select, Button, Pagination, Card, Row, Col, Typography } from "antd";
  import companyAPI from "../../api/company"; // API lấy danh sách công ty
  import { useNavigate } from "react-router-dom";
  import Header from "../../components/header/Header"; // Import Header
  import styles from "./CompanyPage.module.css";

  const { Option } = Select;
  const { Title, Paragraph } = Typography;

  const CompanyPage = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [address, setAddress] = useState(undefined);
    const [industry, setIndustry] = useState(undefined);
    const [page, setPage] = useState(1); // Bắt đầu từ trang 1
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [size] = useState(6); // Mặc định 6 công ty mỗi trang
    const [isSearching, setIsSearching] = useState(false); // Xác định trạng thái tìm kiếm
    const navigate = useNavigate();

    // Lấy danh sách công ty từ API (không tìm kiếm)
    useEffect(() => {
      if (!isSearching) {
        const fetchCompanies = async () => {
          try {
            const response = await companyAPI.getAllCompanies(page - 1, size);
            setCompanies(response.data.data.content);
            setTotalPages(response.data.data.page.totalPages);
            setTotalElements(response.data.data.page.totalElements);
          } catch (error) {
            console.error("Error fetching companies:", error);
          }
        };

        fetchCompanies();
      }
    }, [page, size, isSearching]);

    // Tìm kiếm công ty từ API
    useEffect(() => {
      if (isSearching) {
        const searchCompanies = async () => {
          try {
            const response = await companyAPI.searchCompanies(search, address, industry, page - 1, size);
            setCompanies(response.data.data.content);
            setTotalPages(response.data.data.page.totalPages);
            setTotalElements(response.data.data.page.totalElements);
          } catch (error) {
            console.error("Error searching companies:", error);
          }
        };

        searchCompanies();
      }
    }, [search, address, industry, page, size, isSearching]);

    // Xử lý khi người dùng nhấn vào công ty
    const handleCompanyClick = (id) => {
      navigate(`/companies/${id}`);
    };

    // Xử lý tìm kiếm
    const handleSearch = () => {
      setIsSearching(true);
      setPage(1); // Reset về trang 1 khi tìm kiếm mới
    };

    // Xử lý khi người dùng nhấn nút "Xóa tìm kiếm"
    const handleClearSearch = () => {
      setSearch("");
      setAddress(undefined);
      setIndustry(undefined);
      setIsSearching(false);
      setPage(1); // Reset về trang 1
    };

    return (
      <div className={styles.container}>
        {/* Header */}
        <Header />

        {/* Thêm khoảng trống để tránh nội dung bị che */}
        <div style={{ paddingTop: "80px" }}>
          {/* Phần giới thiệu */}
          <div className={styles.introSection}>
            <Title level={2} className={styles.introTitle}>
              Khám phá các công ty hàng đầu
            </Title>
            <Paragraph className={styles.introText}>
              Tìm kiếm và kết nối với các công ty hàng đầu trong nhiều lĩnh vực khác nhau. Hãy khám phá cơ hội nghề nghiệp phù hợp với bạn!
            </Paragraph>
          </div>

          {/* Phần tìm kiếm */}
          <div className={styles.searchSection}>
            <Title level={3} className={styles.title}>
              Tìm kiếm Công ty
            </Title>
            <div className={styles.searchBox}>
              <Input
                placeholder="Nhập tên công ty"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "30%", marginRight: "10px" }}
              />
              <Select
                placeholder="Chọn địa chỉ"
                value={address}
                onChange={(value) => setAddress(value)}
                style={{ width: "20%", marginRight: "10px" }}
                allowClear
              >
                <Option value="Ha Noi">Hà Nội</Option>
                <Option value="TP HCM">TP HCM</Option>
                <Option value="Da Nang">Đà Nẵng</Option>
              </Select>
              <Select
                placeholder="Chọn lĩnh vực"
                value={industry}
                onChange={(value) => setIndustry(value)}
                style={{ width: "20%", marginRight: "10px" }}
                allowClear
              >
                <Option value="IT">Công nghệ</Option>
                <Option value="BANK">Ngân hàng</Option>
                <Option value="INSURANCE">Bảo hiểm</Option>
                <Option value="E_COMMERCE">Thương mại điện tử</Option>
                <Option value="COMMUNICATION">Truyền thông</Option>
                <Option value="TOURISM">Du lịch</Option>
                <Option value="REAL_ESTATE">Bất động sản</Option>
                <Option value="OUTSOURCE">Outsource</Option>
                <Option value="FINTECH">Fintech</Option>
                <Option value="MANUFACTURING">Sản xuất</Option>
              </Select>
              <Button onClick={handleSearch} type="primary" style={{ marginRight: "10px" }}>
                Tìm kiếm
              </Button>
              <Button onClick={handleClearSearch} type="default">
                Xóa tìm kiếm
              </Button>
            </div>
          </div>

          {/* Danh sách công ty */}
          <Row gutter={[16, 16]} className={styles.companyList}>
            {companies.map((company) => (
              <Col key={company.id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  onClick={() => handleCompanyClick(company.id)}
                  className={styles.companyCard}
                >
                  <div className={styles.cardContent}>
                    <img alt={company.name} src={company.avatar} className={styles.companyImage} />
                    <div className={styles.cardText}>
                      <h3 className={styles.companyName}>{company.name}</h3>
                      <p className={styles.companyDescription}>{company.description}</p>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Phân trang */}
          <div className={styles.pagination}>
            <Pagination
              current={page}
              total={totalElements}
              pageSize={size}
              onChange={(page) => setPage(page)}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </div>
      </div>
    );
  };

  export default CompanyPage;