const {admin, db} = require('../utils/admin'); 
const firebase = require('firebase');
const config = require('../utils/config');
const {validateSignUpData, validateLoginData } = require('../utils/validators');

exports.signUp =  (req, res)=>{
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword, 
    handle: req.body.handle, 
  }
 
  const {valid, errors} = validateSignUpData(newUser);
  if(!valid) return res.status(400).json(errors);

  const noImg = 'no_image.png'
  const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`;
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
      imageUrl,
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
}

exports.logIn = (req,res)=> {
  const user = {
    email: req.body.email,
    password: req.body.password
  }  

  const {valid, errors} = validateLoginData(user);
  if(!valid) return res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(data=>  data.user.getIdToken())
  .then(token=>  res.json({token}))
  .catch(err=> {
    if(err.code ==='auth/wrong-password') return res.status(403).json({general: "Wrong credentials"})
    return res.status(500).json({error: err.code})
  }) 
}

exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  let imageFileName;
  let imageToBeUploaded = {}
  const busboy = new BusBoy({headers: req.headers})

  busboy.on('file', (fieldName, file, filename, encoding, mimeType)=>{ 

    if(mimeType !== 'image/jpeg' && mimeType !== 'image/png'){
      return res.status(400).json({message: 'Wrong image format'})
    } 
    
    const imageExt = filename.split('.')[filename.split('.').length-1];
    imageFileName = `${Math.random()*758935412 | 0}.${imageExt}`;
    
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded ={filePath, mimeType};

    file.pipe(fs.createWriteStream(filePath))
  });

  busboy.on('finish', ()=> {
    admin.storage().bucket().upload(imageToBeUploaded.filePath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimeType
        }
      }
    })
    .then(()=>{
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
      return db.doc(`/users/${req.user.handle}`).update({imageUrl})
    })
    .then(()=>{
      return res.json({message: 'Image uploaded succesfully'})
    })
    .catch(err=> {
      return res.status(500).json({error: err.code})
    })
  })

  busboy.end(req.rawBody);

}