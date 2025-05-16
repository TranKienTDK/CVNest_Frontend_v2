import React, { useState, useEffect } from "react";
import { Pagination, Card, Row, Col, Typography } from "antd";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import companyAPI from "../../api/company";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import styles from "./Companypage.module.css";
import { Button } from "@/components/ui/button";
import { FilterIcon, FilterXIcon, Search, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const { Title, Paragraph } = Typography;

const CompanyPage = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [address, setAddress] = useState(undefined);
  const [industry, setIndustry] = useState(undefined);
  const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [size] = useState(9);
  // const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyAPI.getAllCompanies(0, size);
        setCompanies(response.data.data.content);
        setTotalElements(response.data.data.page.totalElements);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, [size]);

  const searchCompanies = async () => {
    try {
      const response = await companyAPI.searchCompanies(
        search,
        address,
        industry,
        page - 1,
        size
      );
      setCompanies(response.data.data.content);
      // setTotalPages(response.data.data.page.totalPages);
      setTotalElements(response.data.data.page.totalElements);
    } catch (error) {
      console.error("Error searching companies:", error);
    }
  };

  const handleCompanyClick = (id) => {
    navigate(`/companies/${id}`);
  };

  const handleSearch = async () => {
    try {
      const response = await companyAPI.searchCompanies(
        search,
        address,
        industry,
        page - 1,
        size
      );
      setCompanies(response.data.data.content);
      // setTotalPages(response.data.data.page.totalPages);
      setTotalElements(response.data.data.page.totalElements);
    } catch (error) {
      console.error("Error searching companies:", error);
    }
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setAddress(null);
    setIndustry(null);
    setPage(1);
    searchCompanies();
  };

  return (
    <div className={styles.container}>
      <Header />
      <div style={{ paddingTop: "80px" }}>
        <div className={styles.introSection}>
          <Title level={2} className={styles.introTitle}>
            Khám phá các công ty hàng đầu
          </Title>
          <Paragraph className={styles.introText}>
            Tìm kiếm và kết nối với các công ty hàng đầu trong nhiều lĩnh vực
            khác nhau.
          </Paragraph>
        </div>

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

            <Select onValueChange={setAddress} value={address}>
              <SelectTrigger className="w-[20%]">
                <SelectValue placeholder="Chọn địa chỉ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className={styles.selectItem} value="Hà Nội">
                  Hà Nội
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Hồ Chí Minh">
                  TP HCM
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Đà Nẵng">
                  Đà Nẵng
                </SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setIndustry} value={industry}>
              <SelectTrigger className="w-[20%]">
                <SelectValue placeholder="Chọn lĩnh vực" />
              </SelectTrigger>
              <SelectContent className={styles.selectContent}>
                <SelectItem className={styles.selectItem} value="Phần mềm">
                  Phần mềm
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Software">
                  Software
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Ngân hàng">
                  Ngân hàng
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Viễn thông">
                  Viễn thông
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Edtech">
                  Edtech
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Bất động sản">
                  Bất động sản
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Fintech">
                  Fintech
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Giáo dục">
                  Giáo dục
                </SelectItem>
                <SelectItem
                  className={styles.selectItem}
                  value="Thương mại điện tử"
                >
                  Thương mại điện tử
                </SelectItem>
                <SelectItem
                  className={styles.selectItem}
                  value="Gia công phần mềm"
                >
                  Gia công phần mềm
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Kinh doanh">
                  Kinh doanh
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Bảo hiểm">
                  Bảo hiểm
                </SelectItem>
                <SelectItem className={styles.selectItem} value="Game">
                  Game
                </SelectItem>
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
              className="bg-primaryRed font-bold hover:bg-primaryRed"
              onClick={handleClearSearch}
              type="default"
            >
              <FilterXIcon className="w-4 h-4 mr-2" />
              Xóa tìm kiếm
            </Button>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {companies.map((company) => (
            <Col key={company.id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                className={styles.companyCard}
                onClick={() => handleCompanyClick(company.id)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.cardContent}>
                  <img
                    alt={company.name}
                    src={company.avatar}
                    className={styles.companyImage}
                  />
                  <div className={styles.cardText}>
                    <h3 className={styles.companyName}>{company.name}</h3>
                    <p className={styles.companyIndustry}>
                      Lĩnh vực: {company.industry || "Không xác định"}
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className={styles.pagination}>
          <Pagination
            current={page}
            total={totalElements}
            pageSize={size}
            onChange={(page) => {
              setPage(page);
              searchCompanies();
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
