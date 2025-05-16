import API from './axios.config';

const applyAPI = {
  // API ứng tuyển việc làm với CV đã chọn
  applyJob: (userId, jobId, cvId) => {
    return API.post('/apply', {
      userId,
      jobId,
      cvId
    });
  },
  
  // API lấy danh sách các ứng tuyển của người dùng
  getUserApplications: (userId) => {
    return API.get(`/apply/user/${userId}`);
  },

  // API lấy danh sách các ứng tuyển cho một công việc
  getJobApplications: (jobId, page = 0, size = 10) => {
    return API.get(`/apply/job/${jobId}`, {
      params: {
        page,
        size
      }
    });
  },
  
  // API lấy danh sách các ứng tuyển theo HR
  getHRApplications: (hrId) => {
    return API.get(`/apply/hr/${hrId}`);
  },
  
  // API duyệt đơn ứng tuyển
  approveApplication: (applicationId) => {
    return API.put(`/apply/${applicationId}/approve`);
  },
  
  // API từ chối đơn ứng tuyển
  rejectApplication: (applicationId) => {
    return API.put(`/apply/${applicationId}/reject`);
  }
};

export default applyAPI;