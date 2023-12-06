import { DELETE_USER, GET_USERS, RESET_USERS, SET_USERS } from './constants';

export const actionGetUsers = (search, limit, page) => ({
  type: GET_USERS,
  search,
  limit,
  page,
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
