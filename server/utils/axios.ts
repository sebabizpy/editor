import axios from 'axios';
// ----------------------------------------------------------------------

// TODO SACARLO.
//axios.defaults.baseURL = 'http://localhost:3000';
const axiosInstance = axios.create({ withCredentials: false });

/*axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => (error) => {
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);*/
export default axiosInstance;
