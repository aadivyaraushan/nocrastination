import {
  SET_USER_EMAIL,
  SET_USER_LEVEL,
  SET_USER_COINS,
  SET_USER_XP,
  SET_USER_DIAMONDS,
  SET_USER_MULTIPLIER,
  SET_USER_DISPLAY_NAME,
} from "./actions";

const initialState = {
  email: "",
  displayName: "",
  level: 1,
  coins: 0,
  userXp: 0,
  diamonds: 0,
  multiplier: 1,
};

function useReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_EMAIL:
      return { ...state, email: action.payload };
    case SET_USER_DISPLAY_NAME:
      return { ...state, displayName: action.payload };
    case SET_USER_LEVEL:
      return { ...state, level: action.payload };
    case SET_USER_COINS:
      return { ...state, coins: action.payload };
    case SET_USER_XP:
      return { ...state, userXp: action.payload };
    case SET_USER_DIAMONDS:
      return { ...state, diamonds: action.payload };
    case SET_USER_MULTIPLIER:
      return { ...state, multiplier: actions.payload };
    default:
      return state;
  }
}

export default useReducer;
