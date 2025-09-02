import API from './axios.config';

export const getEmailPreview = async (data) => {
  try {
    const response = await API.post('/recruitment/preview', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendEmail = async (data) => {
  try {
    const response = await API.post('/recruitment/send', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};