import { firebase } from './firebase'

export const deleteObject = (uid, objectName, object) => {
  const objectKey = object.id

  return firebase.database().ref(`/user-${objectName}/${uid}/${objectKey}`).remove()
}

export const writeNewObject = (uid, objectName, object) => {
  const newObjectKey = firebase.database().ref().child(objectName).push().key

  object.id = newObjectKey
  var newObject = {}
  newObject[`/user-${objectName}/${uid}/${newObjectKey}`] = object

  return firebase.database().ref().update(newObject)
}

export const updateObject = (uid, objectName, object) => {
  const objectKey = object.id

  var updateObject = {}
  updateObject[`/user-${objectName}/${uid}/${objectKey}`] = object

  return firebase.database().ref().update(updateObject)
}

export const fetchObjects = (uid, objectName, object) => {
  return firebase.database().ref(`/user-${objectName}/${uid}/`).once('value')
}
