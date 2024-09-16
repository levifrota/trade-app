// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDYysD9v2CIN1T4J2a-IEbsFZt3VM0Xkdo',
  authDomain: 'trade-app-b275f.firebaseapp.com',
  projectId: 'trade-app-b275f',
  storageBucket: 'trade-app-b275f.appspot.com',
  messagingSenderId: '349863970857',
  appId: '1:349863970857:web:bb8d3f4e0d83b8c9ac7438',
  measurementId: 'G-P3Y3XRCS69',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);