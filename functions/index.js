const functions = require("firebase-functions");
const firebase = require("firebase");
const firebaseConfig = require("./utils/config");
const app = require("express")();
const { db } = require("./utils/admin");

const {
  signUp,
  logIn,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  likeScream,
  unlikeScream,
  getUserDetails,
  markNotificationsAsRead
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

app.get("/user/:handle", getUserDetails);
app.post("/notifications", authMiddleware, markNotificationsAsRead);

exports.api = functions.region("europe-west1").https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document("likes/${id}")
  .onCreate(snapshot => {
    db.doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.log(err);
        return;
      });
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document("comments/${id}")
  .onDelete(snapshot => {
    db.doc(`notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch(err => {
        console.log(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document("comments/${id}")
  .onCreate(snapshot => {
    db.doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          return db.doc(`notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id
          });
        }
      })
      .then(() => {
        return;
      })
      .catch(err => {
        console.log(err);
        return;
      });
  });
