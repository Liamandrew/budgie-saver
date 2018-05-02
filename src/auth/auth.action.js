import {
  // types
  AUTH_CLEAR_ERROR,
  AUTH_GET_USER,
  AUTH_LINK_CREDENTIAL,
  AUTH_SIGNIN,
  AUTH_SIGNIN_ANONYMOUS,
  AUTH_SIGNOUT,
  AUTH_SIGNUP,
  AUTH_RESET_PASSWORD,
  AUTH_UPDATE_PROFILE,
} from './index'
import {
  currentUser,
  emailAuthProvider,
  linkWithCredential,
  getToken,
  createUserWithEmailAndPassword,
  loginWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from '../firebase'

export const getUser = () => {

  return (dispatch) => {
    dispatch({ type: AUTH_GET_USER.PENDING })

    const user = currentUser()

    dispatch({
      type: AUTH_GET_USER.SUCCESS,
      payload: {
        user
      }
    })

  }

}

export const signUserIn = (email, password) => {

  return (dispatch) => {
    dispatch({ type: AUTH_SIGNIN.PENDING })

    let accessToken

    loginWithEmailAndPassword(email, password)
    .then((user) => {

      dispatch({
        type: AUTH_SIGNIN.SUCCESS,
        payload: {
          user
        }
      })
    })
    .catch((error) => {

      dispatch({
        type: AUTH_SIGNIN.ERROR,
        payload: {
          error
        }
      })
    })
  }
}

export const signUserInAnonymously = () => {

  return (dispatch) => {
    dispatch({ type: AUTH_SIGNIN_ANONYMOUS.PENDING })

    signInAnonymously()
    .then((user) => {

      dispatch({
        type: AUTH_SIGNIN_ANONYMOUS.SUCCESS,
        payload: {
          user
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: AUTH_SIGNIN_ANONYMOUS.ERROR,
        payload: {
          error
        }
      })
    })
  }
}

export const linkAnonymousWithCredential = (email, password, firstName) => {

  return (dispatch) => {

    dispatch({ type: AUTH_LINK_CREDENTIAL.PENDING })

    let credential = emailAuthProvider().credential(email, password)

    linkWithCredential(credential)
    .then((user) => {

      dispatch(updateUserProfile({ displayName: firstName }))

      dispatch({
        type: AUTH_LINK_CREDENTIAL.SUCCESS,
        payload: {
          user
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: AUTH_LINK_CREDENTIAL.ERROR,
        payload: {
          error
        }
      })
    })
  }
}

export const signUserOut = () => {

  return (dispatch, getState) => {
    dispatch({ type: AUTH_SIGNOUT.PENDING })

    return signOut()
      .then(() => {

        dispatch({ type: AUTH_SIGNOUT.SUCCESS })

      })
      .catch((error) => {
        dispatch({
          type: AUTH_SIGNOUT.ERROR,
          payload: {
            error
          }
        })

        return Promise.reject(error)
      })

    }

}

export const signUserUp = (email, firstName, password) => {

  return (dispatch) => {
    dispatch({ type: AUTH_SIGNUP.PENDING })

    createUserWithEmailAndPassword(email, password)
    .then((user) => {

      dispatch(signUserIn(email, password))
      dispatch(updateUserProfile({ displayName: firstName }))

      dispatch({ type: AUTH_SIGNUP.SUCCESS })
    })
    .catch((error) => {

      dispatch({
        type: AUTH_SIGNUP.ERROR,
        payload: {
          error
        }
      })
    })
  }
}

export const sendUserResetPassword = (email) => {

  return (dispatch) => {
    dispatch({ type: AUTH_RESET_PASSWORD.PENDING })

    sendPasswordResetEmail(email)
    .then(() => {

      dispatch({ type: AUTH_RESET_PASSWORD.SUCCESS })

    })
    .catch((error) => {

      dispatch({
        type: AUTH_RESET_PASSWORD.ERROR,
        payload: {
          error,
        }
      })
    })
  }
}

export const updateUserProfile = (profile) => {

  return (dispatch, getState) => {
    dispatch({ type: AUTH_UPDATE_PROFILE.PENDING })

    return updateProfile(profile)
    .then(() => {

      dispatch({ type: AUTH_UPDATE_PROFILE.SUCCESS })
    })
    .catch((error) => {

      dispatch({
        type: AUTH_UPDATE_PROFILE.ERROR,
        error,
      })
    })
  }
}

export const clearAuthError = () => {

  return (dispatch) => {

    dispatch({ type: AUTH_CLEAR_ERROR.SUCCESS })
  }
}
