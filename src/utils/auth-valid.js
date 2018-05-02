export const isValidSignin = (email, password) => {
  let errArray = []

  if (!isValidEmail(email)) {
    errArray.push('Please enter a valid email address.')
  }
  else if (!isValidPassword(password)) {
    errArray.push('Please enter a password that is at least 6 characters.')
  }

  return errArray
}

export const isValidSignup = (email, firstName, passwordOne, passwordTwo) => {
  let errArray = []

  if (!isValidEmail(email)) {
    errArray.push('Please enter a valid email address.')
  }
  else if (!isValidFirstName(firstName)) {
    errArray.push('Please enter a valid first name.')
  }
  else if (!isValidPassword(passwordOne)) {
    errArray.push('Please enter a password that is at least 6 characters.')
  }
  else if (!isMatchingPasswords(passwordOne, passwordTwo)) {
    errArray.push('Please make sure your passwords match.')
  }

  return errArray
}

const isValidEmail = (email) => {

  if (email.length === 0 || email.trim() === '') {
    return false
  }
  return true
}

const isValidFirstName = (firstName) => {
  if (firstName.length === 0 || firstName.trim() === '') {
    return false
  }
  return true
}

const isValidPassword = (password) => {
  return (password.length >= 6 || password.trim() !== '')
}

const isMatchingPasswords = (passwordOne, passwordTwo) => {
  return (passwordOne === passwordTwo)
}
