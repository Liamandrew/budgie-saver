import moment from 'moment'
import {
  overviewPeriods,
  // types
  OVERVIEW_CEAR_ERROR,
  OVERVIEW_SET_HAS_LOADED,
  OVERVIEW_SET_PERIOD,
  OVERVIEW_IS_CALCULATING,
} from './index'
import { getFirstExpenseIncomeDate } from '../expenses'
import { getOldestMoment, sleep } from '../utils'

export const setOverviewPeriod = (period) => {

  return (dispatch, getState) => {

    var reportPeriodStartDate

    if (period === overviewPeriods.all.id) {
      // for all period we find the first date between all expenses and all
      // incomes and that becomes the starting report date
      reportPeriodStartDate = getFirstExpenseIncomeDate(getState())
    } else {
      // otherwise the starting period is just calculated as expected for
      // the appropriate report period
      const { duration, key } = overviewPeriods[period]
      reportPeriodStartDate = moment().subtract(duration, key).add(1, 'days').startOf('day')
    }

    dispatch({
      type: OVERVIEW_SET_PERIOD.SUCCESS,
      payload: {
        reportPeriod: period,
        reportPeriodStartDate,
      }
    })
  }
}

export const setHasLoadedData = () => {

  return (dispatch) => {

    dispatch({ type: OVERVIEW_SET_HAS_LOADED.SUCCESS })
  }
}

export const clearOverviewError = () => {

  return (dispatch) => {

    dispatch({ type: OVERVIEW_CEAR_ERROR.SUCCESS })
  }
}
