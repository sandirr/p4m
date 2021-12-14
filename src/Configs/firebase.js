import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAcLfxsGLHbg_iidKYkshv418pLdibuGnA',
  authDomain: 'p4-mahasiswa.firebaseapp.com',
  databaseURL: 'https://p4-mahasiswa-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'p4-mahasiswa',
  storageBucket: 'p4-mahasiswa.appspot.com',
  messagingSenderId: '329835326389',
  appId: '1:329835326389:web:7dac59ca1b318a2b9187fc'
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const fDB = getDatabase(app);
export const fAuth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);