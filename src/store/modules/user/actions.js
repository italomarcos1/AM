export function updateProfileRequest(data) {
  return { type: '@user/UPDATE_PROFILE_REQUEST', payload: { data } };
}

export function updateProfileSuccess(profile) {
  return { type: '@user/UPDATE_PROFILE_SUCCESS', payload: { profile } };
}

export function updateProfileFailure() {
  return { type: '@user/UPDATE_PROFILE_FAILURE' };
}

export function hideTabBar() {
  return { type: '@user/HIDE_TAB_BAR' };
}

export function showTabBar() {
  return { type: '@user/SHOW_TAB_BAR' };
}

export function setOrder(order) {
  return { type: '@user/SET_ORDER', payload: { order } };
}
export function viewOrder() {
  return { type: '@user/VIEW_ORDER' };
}

export function resetOrder() {
  return { type: '@user/RESET_ORDER' };
}
export function resetTrigger() {
  return { type: '@user/RESET_TRIGGER' };
}
