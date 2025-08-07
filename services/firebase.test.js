// currencies
import {
    registerUserFirebase,
    getUserId,
    loginUserFirebase,
    getUserStateFirestore,
    logoutFirebase,
    getCurrenciesStatesFirestore,
    auth,
    getCategoriesStatesFirestore,
    addExpenseFirestore,
    readAllExpensesFirebase,
    readExpenseFirestore,
    updateExpenseFirestore,
    deleteExpenseFirestore
} from './firebase';
import { setCurrenciesState, submitDefaultCurrency, submitNewExchangeRate, submitNewCurrency, submitDelCurrency, submitLastCurrency } from '../features/currencies/currencySlice';

// categories
import { submitNewCategory, submitNewCategories, removeCategory, updateCategoryName } from '../features/categories/categorySlice'

// expenses
import { submitNewExpense, setExpensesState, submitUpdateExpense, submitDeleteExpense } from '../features/expenses/expenseSlice'

// userSlice 
import { loginUser, setUserState } from '../features/user/userSlice';
// general
import initializeStore from '../store';

// assets
const currencyData = require("../../assets/data/currencies.json");


// workaround for xmlhttprequest during jest runner ....
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;


jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const store = initializeStore();

describe('Firebase Test Auth-Flow', () => {
    beforeAll(done => {
        done()
    });
    afterAll(done => {
        done()
    });

    test('Create new user and check firebase structure', async () => {

        const email = "testuser2@web.de"
        const password = "test12211!"
        const lastName = 'Richter';
        const firstName = 'Florian';
        const props = { email, password, lastName, firstName };
        await registerUserFirebase(props);

        const userState = await getUserStateFirestore(getUserId());
        expect(email).toBe(userState.email)
    });

    test('Logout with newly created user', async () => {

        logoutFirebase()
            .then(() => {
                const user = auth.currentUser;
                expect(user).toBe(null)
            })

    });

    test('Login with wrong pasword', async () => {

        const email = "testuser2@web.de"
        const password = "ss!"
        const props = { email, password };
        expect(await loginUserFirebase(props)).toMatch('auth/wrong-password');

    });

    test('Login with wrong username', async () => {

        const email = "testuseddr2@web.de"
        const password = "test12211!"
        const props = { email, password };
        expect(await loginUserFirebase(props)).toMatch('auth/user-not-found');

    });

    test('Login with newly created user and check firebase structure', async () => {

        const email = "testuser2@web.de"
        const password = "test12211!"
        const props = { email, password };
        await loginUserFirebase(props);

        const userState = await getUserStateFirestore(getUserId());
        expect(email).toBe(userState.email)
        const user = auth.currentUser;
        expect(user.uid).toBe(userState.uid)
    });

});

describe('E2E - Users - Firebase and redux', () => {
    beforeAll(async () => {

    });
    afterAll(done => {
        done()
    });


    test('Redux-action: Login with newly created user and check firebase.', async () => {
        const email = "testuser2@web.de"
        const password = "test12211!"
        const props = { email, password };
        await store.dispatch(loginUser(props))

        const userState = await getUserStateFirestore(getUserId());
        expect(email).toBe(userState.email)
        const user = auth.currentUser;
        expect(user.uid).toBe(userState.uid)

    });

    test('Redux-action: setUserState function from firebase-data', async () => {
        const user = auth.currentUser;
        const userData = await getUserStateFirestore(user.uid)

        store.dispatch(setUserState(userData));
        const userState = store.getState().user;
        expect(user.uid).toBe(userState.uid)

    });

});


