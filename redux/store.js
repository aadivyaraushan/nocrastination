import { createStore, combineReducers, applyMiddleware } from "redux";
import useReducer from "./reducers.js";
import thunk from "redux-thunk";

const rootReducer = combineReducers({ useReducer });

export const Store = createStore(rootReducer, applyMiddleware(thunk));
