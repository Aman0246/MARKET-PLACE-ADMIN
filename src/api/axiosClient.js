// src/api/axiosClient.js
import axios from 'axios';
import { baseURL } from './baseUrl';

const axiosClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

export default axiosClient;
