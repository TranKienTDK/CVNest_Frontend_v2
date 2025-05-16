import API from "./axios.config";

const cvAPI = {

    createCV: ( payload ) => {
        // console.log("payload: ", payload);
        return API.post("/cv", { ...payload });
    },

    getCvs: (page = 0, size = 6) => {
        return API.get(`/cv`, {
            params: {
                page,
                size,
            },
        });
    },

    getDetailCv: (id) => {
        return API.get(`/cv/${id}`);
    },

    updateCV: (id, payload) => {
        console.log("payload: ", payload);
        return API.put(`/cv/${id}`, { ...payload });
    },

    deleteCv: (id) => {
        return API.delete(`/cv/${id}`);
    },

};

export default cvAPI;