describe('E2E - Currencies - Firebase and redux', () => {
    beforeAll(async () => {

    });
    afterAll(done => {
        done()
    });



    test('Redux-action: setCurrencyState function from firebase-data', async () => {
        const currencyData = await getCurrenciesStatesFirestore()

        store.dispatch(setCurrenciesState(currencyData));
        const currencies = store.getState().currencies;
        expect(currencies.defaultCurrencyCode).toBe("EUR")

        const firebaseCurrencies = await getCurrenciesStatesFirestore();

        expect(firebaseCurrencies.defaultCurrencyCode).toBe("EUR");


    });

    test('Redux-action: set "USD" as new default currency', async () => {
        await store.dispatch(submitDefaultCurrency("USD"))

        const currencies = store.getState().currencies;
        expect(currencies.defaultCurrencyCode).toBe("USD")

        const firebaseCurrencies = await getCurrenciesStatesFirestore();

        expect(firebaseCurrencies.defaultCurrencyCode).toBe("USD");


    });

    test('Redux-action: set "EUR" as last currency', async () => {
        await store.dispatch(submitLastCurrency("EUR"))

        const currencies = store.getState().currencies;
        expect(currencies.lastCurrencyCode).toBe("EUR")

        const firebaseCurrencies = await getCurrenciesStatesFirestore();

        expect(firebaseCurrencies.lastCurrencyCode).toBe("EUR");


    });

    test('Redux-action: add new Currency with exchangerate', async () => {


        await store.dispatch(submitNewCurrency({ currency: currencyData[0], exchangeRate: 1.22, baseCurrency: 'EUR' }))

        const currencies = store.getState().currencies;
        const firebaseCurrencies = await getCurrenciesStatesFirestore();


        // check new usedCurrencies
        expect(currencies.usedCurrencies[1].name).toBe('US Dollar');
        expect(currencies.usedCurrencies[1].code).toBe('USD');

        // check also added exchangerates ...
        expect(currencies.exchangeRates[0].code1).toBe('EUR');
        expect(currencies.exchangeRates[0].code2).toBe('USD');
        expect(currencies.exchangeRates[0].rate).toBe(1.22);

        expect(currencies.exchangeRates[1].code1).toBe('USD');
        expect(currencies.exchangeRates[1].code2).toBe('EUR');
        expect(currencies.exchangeRates[1].rate.toFixed(5)).toBe((1 / 1.22).toFixed(5));

        // check also within firebase
        expect(firebaseCurrencies.usedCurrencies[1].name).toBe('US Dollar');
        expect(firebaseCurrencies.usedCurrencies[1].code).toBe('USD');

        expect(firebaseCurrencies.exchangeRates[0].code1).toBe('EUR');
        expect(firebaseCurrencies.exchangeRates[0].code2).toBe('USD');
        expect(firebaseCurrencies.exchangeRates[0].rate).toBe(1.22);

        expect(firebaseCurrencies.exchangeRates[1].code1).toBe('USD');
        expect(firebaseCurrencies.exchangeRates[1].code2).toBe('EUR');
        expect(firebaseCurrencies.exchangeRates[1].rate.toFixed(5)).toBe((1 / 1.22).toFixed(5));

    })

    test('Redux-action: add new Currency (incomplete no icon) with exchangerate', async () => {


        await store.dispatch(submitNewCurrency({ currency: currencyData[4], exchangeRate: 1.03, baseCurrency: 'EUR' }))

        const currencies = store.getState().currencies;
        const firebaseCurrencies = await getCurrenciesStatesFirestore();

        // check new usedCurrencies
        expect(currencies.usedCurrencies[2].name).toBe('Swiss Franc');
        expect(currencies.usedCurrencies[2].code).toBe('CHF');

        // check also added exchangerates ...
        expect(currencies.exchangeRates[2].code1).toBe('EUR');
        expect(currencies.exchangeRates[2].code2).toBe('CHF');
        expect(currencies.exchangeRates[2].rate).toBe(1.03);

        expect(currencies.exchangeRates[3].code1).toBe('CHF');
        expect(currencies.exchangeRates[3].code2).toBe('EUR');
        expect(currencies.exchangeRates[3].rate.toFixed(5)).toBe((1 / 1.03).toFixed(5));

        // check also within firebase
        expect(firebaseCurrencies.usedCurrencies[2].name).toBe('Swiss Franc');
        expect(firebaseCurrencies.usedCurrencies[2].code).toBe('CHF');

        expect(firebaseCurrencies.exchangeRates[2].code1).toBe('EUR');
        expect(firebaseCurrencies.exchangeRates[2].code2).toBe('CHF');
        expect(firebaseCurrencies.exchangeRates[2].rate).toBe(1.03);

        expect(firebaseCurrencies.exchangeRates[3].code1).toBe('CHF');
        expect(firebaseCurrencies.exchangeRates[3].code2).toBe('EUR');
        expect(firebaseCurrencies.exchangeRates[3].rate.toFixed(5)).toBe((1 / 1.03).toFixed(5));

    })

    test('Redux-action: add new exchange rate', async () => {
        await store.dispatch(submitNewExchangeRate({ code1: 'EUR', code2: 'USD', rate: 1.77 }))

        const currencies = store.getState().currencies;
        const firebaseCurrencies = await getCurrenciesStatesFirestore();

        expect(currencies.exchangeRates[4].code1).toBe('EUR');
        expect(currencies.exchangeRates[4].code2).toBe('USD');
        expect(currencies.exchangeRates[4].rate).toBe(1.77);

        expect(currencies.exchangeRates[5].code1).toBe('USD');
        expect(currencies.exchangeRates[5].code2).toBe('EUR');
        expect(currencies.exchangeRates[5].rate.toFixed(5)).toBe((1 / 1.77).toFixed(5));

        // check also within firebase
        expect(firebaseCurrencies.exchangeRates[4].code1).toBe('EUR');
        expect(firebaseCurrencies.exchangeRates[4].code2).toBe('USD');
        expect(firebaseCurrencies.exchangeRates[4].rate).toBe(1.77);

        expect(firebaseCurrencies.exchangeRates[5].code1).toBe('USD');
        expect(firebaseCurrencies.exchangeRates[5].code2).toBe('EUR');
        expect(firebaseCurrencies.exchangeRates[5].rate.toFixed(5)).toBe((1 / 1.77).toFixed(5));

    });



    test('Redux-action: delete currency', async () => {
        await store.dispatch(submitDelCurrency({ name: 'British Pound Sterling', code: 'GBP' }))

        const currencies = store.getState().currencies;
        const firebaseCurrencies = await getCurrenciesStatesFirestore();


        // check new usedCurrencies
        expect(currencies.usedCurrencies.length).toBe(2);


        expect(firebaseCurrencies.usedCurrencies.length).toBe(2);

    })




});

