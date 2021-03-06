import axios from 'axios';
import {
  SET_SCREAMS, 
  SET_SCREAM,
  LOADING_DATA, 
  LIKE_SCREAM, 
  UNLIKE_SCREAM, 
  DELETE_SCREAM,  
  LOADING_UI,
  STOP_LOADING_UI, 
  POST_SCREAM, 
  SET_ERRORS, 
  CLEAR_ERRORS} from '../types';

export const getScreams = ()=> async dispatch=>{
  try {
    dispatch({type: LOADING_DATA});
    const {data} = await axios.get('/screams')
    dispatch({
      type: SET_SCREAMS,
      payload: data
    })
  } catch (err) {
    console.log(err);
    dispatch({type: SET_SCREAMS, payload: []})
  } 
};

export const likeScream = (screamId) => async dispatch =>{
  try {
    const {data} = await axios.get(`/scream/${screamId}/like`);
    dispatch({type: LIKE_SCREAM, payload: data})
  } catch (err) {
    console.log(err)
  }
}

export const unlikeScream = (screamId) => async dispatch =>{
  try {
    const {data} = await axios.get(`/scream/${screamId}/unlike`);
    dispatch({type: UNLIKE_SCREAM, payload: data})
  } catch (err) {
    console.log(err)
  }
}

export const deleteScream = (screamId) => async dispatch => {
  try {
    await axios.delete(`/scream/${screamId}`);
    dispatch({type: DELETE_SCREAM, payload: screamId})
  } catch (err) {
    console.log(err)
  }
}

export const postScream = (newScream) => async dispatch => {
  try {
    dispatch({type: LOADING_UI})
    const {data} = await axios.post('/scream', newScream);
    dispatch({type: POST_SCREAM, payload: data})
    dispatch({type: CLEAR_ERRORS})
  } catch (err) {
    console.log(err);
    dispatch({type: SET_ERRORS, payload: err.response.data})
  }
}

export const clearErrors = () =>  dispatch=> dispatch({type:CLEAR_ERRORS});

export const getScream = screamId => async dispatch => {
  try {
    dispatch({type: LOADING_UI});
    const {data} = await axios.get(`scream/${screamId}`);
    dispatch({type: SET_SCREAM, payload: data})
  } catch (error) {
    console.log(error)
  }finally{
    dispatch({type: STOP_LOADING_UI})
  }  
}

export const getUser = userHandle => async dispatch => {
  try {
    dispatch({type: LOADING_DATA});
    const {data} = await axios.get(`users/${userHandle}`);
    dispatch({type: SET_SCREAMS, payload: data.screams})
  } catch (error) {
    console.log(error);
    dispatch({type: SET_SCREAMS, payload: null})
  }
}