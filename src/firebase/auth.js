import { firebase } from './firebase'

export const createUserWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export const currentUser = () => {
  return firebase.auth().currentUser
}

export const emailAuthProvider = () => {
  return firebase.auth.EmailAuthProvider
}

export const getToken = () => {
  return currentUser().getIdToken()
}

export const loginWithEmailAndPassword = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export const signInAnonymously = () => {
  return firebase.auth().signInAnonymously()
}

export const linkWithCredential = (credential) => {
  return currentUser().linkWithCredential(credential)
}

export const onAuthStateChanged = () => {
  return firebase.auth().onAuthStateChanged
}

export const signOut = () => {
  return firebase.auth().signOut()
}

export const sendPasswordResetEmail = (email) => {
  return firebase.auth().sendPasswordResetEmail(email)
}

export const updateProfile = (profile) => {
  return currentUser().updateProfile(profile)
}
