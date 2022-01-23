import React, { Component } from 'react';
import Profile from './components/Profile.js';
import Signin from './components/Signin.js';

import { AppConfig, UserSession } from "@stacks/connect";
import { Connect } from '@stacks/connect-react';

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
    }
  }


  handleSignOut = (e) => {
    e.preventDefault();
    this.setState({ userData: null });
    userSession.signUserOut(window.location.origin);
  }

  render() {
    const { userData } = this.state;
    const authOptions = {
      appDetails: {
        name: "DIMS Issuer",
        icon: window.location.origin + "/favicon.ico",
      },
      redirectTo: "/",
      onFinish: () => {
        this.setState({ userData: userSession.loadUserData() });
        // Save or otherwise utilize userData post-authentication
      },
      userSession: userSession,
    }
    return (
      <Connect authOptions={authOptions} >
        <div>
          {!userData ? <Signin /> : <Profile userData={userData} userSession={userSession} handleSignOut={this.handleSignOut} />}
        </div>
      </Connect>
    );
  }

  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData })
      });
    } else if (userSession.isUserSignedIn()) {
      this.setState({ userData: userSession.loadUserData() });
    }
  }
}
