import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";

import Scream from "../components/Scream";
import Profile from "../components/Profile";
export class Home extends Component {
  state = {
    screams: null
  };
  componentDidMount() {
    axios.get("/screams").then(res => {
      this.setState({ screams: res.data });
    });
  }

  render() {
    let recentScreamsMarkup = this.state.screams ? (
      this.state.screams.map(scream => (
        <Scream key={scream.id} scream={scream} />
      ))
    ) : (
      <p>Loading ...</p>
    );
    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <p>{recentScreamsMarkup}</p>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

export default Home;
