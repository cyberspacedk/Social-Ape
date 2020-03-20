import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axios from 'axios';

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/Edit";
import MULink from "@material-ui/core/Link";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import { uploadImage, logoutUser } from "../../redux/actions/userActions";

import EditDetails from "../EditDetails";
import MyButton from "../../util/MyButton"; 
import {loginWithFacebook} from '../../db'

const styles = theme => ({
  paper: {
    padding: 20
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative",
      "& button": {
        position: "absolute",
        top: "80%",
        left: "70%"
      }
    },
    "& .profile-image": {
      width: "200px",
      height: "200px",
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%"
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle"
      },
      "& a": {
        color: theme.palette.primary.main
      }
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0"
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer"
      }
    }
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px"
    }
  },
  userBio: {
    textAlign: "center"
  },
  facebookLogin:{
    background: '#4267b2',
    textTransform: 'none',
    "&:hover": {
      background: "#4267b2"
    },
    width: '170px',
    marginBottom: '10px'
  }
});

const Profile = ({
  user: {
    credentials: { handle, createdAt, imageUrl, bio, website, location },
    authenticated
  },
  classes,
  loading,
  uploadImage,
  logoutUser
}) => {
  const handleImageChange = e => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    uploadImage(formData);
  };

  const handleEditPicture = () => document.querySelector("#imageInput").click();
  const handleLogout = () => logoutUser();

  const facebookAuthServer = async () => {
    try {
      console.log('START')
      const {data} = await axios.get('/auth/facebook'); 
      console.log("➡️: facebookAuth -> data", data);
    } catch (error) {
      console.log("➡️: facebookAuth -> error", error);
    }  
  }

  let profileMarkup = !loading ? (
    authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="Profile" className="profile-image" />
            <input
              type="file"
              id="imageInput"
              onChange={handleImageChange}
              hidden
            />
            <MyButton
              tip="Edit profile picture"
              onClick={handleEditPicture}
              btnClassName="button"
            >
              <EditIcon color="primary" />
            </MyButton>
          </div>
          <hr />
          <div className="profile-details">
            <MULink
              component={Link}
              to={`/users/${handle}`}
              color="primary"
              variant="h5"
            >
              @{handle}
            </MULink>
          </div>
          <hr />
          {bio && (
            <Typography variant="body2" className={classes.userBio}>
              {bio}
            </Typography>
          )}
          <hr />
          {location && (
            <>
              <LocationOn color="primary" />
              <span>{location}</span>
              <hr />
            </>
          )}
          {website && (
            <>
              <LinkIcon color="primary" />
              <a href={website} target="_blank" rel="noopener noreferrer">
                {" "}
                {website}
              </a>
              <hr />
            </>
          )}
          <CalendarToday color="primary" />{" "}
          <span>Joined {dayjs(createdAt).format("MMM YYY")}</span>
        </div>
        <MyButton tip="Logout" onClick={handleLogout} btnClassName="button">
          <KeyboardReturn color="primary" />
        </MyButton>
        <EditDetails />
      </Paper>
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No profile found, please logon again
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/signup"
            >
              Signup
            </Button>
            <Button
              className={classes.facebookLogin}
              variant="contained"
              color="primary"
              onClick={loginWithFacebook}
            >
              Login by Facebook client side
            </Button>  
            <Button
              className={classes.facebookLogin}
              variant="contained"
              color="primary"
              onClick={facebookAuthServer}
            >
              Login by Facebook server side
            </Button>  
          </div>
        </Typography>
      </Paper>
    )
  ) : (
    <p>Loading ...</p>
  );
  return profileMarkup;
};

Profile.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired
};

const mstp = state => ({
  user: state.user
});

export default connect(mstp, { logoutUser, uploadImage })(
  withStyles(styles)(Profile)
);
