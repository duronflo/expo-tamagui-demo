import { useDispatch, useSelector } from 'react-redux'
import {  setStatus, submitNewExpense, submitUpdateExpense, submitDeleteExpense, setExpensesState } from './expenseSlice'



export const useExpenses = () => {

  const dispatch = useDispatch();

  const expenses = useSelector(state => state.expenses.expenses);
  const status = useSelector(state => state.expenses.status);


  return {
    // full currency state
    addExpense: async (expense) => dispatch(submitNewExpense(expense)),
    updateExpense: async ({id, newExpense}) => dispatch(submitUpdateExpense({id: id, expense: newExpense})),
    readExpense: (id) => expenses.find((element) => element.id === id),
    setExpenseState: (expenses) => dispatch(setExpensesState({expenses})),
    delExpense: async (id) => dispatch(submitDeleteExpense(id)),
    expenses: expenses,

    // status for screens while async operations
    status: status,
    setStatus: (value) => dispatch(setStatus(value))
  }
}



