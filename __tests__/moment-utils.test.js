import React from 'react'
import 'react-native'
import moment from 'moment'
import {
  dateOccursInPeriod,
  getMomentNow,
  getNewestMoment,
  getOldestMoment,
  getPeriodSummary,
  lastPeriodFromDate,
  momentFormat,
  nextPeriodFromDate,
  periodicityMap,
  stringToMoment,
} from '../src/utils'

/*
 * NEWER/OLDER DATES TESTS
 */
test('today is newer than yesterday', () => {
  const yesterday = getMomentNow().subtract(1, 'days')
  const today = getMomentNow()
  const result = getNewestMoment(today, yesterday)

  expect(momentFormat(result)).toEqual(momentFormat(today))
})

test('yesterday is older than today', () => {
  const yesterday = getMomentNow().subtract(1, 'days')
  const today = getMomentNow()
  const result = getOldestMoment(today, yesterday)

  expect(momentFormat(result)).toEqual(momentFormat(yesterday))
})

test('date is inside period', () => {
  const date = getMomentNow()
  const begin = getMomentNow().subtract(1, 'days')
  const end = getMomentNow().add(1, 'days')
  const expected = true
  const result = dateOccursInPeriod(date, begin, end)

  expect(result).toEqual(expected)
})

test('date is outside period', () => {
  const date = getMomentNow().add(2, 'days')
  const begin = getMomentNow().subtract(1, 'days')
  const end = getMomentNow().add(1, 'days')
  const expected = false
  const result = dateOccursInPeriod(date, begin, end)

  expect(result).toEqual(expected)
})

/*
 * PERIOD WITH FUTURE START DATE TESTS
 */
test('next period starting after today should be the start day', () => {
  const start = getMomentNow().add(1, 'days')
  const today = getMomentNow()
  const result = nextPeriodFromDate(start, today, periodicityMap.oneOff.id)

  expect(momentFormat(result)).toEqual(momentFormat(start))
})

test('next period starting today should be today', () => {
  const start = getMomentNow()
  const today = getMomentNow()
  const result = nextPeriodFromDate(start, today, periodicityMap.yearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(start))
})

test('last period starting after today should be null', () => {
  const start = getMomentNow().add(1, 'days')
  const today = getMomentNow()
  const expected = null
  const result = lastPeriodFromDate(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result)).toEqual(expected)
})

