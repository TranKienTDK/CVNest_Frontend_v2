import API from "./axios.config";

const jobAPI = {
    // API lấy danh sách việc làm
    getAllJobs: (page = 0, size = 6) => {
        return API.get("/job", {
            params: {
                page,
                size,
            },
        });
    },
    // API lấy danh sách việc làm theo công ty
    getJobsByCompany: (companyId) => {
        return API.get(`/job/${companyId}/jobs`);
    },
    // API tìm kiếm việc làm
    searchJobs: (title = '', contract = '', jobType = '', level = '', experienceYear = '', salaryRange = '', skillIds = [], page = 0, size = 6) => {
        const params = {
            page,
            size,
        };
    
        if (title) params.title = title;
        if (contract) params.contract = contract;
        if (jobType) params.jobType = jobType;
        if (level) params.level = level;
        if (experienceYear) params.experienceYear = experienceYear;
        if (salaryRange) params.salaryRange = salaryRange;
        if (skillIds.length > 0) params.skillIds = skillIds.join(',');
    
        return API.get("/job/search", { params });
    },
    // API lấy chi tiết việc làm theo ID
    getJobDetail: (id) => {
        return API.get(`/job/${id}`);
    },
};

export default jobAPI;
