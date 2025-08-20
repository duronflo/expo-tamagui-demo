import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PENDING, REQUESTING, SUCCESS, ERROR } from "../../utils/helper"
import { addExpenseFirestore, updateExpenseFirestore, deleteExpenseFirestore } from '../../services/firebase'

export const name = 'expenses'

const initialState = {
    
    expenses: [],
    status: SUCCESS,
}
// remove status, which is local and not for saving in firebase
export const { status, ...initialStateExpensesFirebase } = initialState;

function addExpenseFn(state, { payload }) {
    const { expense } = payload;
    state.expenses.push(expense);
}
function updateExpenseFn(state, { payload }) {
    const { id, expense } = payload;
    const idx = state.expenses.findIndex( item => item.id === id);
    state.expenses[idx] = expense;
}
function deleteExpenseFn(state, { payload }) {
    const { id } = payload;
    const idx = state.expenses.findIndex( item => item.id === id);
    state.expenses.splice(idx,1);
}

function setExpensesStateFn(state, { payload }) {
    const { expenses } = payload;
    state.expenses = expenses
}

const reducers = {
    addExpense: addExpenseFn,
    updateExpense: updateExpenseFn,
    setExpensesState: setExpensesStateFn,
    deleteExpense: deleteExpenseFn,
    setStatus: (state, { payload }) => {
        const { value } = payload;
        state.status = value
    }
}

const extraReducers = (builder) => {
    builder
        .addCase(submitNewExpense.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitNewExpense.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitNewExpense.rejected, (state) => {
            state.status = ERROR
        })
        .addCase(submitUpdateExpense.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitUpdateExpense.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitUpdateExpense.rejected, (state) => {
            state.status = ERROR
        })
        .addCase(submitDeleteExpense.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitDeleteExpense.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitDeleteExpense.rejected, (state) => {
            state.status = ERROR
        })

}

export const submitNewExpense = createAsyncThunk(
    "expenses/submitNewExpense",
    async (expense, {dispatch}) => {
        return addExpenseFirestore(expense)
            .then((id) =>  {
                expense['id'] = id;
                dispatch(addExpense({expense, id}));
            }
                )
            .catch(error => console.log(error));
    }
)

export const submitUpdateExpense = createAsyncThunk(
    "expenses/submitUpdateExpense",
    async (updateData, { dispatch}) => {
        const {id, expense} = updateData;
        return updateExpenseFirestore(id, expense)
            .then(() =>  {
                dispatch(updateExpense({id: id, expense: {id: id, ...expense}}));
            }
                )
            .catch(error => console.log(error));
    }
)

export const submitDeleteExpense = createAsyncThunk(
    "expenses/submitDeleteExpense",
    async (id, { dispatch}) => {
        return deleteExpenseFirestore(id)
            .then(() =>  {
                dispatch(deleteExpense({id}));
            }
                )
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
    addExpense,
    updateExpense,
    deleteExpense,
    setExpensesState
} = slice.actions

export default slice.reducer
