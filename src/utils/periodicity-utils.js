export const isRecurring = (periodicity) => {
  return periodicity !== periodicityMap.oneOff.id
}

export const periodicityMap = {
  oneOff: {
    id: 'oneOff',
    name: 'One-off',
    key: null,
    duration: null,
  },
  daily: {
    id: 'daily',
    name: 'Daily',
    key: 'days',
    duration: 1,
  },
  weekly: {
    id: 'weekly',
    name: 'Weekly',
    key: 'weeks',
    duration: '1'
  },
  fortnightly: {
    id: 'fortnightly',
    name: 'Fornightly',
    key: 'weeks',
    duration: '2',
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    key: 'months',
    duration: 1,
  },
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly',
    key: 'quarters',
    duration: 1,
  },
  halfYearly: {
    id: 'halfYearly',
    name: 'Half-yearly',
    key: 'months',
    duration: 6,
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    key: 'years',
    duration: 1
  }
}

export const periodicities = [
  periodicityMap.oneOff,
  periodicityMap.daily,
  periodicityMap.weekly,
  periodicityMap.fortnightly,
  periodicityMap.monthly,
  periodicityMap.quarterly,
  periodicityMap.halfYearly,
  periodicityMap.yearly
]
