import moment from 'moment'
import {
  // types
  EXPENSE_ADD,
  EXPENSE_CALCULATE_DETAIL,
  EXPENSE_CLEAR_ERROR,
  EXPENSE_DELETE,
  EXPENSE_EDIT_UPDATE,
  EXPENSE_FETCH,
  EXPENSE_SEARCH,
  EXPENSE_SET_DETAIL,
  EXPENSE_SET_EDIT,
  EXPENSE_UPDATE,
  // selectors
  getDetailExpense,
  getExpensesSubCategory,
  getExpenseSummaryOverPeriod
} from './index'
import {
  deleteObject,
  fetchObjects,
  updateObject,
  writeNewObject,
} from '../firebase'

const objectName = 'expense'

export const addExpense = (expense) => {

  return (dispatch, getState) => {

    dispatch(writeNewExpense(expense))
    dispatch(fetchExpenses())

  }
}

export const deleteExpense = (expense) => {

  return (dispatch, getState) => {

    return dispatch(writeDeleteExpense(expense))
    .then(() => {

      dispatch(fetchExpenses())

    })


  }
}

export const fetchExpenses = () => {

  return (dispatch, getState) => {
    dispatch({ type: EXPENSE_FETCH.PENDING })

    const uid = getState().auth.user.uid
    const allExpenseIds = []
    let expensesById = {}

    return fetchObjects(uid, objectName)
    .then((snapshot) => {

      if (snapshot.val()) {
        snapshot.forEach(item => {
          const expenseId = item.val().id
          let expense = item.val()

          if (!expense.endDate) {
            expense = {
              ...expense,
              endDate: null,
            }
          }

          allExpenseIds.push(expenseId)
          expensesById = {
            ...expensesById,
            [expenseId]: expense,
          }
        })
      }

      dispatch({
        type: EXPENSE_FETCH.SUCCESS,
        payload: {
          allExpenseIds,
          expensesById
        }
      })
    })
    .catch((error) => {

      dispatch({
        type: EXPENSE_FETCH.ERROR,
        payload: {
          error
        }
      })
    })
  }
}

export const setSearchString = (string) => {

  return (dispatch, getState) => {

    dispatch({
      type: EXPENSE_SEARCH.SUCCESS,
      payload: {
        searchString: string,
      }
    })
  }
}

export const setDetailExpense = (id) => {

  return (dispatch, getState) => {

    dispatch({
      type: EXPENSE_SET_DETAIL.SUCCESS,
      payload: {
        detailExpenseId: id
      }
    })
  }
}

export const setEditExpense = (expense) => {

  return (dispatch) => {
    dispatch({
      type: EXPENSE_SET_EDIT.SUCCESS,
      payload: {
        expense
      }
    })
  }
}

export const updateEditExpense = (expense) => {

  return (dispatch) => {
    dispatch({
      type: EXPENSE_EDIT_UPDATE.SUCCESS,
      payload: {
        expense
      }
    })
  }
}

export const updateExpense = (expense) => {

  return (dispatch) => {

    dispatch(writeUpdateExpense(expense))
    dispatch(fetchExpenses())

  }
}

const writeDeleteExpense = (expense) => {

  return (dispatch, getState) => {
    dispatch({ type: EXPENSE_DELETE.PENDING })

    const uid = getState().auth.user.uid

    return deleteObject(uid, objectName, expense)
    .then(() => {

      dispatch({ type: EXPENSE_DELETE.SUCCESS })
    })
    .catch((error) => {

      dispatch({
        type: EXPENSE_DELETE.ERROR,
        payload: {
          error
        }
      })
    })
  }
}

const writeNewExpense = (expense) => {

  return (dispatch, getState) => {
    dispatch({ type: EXPENSE_ADD.PENDING })

    const uid = getState().auth.user.uid

    return writeNewObject(uid, objectName, expense)
    .then(() => {

      dispatch({ type: EXPENSE_ADD.SUCCESS })
    })
    .catch((error) => {

      dispatch({
        type: EXPENSE_ADD.ERROR,
        payload: {
          error
        }
      })
    })
  }
}

const writeUpdateExpense = (expense) => {

  return (dispatch, getState) => {
    dispatch({ type: EXPENSE_UPDATE.PENDING })

    const uid = getState().auth.user.uid

    return updateObject(uid, objectName, expense)
    .then(() => {

      dispatch({ type: EXPENSE_UPDATE.SUCCESS })
    })
    .catch((error) => {

      dispatch({
        type: EXPENSE_UPDATE.ERROR,
        payload: {
          error
        }
      })
    })
  }
}

export const clearExpenseError = () => {

  return (dispatch) => {

    dispatch({ type: EXPENSE_CLEAR_ERROR.SUCCESS })
  }
}
