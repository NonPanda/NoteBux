import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCUkeYiwVKaAx8rHH21mO0cj8y6SWaNyRo",
  authDomain: "notebux-c7280.firebaseapp.com",
  projectId: "notebux-c7280",
  storageBucket: "notebux-c7280.appspot.com",
  messagingSenderId: "988852058210",
  appId: "1:988852058210:web:cb5fd5862005ba60a1793b"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider, signInWithPopup };
