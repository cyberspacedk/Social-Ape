import React, {useEffect } from "react";
import PropTypes from 'prop-types'

import { Grid } from "@material-ui/core"; 
import Scream from "../components/Scream";
import Profile from "../components/Profile";
import {getScreams} from '../redux/actions/dataActions';

import {connect} from 'react-redux';

const Home = ({data:{screams, loading}, getScreams})=> { 

  useEffect(()=>{
    getScreams()
  },[]) 
  
  let recentScreamsMarkup = !loading && screams ? (
     screams.map(scream => (
      <Scream key={scream.id} scream={scream} />
    ))
  ) : (
    <p>Loading ...</p>
  );

  return (
    <Grid container spacing={5}>
      <Grid item sm={8} xs={12}>
          {recentScreamsMarkup} 
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  ); 
}

Home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
}
const mstp = state => ({
  data: state.data
})

export default connect(mstp, {getScreams})(Home);
