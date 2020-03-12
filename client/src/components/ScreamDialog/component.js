import React, {useState} from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom"; 
import {connect} from 'react-redux';
import dayjs from 'dayjs'; 

import {
  Dialog,  
  DialogContent,  
  Grid, 
  Typography,
  CircularProgress
} from "@material-ui/core";

import withStyles from "@material-ui/core/styles/withStyles";
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
 
import {getScream} from '../../redux/actions/dataActions';

import MyButton from '../../util/MyButton';    

const styles = {
  separator:{
    border: 'none',
    margin: 4
  },
  profileImage:{
    maxWidth: 200,
    height: 200,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  dialogContent: {
    padding: 20
  },
  closeButton:{
    position: 'absolute',
    left: '90%'
  },
  expandButton: {
    position: 'absolute',
    left: '90%'
  },
  spinner:{
    textAlign: 'center',
    margin: '50px 0'
  }

};

const ScreamDialog = ({getScream, screamId, scream, classes, ui, userHandle}) => { 
  const [opened, setOpened] = useState(false);

  const handleOpen = ()=> {
    setOpened(true);
    getScream(screamId)
  }

  const handleClose = ()=> setOpened(false);
  const dialogMarkup = ui.loading ? (
    <div className={classes.spinner}>
      <CircularProgress size={100}/> 
    </div>
  ): (
    <Grid container spacing={15}>
      <Grid item sm={5}>
        <img src={scream.userImage} alt="Profile image" className={classes.profileImage}/>
      </Grid>
      <Grid item sm={7}>
         <Typography component={Link} color="primary" variant="h5" to={`/users/${userHandle}`}>
            @{userHandle}
         </Typography>
         <hr className={classes.separator}/>
         <Typography  color="textSecondary" variant="body2">
            {dayjs(scream.createdAt).format('h:mm a, MMMM DD YYYY')}
         </Typography>
         <hr className={classes.separator}/>
         <Typography  variant="body1">
            {scream.body}
         </Typography>
      </Grid>
      
    </Grid>
  );

  return (
    <>
      <MyButton onClick={handleOpen} tip="Expand scream" tipClassName={classes.expandButton}>
        <UnfoldMore color="primary"/>
      </MyButton>

      <Dialog open={opened} onClose={handleClose} maxWidth="sm" fullWidth>
      <MyButton tip="close" onClick={handleClose} tipClassName={classes.closeButton}>
        <CloseIcon />
      </MyButton>

      <DialogContent className={classes.dialogContent}>
        {dialogMarkup}
      </DialogContent>
      </Dialog>
    </>
  )
};

ScreamDialog.propTypes = {
  getScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.shape({}).isRequired,
  ui: PropTypes.shape({}).isRequired,
}
const mstp = state => ({
  scream: state.data.scream,
  ui: state.ui
})

export default connect(mstp, {getScream})(withStyles(styles)(ScreamDialog));