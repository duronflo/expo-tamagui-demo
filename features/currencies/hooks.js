import { useDispatch, useSelector } from 'react-redux'
import { setCurrenciesState, submitNewExchangeRate, setStatus, submitDefaultCurrency, submitNewCurrency, submitDelCurrency, submitLastCurrency, submitLastCurrency as submitLastCurrencyCode } from './currencySlice'



export const useCurrencies = () => {

  const dispatch = useDispatch()

  const defaultCurrencyCode = useSelector(state => state.currencies.defaultCurrencyCode);
  const lastCurrencyCode = useSelector(state => state.currencies.lastCurrencyCode);
  const exchangeRates = useSelector(state => state.currencies.exchangeRates);
  const usedCurrencies = useSelector(state => state.currencies.usedCurrencies);
  const status = useSelector(state => state.currencies.status);
  const fullCurrenciyState = useSelector(state => state.currencies);

  const getDefaultCurrencyObject = () => {
    return usedCurrencies.find((item) => item.code === defaultCurrencyCode);
  }

  const findExchangeRate = (code1, code2) => {
    
    const exchangeRateObj = exchangeRates.findLast((item) => item.code1 === code1 && item.code2 === code2);
    
    if (exchangeRateObj) {
      return exchangeRateObj.rate
    }
    else {
      return 0;
    }
  }

  return {
    // full currency state
    setCurrenciesState: (props) => dispatch(setCurrenciesState(props)),
    currenciesState: fullCurrenciyState,
    // default currency
    setDefaultCurrencyCode: (code) => dispatch(submitDefaultCurrency(code)),
    defaultCurrencyCode: defaultCurrencyCode,
    getDefaultCurrencyObject: getDefaultCurrencyObject,
    // last currency code
    lastCurrencyCode: lastCurrencyCode,
    setLastCurrencyCode: (code) => dispatch(submitLastCurrency(code)),
    // used currencies
    addNewCurrency: ({ currency : {name, code, icon, icon_type}, exchangeRate, baseCurrency }) => dispatch(submitNewCurrency({ currency : {name, code, icon, icon_type}, exchangeRate, baseCurrency })),
    removeCurrency: (code) => dispatch(submitDelCurrency({code})),
    usedCurrencies: usedCurrencies,
    // exchangerates
    addNewExchangeRate: ({ code1, code2, rate }) => dispatch(submitNewExchangeRate({ code1, code2, rate })),
    exchangeRates: exchangeRates,
    getExchangeRate: findExchangeRate,
    // status for screens while async operations
    status: status,
    setStatus: (value) => dispatch(setStatus(value))
  }
}



