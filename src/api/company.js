import API from './axios.config';

const companyAPI = {
  getAllCompanies: (page = 0, size = 6) => {
    return API.get('/company', {
      params: {
        page,
        size,
      },
    });
  },

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
  
  getDetailCompany: (id) => {
    return API.get(`/company/${id}`);
  }
};

export default companyAPI;