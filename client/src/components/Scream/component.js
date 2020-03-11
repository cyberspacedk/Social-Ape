import React from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {connect} from 'react-redux';

import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card"; 
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import MyButton from '../../util/MyButton';  
import {likeScream, unlikeScream} from '../../redux/actions/dataActions'

const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: '200px'
  },
  content: {
    padding: 25,
    objectFit: "cover"
  }
};

const Scream = ({ classes, scream, user, likeScream, unlikeScream})=> {
  console.log("➡️: Scream -> scream", scream)
  dayjs.extend(relativeTime); 

 const { body, createdAt, userHandle, userImage, likeCount, commentCount } = scream
  const likedScream = () => {
    return user.likes && user.likes.find(({screamId})=> screamId === scream.screamId) 
  }
  
  console.log("➡️: likedScream -> likedScream", likedScream())
  const likeScreamHandler = ()=>{
    likeScream(scream.screamId)
  }

  const unlikeScreamHandler = ()=>{
    unlikeScream(scream.screamId)
  }
  const likeButton = !user.authenticated ? (
    <MyButton tip="Like">
      <Link to="/login">
        <FavoriteBorder color="primary" />
      </Link>
    </MyButton>
  ) : (
    likedScream() ? (
      <MyButton tip="Undo like" onClick={unlikeScreamHandler}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
       <MyButton tip="Like" onClick={likeScreamHandler}>
         <FavoriteBorder color="primary" />
       </MyButton>
        )  
    );

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.image}
        image={userImage}
        title="Profile image"
      />
      <CardContent className={classes.content}>
        <Typography
          variant="h5"
          component={Link}
          to={`/users/${userHandle}`}
          color="primary"
        >
          {userHandle}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {dayjs(createdAt).fromNow()}
        </Typography>
        <Typography variant="body1">{body}</Typography>
        {likeButton}
        <span>{likeCount} Likes</span>
        <MyButton tip="comments">
          <ChatIcon color="primary" />
        </MyButton>
        <span>{commentCount} comments</span> 
      </CardContent>
    </Card>
  ); 
}

Scream.propTypes = {
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
}
const mstp = state => ({
  user: state.user
});

export default connect(mstp, {likeScream, unlikeScream})(withStyles(styles)(Scream));
