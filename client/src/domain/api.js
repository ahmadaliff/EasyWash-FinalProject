import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  ping: 'ping.json',
  user: 'user',
  admin: 'admin',
};

export const callAPI = async (endpoint, method, iswithCredentials = false, data = {}, header = {}, params = {}) => {
  const defaultHeader = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  };

  const headers = merge(defaultHeader, header);
  const options = {
    url: config.api.host + endpoint,
    method,
    headers,
    data,
    params,
    withCredentials: iswithCredentials,
  };

  return request(options).then((response) => {
    const responseAPI = response.data;
    return responseAPI;
  });
};

export const ping = () => callAPI(urls.ping, 'get');
// refresh token
export const apiRefreshToken = () => callAPI(`${urls.user}/refresh`, 'get', true);
// user
export const apiHandleLogin = (data) => callAPI(`${urls.user}/login`, 'post', true, data);
export const apiHandleLogout = (id) => callAPI(`${urls.user}/logout`, 'post', true, id);
export const apiHandleRegister = (data) => callAPI(`${urls.user}/register`, 'POST', data);
export const apiHandleSendVerifyEmail = (data) => callAPI(`${urls.user}/verifyEmail`, 'POST', data);
export const apiHandleCheckOtpVerifyEmail = (data) => callAPI(`${urls.user}/checkOtpVerifyEmail`, 'POST', data);
export const apiHandleSendForgotPassword = (data) => callAPI(`${urls.user}/forgotPassword`, 'POST', data);
export const apiHandleResetForgotPassword = (data) => callAPI(`${urls.user}/resetPassword`, 'PUT', data);
export const apiHandleGetProfile = () => callAPI(`${urls.user}/profile`, 'GET', true);
export const apiHandleEditPhotoProfile = (data) =>
  callAPI(`${urls.user}/edit/photoProfile`, 'PUT', true, data, { 'Content-Type': 'multipart/form-data' });
export const apiHandleEditProfile = (data) => callAPI(`${urls.user}/edit/profile`, 'PUT', true, data);

// admin
export const apiGetUsers = (search, limit, page) =>
  callAPI(`${urls.admin}/users?search=${search}&page=${page}&limit=${limit}`, 'GET', true);
export const apiGetUserUnverified = (search, limit, page) =>
  callAPI(`${urls.admin}/users/unverified?search=${search}&page=${page}&limit=${limit}`, 'GET', true);
export const apiDeleteUser = (id) => callAPI(`${urls.admin}/user/delete`, 'DELETE', true, id);
