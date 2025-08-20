
import { combineReducers } from 'redux'
import currencies from '../features/currencies/currencySlice'
import user from '../features/user/userSlice'
import categories from '../features/categories/categorySlice'
import expenses from '../features/expenses/expenseSlice'

const rootReducer = combineReducers({
    user,
    currencies,
    categories,
    expenses

})

export default rootReducer


