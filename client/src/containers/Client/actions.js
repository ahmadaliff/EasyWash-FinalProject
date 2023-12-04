import { LOGIN, LOGOUT, SET_LOGIN, SET_TOKEN, SET_USER } from '@containers/Client/constants';

export const setLogin = (login) => ({
  type: SET_LOGIN,
  login,
});

export const setUser = (user) => ({
  type: SET_USER,
  user,
});

export const setToken = (token) => ({
  type: SET_TOKEN,
  token,
});

export const actionHandleLogin = (data, callback) => ({
  type: LOGIN,
  data,
  callback,
});

export const actionHandleLogout = (callback) => ({
  type: LOGOUT,
  callback,
});
