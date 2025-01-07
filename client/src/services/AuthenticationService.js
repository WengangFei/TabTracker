import api from "./Api";

const AuthenticationService = {
    login: async (credentials) => {
        const response = await api.post("/login", credentials);
        return response.data;
    },
    register: async (credentials) => {
        try {
            const response = await api.post("/register", credentials);
            return response.data;
        } catch (error) {
            console.log(error);
        }

    },
    logout: async () => {
        const response = await api.post("/logout");
        return response.data;
    },
};

export default AuthenticationService;