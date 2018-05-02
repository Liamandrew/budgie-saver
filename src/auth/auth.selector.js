/*
 * Utility Selectors
 */
export const getAuthError = (state) => state.auth.error

export const getIsAnonymous = (state) => state.auth.isAnonymous

export const getIsLinkingCredential = (state) => state.auth.isLinkingCredential

export const getIsSendingPasswordReset = (state) => state.auth.isSendingPasswordReset

export const getIsSigningIn = (state) => state.auth.isSigningIn

export const getIsSigningOut = (state) => state.auth.getIsSigningOut

export const getIsPendingUser = (state) => state.auth.isPendingUser

export const getAuthUser = (state) => state.auth.user

export const getIsSigningUp = (state) => state.auth.isSigningUp

export const getPasswordResetSent = (state) => state.auth.passwordResetSent
