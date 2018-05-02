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

const initialState = {
  isAnonymous: false,
  isLinkingCredential: false,
  isSigningIn: false,
  isSigningOut: false,
  isPendingUser: false,
  isSendingPasswordReset: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  user: null,
  error: null,
}

export const authReducer = (state = initialState, action = {}) => {

  switch (action.type) {
    case AUTH_SIGNIN.PENDING:
      return {
        ...state,
        isSigningIn: true,
        error: null,
      }

    case AUTH_SIGNIN.SUCCESS: {
      const { payload } = action
      const { accessToken, user } = payload

      return {
        ...state,
        isSigningIn: false,
        accessToken,
        user
      }
    }

    case AUTH_SIGNIN.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isSigningIn: false,
        error,
      }
    }

    case AUTH_SIGNIN_ANONYMOUS.PENDING:
      return {
        ...state,
        isSigningIn: true,
        error: null,
      }

    case AUTH_SIGNIN_ANONYMOUS.SUCCESS: {
      const { payload } = action
      const { accessToken, user } = payload

      return {
        ...state,
        isSigningIn: false,
        isAnonymous: true,
        accessToken,
        user
      }
    }

    case AUTH_SIGNIN_ANONYMOUS.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isSigningIn: false,
        error,
      }
    }

    case AUTH_SIGNOUT.PENDING:
      return {
        ...state,
        isSigningOut: true,
        error: null,
      }

    case AUTH_SIGNOUT.SUCCESS:
      return {
        ...initialState
      }

    case AUTH_SIGNOUT.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isSigningOut: false,
        error,
      }
    }

    case AUTH_GET_USER.PENDING:
      return {
        ...state,
        isPendingUser: true,
        error: null,
      }

    case AUTH_GET_USER.SUCCESS: {
      const { payload } = action
      const { user } = payload

      return {
        ...state,
        isPendingUser: false,
        user: user ? user : null,
      }
    }

    case AUTH_GET_USER.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        accessToken: null,
        isPendingUser: false,
        error
      }
    }

    case AUTH_LINK_CREDENTIAL.PENDING:
      return {
        ...state,
        isLinkingCredential: true,
        error: null,
      }

    case AUTH_LINK_CREDENTIAL.SUCCESS: {
      const { payload } = action
      const { user } = payload

      return {
        ...state,
        user,
        isAnonymous: false,
        isLinkingCredential: false,
      }
    }

    case AUTH_LINK_CREDENTIAL.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isLinkingCredential: false,
        error
      }
    }

    case AUTH_RESET_PASSWORD.PENDING:
      return {
        ...state,
        isSendingPasswordReset: true,
        passwordResetSent: false,
        error: null,
      }

    case AUTH_RESET_PASSWORD.SUCCESS:
      return {
        ...state,
        isSendingPasswordReset: false,
      }

    case AUTH_RESET_PASSWORD.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isSendingPasswordReset: false,
        error
      }
    }

    case AUTH_SIGNUP.PENDING:
      return {
        ...state,
        isSigningUp: true,
        error: null,
      }

    case AUTH_SIGNUP.SUCCESS:
      return {
        ...state,
        isSigningUp: false,
      }

    case AUTH_SIGNUP.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isSigningUp: false,
        error
      }
    }

    case AUTH_UPDATE_PROFILE.PENDING:
      return {
        ...state,
        isUpdatingProfile: true,
        error: null,
      }

    case AUTH_UPDATE_PROFILE.SUCCESS:
      return {
        ...state,
        isUpdatingProfile: false,
      }

    case AUTH_UPDATE_PROFILE.ERROR: {
      const { payload } = action
      const { error } = payload

      return {
        ...state,
        isUpdatingProfile: false,
        error
      }
    }

    case AUTH_CLEAR_ERROR.SUCCESS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}
