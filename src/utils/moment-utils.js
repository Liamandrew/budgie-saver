import moment from 'moment'
import { periodicityMap } from './periodicity-utils'

/*
 * MOMENT CONVERSION/CREATION UTILS
 * NOTE: IN ORDER FOR CALCULATIONS TO BE CLEAN, WE TAKE THE START OF EACH DAY
 */
export const dateToMoment = (date) => {
  return moment(date).startOf('day')
}

export const getMomentNow = () => {
  return moment().startOf('day')
}

export const isStartOfMonth = (string) => {
  return moment(string).date() === 1
}

export const momentToDate = (moment) => {
  return moment.toDate()
}

export const momentToISOString = (moment) => {
  return moment.toISOString()
}

export const momentFormat = (string, format='DD MMM YYYY') => {
  if (!string) { return null }
  return moment(string).format(format)
}

export const stringToMoment = (string) => {
  return moment(string).startOf('day')
}

export const getNewestMoment = (momentA, momentB) => {
  if (momentA.isAfter(momentB)) {
    return moment(momentA)
  }
  return moment(momentB)
}

export const getOldestMoment = (momentA, momentB) => {
  if (momentA.isBefore(momentB)) {
    return moment(momentA)
  }
  return moment(momentB)
}

export const dateOccursInPeriod = (date, begin, end) => {
  if (!date || !begin || !end) { return false }
  return date.isSameOrAfter(begin) && date.isSameOrBefore(end)
}

/*
 * PERIOD SUMMARY CALCULATOR
 * RETURNS OBJECT { lastDate, nextDate, periods }
 */
export const getPeriodSummary = (begin, end, periodicity) => {
  const { duration, key } = periodicityMap[periodicity]
  var start = moment(begin)

  // if end is null then we take today
  var date = end ? moment(end) : getMomentNow()

  // if start is in the future then return the future results
  // or if input begin is null
  if (!begin || start.isAfter(date)) { return periodSummaryUtil(null, date, 0) }

  switch (periodicity) {
    case periodicityMap.oneOff.id:
      return getOneOffPeriodSummary(start, date)

    case periodicityMap.daily.id:
      return getDailyPeriodSummary(start, date, duration, key)

    case periodicityMap.weekly.id:
      return calcPeriodSummary(start, date, duration, key, true)

    case periodicityMap.fortnightly.id:
      return calcPeriodSummary(start, date, duration, key, true)

    default:
      return calcPeriodSummary(start, date, duration, key)
  }
}

const getOneOffPeriodSummary = (start, end) => {
  return periodSummaryUtil(start, null, 1)
}

const getDailyPeriodSummary = (start, end, duration, key) => {
  const next = moment(end)
  const last = start.isSame(end) ? null : moment(end).subtract(duration, key).startOf('day')

  return periodSummaryUtil(
    last,
    next,
    last ? next.diff(last, 'days') + 1 : 1
  )
}

const calcPeriodSummary = (start, end, duration, key, lessThanMonth=false) => {
  var periods = 1
  var startDay = start.date()
  var start = moment(start)
  var last = moment(start)
  var end = moment(end)
  var next = start.add(duration, key)

  if (!lessThanMonth) { next = setDayOfMonth(startDay, next) }

  while (next.isBefore(end)) {
    periods++
    last = moment(next)
    next = moment(next).add(duration ,key)
    if (!lessThanMonth) { next = setDayOfMonth(startDay, next) }
  }

  if (next.isSame(end)) { periods++ }

  return periodSummaryUtil(
    last,
    next,
    periods
  )
}

const periodSummaryUtil = (lastDate, nextDate, periods) => {
  return {
    lastDate: lastDate,
    nextDate: nextDate,
    periods: periods
  }
}

/*
 * CALCULATE LAST PERIOD UTILS
 */
export const lastPeriodFromDate = (start, date, periodicity) => {
  const { duration, key } = periodicityMap[periodicity]
  start = moment(start).startOf('day')

  if (date) {
    date = moment(date).startOf('day')
  } else {
    date = getMomentNow()
  }

  if (start.isSameOrAfter(date)) { return null }

  switch (periodicity) {
    case periodicityMap.oneOff.id:
      return start

    case periodicityMap.daily.id:
      return date.subtract(duration, key)

    case periodicityMap.weekly.id:
      return getLastWeek(start, date)

    case periodicityMap.fortnightly.id:
      return getLastFortnight(start, date, duration, key)

    case periodicityMap.monthly.id:
      return getLastMonth(start, date, duration, key)

    case periodicityMap.quarterly.id:
      return getLastQuarter(start, date, duration, key)

    case periodicityMap.halfYearly.id:
      return getLastHalfYear(start, date, duration, key)

    case periodicityMap.yearly.id:
      return getLastYear(start, date)

    default:
      return null
  }
}

const getLastWeek = (start, date) => {
  const diff = date.diff(start, 'days')
  const mod = diff % 7

  if (mod === 0) { return moment(date).subtract(7, 'days') }

  return date.subtract(mod, 'days')
}

const getLastFortnight = (start, date, duration, key) => {
  const diff = date.diff(start, 'days')
  const mod = diff % 14

  if (mod === 0) { return moment(date).subtract(duration, key) }

  return date.subtract(mod, 'days')
}

const getLastMonth = (start, date, duration, key) => {
  const startDay = moment(start).date()
  const currentDay = moment(date).date()
  var result = moment(date)

  if (currentDay <= startDay) {
    result = moment(date).subtract(duration, key)
  }

  return setDayOfMonth(startDay, result, false)
}

