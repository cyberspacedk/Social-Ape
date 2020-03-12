import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom"; 
import {connect} from 'react-redux';

import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';  
import EditIcon from '@material-ui/icons/Edit'; 
import {Dialog, DialogTitle, DialogActions, DialogContent, TextField } from "@material-ui/core";
  
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Button from '@material-ui/core/Button';
import MyButton from '../../util/MyButton';  
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import {postScream} from '../../redux/actions/dataActions';

const styles = {
submitButton:{
  position: 'relative'
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

const PostScream = ({ui, postScream, classes}) => {
  const [screamData, setScreamData] = useState({body:''})
  console.log("➡️: PostScream -> screamData", screamData)
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState({})

  useEffect(()=>{
    if(ui.errors){
      setError({body : ui.errors})
    }
  },[ui.errors]);

  const handleOpen = ()=> setOpened(true);
  const handleClose = ()=> setOpened(false);
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
              {/* <CircularProgress size={30} className={classes.progressSpinner} /> */}
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
}

const mstp = state => ({
  ui: state.ui
})

export default connect(mstp, {postScream})(withStyles(styles)(PostScream));