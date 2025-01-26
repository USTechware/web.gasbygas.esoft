"use client"
import { isBrowser } from '@/helpers/common';
import axios, { AxiosInstance } from 'axios';

const API_URL = '/';

const createClient = (): AxiosInstance => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const client = axios.create({
    baseURL: API_URL,
    headers,
  });

  client.interceptors.request.use((config) => {
    let token = null;
    if (isBrowser()) {
      token = localStorage.getItem('token');
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log('Unauthorized, please login again');
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const client = createClient();
export default client;
