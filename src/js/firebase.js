import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAdwEXpdSJ0iY1xwje5R3Vbv8c3a2APkfM",
  authDomain: "qnh-app.firebaseapp.com",
  databaseURL: "https://qnh-app.firebaseio.com",
  projectId: "qnh-app",
  storageBucket: "qnh-app.appspot.com",
  messagingSenderId: "1027880630848"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;