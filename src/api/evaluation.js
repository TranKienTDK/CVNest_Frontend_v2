import axiosConfig from './axios.config';

// API để lấy danh sách đánh giá CV cho một job cụ thể
export const getEvaluationsByJobId = async (jobId) => {
  try {
    const response = await axiosConfig.get(`/evaluations/job/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching evaluations by job ID:', error);
    throw error;
  }
};

// Xuất default object chứa tất cả các API functions
const evaluationAPI = {
  getEvaluationsByJobId,
};

export default evaluationAPI;