import axios from 'axios';

import store from '@store';
import { actionHandleLogout, setToken } from '@containers/Client/actions';
import { apiRefreshToken } from '@domain/api';

axios.interceptors.request.use((reqConfig) => {
  const state = store.getState();
  const { token } = state.client;
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403) {
      try {
        const response = await apiRefreshToken();
        if (response?.token) {
          store.dispatch(setToken(response?.token));
          originalRequest.headers.Authorization = `Bearer ${response?.token}`;
          return axios.request(originalRequest);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          store.dispatch(actionHandleLogout(() => window.location.assign('/')));
          return Promise.reject(err);
        }
      }
    }
    if (error.response?.status === 401) {
      store.dispatch(actionHandleLogout(() => window.location.assign('/')));
    }
    return Promise.reject(error);
  }
);

const request = (options) => axios(options);

export default request;
