import initializeFirebase from './firebaseService'
import firebaseConfig from './config'
import { doc, setDoc, addDoc, getDocs, updateDoc, getDoc, deleteDoc, collection, query, serverTimestamp } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

import { initialStateCurrenciesFirebase as initialCurrencyStates, name as currencyPath } from "../features/currencies/currencySlice";
import { initialStateCategoryFirebase as initialCategoryStates, name as categoryPath } from '../features/categories/categorySlice';
import { initialStateExpensesFirebase as initialExpenseStates, name as expensePath } from '../features/expenses/expenseSlice';


import { initialState as initialUserStates } from "../features/user/userSlice";
import { CurvedTransition } from 'react-native-reanimated';

export const { auth, db } = initializeFirebase(firebaseConfig);

// ######### Global pathnames in firebase

const userCollectionName = 'users2';
const settingsCollectionName = "settings"
const expensesCollectionName = "expenses"

/// ### Auth related firebase functions

export const getUserId = () => {
    return auth.currentUser.uid;
}

export const logoutFirebase = async () => {
    return signOut(auth).then(() => {

    }).catch((error) => error);
}

export const registerUserFirebase = async (props) => {
    const { email, password, lastName, firstName } = props;
    // remove status from struct
    const { status, ...initialState } = initialUserStates;
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            //init datastructure in firebase
            initialState.email = email;
            initialState.firstName = firstName;
            initialState.lastName = lastName;
            initialState.uid = user.uid;
            const docRef = doc(db, `/${userCollectionName}`, user.uid);
            setDoc(docRef, initialState)
        })
        .then(() => initDocWithinSettingsFirestore(currencyPath, initialCurrencyStates))
        .then(() => initDocWithinSettingsFirestore(categoryPath, initialCategoryStates))
        .catch((error) => error.message)
        .finally(() => initialState);
}


export const loginUserFirebase = async (props) => {
    const { email, password } = props;
    return signInWithEmailAndPassword(auth, email, password)
        .then((userImpl) => userImpl.user)
        .catch((error) => error.message)
}


export const getUserStateFirestore = async (uid) => {
    return new Promise((resolve) => {
        resolve(getDoc(doc(db, userCollectionName, uid)));
    }).then((docSnap) => docSnap.data())
        .catch((error) => error);
}

export const initDocWithinSettingsFirestore = async (docName, initialState) => {
    const docRef = doc(db, `/${userCollectionName}/${auth.currentUser.uid}/${settingsCollectionName}/`, docName);
    await setDoc(docRef, initialState);
}


/// ##### currency related firebase functions

export const getCurrenciesStatesFirestore = async () => {
    return getDoc(doc(db, `/${userCollectionName}/${auth.currentUser.uid}/${settingsCollectionName}/`, currencyPath))
        .then((docSnap) => docSnap.data())
        .catch((error) => {
            console.log(error)
        });
}

export const setCurrenciesStatesFirestore = async (props) => {
    const { defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates } = props;
    const docRef = doc(db, `/${userCollectionName}/${auth.currentUser.uid}/${settingsCollectionName}/`, currencyPath);
    return await setDoc(docRef, { defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates })
        .catch((error) => {
            console.log(error)
        });
}



/// ##### category related firebase functions


export const getCategoriesStatesFirestore = async () => {
    return getDoc(doc(db, `/${userCollectionName}/${auth.currentUser.uid}/${settingsCollectionName}/`, categoryPath))
        .then((docSnap) => docSnap.data())
        .catch((error) => {
            console.log(error)
        });
}

export const setCategoriesStatesFirestore = async (categories) => {
    const docRef = doc(db, `/${userCollectionName}/${auth.currentUser.uid}/${settingsCollectionName}/`, categoryPath);
    return await setDoc(docRef, { categories })
        .catch((error) => {
            console.log(error)
        });
}


/// ##### expense related firebase functions

export const addExpenseFirestore = async (expense) => {
    const { category, name, date, emotion, amount, currencyCode } = expense;
    const colRef = collection(db, `/${userCollectionName}/${auth.currentUser.uid}/${expensesCollectionName}/`);
    try {


        const docRef = await addDoc(colRef,
            {
                category: category,
                name: name,
                date: date,
                emotion: emotion,
                amount: amount,
                currencyCode: currencyCode,
                timestamp: serverTimestamp()
            }
        );
        return docRef.id;
    }
    catch(error)
    {
        console.log(error)
        return 0;
    }

}

export const readExpenseFirestore = async (id) => {
    const colRef = collection(db, `/${userCollectionName}/${auth.currentUser.uid}/${expensesCollectionName}/`);
    const docSnap = await getDoc(doc(colRef, id));
    return docSnap.data();

}

export const readAllExpensesFirebase = async () => {
    const expenses = []
    const q = query(collection(db, `/${userCollectionName}/${auth.currentUser.uid}/${expensesCollectionName}/`));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let data = doc.data();
        data['id'] = doc.id;
        delete data.timestamp;
        expenses.push(data)
    });
    return expenses

}

export const updateExpenseFirestore = async (id, newExpenseData) => {
    const { category, name, date, emotion, amount, currencyCode } = newExpenseData;
    const colRef = collection(db, `/${userCollectionName}/${auth.currentUser.uid}/${expensesCollectionName}/`);
    const docSnap = await updateDoc(doc(colRef, id),
        {
            category: category,
            name: name,
            date: date,
            emotion: emotion,
            amount: amount,
            currencyCode: currencyCode,
            timestamp: serverTimestamp()
        }
    );
}

export const deleteExpenseFirestore = async (id) => {
    const colRef = collection(db, `/${userCollectionName}/${auth.currentUser.uid}/${expensesCollectionName}/`);
    try {
        await deleteDoc(doc(colRef, id));
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}


