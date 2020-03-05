
const isEmpty = string => {
  if(string.trim()==='') return true;
  else return false;
}

const isEmail = email => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(emailRegEx)  
} 

exports.validateSignUpData = (data) => { 
  const errors = {} 
  Object.entries(data).forEach(([key, value])=> { if(isEmpty(value)) errors[key] = 'Must not be empty'}) 
  if(!isEmail(data.email)) errors.email = 'Invalid email format!'; 
  if(data.password !== data.confirmPassword) errors.confirmPassword = 'Password should match';  

  return  {
    errors, 
    valid: Object.keys(errors).length ? false : true
  }
}

exports.validateLoginData = (data)=> { 
   const errors = {} 
   Object.entries(data).forEach(([key, value])=> { if(isEmpty(value)) errors[key] = 'Must not be empty'}) 
   if(!isEmail(data.email)) errors.email = 'Invalid email format!';  
   
   return  {
    errors, 
    valid: Object.keys(errors).length ? false : true
  } 
}