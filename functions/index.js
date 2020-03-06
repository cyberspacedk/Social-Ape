const functions = require("firebase-functions"); 
const firebase = require('firebase');
const firebaseConfig = require('./utils/config'); 
const app = require("express")();

const {signUp, logIn, uploadImage, addUserDetails, getAuthenticatedUser} = require('./handlers/users');
const {authMiddleware} = require('./utils/middleWare');
const {getAllScreams, createScream, getScream, postCommentOnScream} = require('./handlers/screams');

firebase.initializeApp(firebaseConfig);

// authentication 
app.post('/signup',signUp);
app.post('/login', logIn);

// user routes
app.post('/user/image',authMiddleware, uploadImage);
app.post('/user', authMiddleware, addUserDetails);
app.get('/user', authMiddleware, getAuthenticatedUser);

// post operations
app.get("/screams", getAllScreams);
app.post("/scream", authMiddleware, createScream); 
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', authMiddleware, postCommentOnScream)

exports.api = functions.region("europe-west1").https.onRequest(app);
