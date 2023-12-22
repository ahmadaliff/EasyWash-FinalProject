import {
  ADD_TO_FAVORIT,
  DELETE_FROM_FAVORIT,
  GET_FAVORIT_MERCHANTS,
  RESET_FAVORIT_MERCHANTS,
  SET_FAVORIT_MERCHANTS,
} from './constants';

export const actionGetFavoritMerchants = () => ({
  type: GET_FAVORIT_MERCHANTS,
});

export const actionSetFavoritMerchants = (data) => ({
  type: SET_FAVORIT_MERCHANTS,
  data,
});

export const actionResetFavoritMerchants = () => ({
  type: RESET_FAVORIT_MERCHANTS,
});

export const actionAddToFavorit = (id) => ({
  type: ADD_TO_FAVORIT,
  id,
});

export const actionDeleteFromFavorit = (id) => ({
  type: DELETE_FROM_FAVORIT,
  id,
});
