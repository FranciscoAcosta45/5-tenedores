import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA8gUvglKSUg-XAGg6utg5hR1RTLfBZy-A",
  authDomain: "tenedores-8c5fa.firebaseapp.com",
  databaseURL: "https://tenedores-8c5fa.firebaseio.com",
  projectId: "tenedores-8c5fa",
  storageBucket: "tenedores-8c5fa.appspot.com",
  messagingSenderId: "403590733912",
  appId: "1:403590733912:web:67bf58d326c4975eef6a2d"

};

export const firebaseApp = firebase.initializeApp(firebaseConfig);