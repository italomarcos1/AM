export function addToCartRequest(product, amount) {
  return {
    type: '@cart/ADD_TO_CART_REQUEST',
    payload: { product, amount },
  };
}

export function addToCartSuccess(product) {
  return {
    type: '@cart/ADD_TO_CART_SUCCESS',
    payload: { product },
  };
}

export function removeFromCartRequest(id) {
  return {
    type: '@cart/REMOVE_FROM_CART_REQUEST',
    payload: { id },
  };
}

export function removeFromCartSuccess(id) {
  return {
    type: '@cart/REMOVE_FROM_CART_SUCCESS',
    payload: { id },
  };
}

export function cleanCart() {
  return {
    type: '@cart/CLEAN_CART',
  };
}

export function addFavorites(favorites) {
  return {
    type: '@cart/ADD_FAVORITES',
    payload: { favorites },
  };
}

export function addToFavoritesRequest(id) {
  return {
    type: '@cart/ADD_TO_FAVORITES_REQUEST',
    payload: { id },
  };
}

export function addToFavoritesSuccess(product) {
  return {
    type: '@cart/ADD_TO_FAVORITES_SUCCESS',
    payload: { product },
  };
}

export function removeFromFavoritesRequest(id) {
  return {
    type: '@cart/REMOVE_FROM_FAVORITES_REQUEST',
    payload: { id },
  };
}

export function removeFromFavoritesSuccess(id) {
  return {
    type: '@cart/REMOVE_FROM_FAVORITES_SUCCESS',
    payload: { id },
  };
}

export function updateAmount(id, amount) {
  return {
    type: '@cart/UPDATE_AMOUNT',
    payload: { id, amount },
  };
}
