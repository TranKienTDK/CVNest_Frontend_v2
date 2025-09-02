import axiosClient from './axios.config';

const recommendApi = {
  getRecommendedJobs: (userId) => {
    const url = `/recommends/${userId}`;
    return axiosClient.get(url);
  },
  
  getJobRecommendDetails: (userId, jobId) => {
    const url = `/recommends/details/${userId}`;
    return axiosClient.get(url, {
      params: {
        jobId: jobId
      }
    });
  },
};

export default recommendApi;