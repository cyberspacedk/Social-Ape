import React, { Component, useState } from "react";
import PropTypes from 'prop-types'; 
import {Link} from 'react-router-dom';

import Grid from '@material-ui/core/Grid'
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button';

import axios from 'axios';

import AppIcon from '../images/icon.png';

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
  confirmPassword: '',
  handle: '',
  error: {}
}

const SignUp = ({classes, history})=> { 
  const [formData, setFormData] = useState(initialFormState);  
  const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (e) => { 
      e.preventDefault();
      const {error:_, ...newUserData } = formData;

      setLoading(true);
      try{
        const {data:{token}} = await axios.post('/signup', newUserData); 
        localStorage.setItem('FBIdToken', `Bearer ${token}`)
        history.push('/')
      }catch(err){ 
        setFormData(prevState=> ({...prevState, error: err.response.data})); 
      }finally{
        setLoading(false);
      }  
    }

    const handleFieldChange = ({target:{name, value}})=> {
      setFormData(prevState => ({...prevState,[name]:value, error: {}}));
    }

    return (
    <Grid container className={classes.form}> 
      <Grid item>
       <img src={AppIcon} alt="logo" className={classes.image}/>
       <Typography variant="h4" className={classes.pageTitle}>
         Signup
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
          <TextField 
          id="confirmPassword" 
          name="confirmPassword" 
          type="password" 
          label="Confirm password" 
          className={classes.textField}
          value={formData.confirmPassword}
          onChange={handleFieldChange}
          helperText={formData.error.confirmPassword}
          error={!!formData.error.confirmPassword}
          fullWidth
        />
         <TextField 
          id="handle" 
          name="handle" 
          type="text" 
          label="Handle" 
          className={classes.textField}
          value={formData.handle}
          onChange={handleFieldChange}
          helperText={formData.error.handle}
          error={!!formData.error.handle}
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
          disabled={loading}
        >
          Signup
          {loading && <CircularProgress size={25} className={classes.spinner}/>}
        </Button>
        <br />
        <small>Already have an account ? log in <Link to="/login">here</Link></small>
       </form>
      </Grid>  
    </Grid>
    );
  } 

SignUp.propTypes = {
  classes: PropTypes.shape({}).isRequired,
}

export default withStyles(styles)(SignUp);
