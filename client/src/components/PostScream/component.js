import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types'; 
import {connect} from 'react-redux';

import withStyles from "@material-ui/core/styles/withStyles"; 
import {Dialog, DialogTitle, DialogContent, TextField, Button } from "@material-ui/core";
     
import AddIcon from '@material-ui/icons/Add'; 
import CloseIcon from '@material-ui/icons/Close';

import MyButton from '../../util/MyButton';  

import {postScream, clearErrors} from '../../redux/actions/dataActions';

const styles = {
  submitButton:{
    position: 'relative',
    float: 'right',
    marginTop: 10
  },
  progressSpinner: {
    position: 'absolute'
  },
  closeButton:{
    position: 'absolute',
    left: '90%',
    top: '3%'
  }
}

const PostScream = ({ui, postScream, clearErrors, classes}) => {
  const [screamData, setScreamData] = useState({body:''}) 
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState({})

  useEffect(()=>{
    if(ui.errors){
      setError({body : ui.errors})
    } 
  },[ui.errors]);

  const handleOpen = ()=> {
    setOpened(true);
    setError({})
  };

  const handleClose = ()=> {
    clearErrors();
    setOpened(false);
  }; 

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!screamData.body) {
      return setError({body: 'Must not be empty!'})
    }
    postScream(screamData);
    handleClose()
  }

  const handleChange = ({target})=>{
    setScreamData(({body: target.value}));
    setError({})
  }

  return (
    <>
    <MyButton tip="Create a Scream" onClick={handleOpen}>
      <AddIcon color="primary"/>  
    </MyButton>

    <Dialog open={opened} onClose={handleClose} maxWidth="sm" fullWidth>
      
      <MyButton tip="close" onClick={handleClose} tipClassName={classes.closeButton}>
        <CloseIcon />
      </MyButton>

        <DialogTitle>Post a new scream</DialogTitle> 

        <DialogContent>
          <form onSubmit={handleSubmit}>  
            <TextField 
              name="body" 
              type="text" 
              label="Scream" 
              multiline 
              rows="3" 
              placeholder="Screamat your fellow apes" 
              error={error.body ? true : false} 
              helperText={error.body}
              onChange={handleChange}
              fullWidth
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              className={classes.submitButton}
              disabled={ui.loading}
            >
              Submit 
            </Button>
          </form>
        </DialogContent>
     
    </Dialog>
    </>
  )
}

PostScream.propTypes = {
  ui: PropTypes.shape({}).isRequired,
  postScream: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
}

const mstp = state => ({
  ui: state.ui
})

export default connect(mstp, {postScream, clearErrors})(withStyles(styles)(PostScream));