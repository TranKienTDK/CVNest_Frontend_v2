import API from "./axios.config";

const skillAPI = {
    // API lay danh sach ky nang va khong phan trang
    getAllSkills: () => {
        return API.get("/skill");
    },
};

export default skillAPI;