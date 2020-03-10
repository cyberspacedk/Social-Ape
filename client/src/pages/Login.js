import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types'; 
import axios from 'axios';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import Grid from '@material-ui/core/Grid'
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'; 

import AppIcon from '../images/icon.png';

import {loginUser} from '../redux/actions/userActions';

const styles = {
  form:{
    textAlign: 'center',
    justifyContent: 'center'
  },
  image: {
    margin: '20px auto'
  },
  pageTitle:{
    margin: '10px auto'
  },
  textField:{
    margin: '10px auto'
  },
  button:{
    margin: '15px 0',
    position: 'relative'
  },
  customError:{
    color: 'red',
    fontSize: '.8rem', 
    marginTop: '10px'
  }, 
  spinner:{
    position: 'absolute'
  }
}

const initialFormState = {
  email: '',
  password: '',
  error: {}
}

const Login = ({classes, history, loginUser, ui, user})=> { 
  const [formData, setFormData] = useState(initialFormState);  

  useEffect(()=>{
    if(ui.errors){
      setFormData(prevState=> ({...prevState, error : ui.errors}))
    }
  },[ui.errors]);

    const handleFormSubmit = async (e) => { 
      e.preventDefault();
      loginUser(formData, history) 
    }

    const handleFieldChange = ({target:{name, value}})=> {
      setFormData(prevState => ({...prevState,[name]:value, error: {}}));
    }

    return (
    <Grid container className={classes.form}>
 
      <Grid item>
       <img src={AppIcon} alt="logo" className={classes.image}/>
       <Typography variant="h4" className={classes.pageTitle}>
         Login
       </Typography>
       <form noValidate onSubmit={handleFormSubmit}>
        <TextField 
          id="email" 
          name="email" 
          type="email" 
          label="Email" 
          className={classes.textField}
          value={formData.email}
          onChange={handleFieldChange}
          helperText={formData.error.email}
          error={!!formData.error.email}
          fullWidth
        />
        <TextField 
          id="password" 
          name="password" 
          type="password" 
          label="Password" 
          className={classes.textField}
          value={formData.password}
          onChange={handleFieldChange}
          helperText={formData.error.password}
          error={!!formData.error.password}
          fullWidth
        />
        {formData.error.error && (
          <Typography 
          variant="body2" 
          className={classes.customError}
          >
            User not found
          </Typography>
        )}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          className={classes.button}
          disabled={ui.loading}
        >
          Login
          {ui.loading && <CircularProgress size={25} className={classes.spinner}/>}
        </Button>
        <br />
        <small>dont have an account ? sign up <Link to="/signup">here</Link></small>
       </form>
      </Grid>
     

    </Grid>
    );
  } 

Login.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
  ui: PropTypes.shape({}).isRequired,
}

const mstp = state=> ({
  user: state.user,
  ui: state.ui
});

const mdtp = {
  loginUser
}

export default connect(mstp, mdtp)(withStyles(styles)(Login))
