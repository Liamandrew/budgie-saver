import moment from 'moment'
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
  // selectors
  getDetailIncome,
  getIncomesSubCategory,
  getIncomeSummaryOverPeriod,
} from './index'
import {
  deleteObject,
  fetchObjects,
  updateObject,
  writeNewObject,
} from '../firebase'

const objectName = 'income'

export const addIncome = (income) => {

  return (dispatch, getState) => {

    dispatch(writeNewIncome(income))
    dispatch(fetchIncomes())

  }
}

export const deleteIncome = (income) => {

  return (dispatch, getState) => {

    return dispatch(writeDeleteIncome(income))
    .then(() => {

      dispatch(fetchIncomes())

    })
  }
}

export const fetchIncomes = () => {

  return (dispatch, getState) => {
    dispatch({ type: INCOME_FETCH.PENDING })

    const uid = getState().auth.user.uid
    const allIncomeIds = []
    let incomesById = {}

    return fetchObjects(uid, objectName)
    .then((snapshot) => {

      if (snapshot.val()) {
        snapshot.forEach(item => {
          const incomeId = item.val().id
          let income = item.val()

          if (!income.endDate) {
            income = {
              ...income,
              endDate: null,
            }
          }

          allIncomeIds.push(incomeId)
          incomesById = {
            ...incomesById,
            [incomeId]: income,
          }
        })
      }

      dispatch({
        type: INCOME_FETCH.SUCCESS,
        payload: {
          allIncomeIds,
          incomesById,
        }
      })
    })
    .catch((error) => {

      dispatch({
        type: INCOME_FETCH.ERROR,
        payload: {
          error,
        }
      })
    })
  }
}

export const setSearchString = (string) => {

  return (dispatch, getState) => {

    dispatch({
      type: INCOME_SEARCH.SUCCESS,
      payload: {
        searchString: string,
      }
    })
  }
}

export const setDetailIncome = (id) => {

  return (dispatch) => {

    dispatch({
      type: INCOME_SET_DETAIL.SUCCESS,
      payload: {
        detailIncomeId: id,
      }
    })
  }
}

export const setEditIncome = (income) => {

  return (dispatch) => {
    dispatch({
      type: INCOME_SET_EDIT.SUCCESS,
      payload: {
        income
      }
    })
  }
}

export const updateEditIncome = (income) => {

  return (dispatch) => {
    dispatch({
      type: INCOME_EDIT_UPDATE.SUCCESS,
      payload: {
        income
      }
    })
  }
}

export const updateIncome = (income) => {

  return (dispatch) => {

    dispatch(writeUpdateIncome(income))
    dispatch(fetchIncomes())

  }
}

const writeDeleteIncome = (income) => {

  return (dispatch, getState) => {
    dispatch({ type: INCOME_DELETE.PENDING })

    const uid = getState().auth.user.uid

    return deleteObject(uid, objectName, income)
    .then(() => {

      dispatch({ type: INCOME_DELETE.SUCCESS })
    })
    .catch((error) => {

      dispatch({
        type: INCOME_DELETE.ERROR,
        payload: {
          error
        }
      })
    })
  }
}

const writeNewIncome = (income) => {

  return (dispatch, getState) => {
    dispatch({ type: INCOME_ADD.PENDING })

    const uid = getState().auth.user.uid

    return writeNewObject(uid, objectName, income)
    .then(() => {

      dispatch({ type: INCOME_ADD.SUCCESS })
    })
    .catch((error) => {

      dispatch({
        type: INCOME_ADD.ERROR,
        payload: {
          error,
        }
      })
    })
  }
}

const writeUpdateIncome = (income) => {

  return (dispatch, getState) => {
    dispatch({ type: INCOME_UPDATE.PENDING })

    const uid = getState().auth.user.uid

    return updateObject(uid, objectName, income)
    .then(() => {

      dispatch({ type: INCOME_UPDATE.SUCCESS })
    })
    .catch((error) => {

      dispatch({
        type: INCOME_UPDATE.ERROR,
        payload: {
          error,
        }
      })
    })
  }
}

export const clearIncomeError = () => {

  return (dispatch) => {

    dispatch({ type: INCOME_CLEAR_ERROR.SUCCESS })
  }
}
