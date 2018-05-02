import {
  // types
  INCOME_ADD,
  INCOME_CLEAR_ERROR,
  INCOME_DELETE,
  INCOME_EDIT_UPDATE,
  INCOME_FETCH,
  INCOME_SEARCH,
  INCOME_SET_DETAIL,
  INCOME_SET_EDIT,
  INCOME_UPDATE,
  // category
  incomesCategory,
} from './index'

import {
  // type
  AUTH_SIGNOUT
} from '../auth'

const initialState = {
  allIncomeIds: [],
  incomesById: {},
  categories: incomesCategory.categories,
  subCategories: incomesCategory.subCategories,
  detailIncomeId: null,
  editIncome: null,
  incomeSearchString: '',
  isCalculating: false,
  isFetchingIncomes: false,
  isSearchingIncomes: false,
  isUpdatingIncome: false,
  error: null,
}

export const incomesReducer = (state = initialState, action = {}) => {

  switch (action.type) {
    case INCOME_ADD.PENDING:
      return {
        ...state,
        isUpdatingIncome: true,
        error: null,
      }

    case INCOME_ADD.SUCCESS:
      return {
        ...state,
        editIncome: null,
        isUpdatingIncome: false,
      }

    case INCOME_ADD.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isUpdatingIncome: false,
        error,
      }
    }

    case INCOME_CLEAR_ERROR.SUCCESS:
      return {
        ...state,
        error: null,
      }

    case INCOME_DELETE.PENDING:
      return {
        ...state,
        isUpdatingIncome: true,
        error: null,
      }

    case INCOME_DELETE.SUCCESS:
      return {
        ...state,
        detailIncomeId: null,
        editIncome: null,
        isUpdatingIncome: false
      }

    case INCOME_DELETE.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isUpdatingIncome: false ,
        error,
      }
    }

    case INCOME_EDIT_UPDATE.SUCCESS: {
      const { payload } = action
      const { income } = payload

      return {
        ...state,
        editIncome: income
      }
    }

    case INCOME_FETCH.PENDING:
      return {
        ...state,
        isFetchingIncomes: true,
        error: null,
      }

    case INCOME_FETCH.SUCCESS: {
      const { payload } = action
      const {
        allIncomeIds,
        incomesById,
      } = payload

      return {
        ...state,
        isFetchingIncomes: false,
        allIncomeIds,
        incomesById,
      }
    }

    case INCOME_FETCH.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isFetchingIncomes: false,
        error,
      }
    }

    case INCOME_SEARCH.PENDING:
      return {
        ...state,
        isSearchingIncomes: true,
        error: null,
      }

    case INCOME_SEARCH.SUCCESS: {
      const { payload } = action
      const { searchString } = payload

      return {
        ...state,
        isSearchingIncomes: false,
        incomeSearchString: searchString,
      }
    }

    case INCOME_SEARCH.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isSearchingIncomes: false,
        error
      }
    }

    case INCOME_SET_DETAIL.PENDING:
      return {
        ...state,
        isCalculating: true,
        error: null,
      }

    case INCOME_SET_DETAIL.SUCCESS: {
      const { payload } = action
      const { detailIncomeId } = payload

      return {
        ...state,
        detailIncomeId,
        isCalculating: false,
      }
    }

    case INCOME_SET_DETAIL.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isCalculating: false,
        error
      }
    }

    case INCOME_SET_EDIT.SUCCESS: {
      const { payload } = action
      const { income } = payload

      return {
        ...state,
        editIncome: income
      }
    }

    case INCOME_UPDATE.PENDING:
      return {
        ...state,
        isUpdatingIncome: true,
        error: false,
      }

    case INCOME_UPDATE.SUCCESS:
      return {
        ...state,
        editIncome: null,
        isUpdatingIncome: false,
      }

    case INCOME_UPDATE.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isUpdatingIncome: false,
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
