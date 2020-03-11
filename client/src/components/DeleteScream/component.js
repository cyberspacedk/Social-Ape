import React, {useState} from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom"; 
import {connect} from 'react-redux';

import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';  
import EditIcon from '@material-ui/icons/Edit'; 
import { DialogContent, TextField } from "@material-ui/core";

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';  
import DialogActions from '@material-ui/core/DialogActions';  
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Button from '@material-ui/core/Button';
import MyButton from '../../util/MyButton';  

import {deleteScream} from '../../redux/actions/dataActions';
const styles = {
  deleteButton:{
    position: 'absolute',
    top: '10%',
    left: '90%'

  }
}

const DeleteScream = ({classes, deleteScream, screamId}) => {
  const [opened, setOpened] = useState(false);

  const handleOpen = ()=> setOpened(true);
  const handleClose = ()=> setOpened(false);
  const handleDeleteScream = ()=>{
    deleteScream(screamId);
    handleClose()
  }

  return (
    <>
      <MyButton tip="Delete Scream" onClick={handleOpen} btnClassName={classes.deleteButton}>
        <DeleteOutline color="secondary" />
      </MyButton>
      <Dialog 
      open={opened}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      >
        <DialogTitle>
          Are you sure you want to delete this scream ?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
          <Button onClick={handleDeleteScream} color="secondary">
              Delete
          </Button>
        </DialogActions>
      </Dialog> 
    </>
  )
}

DeleteScream.propTypes = {
  deleteScream: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  screamId: PropTypes.string.isRequired,
}

export default connect(null, {deleteScream})(withStyles(styles)(DeleteScream));