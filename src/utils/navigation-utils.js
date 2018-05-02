import { NavigationActions } from 'react-navigation'

export const navigateTo = (routeName, navigation, params={}) => {
  const navigateAction = NavigationActions.navigate({
    routeName,
    params,
  })

  navigation.dispatch(navigateAction)
}

export const resetNavigationTo = (routeName, navigation) => {
  const resetAction = NavigationActions.reset({
    index: 0,
    key: null,
    actions: [NavigationActions.navigate({ routeName, params: {} })],
  })

  navigation.dispatch(resetAction)
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
