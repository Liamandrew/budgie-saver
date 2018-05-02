import { Alert } from 'react-native'

export const SingleAlert = (title, message, buttonText, onPress) => {
  Alert.alert(
    title,
    message,
    [{
      text: buttonText,
      onPress: onPress
    }]
  )
}
