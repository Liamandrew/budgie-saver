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
  setEditIncome,
  // selectors
  getDetailIncome,
  getDetailIncomeDataStructures,
  getDetailIncomeSummary,
  getFullIncomesSummary,
  getIsIncomeCalculating,
} from '../index'
import { overviewPeriods } from '../../overview'

class DetailIncome extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    const {
      handleEdit,
      incomeName,
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
        color: colors.lightNavy
      },
      tabBarLabel: "Income",
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_attach_money_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
      title: incomeName && incomeName
    }
  }

  componentWillMount = () => {
    const { income, navigation } = this.props

    navigation.setParams({ incomeName: income.name,  handleEdit: this.handleEditPress })
  }

  handleEditPress = () => {
    const {
      income,
      navigation,
      setEditIncome,
    } = this.props
    const params = {
      // pass the route key so that we can goBack from here in case of delete
      detailIncomeKey: navigation.state.key,
      // dummy function to avoid warning about required onPress handler on edit button
      handleEdit: () => { return }
    }

    setEditIncome(income)
    navigation.navigate('EditIncomeScreen', params)
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
      complexCategoryIncomeColumnData,
      detailCategoryColumnData,
      income,
      incomePieData,
      total,
      totals,
      lastDate,
      isCalculating,
      nextDate,
      periods,
    } = this.props

    const showLoader = isCalculating || !income

    return (
      <ViewContainer>
        {showLoader ?
          <LoadingModal
            animating={ showLoader }
            size='large'
          />
        :
          <ItemContainer
            complexColumnChartData={ complexCategoryIncomeColumnData }
            categoryPieCenterText={ categoryPieData.centerText }
            categoryPieData={ categoryPieData.data }
            displayXIncrementMarkers={ this.displayColumnXIncrementMarkers }
            generateXAxisLabel={ this.generateColumnXLabel }
            graphColumnPadding={ columnPadding }
            isExpense={ false }
            item={ income }
            itemPieCenterText={ incomePieData.centerText }
            itemPieData={ incomePieData.data }
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
  } = getDetailIncomeSummary(state)
  const {
    categoryPieData,
    columnPadding,
    complexCategoryIncomeColumnData,
    incomePieData,
    labelFormat,
    reportPeriod
  } = getDetailIncomeDataStructures(state)
  const { totals, periodSummaries } = getFullIncomesSummary(state)

  return {
    categoryPieData,
    columnPadding,
    complexCategoryIncomeColumnData,
    income: getDetailIncome(state),
    incomePieData,
    labelFormat,
    lastDate,
    isCalculating: getIsIncomeCalculating(state),
    nextDate,
    periodSummaries,
    total,
    totals,
    reportPeriod,
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    setEditIncome: (income) => dispatch(setEditIncome(income))
  }
}

export const DetailIncomeScreen = connect(mapStateToProps, mapDispatchToProps)(DetailIncome)