describe('E2E - Categories - Firebase and redux', () => {
    beforeAll(async () => {

    });
    afterAll(done => {
        done()
    });



    test('Redux-action: addNewCategory from firebase data: add first category and check with redux and firebase result', async () => {
        const category = {
            name: 'Lebensmittel',
            avatar_icon: 'desktop',
            icon_type: 'font-awesome',
            avatar_background: 'blue'
        }
        await store.dispatch(submitNewCategory(category))
        const reduxCategories = store.getState().categories;
        expect(reduxCategories.categories[0].name).toBe("Lebensmittel")
        expect(reduxCategories.categories[0].avatar_icon).toBe("desktop")
        expect(reduxCategories.categories[0].icon_type).toBe("font-awesome")
        expect(reduxCategories.categories[0].avatar_background).toBe("blue")

        const firebaseCategories = await getCategoriesStatesFirestore();

        expect(firebaseCategories.categories[0].name).toBe("Lebensmittel")
        expect(firebaseCategories.categories[0].avatar_icon).toBe("desktop")
        expect(firebaseCategories.categories[0].icon_type).toBe("font-awesome")
        expect(firebaseCategories.categories[0].avatar_background).toBe("blue")

    });

    test('Redux-action: addNewCategory from firebase data: add second category and check with redux and firebase result', async () => {
        const category = {
            name: 'Büro',
            avatar_icon: 'desktop',
            icon_type: 'font-awesome',
            avatar_background: 'blue'
        }
        await store.dispatch(submitNewCategory(category))
        const reduxCategories = store.getState().categories;
        expect(reduxCategories.categories[0].name).toBe("Lebensmittel")
        expect(reduxCategories.categories[1].name).toBe("Büro")

        const firebaseCategories = await getCategoriesStatesFirestore();

        expect(firebaseCategories.categories[0].name).toBe("Lebensmittel")
        expect(firebaseCategories.categories[1].name).toBe("Büro")

    });

    test('Redux-action: addNewCategory from firebase data: add third and fourth category with array-function', async () => {
        const newCategories = [{
            name: 'Handy',
            avatar_icon: 'desktop',
            icon_type: 'font-awesome',
            avatar_background: 'blue'
        },
        {
            name: 'Versicherung',
            avatar_icon: 'desktop',
            icon_type: 'font-awesome',
            avatar_background: 'blue'
        }
        ]

        await store.dispatch(submitNewCategories(newCategories));

        const reduxCategories = store.getState().categories;
        expect(reduxCategories.categories[0].name).toBe("Lebensmittel")
        expect(reduxCategories.categories[1].name).toBe("Büro")
        expect(reduxCategories.categories[2].name).toBe("Handy")
        expect(reduxCategories.categories[3].name).toBe("Versicherung")

        const firebaseCategories = await getCategoriesStatesFirestore();

        expect(firebaseCategories.categories[0].name).toBe("Lebensmittel")
        expect(firebaseCategories.categories[1].name).toBe("Büro")
        expect(firebaseCategories.categories[2].name).toBe("Handy")
        expect(firebaseCategories.categories[3].name).toBe("Versicherung")
    });


    test('Redux-action: addNewCategory from firebase data: add fifth category, and delete three', async () => {
        const category = {
            name: 'Tierfutter',
            avatar_icon: 'desktop',
            icon_type: 'font-awesome',
            avatar_background: 'blue'
        }

        await store.dispatch(submitNewCategory(category))

        let categories = store.getState().categories;
        expect(categories.categories[4].name).toBe("Tierfutter")

        const category2 = {
            name: 'Versicherung',
            avatar_icon: 'desktop',
            icon_type: 'font-awesome',
            avatar_background: 'blue'
        }

        await store.dispatch(removeCategory(category2))

        categories = store.getState().categories;

        await store.dispatch(removeCategory(categories.categories[0]));
        categories = store.getState().categories;
        await store.dispatch(removeCategory(categories.categories[0]));
        categories = store.getState().categories;
        expect(categories.categories[0].name).toBe("Handy")
        expect(categories.categories[1].name).toBe("Tierfutter")

        const firebaseCategories = await getCategoriesStatesFirestore();

        expect(firebaseCategories.categories[0].name).toBe("Handy")
        expect(firebaseCategories.categories[1].name).toBe("Tierfutter")
    });

    test('Redux-action: Update a categories name', async () => {
        const category = {
            name: 'Wallet',
            avatar_icon: 'desktop',
            icon_type: 'font-awesome',
            avatar_background: 'blue'
        }
        await store.dispatch(submitNewCategory(category))
        let categories = store.getState().categories;
        expect(categories.categories[2].name).toBe("Wallet")
        const props = { category, newName: 'Geldbeutel' }
        await store.dispatch(updateCategoryName(props))
        categories = store.getState().categories;
        expect(categories.categories[2].name).toBe("Geldbeutel")
        const firebaseCategories = await getCategoriesStatesFirestore();

        expect(firebaseCategories.categories[2].name).toBe("Geldbeutel")
    });

});