const getLastQuarter = (start, date, duration, key) => {
  const diff = date.diff(start, 'months')
  const monthsInPeriod = 3
  const mod = diff % monthsInPeriod
  const startDay = moment(start).date()

  var result = setLastPeriod(startDay, date, mod, monthsInPeriod)

  return setDayOfMonth(startDay, result, false)
}

const getLastHalfYear = (start, date, duration, key) => {
  const diff = date.diff(start, 'months')
  const monthsInPeriod = 6
  const mod = diff % monthsInPeriod
  const startDay = moment(start).date()

  var result = setLastPeriod(startDay, date, mod, monthsInPeriod)

  return setDayOfMonth(startDay, result, false)
}

const getLastYear = (start, date) => {
  const startDay = moment(start).dayOfYear()
  const currentDay = moment(date).dayOfYear()
  date = moment(date)

  if (currentDay <= startDay) {
    return date.subtract(1, 'years').dayOfYear(startDay)
  }

  return date.dayOfYear(startDay)
}

/*
 * CALCULATE NEXT PERIOD UTILS
 */
export const nextPeriodFromDate = (start, date, periodicity) => {
  const { duration, key } = periodicityMap[periodicity]
  var start = moment(start).startOf('day')

  if (date) {
    date = moment(date).startOf('day')
  } else {
    date = getMomentNow()
  }

  if (start.isSameOrAfter(date)) { return start }

  switch (periodicity) {
    case periodicityMap.daily.id:
      return date

    case periodicityMap.weekly.id:
      return getNextWeek(start, date)

    case periodicityMap.fortnightly.id:
      return getNextFortnight(start, date)

    case periodicityMap.monthly.id:
      return getNextMonth(start, date, duration, key)

    case periodicityMap.quarterly.id:
      return getNextQuarter(start, date, duration, key)

    case periodicityMap.halfYearly.id:
      return getNextHalfYear(start, date, duration, key)

    case periodicityMap.yearly.id:
      return getNextYear(start, date)

    default:
      return null
  }
}

const getNextWeek = (start, date) => {
  const diff = date.diff(start, 'days')
  const mod = (diff) % 7

  if (mod === 0) { return date }

  return moment(date).add(7 - mod, 'days')
}

const getNextFortnight = (start, date) => {
  const diff = date.diff(start, 'days')
  const mod = (diff) % 14

  if (mod === 0) { return date }

  return moment(date).add(14 - mod, 'days')
}

const getNextMonth = (start, date, duration, key) => {
  const startDay = moment(start).date()
  const currentDay = moment(date).date()
  var result = moment(date)

  // the assumption is that if the days are the same then the next month period
  // is in fact date and not next month (hence it is not >=)
  if (currentDay > startDay) {
    result = moment(date).add(duration, key)
  }

  return setDayOfMonth(startDay, result)
}

const getNextQuarter = (start, date, duration, key) => {
  const diff = date.diff(start, 'months')
  const monthsInPeriod = 3
  const mod = diff % monthsInPeriod
  const startDay = moment(start).date()

  var result = setNextPeriod(startDay, date, mod, monthsInPeriod)

  return setDayOfMonth(startDay, result)
}

const getNextHalfYear = (start, date, duration, key) => {
  const diff = date.diff(start, 'months')
  const monthsInPeriod = 6
  const mod = diff % monthsInPeriod
  const startDay = moment(start).date()

  var result = setNextPeriod(startDay, date, mod, monthsInPeriod)

  return setDayOfMonth(startDay, result)
}

const getNextYear = (start, date) => {
  const startDay = moment(start).dayOfYear()
  const currentDay = moment(date).dayOfYear()
  date = moment(date)

  if (currentDay < startDay) {
    return date.dayOfYear(startDay)
  }

  return date.add(1, 'years').dayOfYear(startDay)
}

/*
 * CALCULATOR FOR DAY IN PERIOD/MONTH
 */
const setDayOfMonth = (startDay, result, isSettingNext=true) => {
  var r = moment(result)

  if (startDay >= r.daysInMonth()) {
    return r.date(r.daysInMonth()).startOf('day')
  }

  return r.date(startDay).startOf('day')
}

const setNextPeriod = (startDay, result, mod, monthsInPeriod) => {
  var r = moment(result)

  // basic scenario where next date is more than a month in the future and less
  // than (or equal) to end date
  if (mod !== 0 && startDay <= r.date()) {
    r.add(monthsInPeriod - mod, 'months')

  // basic scenario where next date is more than a month in the future and
  // greater than current day
  } else if (mod !== 0 && startDay > r.date()) {
    r.add(monthsInPeriod - mod - 1, 'months')

  // scenario where next date is less than a month and less than current date
  } else if (mod === 0 && startDay < r.date()) {
    r.add(monthsInPeriod - mod, 'months')

  // scenario where next date is less than a month and greater than current date
  } else if (mod === 0 && startDay > r.date()) {
    r.add(monthsInPeriod - 1, 'months')
  }

  return r
}

const setLastPeriod = (startDay, result, mod, monthsInPeriod) => {
  var r = moment(result)

  if (mod !== 0 && startDay <= r.date()) {
    r.subtract(mod, 'months')

  } else if (mod !== 0 && startDay > r.date()) {
    r.subtract(mod + 1, 'months')

  } else if (mod === 0 && startDay > r.date()) {
    r.subtract(1, 'months')

  } else if (mod === 0 && startDay === r.date()) {
    r.subtract(monthsInPeriod, 'months')
  }

  return r
}
