import API from "./axios.config";

const cvAPI = {

    createCV: ( payload ) => {
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
    
    setDefaultCV: (payload) => {
        return API.put(`/cv/set-default`, payload);
    },    
    
    saveCV: (payload) => {
        return API.post(`/cv/saved-cv`, payload);
    },

    getSavedCVs: (hrId) => {
        return API.get(`/cv/${hrId}/saved-cv`);
    },
    
    removeSavedCV: (hrId, cvId) => {
        return API.delete(`/cv/saved-cv`, { 
            data: { hrId, cvId }
        });
    },

};

export default cvAPI;
