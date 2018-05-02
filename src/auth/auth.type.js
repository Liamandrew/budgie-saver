import { createActionTypeSet } from '../utils'

export const AUTH_CLEAR_ERROR = createActionTypeSet('AUTH_CLEAR_ERROR')
export const AUTH_SIGNIN = createActionTypeSet('AUTH_SIGNIN')
export const AUTH_SIGNIN_ANONYMOUS = createActionTypeSet('AUTH_SIGNIN_ANONYMOUS')
export const AUTH_SIGNOUT = createActionTypeSet('AUTH_SIGNOUT')
export const AUTH_GET_USER = createActionTypeSet('AUTH_GET_USER')
export const AUTH_LINK_CREDENTIAL = createActionTypeSet('AUTH_LINK_CREDENTIAL')
export const AUTH_SIGNUP = createActionTypeSet('AUTH_SIGNUP')
export const AUTH_RESET_PASSWORD = createActionTypeSet('AUTH_RESET_PASSWORD')
export const AUTH_UPDATE_PROFILE = createActionTypeSet('AUTH_UPDATE_PROFILE')
