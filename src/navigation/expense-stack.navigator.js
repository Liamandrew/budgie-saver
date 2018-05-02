import React from 'react'
import { StackNavigator } from 'react-navigation'
import {
  AddExpenseScreen,
  DetailExpenseScreen,
  EditExpenseScreen,
  ExpenseCategoriesScreen,
  ExpenseScreen,
} from '../expenses'

export const ExpenseStackNavigator = StackNavigator({
  ExpenseScreen: {
    screen: ExpenseScreen,
  },
  AddExpenseScreen: {
    screen: AddExpenseScreen,
  },
  DetailExpenseScreen: {
    screen: DetailExpenseScreen,
  },
  EditExpenseScreen: {
    screen: EditExpenseScreen,
  },
  ExpenseCategoriesScreen: {
    screen: ExpenseCategoriesScreen,
  }
}, {
  initialRouteName: 'ExpenseScreen',
  navigationOptions: {
     gesturesEnabled: false,
   },
})
