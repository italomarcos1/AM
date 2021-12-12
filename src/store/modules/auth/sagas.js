import { Alert } from 'react-native';
import { call, put, all, takeLatest } from 'redux-saga/effects';
import Toast from 'react-native-tiny-toast';
import OneSignal from 'react-native-onesignal';

import api from '~/services/api';

import { signInSuccess, signFailure } from '~/store/modules/auth/actions';
import { addFavorites } from '~/store/modules/cart/actions';

export function* signIn({ payload }) {
  const { email, password } = payload;

  try {
    const response = yield call(api.post, 'auth/login', {
      email,
      password,
    });
    const { token, user } = response.data.data;

    const { name, last_name } = user;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    const favResponse = yield call(api.get, 'clients/wishlists');

    if (favResponse.data.meta.message === 'Não há produtos favoritados.') {
      yield put(addFavorites([]));
    } else {
      yield put(addFavorites(favResponse.data.data));
    }

    if (name === '' && last_name === '') {
      const { data } = yield call(api.put, 'clients', {
        name: 'Cliente',
        last_name: 'AMFrutas',
      });
      const updatedUser = { ...data.data, default_address: [] };

      yield put(signInSuccess(token, updatedUser));
      OneSignal.setExternalUserId(String(user.id));

      return;
    }
    OneSignal.setExternalUserId(String(user.id));

    const updatedUser = { ...user, default_address: [] };

    yield put(signInSuccess(token, updatedUser));
  } catch (error) {
    Toast.show('Erro no login, confira seus dados.');
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) {
    return;
  }

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
]);
