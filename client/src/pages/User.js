import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';

import {Grid} from '@material-ui/core'

import Scream from '../components/Scream';
import StaticProfile from '../components/StaticProfile';

import {getUser} from '../redux/actions/dataActions';
import { getUserData } from '../redux/actions/userActions';

const User = ({getUser, data, match}) => {
const [profile, setProfile] = useState(null)

  useEffect(()=>{
    const handle = match.params.handle;

    async function getProfile(){
      try{
        const {data} = await axios.get(`/user/${handle}`);
        setProfile(data.user)
      }catch(err){
        console.log(err)
      } 
    }
    getUserData(handle);
    getProfile();
    
  },[]);

  const screamsMarkup = data.loading ? 
  <p>Loading ....</p> : data.screams === null 
  ? <p>No screams for this user</p> 
  : ( data.screams.map(scream => <Scream key={scream.screamId} scream={scream} /> ) );

  return (
    <Grid container spacing={5}>
      <Grid item sm={8} xs={12}>
          {screamsMarkup} 
      </Grid>
      <Grid item sm={4} xs={12}>
        <StaticProfile profile={profile} />
      </Grid>
    </Grid>
  )
};

User.propTypes = {
  getUser: PropTypes.func.isRequired,
  data: PropTypes.shape({}).isRequired,
};

const mstp = state => ({
  data: state.data
})

export default connect(mstp, {getUser})(User)