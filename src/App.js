import React, { Component } from 'react';
import 'react-mdl/extra/material.js';
import {Snackbar} from 'react-mdl';
import firebase from 'firebase';
import 'react-mdl/extra/material.css';
import Login from "./Login";
import './App.css';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBAIHhafMkp19JTovzUxYuoYNBxo-qPzaQ",
  authDomain: "bon-app-a-ti.firebaseapp.com",
  databaseURL: "https://bon-app-a-ti.firebaseio.com",
  projectId: "bon-app-a-ti",
  storageBucket: "bon-app-a-ti.appspot.com",
  messagingSenderId: "683254335656"
};
firebase.initializeApp(config);
export const auth = firebase.auth();
export const database = firebase.database();
export const messaging = firebase.messaging();

class App extends Component {
  uid = 0;
  state = {
      curMsg: '',
      isSnackbarActive: false,
      signedIn: false
  };

  componentDidMount() {
      const self = this;
      auth.onAuthStateChanged(user => {
          if (user) {
              self.uid = user.uid;
              self.setState({
                  signedIn: true
              });
          } else {
              self.uid = 0;
              self.setState({
                  signedIn: false
              });
          }
          messaging.requestPermission()
              .then(function () {
                  console.log('Notification permission granted.');
                  messaging.getToken()
                  .then(currentToken => {
                      if (currentToken) {
                          database.ref('/messagingIds/' + self.uid).set(currentToken);
                      } else {
                          console.log('No Instance ID token available. Request permission to generate one.');
                      }
                  })
                  .catch(function (err) {
                      console.log('An error occurred while retrieving token. ', err);
                  });
              messaging.onTokenRefresh(() => {
                  messaging.getToken()
                      .then(currentToken => {
                          database.ref('/messagingIds/' + self.uid).set(currentToken);
                      })
                      .catch(function (err) {
                          console.log('An error occurred while retrieving token. ', err);
                      });
              })
              }).catch(err => {
              console.log('Unable to get permission to notify.', err);
          });
      });
      // messaging.onMessage(payload => {
      //     console.log("Message received. ", payload);
      // });
  }

  showMessage(msg) {
      this.setState({
          curMsg: msg,
          isSnackbarActive: true
      });
  }

  handleTimeoutSnackbar() {
    this.setState({
      isSnackbarActive: false
    });
  }

  render() {
      let main = null;
      if (this.state.signedIn) {
          main = (null);
      } else {
          main = <Login/>;
      }

      return (
          <div className="App">
              {main}
              <Snackbar
                  ref="snackbar"
                  active={this.state.isSnackbarActive}
                  onTimeout={this.handleTimeoutSnackbar.bind(this)}>
                  {this.state.curMsg}
              </Snackbar>
          </div>
      );
  }
}

export default App;
