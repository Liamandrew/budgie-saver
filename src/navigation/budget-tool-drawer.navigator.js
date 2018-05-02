import React, { Component } from 'react'
import { DrawerNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { BudgetToolTabNavigator } from './budget-tool-tab.navigator'
import { DrawerNavigationContent } from '../components'
import {
  // selectors
  getIsAnonymous,
  // screens
  SignOutScreen
} from '../auth'

const mapStateToProps = (state) => {
  return {
    isAnonymous: getIsAnonymous(state),
  }
}

const ConnectedDrawerNavigator = connect(mapStateToProps)(DrawerNavigationContent)

export const BudgetToolDrawerNavigator = DrawerNavigator({
  BudgetToolTabNavigator: {
    screen: BudgetToolTabNavigator,
  }
}, {
  contentComponent: ({ navigation }) => <ConnectedDrawerNavigator navigation={ navigation } />,
  drawerWidth: 270,
})
