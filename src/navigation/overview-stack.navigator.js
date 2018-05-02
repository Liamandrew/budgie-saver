import React from 'react'
import { StackNavigator } from 'react-navigation'
import {
  OverviewScreen,
} from '../overview'

export const OverviewStackNavigator = StackNavigator({
  OverviewScreen: {
    screen: OverviewScreen,
  },
}, {
  initialRouteName: 'OverviewScreen',
  navigationOptions: {
     gesturesEnabled: false,
   },
})
