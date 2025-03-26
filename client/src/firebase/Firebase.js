import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBliKBzqOY_c3j-0Ue_d1tmHkMHIlK71yU",
  authDomain: "uemhackathon.firebaseapp.com",
  databaseURL: "https://uemhackathon-default-rtdb.firebaseio.com",
  projectId: "uemhackathon",
  storageBucket: "uemhackathon.appspot.com",
  messagingSenderId: "650691025025",
  appId: "1:650691025025:web:4a2db26019ecac36951580",
  measurementId: "G-XDMFW5C4K6"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage };
