import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { authReducer } from '../auth'
import { expensesReducer } from '../expenses'
import { incomesReducer } from '../incomes'
import { overviewReducer } from '../overview'

const config = {
  key: 'root',
  storage,
  debug: true,
}

const reducers = persistCombineReducers(
  config,
  {
    auth: authReducer,
    expenses: expensesReducer,
    incomes: incomesReducer,
    overview: overviewReducer,
  }
)

export default reducers
