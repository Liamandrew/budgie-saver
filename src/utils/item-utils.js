import {
  getMomentNow,
  momentToISOString
} from './moment-utils'

export const itemIsValidInput = (item) => {
  const errArray = []

  if (item.name.length === 0 || !isNaN(item.name) || item.name.trim() === '') {
    errArray.push('Please enter a valid text name.')
  }
  else if (item.amount === null || item.amount <= 0 || isNaN(item.amount) || item.amount.trim() === '') {
    errArray.push('Please enter a valid number amount greater than 0.')
  }
  else if (item.firstDate === null) {
    errArray.push('Please enter a valid date')
  }

  return errArray
}

export const itemShell = () => {

  const date = momentToISOString(getMomentNow())

  return {
    amount: null,
    category: 'None',
    endDate: date,
    firstDate: date,
    isEnded: false,
    name: '',
    notes: '',
    periodicity: 'oneOff',
    subCategory: null,
  }
}
