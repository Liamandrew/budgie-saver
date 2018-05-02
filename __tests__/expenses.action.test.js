import * as actions from '../src/expenses/expenses.action'
import * as types from '../src/expenses/expenses.type'
import RNFirebase from 'react-native-firebase'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
var store
var navigation

describe('expenses action', () => {
  beforeEach(() => {
    RNFirebase.reset()
    store = mockStore({
      auth: {
        user: {
          uid: 'test'
        }
      },
      expenses: {
        expenssById: {},
        allExpenseIds: []
      }
    })
    navigation = { navigate: jest.fn(), goBack: jest.fn() };
  })

  it('should create an action to fetch expenses', () => {
    const expected = [
      { type: types.EXPENSE_FETCH.PENDING },
      { type: types.EXPENSE_FETCH.SUCCESS, payload: { allExpenseIds: [] , expensesById: {}} }
    ]

    return store.dispatch(actions.fetchExpenses()).then(() => {
      expect(store.getActions()).toEqual(expected)
    })
  })

  // it('should create an action to delete expenses', () => {
  //   const expected = [
  //     { type: types.EXPENSE_DELETE.PENDING },
  //     { type: types.EXPENSE_DELETE.SUCCESS },
  //     { type: types.EXPENSE_FETCH.PENDING },
  //     { type: types.EXPENSE_FETCH.SUCCESS, payload: { allExpenseIds: [] , expensesById: {}} }
  //   ]
  //   console.log('actions: ', store.getActions())
  //
  //   return store.dispatch(actions.deleteExpense('expense', navigation)).then(() => {
  //     expect(store.getActions()).toEqual(expected)
  //   })
  // })
  //
  // it('should create an action to set detail expense', () => {
  //   const expected = { type: types.EXPENSE_SET_DETAIL.SUCCESS, payload: { detailExpenseId: 'expense '} }
  //   store.dispatch(actions.setDetailExpense('expense'))
  //   console.log('get actions: ', store.getActions())
  //   expect(actions.setDetailExpense('expense')).toEqual(expected)
  // })
})
