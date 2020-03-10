import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticated ? <Redirect to="/" /> : <Component {...props} />
    }
  />
);

const mstp = state => ({
  authenticated: state.user.authenticated
});

AuthRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired
};
export default connect(mstp)(AuthRoute);
