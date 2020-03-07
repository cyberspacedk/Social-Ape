const functions = require("firebase-functions");
const firebase = require("firebase");
const firebaseConfig = require("./utils/config");
const app = require("express")();

const {
  signUp,
  logIn,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  likeScream,
  unlikeScream
} = require("./handlers/users");
const { authMiddleware } = require("./utils/middleWare");
const {
  getAllScreams,
  createScream,
  getScream,
  postCommentOnScream,
  deleteScream
} = require("./handlers/screams");

firebase.initializeApp(firebaseConfig);

// authentication
app.post("/signup", signUp);
app.post("/login", logIn);

// user routes
app.post("/user/image", authMiddleware, uploadImage);
app.post("/user", authMiddleware, addUserDetails);
app.get("/user", authMiddleware, getAuthenticatedUser);

// post operations
app.get("/screams", getAllScreams);
app.get("/scream/:screamId", getScream);

app.post("/scream", authMiddleware, createScream);
app.post("/scream/:screamId/comment", authMiddleware, postCommentOnScream);

app.delete("/scream/:screamId", authMiddleware, deleteScream);

app.get("/scream/:screamId/like", authMiddleware, likeScream);
app.get("/scream/:screamId/unlike", authMiddleware, unlikeScream);

exports.api = functions.region("europe-west1").https.onRequest(app);
