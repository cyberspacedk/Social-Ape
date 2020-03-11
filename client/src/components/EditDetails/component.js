import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";

import {connect} from 'react-redux';
import {editUserDetails} from '../../redux/actions/userActions';

import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/Tooltip';  
import DialogTitle from '@material-ui/core/DialogTitle';  
import EditIcon from '@material-ui/icons/Edit'; 
import { DialogContent, TextField } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions'; 
import DialogContentText from '@material-ui/core/DialogContentText'; 
const styles = theme => ({
  button: {
    float: 'right'
  }
});

const initialState = {
  bio: '',
  website: '',
  location: '',
  open: false,
  error: null
}

const EditDetails = ({credentials, classes, editUserDetails}) => {
  const [userDetails, setUserDetails] = useState(initialState);
  
  useEffect(()=> { 
    setUserDetails(prevState=> ({
      ...prevState,
      bio: credentials.bio,
      website: credentials.website,
      location: credentials.location
    })) 
  },[credentials]);

const handleOpen= ()=> setUserDetails(prevState=> ({
  ...prevState,
  open:true
}));

const handleClose = ()=> setUserDetails(prevState=> ({
  ...prevState,
  open:false
}));

const handleFieldChange = ({target:{name, value}})=> {
  setUserDetails(prevState => ({...prevState,[name]:value, error: {}}));
}
const handleSubmit = (e)=>{
  e.preventDefault();
  const {error, open, ...userData} = userDetails;
  editUserDetails(userData)
  handleClose()
}

  return (
   <>
   <Tooltip title="Edit details" placement="top">
      <IconButton onClick={handleOpen} className={classes.button}>
        <EditIcon color="primary"/>
      </IconButton>
   </Tooltip>
   <Dialog
   open={userDetails.open}
   onClose={handleClose}
   fullWidth
   maxWidth="sm"
   >
     <DialogTitle>Edit your details</DialogTitle>
     <DialogContent>
       <form>
         <TextField 
          name="bio" 
          type="text" 
          label="Bio" 
          multiline rows="3" 
          placeholder="A short bio about yourself" 
          className={classes.textField} 
          value={userDetails.bio}
          fullWidth
          onChange={handleFieldChange}
         />
          <TextField 
          name="website" 
          type="text" 
          label="Website" 
          
          placeholder="Your personal/professional website" 
          className={classes.textField} 
          value={userDetails.website}
          fullWidth
          onChange={handleFieldChange}
         />
          <TextField 
          name="location" 
          type="text" 
          label="Location"  
          placeholder="Where you live" 
          className={classes.textField} 
          value={userDetails.location}
          fullWidth
          onChange={handleFieldChange}
         />
       </form>
     </DialogContent>
     <DialogActions>
       <Button onClick={handleClose} color="primary">
         Cancel
       </Button>
       <Button onClick={handleSubmit} color="primary">
         Save
       </Button>
     </DialogActions>
   </Dialog>
   </>
  )
}


const mstp = state => ({
  credentials: state.user.credentials
})

export default connect(mstp, {editUserDetails})(withStyles(styles)(EditDetails))