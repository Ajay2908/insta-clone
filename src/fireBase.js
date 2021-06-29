
import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDw7MxgJBngqdqhu2vsqxmi4o-SqshtPdI",
    authDomain: "insta-check-d4345.firebaseapp.com",
    projectId: "insta-check-d4345",
    storageBucket: "insta-check-d4345.appspot.com",
    messagingSenderId: "599574950740",
    appId: "1:599574950740:web:3bb30bafdbdde8f1030ec1",
    measurementId: "G-01Z2S0YFCJ"
};



const app = firebase.initializeApp( firebaseConfig );

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

export { db, auth, storage };