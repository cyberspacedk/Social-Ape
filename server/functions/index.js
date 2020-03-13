const functions = require("firebase-functions");
const firebase = require("firebase");
const firebaseConfig = require("./utils/config");
const app = require("express")();
const cors = require("cors");

app.use(cors());

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

// user
app.post("/user/image", authMiddleware, uploadImage);
app.post("/user", authMiddleware, addUserDetails);
app.get("/user", authMiddleware, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);

// screams
app.get("/screams", getAllScreams);
app.post("/scream", authMiddleware, createScream);
app.get("/scream/:screamId", getScream);
app.delete("/scream/:screamId", authMiddleware, deleteScream);
app.get("/scream/:screamId/like", authMiddleware, likeScream);
app.get("/scream/:screamId/unlike", authMiddleware, unlikeScream);
// comment

app.post("/scream/:screamId/comment", authMiddleware, postCommentOnScream);

// notifications
app.post("/notifications", authMiddleware, markNotificationsAsRead);

// FUNCTIONS
exports.api = functions.region("europe-west1").https.onRequest(app);

// TRIGGERS
exports.onLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => {
        console.log(err);
      });
  });

exports.onUnlike = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.log(err);
      });
  });

exports.onComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`screams/${snapshot.data().screamId}`)
      .get()
      .then(doc => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch(err => {
        console.log(err);
      });
  });

// 1. get all screams bt user
// 2. if image changed, update user image in all screams
exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate(change => {
    console.log(" BEFORE", change.before.data());
    console.log("AFTER", change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      let batch = db.batch();
      return db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const screamRef = db.doc(`/screams/${doc.id}`);
            batch.update(screamRef, {
              userImage: change.after.data().imageUrl
            });
          });
          return batch.commit();
        });
    } else {
      return true;
    }
  });

exports.onScreamDelete = functions
  .region("europe-west1")
  .firestore.document("screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();

    return db
      .collections("comments")
      .where("screamId", "==", screamId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => {
        console.log(err);
      });
  });
