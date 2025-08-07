import { Platform } from 'react-native';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { connectAuthEmulator, initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

export default initializeFirebase = (firebaseConfig) => {
    const app = initializeApp(firebaseConfig);
    if (Platform.OS !== 'web') {
        initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage)
        });
    }
    const auth = getAuth(app);
    const db = getFirestore(app);

    if (process.env.USE_FIREBASE_EMULATORS === 'true') {
        connectAuthEmulator(auth, "http://127.0.0.1:9099");
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
    }

    return { auth, db };
};



