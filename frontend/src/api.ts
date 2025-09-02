import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000", // FastAPI'nin çalıştığı port
  withCredentials: true, // eğer cookie vs. kullanacaksan
})

export default api
