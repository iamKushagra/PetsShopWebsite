import axios from 'axios';
import {API} from '../config'


const axiosWithAuth = () => {
  const jwt = JSON.parse(localStorage.getItem('jwt'));
  
  
  return axios.create({
    baseURL: API,
    headers: {
      Authorization: jwt ? `Bearer ${jwt.token}` : '',    
      Accept: 'application/json'
    },
    
    responseType: 'json'
  });
};

export default axiosWithAuth;