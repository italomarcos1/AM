import { combineReducers } from 'redux';

import auth from '~/store/modules/auth/reducer';
import user from '~/store/modules/user/reducer';
import cart from '~/store/modules/cart/reducer';

export default combineReducers({ auth, user, cart });
