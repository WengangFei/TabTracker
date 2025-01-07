import axios from "axios";


//access environment variables in Vite .env file
const PORT = import.meta.env.VITE_SERVER_PORT || 3000

const api = axios.create({
    baseURL: `http://localhost:${PORT}`, 
});


export default api; 