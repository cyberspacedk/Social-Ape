import React from "react";
import PropTypes from 'prop-types' 
import { Link } from "react-router-dom";
import {connect} from 'react-redux';

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import MyButton from '../../util/MyButton';

import HomeIcon from '@material-ui/icons/Home'; 
import Notifications from '@material-ui/icons/Notifications';
import PostScream from '../PostScream';

const Navbar = ({authenticated})=> { 
  return (
    <AppBar position="static">
      <Toolbar className="nav-container">
        {authenticated ? (
          <>
           <PostScream />
            <Link to="/">
            <MyButton tip="Home">
              <HomeIcon color="primary"/>  
            </MyButton>
            </Link>
            <MyButton tip="Notifications">
              <Notifications color="primary"/>  
            </MyButton>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="signup">
              signup
            </Button>
          </> 
        )} 
      </Toolbar>
    </AppBar>
  ); 
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
}
const mstp = state => ({
  authenticated: state.user.authenticated
})
export default connect(mstp)(Navbar);
