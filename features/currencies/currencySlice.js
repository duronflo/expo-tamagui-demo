import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PENDING, REQUESTING, SUCCESS, ERROR } from "../../utilities/helper"
import { addExchangeRateFirestore, addCurrencyFirestore, setDefaultCurrencyFirestore, getCurrenciesStatesFirestore, setCurrenciesStatesFirestore } from '../../services/firebase'

export const name = 'currencies'

const initialState = {
    defaultCurrencyCode: "EUR",
    lastCurrencyCode: 'EUR',
    usedCurrencies: [{
        name: "Euro",
        code: "EUR",
        icon: "euro-sign",
        icon_type: "font-awesome-5"
    }],
    exchangeRates: [],
    status: SUCCESS,
}
// remove status, which is local and not for saving in firebase
export const { status, ...initialStateCurrenciesFirebase } = initialState;

function setNewCurrenciesState(state, { payload }) {
    const { defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates } = payload;
    state.defaultCurrencyCode = defaultCurrencyCode;
    state.lastCurrencyCode = lastCurrencyCode;
    state.usedCurrencies = usedCurrencies;
    state.exchangeRates = exchangeRates;
}

function setDefaultCurrencyFn(state, { payload }) {
    const { code } = payload;
    state.defaultCurrencyCode = code;
}

function setLastCurrencyFn(state, { payload }) {
    const { code } = payload;
    state.lastCurrencyCode = code;
}

function addCurrencyFn(state, { payload }) {
    const { code, name, icon , icon_type  } = payload;
    state.usedCurrencies.push({code,name, icon : icon || 'money-bill', icon_type : icon_type || 'font-awesome-5'});
}

function delCurrencyFn(state, { payload }) {
    const { code } = payload;
    const idx = state.usedCurrencies.findIndex(element => element.code === code);
    state.usedCurrencies.splice(idx,1);

}

function addExchangerateFn(state, { payload }) {
    const { code1, code2, rate  } = payload;
    state.exchangeRates.push({code1, code2, rate});
}

const reducers = {
    setDefaultCurrency: setDefaultCurrencyFn,
    setLastCurrency: setLastCurrencyFn,
    setCurrenciesState: setNewCurrenciesState,
    addCurrency: addCurrencyFn,
    delCurrency: delCurrencyFn,
    addExchangerate: addExchangerateFn,
    setStatus: (state, { payload }) => {
        const { value } = payload;
        state.status = value
    }
}

const extraReducers = (builder) => {
    builder
        .addCase(submitDefaultCurrency.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitDefaultCurrency.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitDefaultCurrency.rejected, (state) => {
            state.status = ERROR
        })
        .addCase(submitLastCurrency.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitLastCurrency.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitLastCurrency.rejected, (state) => {
            state.status = ERROR
        })
        .addCase(submitNewExchangeRate.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitNewExchangeRate.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitNewExchangeRate.rejected, (state) => {
            state.status = ERROR
        })
        .addCase(submitNewCurrency.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitNewCurrency.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitNewCurrency.rejected, (state) => {
            state.status = ERROR
        })
        .addCase(submitDelCurrency.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitDelCurrency.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitDelCurrency.rejected, (state) => {
            state.status = ERROR
        })

}

export const submitDefaultCurrency = createAsyncThunk(
    "currencies/submitDefaultCurrencyAsync",
    async (code, {getState, dispatch}) => {
        dispatch(setDefaultCurrency({code}))
        const newCurrencies = getState().currencies;
        const {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates} = newCurrencies;
        return setCurrenciesStatesFirestore({defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .then(() =>  {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .catch(error => console.log(error));
    }
)

export const submitLastCurrency = createAsyncThunk(
    "currencies/submitLastCurrencyAsync",
    async (code, {getState, dispatch}) => {
        dispatch(setLastCurrency({code}))
        const newCurrencies = getState().currencies;
        const {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates} = newCurrencies;
        return setCurrenciesStatesFirestore({defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .then(() =>  {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .catch(error => console.log(error));
    }
)


export const submitNewExchangeRate = createAsyncThunk(
    "currencies/submitNewExchangeRate",
    async (props, {getState, dispatch}) => {
        const { code1, code2, rate } = props;
        dispatch(addExchangerate({code1: code1, code2: code2, rate: parseFloat(rate.toFixed(7))}));
        dispatch(addExchangerate({code1: code2, code2: code1, rate: parseFloat((1/rate).toFixed(7)) }));
        const newCurrencies = getState().currencies;
        const {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates} = newCurrencies;
        return setCurrenciesStatesFirestore({defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .then(() =>  {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .catch(error => console.log(error));
    }
)


export const submitNewCurrency = createAsyncThunk(
    "currencies/submitNewCurrencyAsync",
    async (props, {getState, dispatch}) => {
        const { currency: {code, name, icon, icon_type} , exchangeRate, baseCurrency } = props;
        dispatch(addCurrency({name, code, icon, icon_type}));
        dispatch(addExchangerate({code1: baseCurrency, code2: code, rate: parseFloat(exchangeRate)}));
        dispatch(addExchangerate({code1: code, code2: baseCurrency, rate: parseFloat((1/exchangeRate).toFixed(7)) }));
        const newCurrencies = getState().currencies;
        const {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates} = newCurrencies;
        return setCurrenciesStatesFirestore({defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .then(() =>  {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .catch(error => console.log(error));
    }
)

export const submitDelCurrency = createAsyncThunk(
    "currencies/submitDelCurrency",
    async (props, {getState, dispatch}) => {
        const { code } = props;
        dispatch(delCurrency({code}));
        const newCurrencies = getState().currencies;
        const {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates} = newCurrencies;
        return setCurrenciesStatesFirestore({defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .then(() =>  {defaultCurrencyCode, lastCurrencyCode, usedCurrencies, exchangeRates})
            .catch(error => console.log(error));
    }
)


const slice = createSlice({
    name,
    initialState,
    reducers,
    extraReducers
})

export const {
    setDefaultCurrency,
    setLastCurrency,
    addCurrency,
    delCurrency,
    addExchangerate,
    setCurrenciesState,
    setStatus
} = slice.actions

export default slice.reducer