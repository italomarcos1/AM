import { all } from 'redux-saga/effects';

import auth from '~/store/modules/auth/sagas';
import user from '~/store/modules/user/sagas';
import cart from '~/store/modules/cart/sagas';

export default function* rootSaga() {
  return yield all([auth, user, cart]);
}
