import React from 'react'
import { StackNavigator } from 'react-navigation'

// AUTH
import {
  CreateAccountScreen,
  SignInScreen,
  SignOutScreen,
} from '../auth'

export const AuthStackNavigator = StackNavigator({
  SignInScreen: {
    screen: SignInScreen,
  },
  SignOutScreen: {
    screen: SignOutScreen,
  },
  CreateAccountScreen: {
    screen: CreateAccountScreen,
  }
}, {
  initialRouteName: 'SignInScreen',
  navigationOptions: {
     gesturesEnabled: false,
     header: null,
   },
})
