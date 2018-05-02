import { expensesReducer } from '../src/expenses/expenses.reducer'
import { expensesCategory } from '../src/expenses/expenses.category'

describe('expenses reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      allExpenseIds: [],
      expensesById: {},
      categories: expensesCategory.categories,
      subCategories: expensesCategory.subCategories,
      detailExpenseId: null,
      editExpense: null,
      isCalculating: false,
      isFetchingExpenses: false,
      isUpdatingExpense: false,
      error: null,
    }
    expect(expensesReducer(undefined, {})).toEqual(initialState)
  })
})
