export const overviewPeriods = {
  all: {
    id: 'all',
    name: 'All',
    reportName: 'All',
    reportSubPeriod: 'months',
    graphColumnPadding: 8,
    graphLabelFormat: 'MMM YY',
    duration: null,
    key: null,
  },
  year: {
    id: 'year',
    name: 'Year',
    reportName: 'Last Year',
    reportSubPeriod: 'months',
    graphColumnPadding: 10,
    graphLabelFormat: 'D MMM',
    duration: 1,
    key: 'years'
  },
  halfYear: {
    id: 'halfYear',
    name: 'Half-Year',
    reportName: 'Last Half-Year',
    reportSubPeriod: 'months',
    graphColumnPadding: 10,
    graphLabelFormat: 'D MMM',
    duration: 6,
    key: 'months'
  },
  quarter: {
    id: 'quarter',
    name: 'Quarter',
    reportName: 'Last Quarter',
    reportSubPeriod: 'months',
    graphColumnPadding: 30,
    graphLabelFormat: 'D MMM',
    duration: 3,
    key: 'months'
  },
  month: {
    id: 'month',
    name: 'Month',
    reportName: 'Last Month',
    reportSubPeriod: 'days',
    graphColumnPadding: 2,
    graphLabelFormat: 'D MMM',
    duration: 1,
    key: 'months'
  },
  week: {
    id: 'week',
    name: 'Week',
    reportName: 'Last Week',
    reportSubPeriod: 'days',
    graphColumnPadding: 15,
    graphLabelFormat: 'ddd',
    duration: 1,
    key: 'weeks'
  }
}