test('last period starting today should be null', () => {
  const start = getMomentNow()
  const today = getMomentNow()
  const expected = null
  const result = lastPeriodFromDate(start, today, periodicityMap.yearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

/*
 * ONE-OFF TESTS
 */
test('next one off period starting 2017-05-16, should be null', () => {
  const start = stringToMoment('2017-05-16')
  const today = getMomentNow()
  const expected = null
  const result = nextPeriodFromDate(start, today, periodicityMap.oneOff.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

/*
 * DAILY TESTS
 */
test('next daily period starting 2017-05-16, should be today', () => {
  const start = stringToMoment('2017-05-16')
  const today = getMomentNow()
  const result = nextPeriodFromDate(start, today, periodicityMap.daily.id)

  expect(momentFormat(result)).toEqual(momentFormat(today))
})

test('last daily period starting 2017-05-16, should be yesterday', () => {
  const start = stringToMoment('2017-05-16')
  const today = getMomentNow()
  const expected = getMomentNow().subtract(1, 'days')
  const result = lastPeriodFromDate(start, today, periodicityMap.daily.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

/*
 * WEEKLY TESTS
 */
test('next weekly period starting 2017-09-16, with today being 2017-09-17, should be 2017-09-23', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-17')
  const expected = stringToMoment('2017-09-23')
  const result = nextPeriodFromDate(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next weekly period starting 2017-09-11, with today being 2017-09-17, should be 2017-09-18', () => {
  const start = stringToMoment('2017-09-11')
  const today = stringToMoment('2017-09-17')
  const expected = stringToMoment('2017-09-18')
  const result = nextPeriodFromDate(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next weekly period starting 2017-09-01, with today being 2017-09-23, should be 2017-09-29', () => {
  const start = stringToMoment('2017-09-01')
  const today = stringToMoment('2017-09-23')
  const expected = stringToMoment('2017-09-29')
  const result = nextPeriodFromDate(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})


test('next weekly period starting 2017-05-02, with today being 2017-09-23, should be 2017-09-26', () => {
  const start = stringToMoment('2017-05-02')
  const today = stringToMoment('2017-09-23')
  const expected = stringToMoment('2017-09-26')
  const result = nextPeriodFromDate(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last weekly period starting 2017-09-16, with today being 2017-09-17, should be 2017-09-16', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-17')
  const expected = stringToMoment('2017-09-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last weekly period starting 2017-09-16, with today being 2017-09-23, should be 2017-09-16', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-23')
  const expected = stringToMoment('2017-09-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

/*
 * FORTNIGHTLY TESTS
 */
 test('next fortnightly period starting 2017-09-16, with today being 2017-09-17, should be 2017-09-30', () => {
   const start = stringToMoment('2017-09-16')
   const today = stringToMoment('2017-09-17')
   const expected = stringToMoment('2017-09-30')
   const result = nextPeriodFromDate(start, today, periodicityMap.fortnightly.id)

   expect(momentFormat(result)).toEqual(momentFormat(expected))
 })

 test('next fotnightly period starting 2017-09-17, with today being 2017-09-18, should be 2017-10-01', () => {
   const start = stringToMoment('2017-09-17')
   const today = stringToMoment('2017-09-18')
   const expected = stringToMoment('2017-10-01')
   const result = nextPeriodFromDate(start, today, periodicityMap.fortnightly.id)

   expect(momentFormat(result)).toEqual(momentFormat(expected))
 })

 test('next fornightly period starting 2017-05-06, with today being 2017-09-17, should be 2017-09-23', () => {
   const start = stringToMoment('2017-05-06')
   const today = stringToMoment('2017-09-17')
   const expected = stringToMoment('2017-09-23')
   const result = nextPeriodFromDate(start, today, periodicityMap.fortnightly.id)

   expect(momentFormat(result)).toEqual(momentFormat(expected))
 })

 test('last fortnightly period starting 2017-09-16, with today being 2017-09-17, should be 2017-09-16', () => {
   const start = stringToMoment('2017-09-16')
   const today = stringToMoment('2017-09-17')
   const expected = stringToMoment('2017-09-16')
   const result = lastPeriodFromDate(start, today, periodicityMap.fortnightly.id)

   expect(momentFormat(result)).toEqual(momentFormat(expected))
 })

 test('last fortnightly period starting 2017-09-16, with today being 2017-09-30, should be 2017-09-16', () => {
   const start = stringToMoment('2017-09-16')
   const today = stringToMoment('2017-09-30')
   const expected = stringToMoment('2017-09-16')
   const result = lastPeriodFromDate(start, today, periodicityMap.fortnightly.id)

   expect(momentFormat(result)).toEqual(momentFormat(expected))
 })

 /*
  * MONTHLY TESTS
  */
 test('next monthly period starting 2017-09-16, with today being 2017-09-17, should be 2017-10-16', () => {
   const start = stringToMoment('2017-09-16')
   const today = stringToMoment('2017-09-17')
   const expected = stringToMoment('2017-10-16')
   const result = nextPeriodFromDate(start, today, periodicityMap.monthly.id)

   expect(momentFormat(result)).toEqual(momentFormat(expected))
 })

test('next monthly period starting 2017-08-16, with today being 2017-09-16, should be 2017-09-16', () => {
  const start = stringToMoment('2017-08-16')
  const today = stringToMoment('2017-09-16')
  const expected = stringToMoment('2017-09-16')
  const result = nextPeriodFromDate(start, today, periodicityMap.monthly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next monthly period starting 2017-08-23, with today being 2017-09-20, should be 2017-09-23', () => {
  const start = stringToMoment('2017-08-23')
  const today = stringToMoment('2017-09-20')
  const expected = stringToMoment('2017-09-23')
  const result = nextPeriodFromDate(start, today, periodicityMap.monthly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next monthly period starting 2017-01-31, with today being 2017-02-01, should be 2017-02-28', () => {
  const start = stringToMoment('2017-01-31')
  const today = stringToMoment('2017-02-01')
  const expected = stringToMoment('2017-02-28')
  const result = nextPeriodFromDate(start, today, periodicityMap.monthly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next monthly period starting 2017-12-25, with today being 2017-12-26, should be 2018-01-25', () => {
  const start = stringToMoment('2017-12-25')
  const today = stringToMoment('2017-12-26')
  const expected = stringToMoment('2018-01-25')
  const result = nextPeriodFromDate(start, today, periodicityMap.monthly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next monthly period starting 2017-02-28, with today being 2017-10-27, should be 2017-10-28', () => {
  const start = stringToMoment(' 2017-02-28')
  const today = stringToMoment('2017-10-27')
  const expected = stringToMoment('2017-10-28')
  const result = nextPeriodFromDate(start, today, periodicityMap.monthly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last monthly period starting 2017-09-16, with today being 2017-09-17, should be 2017-09-16', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-17')
  const expected = stringToMoment('2017-09-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.monthly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last monthly period starting 2017-09-16, with today being 2017-10-16, should be 2017-09-16', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-10-16')
  const expected = stringToMoment('2017-09-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.monthly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last monthly period starting 2017-10-31, with today being 2017-11-30, should be 2017-10-31', () => {
  const start = stringToMoment('2017-10-31')
  const today = stringToMoment('2017-11-30')
  const expected = stringToMoment('2017-10-31')
  const result = lastPeriodFromDate(start, today, periodicityMap.monthly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

/*
 * QUARTERLY TESTS
 */
test('next quarterly period starting 2017-09-16, with today being 2017-09-17, should be 2017-12-16', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-17')
  const expected = stringToMoment('2017-12-16')
  const result = nextPeriodFromDate(start, today, periodicityMap.quarterly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next quarterly period starting 2017-08-16, with today being 2017-09-16, should be 2017-11-16', () => {
  const start = stringToMoment('2017-08-16')
  const today = stringToMoment('2017-09-16')
  const expected = stringToMoment('2017-11-16')
  const result = nextPeriodFromDate(start, today, periodicityMap.quarterly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next quarterly period starting 2017-05-14, with today being 2017-08-16, should be 2017-11-14', () => {
  const start = stringToMoment('2017-05-14')
  const today = stringToMoment('2017-08-16')
  const expected = stringToMoment('2017-11-14')
  const result = nextPeriodFromDate(start, today, periodicityMap.quarterly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next quarterly period starting 2017-05-08, with today being 2017-08-01, should be 2017-08-08', () => {
  const start = stringToMoment('2017-05-08')
  const today = stringToMoment('2017-08-01')
  const expected = stringToMoment('2017-08-08')
  const result = nextPeriodFromDate(start, today, periodicityMap.quarterly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next quarterly period starting 2017-03-31, with today being 2017-04-15, should be 2017-06-30', () => {
  const start = stringToMoment('2017-03-31')
  const today = stringToMoment('2017-04-15')
  const expected = stringToMoment('2017-06-30')
  const result = nextPeriodFromDate(start, today, periodicityMap.quarterly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last quarterly period starting 2017-09-16, with today being 2017-09-17, should be 2017-09-16', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-17')
  const expected = stringToMoment('2017-09-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.quarterly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last quarterly period starting 2017-09-16, with today being 2017-10-14, should be 2017-09-16', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-10-14')
  const expected = stringToMoment('2017-09-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.quarterly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last quarterly period starting 2017-09-16, with today being 2017-11-18, should be 2017-09-16', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-11-18')
  const expected = stringToMoment('2017-09-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.quarterly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

/*
 * HALF YEAR TESTS
 */
test('next half year period starting 2017-01-31, with today being 2017-04-15, should be 2017-07-31', () => {
  const start = stringToMoment('2017-01-31')
  const today = stringToMoment('2017-04-15')
  const expected = stringToMoment('2017-07-31')
  const result = nextPeriodFromDate(start, today, periodicityMap.halfYearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next half year period starting 2016-12-31, with today being 2017-06-28, should be 2017-06-30', () => {
  const start = stringToMoment('2016-12-31')
  const today = stringToMoment('2017-06-28')
  const expected = stringToMoment('2017-06-30')
  const result = nextPeriodFromDate(start, today, periodicityMap.halfYearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next half year period starting 2016-12-31, with today being 2017-06-28, should be 2017-06-30', () => {
  const start = stringToMoment('2016-12-31')
  const today = stringToMoment('2017-06-28')
  const expected = stringToMoment('2017-06-30')
  const result = nextPeriodFromDate(start, today, periodicityMap.halfYearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next half year period starting 2013-08-31, with today being 2017-01-20, should be 2017-02-28', () => {
  const start = stringToMoment('2013-08-31')
  const today = stringToMoment('2017-01-20')
  const expected = stringToMoment('2017-02-28')
  const result = nextPeriodFromDate(start, today, periodicityMap.halfYearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last half year period starting 2017-05-16, with today being 2017-05-18, should be 2017-05-16', () => {
  const start = stringToMoment('2017-05-16')
  const today = stringToMoment('2017-05-18')
  const expected = stringToMoment('2017-05-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.halfYearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last half year period starting 2017-01-16, with today being 2017-08-18, should be 2017-07-16', () => {
  const start = stringToMoment('2017-01-16')
  const today = stringToMoment('2017-08-18')
  const expected = stringToMoment('2017-07-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.halfYearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

 /*
  * YEARLY TESTS
  */
test('next yearly period starting 2013-08-31, with today being 2017-01-20, should be 2017-08-31', () => {
  const start = stringToMoment('2013-08-31')
  const today = stringToMoment('2017-01-20')
  const expected = stringToMoment('2017-08-31')
  const result = nextPeriodFromDate(start, today, periodicityMap.yearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next yearly period starting 2016-02-28, with today being 2017-01-31, should be 2017-02-28', () => {
  const start = stringToMoment('2016-02-28')
  const today = stringToMoment('2017-01-31')
  const expected = stringToMoment('2017-02-28')
  const result = nextPeriodFromDate(start, today, periodicityMap.yearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('next yearly period starting 2017-09-16, with today being 2017-09-17, should be 2018-09-16', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-17')
  const expected = stringToMoment('2018-09-16')
  const result = nextPeriodFromDate(start, today, periodicityMap.yearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last yearly period starting 2017-01-16, with today being 2017-08-18, should be 2017-01-16', () => {
  const start = stringToMoment('2017-01-16')
  const today = stringToMoment('2017-08-18')
  const expected = stringToMoment('2017-01-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.yearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

test('last yearly period starting 2017-01-16, with today being 2018-01-16, should be 2017-01-16', () => {
  const start = stringToMoment('2017-01-16')
  const today = stringToMoment('2018-01-16')
  const expected = stringToMoment('2017-01-16')
  const result = lastPeriodFromDate(start, today, periodicityMap.yearly.id)

  expect(momentFormat(result)).toEqual(momentFormat(expected))
})

/*
 * PERIOD SUMMARY TESTS
 */
test('period summary of one-off outside the reporting period should not occur', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-17')
  const last = stringToMoment('2017-09-16')
  const next = null
  const expected = { lastDate: last, nextDate: next, periods: 1 }
  const result = getPeriodSummary(start, today, periodicityMap.oneOff.id)

  expect(momentFormat(result.lastDate)).toEqual(momentFormat(expected.lastDate))
  expect(momentFormat(result.firstDate)).toEqual(momentFormat(expected.firstdate))
  expect(result.period).toEqual(expected.period)
})

test('period summary of one-off starting in the future should occur next on the start date', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-15')
  const last = null
  const next = stringToMoment('2017-09-16')
  const expected = { lastDate: last, nextDate: next, periods: 0 }
  const result = getPeriodSummary(start, today, periodicityMap.oneOff.id)

  expect(momentFormat(result.lastDate)).toEqual(momentFormat(expected.lastDate))
  expect(momentFormat(result.firstDate)).toEqual(momentFormat(expected.firstdate))
  expect(result.period).toEqual(expected.period)
})

test('period summary of daily starting today and reporting on today should occur once', () => {
  const start = stringToMoment('2017-09-16')
  const today = stringToMoment('2017-09-16')
  const last = null
  const next = stringToMoment('2017-09-16')
  const expected = { lastDate: last, nextDate: next, periods: 1 }
  const result = getPeriodSummary(start, today, periodicityMap.daily.id)

  expect(momentFormat(result.lastDate)).toEqual(momentFormat(expected.lastDate))
  expect(momentFormat(result.firstDate)).toEqual(momentFormat(expected.firstdate))
  expect(result.period).toEqual(expected.period)
})

test('period summary of daily starting yesterday and reporting on today should occur twice', () => {
  const start = stringToMoment('2017-09-15')
  const today = stringToMoment('2017-09-16')
  const last = stringToMoment('2017-09-15')
  const next = stringToMoment('2017-09-16')
  const expected = { lastDate: last, nextDate: next, periods: 2 }
  const result = getPeriodSummary(start, today, periodicityMap.daily.id)

  expect(momentFormat(result.lastDate)).toEqual(momentFormat(expected.lastDate))
  expect(momentFormat(result.firstDate)).toEqual(momentFormat(expected.firstdate))
  expect(result.period).toEqual(expected.period)
})

test('period summary of weekly period starting 2017-09-23, with today being 2017-09-23, is correct', () => {
  const start = stringToMoment('2017-09-23')
  const today = stringToMoment('2017-09-23')
  const last = null
  const next = stringToMoment('2017-09-23')
  const expected = { lastDate: last, nextDate: next, periods: 0 }
  const result = getPeriodSummary(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result.lastDate)).toEqual(momentFormat(expected.lastDate))
  expect(momentFormat(result.firstDate)).toEqual(momentFormat(expected.firstdate))
  expect(result.period).toEqual(expected.period)
})

test('period summary of weekly period starting 2017-09-22, with today being 2017-09-23, is correct', () => {
  const start = stringToMoment('2017-09-22')
  const today = stringToMoment('2017-09-23')
  const last = stringToMoment('2017-09-22')
  const next = stringToMoment('2017-09-29')
  const expected = { lastDate: last, nextDate: next, periods: 1 }
  const result = getPeriodSummary(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result.lastDate)).toEqual(momentFormat(expected.lastDate))
  expect(momentFormat(result.firstDate)).toEqual(momentFormat(expected.firstdate))
  expect(result.period).toEqual(expected.period)
})

test('period summary of weekly period starting 2017-05-15, with today being 2017-09-23, is correct', () => {
  const start = stringToMoment('2017-05-15')
  const today = stringToMoment('2017-09-23')
  const last = stringToMoment('2017-09-18')
  const next = stringToMoment(('2017-09-25'))
  const expected = { lastDate: last, nextDate: next, periods: 19 }
  const result = getPeriodSummary(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result.lastDate)).toEqual(momentFormat(expected.lastDate))
  expect(momentFormat(result.firstDate)).toEqual(momentFormat(expected.firstdate))
  expect(result.period).toEqual(expected.period)
})

test('period summary of fortnightly period starting 2017-08-04, with today being 2017-09-08, is correct', () => {
  const start = stringToMoment('2017-08-04')
  const today = stringToMoment('2017-09-08')
  const last = stringToMoment('2017-09-01')
  const next = stringToMoment(('2017-09-15'))
  const expected = { lastDate: last, nextDate: next, periods: 3 }
  const result = getPeriodSummary(start, today, periodicityMap.weekly.id)

  expect(momentFormat(result.lastDate)).toEqual(momentFormat(expected.lastDate))
  expect(momentFormat(result.firstDate)).toEqual(momentFormat(expected.firstdate))
  expect(result.period).toEqual(expected.period)
})

test('period summary of fortnightly period starting 2017-07-24, with today being 2017-09-24, is correct', () => {
  const start = stringToMoment('2017-07-24')
  const today = stringToMoment('2017-09-24')
  const last = stringToMoment('2017-09-18')
  const next = stringToMoment(('2017-10-02'))
  const expected = { lastDate: last, nextDate: next, periods: 5 }
  const result = getPeriodSummary(start, today, periodicityMap.fortnightly.id)

  expect(momentFormat(result.lastDate)).toEqual(momentFormat(expected.lastDate))
  expect(momentFormat(result.firstDate)).toEqual(momentFormat(expected.firstdate))
  expect(result.period).toEqual(expected.period)
})
