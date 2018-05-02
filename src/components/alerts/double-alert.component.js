import { Alert } from 'react-native'

export const DoubleAlert = (title, message, leftButtonText, leftOnPress,
  rightButtonText, rightOnPress) => {
  Alert.alert(
    title,
    message,
    [
    { text: leftButtonText, onPress: leftOnPress },
    { text: rightButtonText, onPress: rightOnPress }
    ]
  )
}
