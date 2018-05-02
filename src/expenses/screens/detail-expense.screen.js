import React, { Component } from 'react'
import {
  Button,
  Image,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'

import {
  LoadingModal,
  ItemContainer,
  ViewContainer,
} from '../../components'
import {
  colors,
  isStartOfMonth,
  momentFormat
} from '../../utils'
import {
  // actions
  setEditExpense,
  // selectors
  getDetailExpense,
  getDetailExpenseDataStructures,
  getDetailExpenseSummary,
  getFullExpensesSummary,
  getIsExpenseCalculating,
} from '../index'
import { overviewPeriods } from '../../overview'

class DetailExpense extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    const {
      handleEdit,
      expenseName,
    } = state.params

    return {
      headerRight: (
        <Button
          title="Edit"
          onPress={ handleEdit ? handleEdit : () => {} }
          color={ colors.lightNavy }
        />
      ),
      headerStyle: {
        backgroundColor: colors.pureWhite,
      },
      headerTintColor: colors.lightNavy,
      headerTitleStyle: {
        color: colors.navy
      },
      tabBarLabel: "Expense",
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_credit_card_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
      title: expenseName && expenseName
    }
  }

  componentWillMount = () => {
    const { expense, navigation } = this.props

    navigation.setParams({ expenseName: expense.name,  handleEdit: this.handleEditPress })
  }

  handleEditPress = () => {
    const {
      expense,
      navigation,
      setEditExpense,
    } = this.props
    const params = {
      // pass the route key so that we can goBack from here in case of delete
      detailExpenseKey: navigation.state.key,
      // dummy function to avoid warning about required onPress handler on edit button
      handleEdit: () => { return }
    }

    setEditExpense(expense)
    navigation.navigate('EditExpenseScreen', params)
  }

  displayColumnXIncrementMarkers = (subData, index) => {
    const { reportPeriod } = this.props
    const item = subData[0]

    switch (reportPeriod) {
      case overviewPeriods.month.id: {
        if (index % 7 === 0) {
          return true
        }
        return false
      }

      default:
        return true
    }
  }

  generateColumnXLabel = (subData, index) => {
    const { labelFormat, reportPeriod } = this.props
    const item = subData[0]
    const label = momentFormat(item.name, labelFormat)

    switch (reportPeriod) {
      case overviewPeriods.week.id:
        // for week we return the label for every day
        return label

      case overviewPeriods.month.id: {
        if (index % 7 === 0) {
          return label
        }
        break
      }

      case overviewPeriods.quarter.id:
        return label

      case overviewPeriods.halfYear.id: {
        if (index % 2 === 0) {
          return label
        }
        break
      }

      case overviewPeriods.year.id: {
        if (index % 3 === 0) {
          return label
        }
        break
      }

      case overviewPeriods.all.id: {
        if (index % 4 === 0) {
          return label
        }
        break
      }

      default:
        return null
    }

    return null
  }

  render() {
    const {
      categoryPieData,
      columnPadding,
      complexCategoryExpenseColumnData,
      detailCategoryColumnData,
      expense,
      expensePieData,
      isCalculating,
      total,
      totals,
      lastDate,
      nextDate,
      periods,
    } = this.props

    const showLoader = isCalculating || !expense

    return (
      <ViewContainer>
        {showLoader ?
          <LoadingModal
            animating={ showLoader }
            size='large'
          />
        :
          <ItemContainer
            complexColumnChartData={ complexCategoryExpenseColumnData }
            categoryPieCenterText={ categoryPieData.centerText }
            categoryPieData={ categoryPieData.data }
            displayXIncrementMarkers={ this.displayColumnXIncrementMarkers }
            generateXAxisLabel={ this.generateColumnXLabel }
            graphColumnPadding={ columnPadding }
            isExpense={ true }
            item={ expense }
            itemPieCenterText={ expensePieData.centerText }
            itemPieData={ expensePieData.data }
            itemTotal={ total }
            lastDate={ lastDate }
            nextDate={ nextDate }
          />
      }
      </ViewContainer>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    lastDate,
    nextDate,
    periods,
    total,
  } = getDetailExpenseSummary(state)
  const {
    categoryPieData,
    columnPadding,
    complexCategoryExpenseColumnData,
    expensePieData,
    labelFormat,
    reportPeriod,
  } = getDetailExpenseDataStructures(state)
  const { totals, periodSummaries } = getFullExpensesSummary(state)

  return {
    categoryPieData,
    columnPadding,
    complexCategoryExpenseColumnData,
    expense: getDetailExpense(state),
    expensePieData,
    labelFormat,
    lastDate,
    isCalculating: getIsExpenseCalculating(state),
    nextDate,
    periodSummaries,
    total,
    totals,
    reportPeriod,
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    setEditExpense: (expense) => dispatch(setEditExpense(expense))
  }
}

export const DetailExpenseScreen = connect(mapStateToProps, mapDispatchToProps)(DetailExpense)
