import React from 'react'
import { StackNavigator, DrawerNavigator } from 'react-navigation'

import { AuthStackNavigator } from './auth-stack.navigator'
import { BudgetToolDrawerNavigator } from './budget-tool-drawer.navigator'
import { SplashScreen } from '../auth'

export const BudgetToolStackNavigator = StackNavigator({
  SplashScreen: {
    screen: SplashScreen,
  },
  AuthStackNavigator: {
    screen: AuthStackNavigator,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  BudgetToolDrawerNavigator: {
    screen: BudgetToolDrawerNavigator,
  },
}, {
  initialRouteName: 'SplashScreen',
  navigationOptions: {
     gesturesEnabled: false,
     header: null,
   },
})
