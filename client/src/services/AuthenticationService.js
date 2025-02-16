import api from "./Api";

const AuthenticationService = {
    home: async () => {
        try{
            const response = await api.get("/home");
            return response;
        } catch(error){
            return error;
        }   
    },

    about: async () => {
        try{
            const response = await api.get("/about");
            return response;
        } catch(error){
            return error;
        }
    },

    login: async (credentials) => {
        try{
            const response = await api.post("/login", credentials);
            return response;
        } catch(error){
            return error;
        }
    },
    register: async (credentials) => {
        try {
            const response = await api.post("/register", credentials);
            return response;
        } catch (error) {
            return error;
        }
    },
    logout: async () => {
        const response = await api.post("/logout");
        return response;
    },
    changePassword: async (credentials) => {
        try {
            const response = await api.post("/setting", credentials);
            return response;
        } catch (error) {
            return error;
        }
    },
    profile: async (credentials ) => {
        try {
            return await api.post("/profile", credentials,{
                //overwrite the preset header for save image file into DB
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });
           
        } catch (error) {
            return error;
        }
    },
    comparePassword: async (credentials) => {
        try {
            const response = await api.post("/comparePassword", credentials);
            return response;
        } catch (error) {
            return error;
        }
    },
    writeLocation: async (credentials) => {
        try {
            const response = await api.post("/api/writeLocation", credentials);
            return response;
        } catch (error) {
            return error;
        }
    },
    getNearbyUsers: async (credentials) => {
        try {
            const response = await api.post("/api/getNearbyUsers", credentials);
            return response;
        } catch (error) {
            return error;
        }
    },
    collectNearbyUsersProfile: async (credentials) => {
        try {
            const response = await api.post("/api/collectNearbyUsersProfile", credentials);
            return response;
        } catch (error) {
            return error;
        }
    },
    searchUsers: async (credentials) => {
        try {
            const response = await api.get("/api/searchUsers", credentials);
            return response;
        } catch (error) {
            return error;
        }
    },
    searchSingleUser: async (credentials) => {
        try {
            const response = await api.post("/api/searchSingleUser", credentials);
            return response;
        } catch (error) {
            return error;
        }
    },

};

export default AuthenticationService;