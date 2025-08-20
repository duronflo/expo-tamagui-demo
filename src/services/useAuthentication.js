import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useUser } from '../features/user/hooks';
import { useCurrencies } from '../features/currencies/hooks';
import { getUserStateFirestore, getCurrenciesStatesFirestore, getCategoriesStatesFirestore, readAllExpensesFirebase } from '../services/firebase';
import { useExpenses } from '../features/expenses/hooks';
import { useCategories } from '../features/categories/hooks';
import {useThemeMode } from '@rneui/themed';
import { useColorScheme } from 'react-native';


const auth = getAuth();

export function useAuthentication() {
  const [user, setUser] = useState();
  const { setUserState } = useUser();
  const { setCurrenciesState } = useCurrencies();
  const {setCategoriesState} = useCategories();
  const {setExpenseState} = useExpenses();
  const [isAuthLoading, setAuthLoading] = useState(true);
  const { mode, setMode } = useThemeMode('dark');

  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
        // here we need a chain for grabing data from firebase and putting it slice by slice into redux.
        getUserStateFirestore(user.uid)
          .then((userData) => {
            setUserState(userData);
          })
          .then(() => getCurrenciesStatesFirestore())
          .then((currencyData) => setCurrenciesState(currencyData))
          .then(() => getCategoriesStatesFirestore())
          .then((categoryData) => setCategoriesState(categoryData))
          .then(() => readAllExpensesFirebase())
          .then((expensesData) => {
            setExpenseState(expensesData)
          } )
          .then(() => 
            {
            setMode('dark');
            setAuthLoading(false);
            
          })
      } else {
        // User is signed out
        setUser(undefined);
        setAuthLoading(false);
      }
    });

    return () => unsubscribeFromAuthStatuChanged();
  }, []);

  return {
    user,
    isAuthLoading
  };
}