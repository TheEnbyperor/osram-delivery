import React, { Component } from 'react';
import 'react-mdl/extra/material.js';
import {Snackbar} from 'react-mdl';
import firebase from 'firebase';
import 'react-mdl/extra/material.css';
import Login from "./Login";
import Deliveries from "./Deliveries";
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

class LocationUpdater extends Component {
  constructor(props) {
      super(props);
      this.onFix = props.onFix;
      this.lostFix = props.lostFix;
      this.fix = null;
      this.authed = false;
      this.uid = 0;
  }

  componentDidMount() {
      auth.onAuthStateChanged((user) => {
          this.authed = !!user;
          if (user) {
              this.uid = user.uid;
          }
      });
      this.watchId = navigator.geolocation.watchPosition((fix) => {
          this.fix = fix;
          if (this.authed) {
              database.ref('locations/' + this.uid).set({
                  coords: {
                      lat: fix.coords.latitude,
                      lng: fix.coords.longitude
                  },
                  timestamp: fix.timestamp
              });
          }
      }, () => {
          this.fix = null;
      }, {
          enableHighAccuracy: true,
          maximumAge: 0
      });
  }

  componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchId)
  }

  render() {
      return null;
  }
}

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
          main = <Deliveries/>;
      } else {
          main = <Login/>;
      }

      return (
        <div className="App">
            <LocationUpdater/>
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
