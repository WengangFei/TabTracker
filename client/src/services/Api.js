import axios from "axios";


//access environment variables in Vite .env file
const BASE_URL = import.meta.env.VITE_DOMAIN_URL + import.meta.env.VITE_SERVER_PORT;

const api = axios.create({
    baseURL: BASE_URL, 
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
    }
});


export default api; 