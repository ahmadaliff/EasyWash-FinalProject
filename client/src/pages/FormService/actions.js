import { ADD_SERVICE } from './constants';

export const actionAddService = (data, callback) => ({
  type: ADD_SERVICE,
  data,
  callback,
});
