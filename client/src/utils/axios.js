import axios from 'axios';
import { basePath } from '../config';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authJwt';


axios.defaults.baseURL = basePath.url;
console.log('baseUrl axios ' + axios.defaults.baseURL);

const axiosInstance = axios.create({ withCredentials: false });

// Add a request interceptor
/*axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    console.log('req.rejected ' + JSON.stringify(error));
    // Do something with request error
    return Promise.reject(error);
  }
);*/

/// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    
    console.log("response status " + response.status)

    if (response.status === 401) {
      // TODO: desloguear o ver si armar otro token
      let dispatch = useDispatch()
      dispatch(logout())
    }
    return response;
  },
  function (error) {
    console.log('Error ::::' + JSON.stringify(error.response));
    throw error;
  }
);


export default axiosInstance;
