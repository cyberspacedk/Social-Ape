
const isEmpty = string => {
  if(string.trim()==='') return true;
  else return false;
}

const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(emailRegEx)  
}

const authMiddleware = (req, res, next) => {
  let idToken;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
    idToken = req.headers.authorization.split('Bearer ')[1]
  }else{
    return res.status(403).json({error: 'Unauthorized'})
  }

  admin
  .auth()
  .verifyIdToken(idToken)
  .then(decodedToken=>{
    req.user = decodedToken;
    return db
    .collection('users')
    .where('userId', '==', req.user.uid)
    .limit(1)
    .get()
  })
  .then(data=> {
    req.user.handle = data.docs[0].data().handle;
    return next()
  })
  .catch(err=>{
    res.status(403).json(err)
  })
}

module.exports = {isEmpty, isEmail, authMiddleware}