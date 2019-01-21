// 引入createStore创建store，引入applyMiddleware 来使用中间件
import { createStore, combineReducers, applyMiddleware } from "redux";
// 引入所有的reducer

import {
  getManageOrgsId,
  getCode,
  getPart,
  switchMenu,
  getGroup,
  loadManageOrgs
} from "./../reducer";

import thunk from "redux-thunk";

import { createLogger } from "redux-logger";

const allReducers = {
  manageOrgsId: getManageOrgsId,
  getCode: getCode,
  getPart: getPart,
  menuName: switchMenu,
  getGroup: getGroup,
  loadManageOrgs: loadManageOrgs
};

const rootReducer = combineReducers(allReducers);
const middleware = [thunk, createLogger()];
export default (initialState = {}) => {
  let store = createStore(rootReducer, applyMiddleware(...middleware));
  return store;
};

// const middleware = [thunk, createLogger()];

// const rootReducer = combineReducers(allReducers);
// let configureStore = createStore(rootReducer, applyMiddleware(...middleware));

// export default configureStore;
