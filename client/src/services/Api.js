import axios from "axios";


//access environment variables in Vite .env file
const PORT = import.meta.env.VITE_SERVER_PORT || 8080

const api = axios.create({
    baseURL: `http://localhost:${PORT}`, 
    headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
    }
});


export default api; 