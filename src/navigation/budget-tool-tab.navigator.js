import React from 'react'
import { TabNavigator } from 'react-navigation'
import { ExpenseStackNavigator } from './expense-stack.navigator'
import { IncomeStackNavigator } from './income-stack.navigator'
import { OverviewStackNavigator } from './overview-stack.navigator'
import { colors } from '../utils'

export const BudgetToolTabNavigator = TabNavigator({
  ExpenseStackNavigator: {
    screen: ExpenseStackNavigator
  },
  OverviewStackNavigator: {
    screen: OverviewStackNavigator,
  },
  IncomeStackNavigator: {
    screen: IncomeStackNavigator,
  }
},
{
  initialRouteName: 'OverviewStackNavigator',
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeBackgroundColor: colors.pureWhite,
    activeTintColor: colors.lightNavy,
    inactiveTintColor: colors.darkGrey,
    inactiveBackgroundColor: colors.pureWhite,
    style: {
      backgroundColor: colors.pureWhite,
    },
    indicatorStyle: {
      backgroundColor: colors.lightNavy
    }
  },
})

BudgetToolTabNavigator.navigationOptions = {
  header: null,
}
