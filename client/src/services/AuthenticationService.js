import api from "./Api";

const AuthenticationService = {
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
    }
};

export default AuthenticationService;