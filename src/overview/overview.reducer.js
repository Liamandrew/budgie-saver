import {
  // types
  OVERVIEW_CEAR_ERROR,
  OVERVIEW_SET_HAS_LOADED,
  OVERVIEW_SET_PERIOD,
  OVERVIEW_IS_CALCULATING,
  // periods
  overviewPeriods
} from './index'
import {
  // type
  AUTH_SIGNOUT
} from '../auth'
import moment from 'moment'

const initialState = {
  hasLoadedData: false,
  reportPeriod: overviewPeriods.month.id,
  reportPeriodStartDate: moment().subtract(1, 'months').add(1, 'days').startOf('day'),
  error: null,
}

export const overviewReducer = (state = initialState, action = {}) => {

  switch (action.type) {
    case OVERVIEW_CEAR_ERROR.SUCCESS:
      return {
        ...state,
        error: null,
      }
    case OVERVIEW_SET_HAS_LOADED.SUCCESS:
      return {
        ...state,
        hasLoadedData: true,
      }
    case OVERVIEW_SET_PERIOD.SUCCESS: {
      const { payload } = action
      const { reportPeriod, reportPeriodStartDate } = payload

      return {
        ...state,
        reportPeriod,
        reportPeriodStartDate,
      }
    }
    case OVERVIEW_SET_PERIOD.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
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
