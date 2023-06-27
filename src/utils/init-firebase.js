import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDYzruUzUjDMM_xVUOOvlWOuUToxPJcNYU",
  authDomain: "gppenportalclone.firebaseapp.com",
  databaseURL: "https://gppenportalclone-default-rtdb.firebaseio.com",
  projectId: "gppenportalclone",
  storageBucket: "gppenportalclone.appspot.com",
  messagingSenderId: "940197955828",
  appId: "1:940197955828:web:5beed4f90354e0f76036a1",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

export { database, storage };
export const auth = getAuth(app);
