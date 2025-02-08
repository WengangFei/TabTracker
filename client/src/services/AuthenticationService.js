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
                //save image file
                headers:{
                    'Content-Type': 'multipart/form-data',
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

};

export default AuthenticationService;