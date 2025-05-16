import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header.jsx";
import { Eye, Filter, Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Tag, Input, Select, Empty, Spin, Modal } from "antd";
import applyAPI from "@/api/apply";
import { getUserData } from "@/helper/storage";
import { toast } from "react-toastify";
import cvAPI from "@/api/cv";
import jobAPI from "@/api/job";
import { PDFViewer } from "@react-pdf/renderer";
import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import TemplateCV2 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV2";
import TemplateCV3 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV3";
import TemplateCV4 from "@/pages/user/my-cv/components/CVTemplate/TemplateCV4";
import sampleDataCV4 from "@/pages/user/my-cv/components/CVTemplate/sampleDataCV4";

function ApplicationsManagement() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [jobDetails, setJobDetails] = useState({});
    const [cvDetails, setCvDetails] = useState({});
    const [filters, setFilters] = useState({
        status: "ALL"
    });
    const [searchText, setSearchText] = useState("");
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewCV, setPreviewCV] = useState(null);
    
    const navigate = useNavigate();
    const userData = getUserData();
    
    // Fetch applications data
    useEffect(() => {
        const fetchApplications = async () => {
            if (!userData?.id) return;
            
            setLoading(true);
            try {
                const response = await applyAPI.getUserApplications(userData.id);
                
                if (response.data?.data) {
                    const applicationsData = response.data.data || [];
                    setApplications(applicationsData);
                    
                    // Fetch job and CV details for each application
                    await fetchAssociatedData(applicationsData);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
                toast.error("Không thể tải danh sách CV ứng tuyển. Vui lòng thử lại sau.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [userData?.id]);

    // Fetch associated job and CV data for each application
    const fetchAssociatedData = async (applications) => {
        const jobPromises = applications.map(app => 
            jobAPI.getJobDetail(app.jobId)
                .then(res => {
                    setJobDetails(prev => ({
                        ...prev,
                        [app.jobId]: res.data?.data
                    }));
                })
                .catch(err => console.error(`Error fetching job ${app.jobId}:`, err))
        );
        
        const cvPromises = applications.map(app => 
            cvAPI.getDetailCv(app.cvId)
                .then(res => {
                    setCvDetails(prev => ({
                        ...prev,
                        [app.cvId]: res.data?.data
                    }));
                })
                .catch(err => console.error(`Error fetching CV ${app.cvId}:`, err))
        );
        
        await Promise.all([...jobPromises, ...cvPromises]);
    };
    
    // Format date to readable format
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };
    
    // Get status tag with color
    const getStatusTag = (status) => {
        switch (status) {
            case "PENDING":
                return <Tag icon={<Clock className="h-3 w-3" />} color="warning">Đang chờ</Tag>;
            case "APPROVED":
                return <Tag icon={<CheckCircle className="h-3 w-3" />} color="success">Đã duyệt</Tag>;
            case "REJECTED":
                return <Tag icon={<XCircle className="h-3 w-3" />} color="error">Từ chối</Tag>;
            default:
                return <Tag color="default">Unknown</Tag>;
        }
    };
    
    // Filter applications by status
    const handleStatusChange = (value) => {
        setFilters(prev => ({ ...prev, status: value }));
    };
    
    // Handle search change
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };
    
    // Filter and search applications
    const filteredApplications = applications.filter(app => {
        const job = jobDetails[app.jobId];
        
        // Filter by status
        const statusMatch = filters.status === "ALL" || app.status === filters.status;
        
        // Filter by search text
        const searchMatch = !searchText || (
            job && job.title && job.title.toLowerCase().includes(searchText.toLowerCase())
        );
        
        return statusMatch && searchMatch;
    });

    // View job details
    const viewJobDetails = (jobId) => {
        navigate(`/jobs/${jobId}`);
    };
    
    // Preview CV
    const handlePreviewCV = (cvId) => {
        const cv = cvDetails[cvId];
        if (cv) {
            setPreviewCV(cv);
            setShowPreviewModal(true);
        } else {
            toast.error("Không thể tải thông tin CV. Vui lòng thử lại sau.");
        }
    };

    return (
        <div>
            <Header />
            <div className="w-full max-w-5xl mx-auto mt-20">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý CV ứng tuyển</h1>
                </div>

                {/* Filters and search */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4 text-gray-500" />
                        <span className="mr-2 text-sm text-gray-600">Trạng thái:</span>
                        <Select 
                            defaultValue="ALL"
                            style={{ width: 120 }}
                            onChange={handleStatusChange}
                            options={[
                                { value: 'ALL', label: 'Tất cả' },
                                { value: 'PENDING', label: 'Đang chờ' },
                                { value: 'APPROVED', label: 'Đã duyệt' },
                                { value: 'REJECTED', label: 'Từ chối' },
                            ]}
                        />
                    </div>
                    
                    <div className="flex-1">
                        <Input 
                            placeholder="Tìm kiếm theo tên công việc..."
                            prefix={<Search className="h-4 w-4 text-gray-400" />}
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        {filteredApplications.length > 0 ? (
                            <div className="border rounded-md overflow-hidden">
                                {/* Header */}
                                <div className="grid grid-cols-12 bg-gray-100 text-sm font-semibold text-gray-700">
                                    <div className="col-span-4 py-3 px-4 border-r">Vị trí ứng tuyển</div>
                                    <div className="col-span-2 py-3 px-4 border-r">CV sử dụng</div>
                                    <div className="col-span-2 py-3 px-4 border-r">Ngày ứng tuyển</div>
                                    <div className="col-span-2 py-3 px-4 border-r">Trạng thái</div>
                                    <div className="col-span-2 py-3 px-4">Thao tác</div>
                                </div>

                                {/* Row content */}
                                {filteredApplications.map((application) => (
                                    <div key={application.id} className="grid grid-cols-12 items-center text-sm border-t py-4">
                                        {/* Vị trí ứng tuyển */}
                                        <div className="col-span-4 px-4">
                                            <div className="font-medium">
                                                {jobDetails[application.jobId]?.title || "Đang tải..."}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {jobDetails[application.jobId]?.company?.name || ""}
                                            </div>
                                        </div>

                                        {/* CV sử dụng */}
                                        <div className="col-span-2 px-4">
                                            {cvDetails[application.cvId]?.cvName || "Đang tải..."}
                                        </div>

                                        {/* Ngày ứng tuyển */}
                                        <div className="col-span-2 px-4 text-gray-600">
                                            {formatDate(application.appliedAt)}
                                        </div>

                                        {/* Trạng thái */}
                                        <div className="col-span-2 px-4">
                                            {getStatusTag(application.status)}
                                        </div>

                                        {/* Thao tác */}
                                        <div className="col-span-2 px-4 flex gap-3">
                                            <Button 
                                                size="small"
                                                onClick={() => viewJobDetails(application.jobId)}
                                                className="flex items-center"
                                            >
                                                <Eye className="mr-1 h-3 w-3" /> Job
                                            </Button>
                                            <Button 
                                                size="small"
                                                onClick={() => handlePreviewCV(application.cvId)}
                                                className="flex items-center"
                                            >
                                                <Eye className="mr-1 h-3 w-3" /> CV
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border rounded-md p-8 flex flex-col items-center justify-center">
                                <Empty 
                                    description="Không tìm thấy CV ứng tuyển nào" 
                                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                />
                                <Button 
                                    type="primary" 
                                    onClick={() => navigate('/viec-lam-it')}
                                    className="mt-4 bg-blue-500"
                                >
                                    Tìm việc ngay
                                </Button>
                            </div>
                        )}
                    </>
                )}
                
                {/* Modal xem trước CV */}
                <Modal
                    open={showPreviewModal}
                    onCancel={() => setShowPreviewModal(false)}
                    style={{ top: 0 }}
                    height={"100vh"}
                    width={800}
                    footer={[<></>]}
                    destroyOnClose
                >
                    {previewCV ? (
                        <div className="p-4 h-[85vh] overflow-y-auto border rounded">
                            <h2 className="text-xl font-bold mb-4">{previewCV.cvName}</h2>
                            <PDFViewer width="100%" height="90%" showToolbar>
                                {(() => {
                                    switch (previewCV.templateId) {
                                        case 1:
                                            return <TemplateCV1 data={previewCV} />;
                                        case 2:
                                            return <TemplateCV2 data={previewCV} />;
                                        case 3:
                                            return <TemplateCV3 data={sampleDataCV4} />;
                                        case 4:
                                            return <TemplateCV4 data={sampleDataCV4} />;
                                        default:
                                            return <TemplateCV1 data={previewCV} />;
                                    }
                                })()}
                            </PDFViewer>
                        </div>
                    ) : (
                        <div className="text-center py-8">Không có thông tin CV</div>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default ApplicationsManagement;