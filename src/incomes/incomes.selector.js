import { createSelector } from 'reselect'
import moment from 'moment'
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
export const getEditIncome = (state) => state.incomes.editIncome

export const getIncome = (state, id) => state.incomes.incomesById[id]

export const getIncomeError = (state) => state.incomes.error

export const getAllIncomes = (state) => state.incomes.allIncomeIds.map(id => getIncome(state, id))

export const getIncomesCategory = (state, id) => state.incomes.incomesById[id].category

export const getIncomesSubCategory = (state, id) => state.incomes.incomesById[id].subCategory

export const getIncomeSearchString = (state) => state.incomes.incomeSearchString

export const getDetailIncomeId = (state) => state.incomes.detailIncomeId

export const getDetailIncome = (state) => state.incomes.incomesById[getDetailIncomeId(state)]

export const getIncomeCategory = (state, category) => state.incomes.categories[category]

export const getIncomeSubCategory = (state, subCategory) => state.incomes.subCategories[subCategory]

export const getIsIncomeCalculating = (state) => state.incomes.isCalculating

export const getIsIncomeFetching = (state) => state.incomes.isFetchingIncomes

export const getIsIncomeSearching = (state) => state.incomes.isSearchingIncomes

export const getIsIncomeUpdating = (state) => state.incomes.isUpdatingIncome

export const getAllIncomeCategoriesFlat = (state) => {
  var categoriesFlat = []

  Object.keys(state.incomes.categories).forEach(category => {
    categoriesFlat.push(getIncomeCategory(state, category))
    categoriesFlat = categoriesFlat.concat(getAllIncomeSubCategoriesForCategory(state, category))
  })

  return categoriesFlat
}

export const getAllIncomeCategories = (state) => {
  var categories = []

  state.incomes.categories.forEach(category => {
    categories.push(category)
  })

  return categories
}

export const getAllIncomeSubCategoriesForCategory = (state, category) => {
  return getIncomeCategory(state, category).subCategoryIds.map(subCategory =>
    getIncomeSubCategory(state, subCategory)
  )
}

export const getIncomeSummaryOverPeriod = (income, begin, end) => {
  const start = nextPeriodFromDate(income.firstDate, moment(begin), income.periodicity)

  const { lastDate, nextDate, periods } = getPeriodSummary(start, moment(end), income.periodicity)

  return {
    lastDate,
    nextDate,
    periods,
    total: periods * income.amount,
  }
}

/*
 * Memoized Selectors
 */
export const getFirstIncomeDate = createSelector(
  [getAllIncomes],
  (incomes) => {
    var first = getMomentNow()
    for (var i = 0; i < incomes.length; i++) {
      var date = moment(incomes[i].firstDate)
      if (date.isBefore(first)) {
        first = date
      }
    }

    return first
  }
)
export const getOccurringIncomes = createSelector(
  [getReportPeriodStartDate, getReportPeriod, getAllIncomes],
  (reportPeriodStartDate, reportPeriod, incomes) => {

    var begin = moment(reportPeriodStartDate)
    var end = getMomentNow()

    return incomes.reduce((result, income) => {
      var next = nextPeriodFromDate(income.firstDate, moment(begin), income.periodicity)
      var last = lastPeriodFromDate(income.firstDate, moment(end), income.periodicity)

      // for the all period we don't want to perform any filtering
      if (reportPeriod === overviewPeriods.all.id || (dateOccursInPeriod(next, begin, end) || dateOccursInPeriod(last, begin, end))) {
        var nextFromToday = nextPeriodFromDate(income.firstDate, moment(end), income.periodicity)

        result.push({
          ...income,
          nextDate: nextFromToday,
          lastDate: last
        })
      }

      return result
    }, [])
  }
)

export const getViewableIncomes = createSelector(
  [getOccurringIncomes, getIncomeSearchString],
  (incomes, searchString) => {

    return incomes.reduce((result, income) => {

      if (searchString === '' || income.name.includes(searchString)) {
        result.push(income)
      }

      return result
    }, [])
  }
)

