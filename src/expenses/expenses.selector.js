import { createSelector } from 'reselect'
import moment from 'moment'
import {
  // selectors
  getAllIncomes // import this as a hack to avoid circular dependency on overview selectors
} from '../incomes'
import {
  // periods
  overviewPeriods,
  // selectors
  getGraphColumnPadding,
  getGraphLabelFormat,
  getGraphReportPeriod,
  getReportPeriod,
  getReportPeriodStartDate,
} from '../overview'
import {
  chartDataCreator,
  colors,
  dateOccursInPeriod,
  getMomentNow,
  getNewestMoment,
  getPeriodSummary,
  lastPeriodFromDate,
  momentFormat,
  nextPeriodFromDate,
  pieColors,
  stringToMoment,
} from '../utils'

/*
 * Utility Selectors
 */
export const getEditExpense = (state) => state.expenses.editExpense

export const getExpense = (state, id) => state.expenses.expensesById[id]

export const getExpenseError = (state) => state.expenses.error

export const getAllExpenses = (state) => state.expenses.allExpenseIds.map(id => getExpense(state, id))

export const getExpensesCategory = (state, id) => state.expenses.expensesById[id].category

export const getExpensesSubCategory = (state, id) => state.expenses.expensesById[id].subCategory

export const getExpenseSearchString = (state) => state.expenses.expenseSearchString

export const getDetailExpenseId = (state) => state.expenses.detailExpenseId

export const getDetailExpense = (state) => state.expenses.expensesById[getDetailExpenseId(state)]

export const getExpenseCategory = (state, category) => state.expenses.categories[category]

export const getExpenseSubCategory = (state, subCategory) => state.expenses.subCategories[subCategory]

export const getIsExpenseCalculating = (state) => state.expenses.isCalculating

export const getIsExpenseFetching = (state) => state.expenses.isFetchingExpenses

export const getIsExpenseSearching = (state) => state.expenses.isSearchingExpenses

export const getIsExpenseUpdating = (state) => state.expenses.isUpdatingExpense

export const getAllExpenseCategoriesFlat = (state) => {
  let categoriesFlat = []

  Object.keys(state.expenses.categories).forEach(category => {
    categoriesFlat.push(getExpenseCategory(state, category))
    categoriesFlat = categoriesFlat.concat(getAllExpenseSubCategoriesForCategory(state, category))
  })

  return categoriesFlat
}

export const getAllExpenseCategories = (state) => {
  const categories = []

  state.expenses.categories.forEach(category => {
    categories.push(category)
  })

  return categories
}

export const getAllExpenseSubCategoriesForCategory = (state, category) => {
  return getExpenseCategory(state, category).subCategoryIds.map(subCategory =>
    getExpenseSubCategory(state, subCategory)
  )
}

export const getExpenseSummaryOverPeriod = (expense, begin, end) => {
  const start = nextPeriodFromDate(expense.firstDate, moment(begin), expense.periodicity)

  const { lastDate, nextDate, periods } = getPeriodSummary(start, moment(end), expense.periodicity)

  return {
    lastDate,
    nextDate,
    periods,
    total: periods * expense.amount,
  }
}

/*
 * Memoized Selectors
 */
export const getFirstExpenseDate = createSelector(
  [getAllExpenses],
  (expenses) => {
    var first = getMomentNow()

    for (var i = 0; i < expenses.length; i++) {
      var date = moment(expenses[i].firstDate)
      if (date.isBefore(first)) {
        first = date
      }
    }

    return first
  }
)

export const getFirstExpenseIncomeDate = createSelector(
  [getFirstExpenseDate, getAllIncomes],
  (first, incomes) => {
    for (var i = 0; i < incomes.length; i++) {
      var date = moment(incomes[i].firstDate)
      if (date.isBefore(first)) {
        first = date
      }
    }

    return first
  }
)

export const getOccurringExpenses = createSelector(
  [getReportPeriodStartDate, getReportPeriod, getAllExpenses],
  (reportPeriodStartDate, reportPeriod, expenses) => {

    var begin = moment(reportPeriodStartDate)
    var end = getMomentNow()

    return expenses.reduce((result, expense) => {
      var next = nextPeriodFromDate(expense.firstDate, moment(begin), expense.periodicity)
      var last = lastPeriodFromDate(expense.firstDate, moment(end), expense.periodicity)

      // for the all period we don't want to perform any filtering
      if (reportPeriod === overviewPeriods.all.id || (dateOccursInPeriod(next, begin, end) || dateOccursInPeriod(last, begin, end))) {
        var nextFromToday = nextPeriodFromDate(expense.firstDate, moment(end), expense.periodicity)

        result.push({
          ...expense,
          nextDate: nextFromToday,
          lastDate: last
        })
      }

      return result
    }, [])
  }
)

