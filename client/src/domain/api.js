import config from '@config/index';
import { merge } from 'lodash';

import request from '@utils/request';

const urls = {
  auth: 'auth',
  admin: 'admin',
  laundry: 'laundry',
  user: 'user',
  chat: 'chat',
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

// refresh token
export const apiRefreshToken = () => callAPI(`${urls.auth}/refresh`, 'get', {}, true);

// home
export const apiGetMerchants = (data) => callAPI(`${urls.user}/merchant`, 'post', data);

// userAUTH
export const apiHandleLogin = (data) => callAPI(`${urls.auth}/login`, 'post', data, true);
export const apiHandleLoginGoogle = () => callAPI(`${urls.auth}/google`, 'get', {}, true);
export const apiHandleGetUserLoginGoogle = (code) => callAPI(`${urls.auth}/google/data`, 'post', code, true);
export const apiHandleLogout = (id) => callAPI(`${urls.auth}/logout`, 'post', { id }, true);
export const apiHandleRegister = (data) => callAPI(`${urls.auth}/register`, 'POST', data);
export const apiHandleSendVerifyEmail = (data) => callAPI(`${urls.auth}/verifyEmail`, 'POST', data);
export const apiHandleCheckOtpVerifyEmail = (data) => callAPI(`${urls.auth}/checkOtpVerifyEmail`, 'POST', data);
export const apiHandleSendForgotPassword = (data) => callAPI(`${urls.auth}/forgotPassword`, 'POST', data);
export const apiHandleResetForgotPassword = (data) => callAPI(`${urls.auth}/resetPassword`, 'PUT', data);
export const apiHandleGetProfile = () => callAPI(`${urls.auth}/profile`, 'GET', {}, true);
export const apiHandleEditPhotoProfile = (data) =>
  callAPI(`${urls.auth}/edit/photoProfile`, 'PUT', data, true, {
    'Content-Type': 'multipart/form-data',
  });
export const apiHandleEditProfile = (data) => callAPI(`${urls.auth}/edit/profile`, 'PUT', data, true);

// admin
export const apiGetUsers = (search, limit, page) =>
  callAPI(`${urls.admin}/users?search=${search}&page=${page}&limit=${limit}`, 'GET', {}, true);
export const apiGetUserUnverified = (search, limit, page) =>
  callAPI(`${urls.admin}/users/unverified?search=${search}&page=${page}&limit=${limit}`, 'GET', {}, true);
export const apiDeleteUser = (id) => callAPI(`${urls.admin}/user/delete`, 'DELETE', id, true);
export const apiVerifyUser = (id) => callAPI(`${urls.admin}/user/verify`, 'PUT', id, true);

// laundry role
export const apiGetService = (id) => callAPI(`${urls.laundry}/service/${id}`, 'GET', {}, true);
export const apiAddServices = (data) => callAPI(`${urls.laundry}/service/add`, 'POST', data, true);
export const apiEditServices = (data, id) => callAPI(`${urls.laundry}/service/edit/${id}`, 'PUT', data, true);
export const apichangeEnableStatusService = (id) => callAPI(`${urls.laundry}/service/status/${id}`, 'PUT', {}, true);
export const apiGetMyMerchant = () => callAPI(`${urls.laundry}/my`, 'GET', {}, true);
export const apiEditMerchant = (data) => callAPI(`${urls.laundry}/edit`, 'PUT', data, true);
export const apiEditPhotoMerchant = (data) =>
  callAPI(`${urls.laundry}/changePhoto`, 'PATCH', data, true, { 'Content-Type': 'multipart/form-data' });
export const apiGetServices = (search, limit, page) =>
  callAPI(`${urls.laundry}/services?search=${search}&page=${page}&limit=${limit}`, 'GET', {}, true);
export const apiGetLaundryOrders = (limit, page) =>
  callAPI(`${urls.laundry}/orders?page=${page}&limit=${limit}`, 'GET', {}, true);
export const apiChangeStatus = (data) => callAPI(`${urls.laundry}/order/changeStatus`, 'PATCH', data, true);

// user role
export const apiGetOrders = () => callAPI(`${urls.user}/orders`, 'GET', {}, true);
export const apiGetOrderById = (id) => callAPI(`${urls.user}/order/${id}`, 'GET', {}, true);
export const apiGetFavoritMerchants = () => callAPI(`${urls.user}/favorit`, 'GET', {}, true);
export const apiAddtoFavorit = (id) => callAPI(`${urls.user}/favorit/add/${id}`, 'POST', {}, true);
export const apiDeleteFromFavorit = (id) => callAPI(`${urls.user}/favorit/delete/${id}`, 'DELETE', {}, true);
export const apiGetCarts = () => callAPI(`${urls.user}/cart`, 'GET', {}, true);
export const apiAddToCart = (data) => callAPI(`${urls.user}/cart/add`, 'POST', data, true);
export const apiDeleteFromCart = (id) => callAPI(`${urls.user}/cart/delete/${id}`, 'DELETE', {}, true);
export const apiChangeQuantityCart = (data) => callAPI(`${urls.user}/cart/updateQuantity`, 'PUT', data, true);

// order
export const apiCreateOrder = (data) => callAPI(`${urls.user}/order/add`, 'POST', data, true);

// laundry page
export const apiGetMerchantById = (id, location) =>
  callAPI(`${urls.user}/detail/laundry/${id}`, 'POST', location, true);

// Myorder page
export const apiGetMyOrder = () => callAPI(`${urls.user}/orders`, 'GET', {}, true);
export const apiCancelOrder = (id) => callAPI(`${urls.user}/order/cancel/${id}`, 'DELETE', {}, true);

// statusOrder page
export const apiGetTokenMidtrans = (orderId) => callAPI(`${urls.user}/midtransToken/${orderId}`, 'GET', {}, true);
export const apiPaymentSuccess = (orderId) => callAPI(`${urls.user}/changeStatusPayment/${orderId}`, 'PUT', {}, true);
export const apiGetMidtransStatus = (orderId) => callAPI(`${urls.user}/status/midtrans/${orderId}`, 'GET', {}, true);

// message stream.io
export const apiHandleGetTokenStream = () => callAPI(`${urls.chat}/token`, 'GET');
export const apiHandleAddChannel = (data) => callAPI(`${urls.chat}/createChannel`, 'POST', data, true);
export const apiHandleDeleteChannel = (userId) => callAPI(`${urls.chat}/delete/${userId}`, 'DELETE', {}, true);
