import { createStore, compose, applyMiddleware } from "redux";

export default (reducers, middlewares) => {
  const devMode = false;

  const enhancer = devMode
    ? compose(console.tron.createEnhancer(), applyMiddleware(...middlewares))
    : applyMiddleware(...middlewares);

  return createStore(reducers, enhancer);
};