export const getViewableExpenses = createSelector(
  [getOccurringExpenses, getExpenseSearchString],
  (expenses, searchString) => {

    return expenses.reduce((result, expense) => {

      if (searchString === '' || expense.name.includes(searchString)) {
        result.push(expense)
      }

      return result
    }, [])
  }
)

export const getFullExpensesSummary = createSelector(
  [getReportPeriodStartDate, getReportPeriod, getOccurringExpenses],
  (reportPeriodStartDate, reportPeriod, expenses) => {

    var reportSubPeriod = overviewPeriods[reportPeriod].reportSubPeriod
    var start = moment(reportPeriodStartDate)
    var end = reportSubPeriod === 'days' ? moment(start) : moment(moment(start).add(1, reportSubPeriod).subtract(1, 'days'))
    var today = getMomentNow()
    let cumulativeTotal = { total: 0 }
    var summary = { periodSummaries: [], totals: { categories: {}, total: 0 } }

    // for reportPeriod all we want to calculate the the delta up until the first
    // end of month so we can have clean monthly periods
    if (reportPeriod === overviewPeriods.all.id) {
      // make sure that we don't go into the future
      if (start.date() !== 1 && moment(start).endOf('month').isSameOrBefore(today)) {
        end = moment(start).endOf('month')
        calcPeriodSummary(expenses, summary, cumulativeTotal, start, end)
        start = moment(start.endOf('month').add(1, 'days'))
        end = moment(moment(start).add(1, reportSubPeriod).subtract(1, 'days'))
      }
    }

    while (end.isSameOrBefore(today)) {
      calcPeriodSummary(expenses, summary, cumulativeTotal, start, end)
      end = moment(end).add(1, reportSubPeriod)
      start = moment(start).add(1, reportSubPeriod)
    }

    // for reportPeriod all we want to calculate the the delta of the end of the
    // full report so that we don't leave out the last period if it is not a full
    // month
    if (reportPeriod === overviewPeriods.all.id) {

      if (start.isSameOrBefore(today) && start.isBefore(moment(start).endOf('month'))) {
        calcPeriodSummary(expenses, summary, cumulativeTotal, start, today)
      }
    }

    const { periodSummaries, totals } = summary

    return {
      periodSummaries,
      totals,
      reportPeriod,
    }
  }
)

const calcPeriodSummary = (expenses, summary, cumulativeTotal, start, end) => {
  var periodSummary = {
    start,
    end,
    categories: {},
    expenses: {},
    totals: { total: 0, categories: {}, cumulativeTotal: cumulativeTotal.total }
  }

  expenses.map((expense) => {
    var amount = getExpenseSummaryOverPeriod(expense, start, end).total
    var category = periodSummary.categories[expense.category] || { id: expense.category, total: 0 }
    var totalsCategory = periodSummary.totals.categories[expense.category] || { id: expense.category, total: 0 }
    var summaryTotalsCategory = summary.totals.categories[expense.category] || { id: expense.category, total: 0 }
    cumulativeTotal.total = cumulativeTotal.total + amount

    periodSummary = {
      ...periodSummary,
      expenses: {
        ...periodSummary.expenses,
        [expense.id]: {
          id: expense.id,
          total: amount
        },
      },
      categories: {
        ...periodSummary.categories,
        [expense.category]: {
          ...category,
          total: category.total + amount
        }
      },
      totals: {
        ...periodSummary.totals,
        categories: {
          ...periodSummary.totals.categories,
          [expense.category]: {
            ...totalsCategory,
            total: totalsCategory.total + amount
          }
        },
        total: periodSummary.totals.total + amount,
        cumulativeTotal: cumulativeTotal.total
      }
    }

    summary.totals = {
      ...summary.totals,
      categories: {
        ...summary.totals.categories,
        [expense.category]: {
          ...summaryTotalsCategory,
          total: summaryTotalsCategory.total + amount
        },
      },
      total: summary.totals.total + amount
    }

  })

  summary.periodSummaries.push(periodSummary)
}

export const getDetailExpenseSummary = createSelector(
  [getReportPeriodStartDate, getReportPeriod, getAllExpenses, getDetailExpense],
  (reportPeriodStartDate, reportPeriod, expenses, detailExpense) => {
    // if detail expense doesn't exist then just return an empty object
    if (!detailExpense) { return {} }

    const { key, duration } = overviewPeriods[reportPeriod]
    var start = moment(reportPeriodStartDate)
    var end = moment(reportPeriodStartDate).add(duration, key)

    const { lastDate, nextDate, total } = getExpenseSummaryOverPeriod(detailExpense, start, end)

    return {
      detailExpense,
      lastDate,
      nextDate,
      total
    }
  }
)

