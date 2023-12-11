import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  ping: 'ping.json',
  auth: 'auth',
  admin: 'admin',
  laundry: 'laundry',
  user: 'user',
};

export const callAPI = async (endpoint, method, data = {}, iswithCredentials = false, header = {}, params = {}) => {
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
export const apiRefreshToken = () => callAPI(`${urls.auth}/refresh`, 'get', {}, true);
// userAUTH
export const apiHandleLogin = (data) => callAPI(`${urls.auth}/login`, 'post', data, true);
export const apiHandleLogout = (id) => callAPI(`${urls.auth}/logout`, 'post', id, true);
export const apiHandleRegister = (data) => callAPI(`${urls.auth}/register`, 'POST', data);
export const apiHandleSendVerifyEmail = (data) => callAPI(`${urls.auth}/verifyEmail`, 'POST', data);
export const apiHandleCheckOtpVerifyEmail = (data) => callAPI(`${urls.auth}/checkOtpVerifyEmail`, 'POST', data);
export const apiHandleSendForgotPassword = (data) => callAPI(`${urls.auth}/forgotPassword`, 'POST', data);
export const apiHandleResetForgotPassword = (data) => callAPI(`${urls.auth}/resetPassword`, 'PUT', data);
export const apiHandleGetProfile = () => callAPI(`${urls.auth}/profile`, 'GET', {}, true);
export const apiHandleEditPhotoProfile = (data) =>
  callAPI(`${urls.auth}/edit/photoProfile`, 'PUT', true, data, { 'Content-Type': 'multipart/form-data' });
export const apiHandleEditProfile = (data) => callAPI(`${urls.auth}/edit/profile`, 'PUT', data, true);

// admin
export const apiGetUsers = (search, limit, page) =>
  callAPI(`${urls.admin}/users?search=${search}&page=${page}&limit=${limit}`, 'GET', {}, true);
export const apiGetUserUnverified = (search, limit, page) =>
  callAPI(`${urls.admin}/users/unverified?search=${search}&page=${page}&limit=${limit}`, 'GET', {}, true);
export const apiDeleteUser = (id) => callAPI(`${urls.admin}/user/delete`, 'DELETE', id, true);
export const apiVerifyUser = (id) => callAPI(`${urls.admin}/user/verify`, 'PUT', id, true);

// laundry
export const apiGetServices = () => callAPI(`${urls.laundry}/services`, 'GET', {}, true);
export const apiGetService = (id) => callAPI(`${urls.laundry}/service/${id}`, 'GET', {}, true);
export const apiAddServices = (data) => callAPI(`${urls.laundry}/service/add`, 'POST', data, true);
export const apiEditServices = (data, id) => callAPI(`${urls.laundry}/service/edit/${id}`, 'PUT', data, true);
export const apiDeleteServices = (id) => callAPI(`${urls.laundry}/service/delete/${id}`, 'DELETE', {}, true);
export const apiGetMyMerchant = () => callAPI(`${urls.laundry}/my`, 'GET', {}, true);
export const apiEditMerchant = (data) => callAPI(`${urls.laundry}/edit`, 'PUT', data, true);
export const apiEditPhotoMerchant = (data) =>
  callAPI(`${urls.laundry}/changePhoto`, 'PATCH', data, true, { 'Content-Type': 'multipart/form-data' });

// user role
export const apiGetOrders = () => callAPI(`${urls.user}/orders`, 'GET', {}, true);
export const apiGetOrderById = (id) => callAPI(`${urls.user}/order/${id}`, 'GET', {}, true);
