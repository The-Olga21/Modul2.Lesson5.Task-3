// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAxE4lgt1C286C10Rj1mznxkLzXFlMq-Vw',
	authDomain: 'todos-50f28.firebaseapp.com',
	projectId: 'todos-50f28',
	storageBucket: 'todos-50f28.appspot.com',
	messagingSenderId: '73015691493',
	appId: '1:73015691493:web:8c0ac62aaef07ed4beac0c',
	databaseURL: 'https://todos-50f28-default-rtdb.europe-west1.firebasedatabase.app/',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