export const getFullIncomesSummary = createSelector(
  [getReportPeriodStartDate, getReportPeriod, getOccurringIncomes],
  (reportPeriodStartDate, reportPeriod, incomes) => {

    var reportSubPeriod = overviewPeriods[reportPeriod].reportSubPeriod
    var start = moment(reportPeriodStartDate)
    var end = reportSubPeriod === 'days' ? moment(start) : moment(moment(start).add(1, reportSubPeriod).subtract(1, 'days'))
    var today = getMomentNow()
    let cumulativeTotal = { total: 0 }
    var summary = { periodSummaries: [], totals: { categories: {}, total: 0 } }

    // for reportPeriod all we want to calculate the delta up until the first
    // end of month so we can have clean monthly periods
    if (reportPeriod === overviewPeriods.all.id) {
      // make sure that we don't go into the future
      if (start.date() !== 1 && moment(start).endOf('month').isSameOrBefore(today)) {
        end = moment(start).endOf('month')
        calcPeriodSummary(incomes, summary, cumulativeTotal, start, end)
        start = moment(start.endOf('month').add(1, 'days'))
        end = moment(moment(start).add(1, reportSubPeriod).subtract(1, 'days'))
      }
    }

    while (end.isSameOrBefore(today)) {
      calcPeriodSummary(incomes, summary, cumulativeTotal, start, end)
      end = moment(end).add(1, reportSubPeriod)
      start = moment(start).add(1, reportSubPeriod)
    }

    // for reportPeriod all we want to calculate the delta of the end of the
    // full report so that we don't leave out the last period if it is not a full
    // month
    if (reportPeriod === overviewPeriods.all.id) {

      if (start.isSameOrBefore(today) && start.isBefore(moment(start).endOf('month'))) {
        calcPeriodSummary(incomes, summary, cumulativeTotal, start, today)
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

const calcPeriodSummary = (incomes, summary, cumulativeTotal, start, end) => {
  var periodSummary = {
    start,
    end,
    categories: {},
    incomes: {},
    totals: { total: 0, categories: {}, cumulativeTotal: cumulativeTotal.total }
  }

  incomes.map((income) => {
    var amount = getIncomeSummaryOverPeriod(income, start, end).total
    var category = periodSummary.categories[income.category] || { id: income.category, total: 0 }
    var totalsCategory = periodSummary.totals.categories[income.category] || { id: income.category, total: 0 }
    var summaryTotalsCategory = summary.totals.categories[income.category] || { id: income.category, total: 0 }
    cumulativeTotal.total = cumulativeTotal.total + amount

    periodSummary = {
      ...periodSummary,
      incomes: {
        ...periodSummary.incomes,
        [income.id]: {
          id: income.id,
          total: amount
        },
      },
      categories: {
        ...periodSummary.categories,
        [income.category]: {
          ...category,
          total: category.total + amount
        }
      },
      totals: {
        ...periodSummary.totals,
        categories: {
          ...periodSummary.totals.categories,
          [income.category]: {
            ...totalsCategory,
            total: totalsCategory.total + amount,
          },
        },
        total: periodSummary.totals.total + amount,
        cumulativeTotal: cumulativeTotal.total
      }
    }

    summary.totals = {
      ...summary.totals,
      categories: {
        ...summary.totals.categories,
        [income.category]: {
          ...summaryTotalsCategory,
          total: summaryTotalsCategory.total + amount
        },
      },
      total: summary.totals.total + amount
    }

  })

  summary.periodSummaries.push(periodSummary)
}

export const getDetailIncomeSummary = createSelector(
  [getReportPeriodStartDate, getReportPeriod, getAllIncomes, getDetailIncome],
  (reportPeriodStartDate, reportPeriod, incomes, detailIncome) => {
    // if detail income doesn't exist then just return an empty object
    if (!detailIncome) { return {} }

    const { key, duration } = overviewPeriods[reportPeriod]
    var start = moment(reportPeriodStartDate)
    var end = moment(reportPeriodStartDate).add(duration, key)

    const { lastDate, nextDate, total } = getIncomeSummaryOverPeriod(detailIncome, start, end)

    return {
      detailIncome,
      lastDate,
      nextDate,
      total
    }
  }
)

export const getIncomesDataStructures = createSelector(
  [getFullIncomesSummary],
  (fullIncomesSummary) => {
    const { periodSummaries, reportPeriod, totals } = fullIncomesSummary
    const columnPadding = getGraphColumnPadding(reportPeriod)

    // this data array is used to populate the complex smooth line chart
    // on the overview screen
    const incomesDataArray = periodSummaries.map((period) => {
      return chartDataCreator(period.start, period.totals.cumulativeTotal, colors.opacityPowderBlue, 'Income')
    })

    const fullIncomesTotal = totals.total
    var categories = []
    var incomesCategoryPieDataArray

    if (fullIncomesTotal > 0) {
      for (var category in totals.categories) {
        categories.push([category, totals.categories[category].total])
      }

      categories.sort((a, b) => b[1] - a[1])

      var otherTotal = 0
      incomesCategoryPieDataArray = categories.reduce((result, category) => {

        // we only want to show the top 6 categories and not none (gets added to other)
        if (result.length <= 6 && category[0] !== 'None') {
          result.push(chartDataCreator(category[0], category[1] / fullIncomesTotal, pieColors[result.length], category[0]))
        } else {
          otherTotal += category[1]
        }

        return result

      }, [])

      if (otherTotal > 0) {
        incomesCategoryPieDataArray.push(chartDataCreator('Other', otherTotal / fullIncomesTotal, colors.pureWhite, 'Other'))
      }
    }

    return {
      incomesCategoryPieDataArray,
      incomesDataArray,
      totalIncomes: totals.total || 0
    }
  }
)

// outputs the detail income related data in a format ready to be used by charts
export const getDetailIncomeDataStructures = createSelector(
  [getDetailIncomeSummary, getFullIncomesSummary],
  (detailIncomeSummary, fullIncomesSummary) => {

    const detailIncome = detailIncomeSummary.detailIncome
    if (!detailIncome) { return {} }

    const { periodSummaries, reportPeriod, totals } = fullIncomesSummary
    const columnPadding = getGraphColumnPadding(reportPeriod)
    const labelFormat = getGraphLabelFormat(reportPeriod)
    var category
    var income

    // complex column chart data structures
    const complexCategoryIncomeColumnData = periodSummaries.map((period, index) => {
      category = period.categories[detailIncome.category] || {}
      income = period.incomes[detailIncome.id] || {}
      return [
        // income total should be first as it will always be less than or equal to the category total
        chartDataCreator(period.start, income.total || 0, colors.powderBlue, detailIncome.name),
        chartDataCreator(period.start, category.total || 0, colors.lightGrey, detailIncome.category)
      ]
    })

    // pie chart data structures
    category = totals.categories[detailIncome.category] || {}
    const categoryTotal = category.total || 0
    const incomeTotal = detailIncomeSummary.total
    const fullIncomesTotal = totals.total

    var incomePieShare
    var categoryRemainderShare
    var categoryPieShare
    var incomeRemainderShare

    if (fullIncomesTotal === 0) {
      // if all incomes amount to 0 then everything should be 0
      incomePieShare = 0
      categoryRemainderShare = 0
      categoryPieShare = 0
      incomeRemainderShare = 0
    }
    else if (categoryTotal === 0) {
      // if just the category is 0 then all other incomes have the full share
      incomePieShare = 0
      categoryRemainderShare = 0
      categoryPieShare = 0
      incomeRemainderShare = 1
    } else {
      incomePieShare = incomeTotal / categoryTotal
      categoryRemainderShare = (categoryTotal - incomeTotal) / categoryTotal
      categoryPieShare = categoryTotal / fullIncomesTotal
      incomeRemainderShare = (fullIncomesTotal - categoryTotal) / fullIncomesTotal
    }
    const incomePieData = {
      data: [
        chartDataCreator(detailIncome.category, categoryRemainderShare, colors.lightGrey, `Rest of ${detailIncome.category}`),
        chartDataCreator(detailIncome.name, incomePieShare, colors.powderBlue, detailIncome.name, true),
      ],
      centerText: `${(incomePieShare * 100).toPrecision(3)}%`
    }

    const categoryPieData = {
      data: [
        chartDataCreator('Incomes', incomeRemainderShare, colors.lightGrey, 'Rest of Income'),
        chartDataCreator(detailIncome.category, categoryPieShare, colors.powderBlue, detailIncome.name, true),
      ],
      centerText: `${(categoryPieShare * 100).toPrecision(3)}%`
    }

    return {
      categoryPieData,
      columnPadding,
      complexCategoryIncomeColumnData,
      incomePieData,
      labelFormat,
      reportPeriod,
    }
  }
)
