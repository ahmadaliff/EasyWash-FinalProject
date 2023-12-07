import { DELETE_USER, GET_UNVERIFIED_USERS, GET_USERS, RESET_USERS, SET_USERS, VERIFY_USER } from './constants';

export const actionGetUsers = (search, limit, page) => ({
  type: GET_USERS,
  search,
  limit,
  page,
});

export const actionGetUnverifiedUsers = (search, limit, page) => ({
  type: GET_UNVERIFIED_USERS,
  search,
  limit,
  page,
});

export const actionVerifyUser = (data) => ({
  type: VERIFY_USER,
  data,
});

export const actionSetUsers = (users) => ({
  type: SET_USERS,
  users,
});

export const actionDeleteUser = (data) => ({
  type: DELETE_USER,
  data,
});

export const actionResetUsers = () => ({
  type: RESET_USERS,
});