export const getExpensesDataStructures = createSelector(
  [getFullExpensesSummary],
  (fullExpensesSummary) => {
    const { periodSummaries, reportPeriod, totals } = fullExpensesSummary
    const columnPadding = getGraphColumnPadding(reportPeriod)

    // this data array is used to populate the complex smooth line chart
    // on the overview screen
    const expensesDataArray = periodSummaries.map((period) => {
      return chartDataCreator(period.start, period.totals.cumulativeTotal, colors.opacityPowderPink, 'Expenses')
    })

    const fullExpensesTotal = totals.total
    var categories = []
    var expensesCategoryPieDataArray

    if (fullExpensesTotal > 0) {
      for (var category in totals.categories) {
        categories.push([category, totals.categories[category].total])
      }

      categories.sort((a, b) => b[1] - a[1])

      var otherTotal = 0
      expensesCategoryPieDataArray = categories.reduce((result, category) => {

        // we only want to show the top 6 categories and not none (gets added to other)
        if (result.length <= 6 && category[0] !== 'None') {
          result.push(chartDataCreator(category[0], category[1] / fullExpensesTotal, pieColors[result.length], category[0]))
        } else {
          otherTotal += category[1]
        }

        return result

      }, [])

      if (otherTotal > 0) {
        expensesCategoryPieDataArray.push(chartDataCreator('Other', otherTotal / fullExpensesTotal, colors.pureWhite, 'Other'))
      }
    }

    return {
      expensesCategoryPieDataArray,
      expensesDataArray,
      totalExpenses: totals.total || 0
    }
  }
)

// outputs the detail expense related data in a format ready to be used by
// charts.
export const getDetailExpenseDataStructures = createSelector(
  [getDetailExpenseSummary, getFullExpensesSummary],
  (detailExpenseSummary, fullExpensesSummary) => {

    const detailExpense = detailExpenseSummary.detailExpense
    if (!detailExpense) { return {} }

    const { periodSummaries, reportPeriod, totals } = fullExpensesSummary
    const labelFormat = getGraphLabelFormat(reportPeriod)
    const columnPadding = getGraphColumnPadding(reportPeriod)
    var category
    var expense

    // complex column chart data structures
    const complexCategoryExpenseColumnData = periodSummaries.map((period, index) => {
      category = period.categories[detailExpense.category] || {}
      expense = period.expenses[detailExpense.id] || {}
      return [
        // expense total should be first as it will always be less than or equal to the category total
        chartDataCreator(period.start, expense.total || 0, colors.powderPink, detailExpense.name),
        chartDataCreator(period.start, category.total || 0, colors.lightGrey, `Category ${detailExpense.category}`),
      ]
    })

    // pie chart data structures
    category = totals.categories[detailExpense.category] || {}
    const categoryTotal = category.total || 0
    const expenseTotal = detailExpenseSummary.total
    const fullExpensesTotal = totals.total

    var expensePieShare
    var categoryRemainderShare
    var categoryPieShare
    var expenseRemainderShare

    if (fullExpensesTotal === 0) {
      // if all expenses amount to 0 then everything should be 0
      expensePieShare = 0
      categoryRemainderShare = 0
      categoryPieShare = 0
      expenseRemainderShare = 0
    }
    else if (categoryTotal === 0) {
      // if just the category is 0 then then all other expenses have the full share
      expensePieShare = 0
      categoryRemainderShare = 0
      categoryPieShare = 0
      expenseRemainderShare = 1
    } else {
      expensePieShare = expenseTotal / categoryTotal
      categoryRemainderShare = (categoryTotal - expenseTotal) / categoryTotal
      categoryPieShare = categoryTotal / fullExpensesTotal
      expenseRemainderShare = (fullExpensesTotal - categoryTotal) / fullExpensesTotal
    }
    const expensePieData = {
      data: [
        chartDataCreator(detailExpense.category, categoryRemainderShare, colors.lightGrey, `Rest of ${detailExpense.category}`),
        chartDataCreator(detailExpense.name, expensePieShare, colors.powderPink, detailExpense.name, true)
      ],
      centerText: `${(expensePieShare * 100).toPrecision(3)}%`
    }

    const categoryPieData = {
      data: [
        chartDataCreator('Expenses', expenseRemainderShare, colors.lightGrey, 'Rest of Expenses'),
        chartDataCreator(detailExpense.category, categoryPieShare, colors.powderPink, detailExpense.category, true)
      ],
      centerText: `${(categoryPieShare * 100).toPrecision(3)}%`
    }

    return {
      categoryPieData,
      columnPadding,
      complexCategoryExpenseColumnData,
      expensePieData,
      labelFormat,
      reportPeriod,
    }
  }
)
