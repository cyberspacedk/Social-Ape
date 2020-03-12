import {SET_SCREAMS, LOADING_DATA, LIKE_SCREAM, UNLIKE_SCREAM, DELETE_SCREAM, POST_SCREAM} from '../types';

const initialState = {
  screams : [],
  scream: {},
  loading: false
}

export default function(state=initialState, action){
  switch(action.type){

    case LOADING_DATA :
      return {
        ...state,
        loading: true
      };

    case SET_SCREAMS: 
      return {
        ...state,
        screams: action.payload,
        loading: false
      };

    case LIKE_SCREAM: 
    case UNLIKE_SCREAM:
      const index = state.screams.findIndex(({screamId}) => screamId === action.payload.screamId ); 
      state.screams[index] = action.payload 
      return{
        ...state
      };

    case DELETE_SCREAM:
      const idx = state.screams.findIndex(({screamId}) => screamId === action.payload.screamId ); 
      state.screams.splice(idx, 1);
      return {
        ...state
      };
      
    case POST_SCREAM:
      return {
        ...state,
        screams: [
          ...state.screams,
          action.payload
        ]
      }
    default:
      return state;
  }
}