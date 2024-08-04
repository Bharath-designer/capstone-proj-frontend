import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:4000'
  baseURL: 'https://brokerlessappservicebharath.azurewebsites.net'
});


axiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // console.log("[INTERCEPTOR]", error);
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(config => config, (error) => {
  // console.log("[INTERCEPTOR]", error);
  if ([401, 403].includes(error.response?.status)) {
    // localStorage.clear()
    location.replace("/")
  }
  return Promise.reject(error)
})

export default axiosInstance;