describe('E2E - Expenses - Firebase and redux', () => {
    beforeAll(async () => {

    });
    afterAll(done => {
        done()
    });


    test('Firebase: add two expenses and read them all (firebase-only)', async () => {
        const expense = {
            category: 'Entertainment',
            name: 'Kino',
            date: 'today',
            emotion: 5,
            amount: 5.55,
            currencyCode: "EUR",
        }
        const expense2 = {
            category: 'Food',
            name: 'Supermarket',
            date: 'today',
            emotion: 5,
            amount: 5.55,
            currencyCode: "EUR",
        }
        const id1 = await addExpenseFirestore(expense)
        const id2 = await addExpenseFirestore(expense2)

        const expenses = await readAllExpensesFirebase();
        expect(expenses.find(item => item.name === 'Supermarket').name).toBe('Supermarket')

        expect(expenses.find(item => item.name === 'Kino').name).toBe('Kino')


    });


    test('Firebase: add one expensea and read it by ID (firebase-only)', async () => {
        const expense = {
            category: 'Car',
            name: 'Tyres',
            date: 'today',
            emotion: 5,
            amount: 5.55,
            currencyCode: "EUR",
        }
        const id = await addExpenseFirestore(expense)

        const readExpense = await readExpenseFirestore(id);
        expect(readExpense.name).toBe('Tyres')



    });

    test('Firebase: Update one expense', async () => {

        const expenses = await readAllExpensesFirebase();

        const expense = expenses.find(item => item.name === 'Kino');

        expense.name = "Restaurant"

        await updateExpenseFirestore(expense.id, expense);
        const readExpense = await readExpenseFirestore(expense.id);
        expect(readExpense.name).toBe('Restaurant')

    });


    test('Firebase: Delete one expense', async () => {

        const expenses = await readAllExpensesFirebase();

        const expense = expenses.find(item => item.name === 'Restaurant');

        await deleteExpenseFirestore(expense.id);

        const expensesNew = await readAllExpensesFirebase();
        expect(expensesNew.length).toBe(2)

    });

    test('Firebase: Delete all expenses', async () => {

        const expenses = await readAllExpensesFirebase();

        expenses.forEach(async item => await deleteExpenseFirestore(item.id))


        const expensesNew = await readAllExpensesFirebase();
        expect(expensesNew.length).toBe(0)

    });


    test('FIREBASE+REDUX: add two expenses and read them all from REDUX.', async () => {
        const expense = {
            category: 'Entertainment',
            name: 'Auto-Kino',
            date: 'today',
            emotion: 5,
            amount: 5.55,
            currencyCode: "EUR",
        }
        const expense2 = {
            category: 'Food',
            name: 'Grocery Store',
            date: 'today',
            emotion: 5,
            amount: 30,
            currencyCode: "USD",
        }

        store.dispatch(setExpensesState({ expenses: [] }));

        await store.dispatch(submitNewExpense(expense))
        await store.dispatch(submitNewExpense(expense2))

        expenses = store.getState().expenses.expenses;

        expect(expenses.find(item => item.name === 'Grocery Store').name).toBe('Grocery Store')

        expect(expenses.find(item => item.name === 'Auto-Kino').name).toBe('Auto-Kino')


    });

    test('FIREBASE+REDUX: add two expenses and read them all from REDUX.', async () => {

        // empty redux state
        store.dispatch(setExpensesState({ expenses: [] }));

        let expenses = store.getState().expenses.expenses;
        // check if really empty
        expect(expenses).toHaveLength(0)
        // read all expenses
        expenses = await readAllExpensesFirebase();

        store.dispatch(setExpensesState({ expenses }));

        expenses = store.getState().expenses.expenses;

        expect(expenses.find(item => item.name === 'Grocery Store').name).toBe('Grocery Store')

        expect(expenses.find(item => item.name === 'Auto-Kino').name).toBe('Auto-Kino')



    });

    test('FIREBASE+REDUX: Update first expense.', async () => {

        let expenses = store.getState().expenses.expenses;

        const toUpdateExpense = {
            category: 'Food',
            name: 'Barber Shop',
            date: 'today',
            emotion: 5,
            amount: 30,
            currencyCode: "USD",
        }

        const groceryExpense = expenses.find(item => item.name === 'Grocery Store');
        await store.dispatch(submitUpdateExpense({id: groceryExpense.id, expense: toUpdateExpense}));

        expenses = store.getState().expenses.expenses;

        expect(expenses.find(item => item.name === 'Barber Shop').name).toBe('Barber Shop')
    });

    test('FIREBASE+REDUX: Delete expense.', async () => {

        let expenses = store.getState().expenses.expenses;
        expect(expenses).toHaveLength(2);
        const delExpense = expenses.find(item => item.name === 'Barber Shop');
        await store.dispatch(submitDeleteExpense(delExpense.id));

        expenses = store.getState().expenses.expenses;
        expect(expenses).toHaveLength(1);

    });



});
