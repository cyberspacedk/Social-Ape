import firebase from 'firebase'; 
import {setAuthorizationHeader} from '../redux/actions/userActions';

const config = {
  apiKey: "AIzaSyAdrFuIP_SgfyiLL59YCUqXX34x8sC1rXo",
  authDomain: "social-ape-f0156.firebaseapp.com",
  databaseURL: "https://social-ape-f0156.firebaseio.com",
  projectId: "social-ape-f0156",
  storageBucket: "social-ape-f0156.appspot.com",
  messagingSenderId: "780316368509",
  appId: "1:780316368509:web:9a14e8f449adc665a85b14"
}

firebase.initializeApp(config);

const db = firebase.firestore();

const fbProvider = new firebase.auth.FacebookAuthProvider();

export const loginWithFacebook = ()=> {
  let user = {}

  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result)=> {  
    const token = result.credential.accessToken;  
    user = result.user;  
    return user.getIdToken();  
  })
  .then(token=> { 
    const newUser = {
      email: user.email, 
      handle: user.displayName,
      imageUrl: user.photoURL,
      createdAt: new Date().toISOString(),
      userId: user.uid
    };
    setAuthorizationHeader(token);

    db.doc(`/users/${user.displayName}`)
    .get()
    .then(doc => {
      if (!doc.exists) { 
        return  db.collection('users').doc(`${user.displayName}`).set(newUser); 
      } 
    })
  })
  .catch(function(error) { 
    const errorCode = error.code; 
    const errorMessage = error.message;  
    const email = error.email; 
    const credential = error.credential;  
  });
}