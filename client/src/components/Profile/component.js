import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tooltip from '@material-ui/core/Tooltip';
import Typography from "@material-ui/core/Typography";
import LocationOn from "@material-ui/icons/LocationOn";
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import EditIcon from '@material-ui/icons/Edit';
import MULink from "@material-ui/core/Link";
import { IconButton } from "@material-ui/core";
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import {uploadImage, logoutUser} from '../../redux/actions/userActions';

import EditDetails from '../EditDetails';

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
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    uploadImage(formData)
  };

  const handleEditPicture = ()=> document.querySelector('#imageInput').click();  
  const handleLogout = ()=> logoutUser();

  let profileMarkup = !loading ? (
    authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="Profile" className="profile-image" />
            <input type="file" id="imageInput" onChange={handleImageChange} hidden/>
            <Tooltip title="Edit profile picture" placement="top">
            <IconButton onClick={handleEditPicture} className="button">
              <EditIcon color="primary"/>
            </IconButton>
            </Tooltip>
           
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
          {bio && <Typography variant="body2">{bio}</Typography>}
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
        <Tooltip title="Logout" placement="top">
          <IconButton onClick={handleLogout}>
            <KeyboardReturn color="primary"/>
          </IconButton>
        </Tooltip>
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
  uploadImage: PropTypes.func.isRequired,
};

const mstp = state => ({
    user: state.user
  });

export default connect(mstp, {logoutUser, uploadImage})(withStyles(styles)(Profile));
