import {
  // types
  EXPENSE_ADD,
  EXPENSE_CLEAR_ERROR,
  EXPENSE_DELETE,
  EXPENSE_EDIT_UPDATE,
  EXPENSE_FETCH,
  EXPENSE_SEARCH,
  EXPENSE_SET_DETAIL,
  EXPENSE_SET_EDIT,
  EXPENSE_UPDATE,
  // category
  expensesCategory
} from './index'

import {
  // type
  AUTH_SIGNOUT
} from '../auth'

const initialState = {
  allExpenseIds: [],
  expensesById: {},
  categories: expensesCategory.categories,
  subCategories: expensesCategory.subCategories,
  detailExpenseId: null,
  editExpense: null,
  isCalculating: false,
  isFetchingExpenses: false,
  isSearchingExpenses: false,
  isUpdatingExpense: false,
  expenseSearchString: '',
  error: null,
}

export const expensesReducer = (state = initialState, action = {}) => {

  switch (action.type) {
    case EXPENSE_ADD.PENDING:
      return {
        ...state,
        isUpdatingExpense: true,
        error: null,
      }

    case EXPENSE_ADD.SUCCESS:
      return {
        ...state,
        editExpense: null,
        isUpdatingExpense: false,
      }

    case EXPENSE_ADD.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isUpdatingExpense: false,
        error
      }
    }

    case EXPENSE_CLEAR_ERROR.SUCCESS:
      return {
        ...state,
        error: null,
      }

    case EXPENSE_DELETE.PENDING:
      return {
        ...state,
        isUpdatingExpense: true,
        error: null,
      }

    case EXPENSE_DELETE.SUCCESS:
      return {
        ...state,
        detailExpenseId: null,
        editExpense: null,
        isUpdatingExpense: false,
      }

    case EXPENSE_DELETE.ERROR: {
      const { payload } = action
      const { error } = action

      return {
        ...state,
        isUpdatingExpense: false,
        error
      }
    }

    case EXPENSE_EDIT_UPDATE.SUCCESS: {
      const { payload } = action
      const { expense } = payload

      return {
        ...state,
        editExpense: expense
      }
    }

    case EXPENSE_FETCH.PENDING:
      return {
        ...state,
        isFetchingExpenses: true,
        error: null,
      }

    case EXPENSE_FETCH.SUCCESS: {
      const { payload } = action
      const {
        allExpenseIds,
        expensesById,
      } = payload

      return {
        ...state,
        isFetchingExpenses: false,
        allExpenseIds,
        expensesById
      }
    }

    case EXPENSE_FETCH.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isFetchingExpenses: false,
        error,
      }
    }

    case EXPENSE_SEARCH.PENDING:
      return {
        ...state,
        isSearchingExpenses: true,
        error: null
      }

    case EXPENSE_SEARCH.SUCCESS: {
      const { payload } = action
      const { searchString } = payload

      return {
        ...state,
        isSearchingExpenses: false,
        expenseSearchString: searchString,
      }
    }

    case EXPENSE_SEARCH.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isSearchingExpenses: false,
        error,
      }
    }

    case EXPENSE_SET_DETAIL.PENDING:
      return {
        ...state,
        isCalculating: true,
        error: null,
      }

    case EXPENSE_SET_DETAIL.SUCCESS: {
      const { payload } = action
      const { detailExpenseId } = payload

      return {
        ...state,
        detailExpenseId,
        isCalculating: false,
      }
    }

    case EXPENSE_SET_DETAIL.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isCalculating: false,
        error
      }
    }

    case EXPENSE_SET_EDIT.SUCCESS: {
      const { payload } = action
      const { expense } = payload

      return {
        ...state,
        editExpense: expense,
      }
    }

    case EXPENSE_UPDATE.PENDING:
      return {
        ...state,
        isUpdatingExpense: true,
        error: null,
      }

    case EXPENSE_UPDATE.SUCCESS:
      return {
        ...state,
        editExpense: null,
        isUpdatingExpense: false,
      }

    case EXPENSE_UPDATE.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isUpdatingExpense: false,
        error,
      }
    }

    case AUTH_SIGNOUT.SUCCESS:
      return {
        ...initialState
      }

    default:
      return state

  }
}
