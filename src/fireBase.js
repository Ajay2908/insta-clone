
import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCAHYunNZ9lWYn_xxcyKLYHic7naigYIzU",
    authDomain: "instagram-clone-cbada.firebaseapp.com",
    projectId: "instagram-clone-cbada",
    storageBucket: "instagram-clone-cbada.appspot.com",
    messagingSenderId: "760366423543",
    appId: "1:760366423543:web:481c51f58ee5708634e2f2"
};



const app = firebase.initializeApp( firebaseConfig );

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

export { db, auth, storage };