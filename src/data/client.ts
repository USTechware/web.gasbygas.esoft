"use client"
import { isBrowser } from '@/helpers/common';
import axios, { AxiosInstance } from 'axios';

const API_URL = '/';

const createClient = (): AxiosInstance => {
  let token = null;

  if (isBrowser()) {
    token = localStorage.getItem('token');
  }

  const headers = {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  const client = axios.create({
    baseURL: API_URL,
    headers,
  });

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
