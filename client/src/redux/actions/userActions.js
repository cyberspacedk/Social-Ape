import axios from 'axios';
import {
  SET_ERRORS, SET_USER, CLEAR_ERRORS, LOADING_UI
} from '../types';

export const loginUser = (userData, history)=> async dispatch=> {
  dispatch({type: LOADING_UI});
   
  try{
    const {data} = await axios.post('/login', userData); 
    const firebaseToken = `Bearer ${data.token}`;

    localStorage.setItem('FBIdToken', firebaseToken);
    axios.defaults.headers.common['Authorization'] = firebaseToken;

    dispatch(getUserData());
    dispatch({type: CLEAR_ERRORS})
    history.push('/')
  }catch(err){ 
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data
    }) 
  }
}

export const getUserData = () => async dispatch => {
  try{
   const {data}= await axios.get('/user');
    dispatch({
      type: SET_USER,
      payload: data
    }) 
  }catch(err){
    console.log(err)
  }
}