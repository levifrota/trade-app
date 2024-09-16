import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDYysD9v2CIN1T4J2a-IEbsFZt3VM0Xkdo",
  authDomain: "trade-app-b275f.firebaseapp.com",
  projectId: "trade-app-b275f",
  storageBucket: "trade-app-b275f.appspot.com",
  messagingSenderId: "349863970857",
  appId: "1:349863970857:web:bb8d3f4e0d83b8c9ac7438",
  measurementId: "G-P3Y3XRCS69"
};

// Inicializa o Firebase apenas se ainda não houver apps inicializados
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializa Firestore e Auth
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
