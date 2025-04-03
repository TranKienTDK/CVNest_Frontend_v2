import API from './axios.config';

const companyAPI = {
  // API lấy danh sách công ty
  getAllCompanies: (page = 0, size = 6) => {
    return API.get('/company', {
      params: {
        page,
        size,
      },
    });
  },

  // API tìm kiếm công ty
  searchCompanies: (name = '', address = '', industry = '', page = 0, size = 6) => {
    return API.get('/company/search', {
      params: {
        name,
        address,
        industry,
        page,
        size,
      },
    });
  },
  // API chi tiết 1 công ty
  getDetailCompany: (id) => {
    return API.get(`/company/${id}`);
  }
};

export default companyAPI;