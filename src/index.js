// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYYS3ScbmSNxRW356FaSSkAdvpCiwRbDU",
  authDomain: "hourstimer-dad4b.firebaseapp.com",
  projectId: "hourstimer-dad4b",
  storageBucket: "hourstimer-dad4b.appspot.com",
  messagingSenderId: "1018547992856",
  appId: "1:1018547992856:web:941511b18478647bec466d",
  measurementId: "G-7PQT8ENKYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth=getAuth(firebaseApp);
const db=getFirestore(firebaseApp);

onAuthStateChanged(auth,user=>{
    if(user!=null){
        console.log('logged in');


    }
    else{
        console.log('no user');
    }
})