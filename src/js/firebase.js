import firebase from 'firebase';

//config

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const database = firebase.database();

export default firebase;