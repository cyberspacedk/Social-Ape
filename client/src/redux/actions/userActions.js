import axios from "axios";
import {
  SET_ERRORS,
  SET_USER,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER
} from "../types";

export const loginUser = (userData, history) => async dispatch => {
  dispatch({ type: LOADING_UI });

  try {
    const { data } = await axios.post("/login", userData);
    setAuthorizationHeader(data.token);
    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });
    history.push("/");
  } catch (err) {
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data
    });
  }
};

export const signUpUser = (newUserData, history) => async dispatch => {
  dispatch({ type: LOADING_UI });

  try {
    const { data } = await axios.post("/signup", newUserData);
    setAuthorizationHeader(data.token);
    dispatch(getUserData());
    dispatch({ type: CLEAR_ERRORS });
    history.push("/");
  } catch (err) {
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data
    });
  }
};

export const logoutUser = () => async dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => async dispatch => {
  try {
    dispatch({ type: LOADING_USER });
    const { data } = await axios.get("/user");
    dispatch({
      type: SET_USER,
      payload: data
    });
  } catch (err) {
    console.log(err);
  }
};

const setAuthorizationHeader = token => {
  const firebaseToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", firebaseToken);
  axios.defaults.headers.common["Authorization"] = firebaseToken;
};
