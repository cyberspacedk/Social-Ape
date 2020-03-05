const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require('firebase');
const app = require("express")();

const {isEmail, isEmpty } = require('./utils/helpers');

const firebaseConfig = {
  apiKey: "AIzaSyAdrFuIP_SgfyiLL59YCUqXX34x8sC1rXo",
  authDomain: "social-ape-f0156.firebaseapp.com",
  databaseURL: "https://social-ape-f0156.firebaseio.com",
  projectId: "social-ape-f0156",
  storageBucket: "social-ape-f0156.appspot.com",
  messagingSenderId: "780316368509",
  appId: "1:780316368509:web:9a14e8f449adc665a85b14"
};


firebase.initializeApp(firebaseConfig);
admin.initializeApp();

const db = admin.firestore();

// SIGNUP
app.post('/signup', (req, res)=>{
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword, 
    handle: req.body.handle, 
  }

  // Validation section
  const errors = {} 
  Object.entries(newUser).forEach(([key, value])=> { if(isEmpty(value)) errors[key] = 'Must not be empty'}) 
  if(!isEmail(newUser.email)) errors.email = 'Invalid email format!'; 
  if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Password should match'; 
  if(Object.keys(errors).length>0) return res.status(400).json(errors);
  //=== 

  let token, userId;

  db
  .doc(`/users/${newUser.handle}`)
  .get()
  .then(doc=>{
    if(doc.exists){
      return res.status(400).json({handle: 'this handle is already taken'})
    }else{
      return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    }
  })
  .then(data => { 
    userId = data.user.uid;
    return data.user.getIdToken(); 
  })
  .then(idToken => {
    token = idToken;
    const userCredentials = {
      handle: newUser.handle,
      email: newUser.email,
      createdAt: new Date().toISOString(),
      userId
    };
    return db.doc(`/users/${newUser.handle}`).set(userCredentials);
  })
  .then(()=>{
    return res.status(201).json({token})
  })
  .catch(err=> {
    console.error(err);
    if(err.code === "auth/email-already-in-use"){
      return res.status(400).json({email: 'Email is already in use'})
    }else{
      return res.status(500).json({error: err.code}) 
    }
  })
})

// LOGIN
app.post('/login', (req,res)=> {
  const user = {
    email: req.body.email,
    password: req.body.password
  } 
   // Validation section
   const errors = {} 
   Object.entries(user).forEach(([key, value])=> { if(isEmpty(value)) errors[key] = 'Must not be empty'}) 
   if(!isEmail(user.email)) errors.email = 'Invalid email format!';  
   if(Object.keys(errors).length>0) return res.status(400).json(errors);
   //=== 

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(data=>  data.user.getIdToken())
  .then(token=>  res.json({token}))
  .catch(err=> {
    if(err.code ==='auth/wrong-password') return res.status(403).json({general: "Wrong credentials"})
    return res.status(500).json({error: err.code})
  }) 
})

app.get("/screams", (req, res) => {
  db
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(error => console.log(error));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  db
    .collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "smth went wrong" });
      console.log(err);
    });
});

exports.api = functions.region("europe-west1").https.onRequest(app);
