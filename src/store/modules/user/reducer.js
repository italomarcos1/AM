import produce from 'immer';

const INITIAL_STATE = {
  profile: null,
  tabBar: true,
  order: null,
  triggered: false,
};

export default function user(state = INITIAL_STATE, { type, payload }) {
  return produce(state, draft => {
    switch (type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.profile = payload.user;
        break;
      }

      case '@user/UPDATE_PROFILE_SUCCESS': {
        draft.profile = payload.profile;
        break;
      }

      case '@user/HIDE_TAB_BAR': {
        draft.tabBar = false;
        break;
      }

      case '@user/SHOW_TAB_BAR': {
        draft.tabBar = true;
        break;
      }

      case '@user/SET_ORDER': {
        draft.order = payload.order;
        draft.triggered = true;
        break;
      }
      case '@user/VIEW_ORDER': {
        draft.triggered = true;
        break;
      }

      case '@user/RESET_ORDER': {
        draft.order = null;
        draft.triggered = false;

        break;
      }

      case '@user/RESET_TRIGGER': {
        draft.triggered = false;

        break;
      }

      case '@auth/SIGN_OUT': {
        draft.profile = null;
        break;
      }
      default:
    }
  });
}
