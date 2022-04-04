export const SET_USER_EMAIL = "SET_USER_EMAIL";
export const SET_USER_LEVEL = "SET_USER_LEVEL";
export const SET_USER_COINS = "SET_USER_COINS";
export const SET_USER_XP = "SET_USER_XP";
export const SET_USER_DIAMONDS = "SET_USER_DIAMONDS";
export const SET_USER_MULTIPLIER = "SET_USER_MULTIPLIER";
export const SET_USER_DISPLAY_NAME = "SET_USER_DISPLAY_NAME";

export const setEmail = (email) => (dispatch) => {
  dispatch({
    type: SET_USER_EMAIL,
    payload: email,
  });
};

export const setLevel = (level) => (dispatch) => {
  dispatch({
    type: SET_USER_LEVEL,
    payload: level,
  });
};
export const setCoins = (coins) => (dispatch) => {
  dispatch({
    type: SET_USER_COINS,
    payload: coins,
  });
};

export const setXp = (xp) => (dispatch) => {
  dispatch({
    type: SET_USER_XP,
    payload: xp,
  });
};

export const setDiamonds = (diamonds) => (dispatch) => {
  dispatch({
    type: SET_USER_DIAMONDS,
    payload: diamonds,
  });
};

export const setMultiplier = (multiplier) => (dispatch) => {
  dispatch({
    type: SET_USER_MULTIPLIER,
    payload: multiplier,
  });
};

export const setDisplayName = (displayName) => (dispatch) => {
  dispatch({
    type: SET_USER_DISPLAY_NAME,
    payload: displayName,
  });
};
