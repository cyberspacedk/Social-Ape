import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import jwtDecode from 'jwt-decode';
import {Provider} from 'react-redux';
import store from './redux/store';

import { ThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NavBar from "./components/Navbar";
import AuthRoute from './util/AuthRoute';

import appTheme from './util/theme';
import "./App.css";

const theme = createMuiTheme(appTheme);
const token = localStorage.FBIdToken;

let authenticated;
if(token){
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp*1000 < Date.now()){ 
    authenticated = false
  }else{
    authenticated=true
  }
}


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
      <BrowserRouter>
        <NavBar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/login" component={Login} authenticated={authenticated}/>
            <AuthRoute exact path="/signup" component={SignUp} authenticated={authenticated}/>
          </Switch>
        </div>
      </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
