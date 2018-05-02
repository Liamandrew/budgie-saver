import React from 'react'
import { StackNavigator } from 'react-navigation'
import {
  AddIncomeScreen,
  DetailIncomeScreen,
  EditIncomeScreen,
  IncomeCategoriesScreen,
  IncomeScreen
} from '../incomes'

export const IncomeStackNavigator = StackNavigator({
  IncomeScreen: {
    screen: IncomeScreen,
  },
  AddIncomeScreen: {
    screen: AddIncomeScreen,
  },
  DetailIncomeScreen: {
    screen: DetailIncomeScreen,
  },
  EditIncomeScreen: {
    screen: EditIncomeScreen,
  },
  IncomeCategoriesScreen: {
    screen: IncomeCategoriesScreen,
  }
}, {
  initialRouteName: 'IncomeScreen',
  navigationOptions: {
     gesturesEnabled: false,
   },
})
