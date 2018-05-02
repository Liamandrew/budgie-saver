import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  AnimatedComplexSmoothLineChart,
  AnimatedPieChart,
  ExpensesIncomesSelector,
  Legend,
  LoadingModal,
  OverviewAmountsView,
  OverviewPeriodSelector,
  SingleAlertView,
  SingleButton,
  TextContainer,
  ViewContainer,
} from '../../components'
import {
  // actions
  clearOverviewError,
  setOverviewPeriod,
  setHasLoadedData,
  // periods
  overviewPeriods,
  // selectors
  getGraphColumnPadding,
  getGraphLabelFormat,
  getGraphReportPeriod,
  getHasLoadedData,
  getOverviewError,
  getReportPeriod,
  getReportPeriodStartDate,
  getReportSubPeriod,
} from '../index'
import {
  // actions
  clearExpenseError,
  fetchExpenses,
  // selectors
  getExpenseError,
  getExpensesDataStructures,
  getFullExpensesSummary,
} from '../../expenses'
import {
  // actions
  clearIncomeError,
  fetchIncomes,
  // selectors
  getIncomeError,
  getIncomesDataStructures,
} from '../../incomes'
import {
  colors,
  getErrorMessage,
  isStartOfMonth,
  momentFormat,
  sleep,
} from '../../utils'

export class Overview extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    const { handleMenuButtonPress } = state.params || {}

    const headerLeft = (
      <ViewContainer containerStyle={ { paddingLeft: 15 } }>
        <TouchableOpacity
          onPress={ handleMenuButtonPress ? handleMenuButtonPress : () => {} }
        >
          <ViewContainer containerStyle={ { justifyContent: 'center' }}>
            <Image
              source={ require('../../assets/images/ic_menu.png') }
              style={ { tintColor: colors.lightNavy } }
            />
          </ViewContainer>
        </TouchableOpacity>
      </ViewContainer>
    )

    return {
      headerLeft: headerLeft,
      headerStyle: {
        backgroundColor: colors.pureWhite,
      },
      tabBarLabel: 'Overview',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_equalizer_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
    }
  }

  state = {
    isExpensesSelected: true,
    isRefreshing: false,
    isLoading: false,
  }

  componentWillMount = () => {
    const {
      fetchExpenses,
      fetchIncomes,
      hasLoadedData,
      navigation,
      setHasLoadedData,
    } = this.props
    navigation.setParams({ handleMenuButtonPress: this.handleMenuButtonPress })

    if (!hasLoadedData) {
      this.setState({ isRefreshing: true })

      Promise.all([
        fetchExpenses(),
        fetchIncomes(),
        sleep(1000),
      ])
      .then(() => {
        this.setState({ isRefreshing: false })
        setHasLoadedData()
      })
    }
  }

  clearError = () => {
    const {
      clearExpenseError,
      clearIncomeError,
      clearOverviewError,
    } = this.props

    clearExpenseError()
    clearIncomeError()
    clearOverviewError()
  }

  generatePieStatistic = (value) => {
    const { totalExpenses, totalIncomes } = this.props
    const { isExpensesSelected } = this.state
    const total = isExpensesSelected ? totalExpenses : totalIncomes
    const statistic = (value * 100).toFixed(2)

    return `${statistic}%`
  }

  displaySmoothLineXIncrementMarkers = (item, index) => {
    const { reportPeriod } = this.props

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

  generateSmoothLineXLabel = (item, index) => {
    const { labelFormat, reportPeriod } = this.props
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

  handleExpensesPressed = () => {
    if (!this.state.isExpensesSelected) {
      this.setState({ isExpensesSelected: true })
    }
  }

  handleIncomesPressed = () => {
    if (this.state.isExpensesSelected) {
      this.setState({ isExpensesSelected: false })
    }
  }

  handleMenuButtonPress = () => {
    this.props.navigation.navigate('DrawerOpen')
  }

  handlePeriodAllPressed = () => {
    this.setOverviewPeriod(overviewPeriods.all.id)
  }

  handlePeriodHalfYearPressed = () => {
    this.setOverviewPeriod(overviewPeriods.halfYear.id)
  }

  handlePeriodMonthPressed = () => {
    this.setOverviewPeriod(overviewPeriods.month.id)
  }

  handlePeriodQuarterPressed = () => {
    this.setOverviewPeriod(overviewPeriods.quarter.id)
  }

  handlePeriodWeekPressed = () => {
    this.setOverviewPeriod(overviewPeriods.week.id)
  }

  handlePeriodYearPressed = () => {
    this.setOverviewPeriod(overviewPeriods.year.id)
  }

  setOverviewPeriod = (period) => {
    const { setOverviewPeriod } = this.props

    this.setState({ isLoading: true })
    Promise.all([sleep(10)])
    .then(() => {
      Promise.all([setOverviewPeriod(period), sleep(300)])
      .then(() => {
        this.setState({ isLoading: false })
      })
    })
  }

  renderExpensesPieChart = () => {
    const { expensesCategoryPieDataArray } = this.props
    const { isLoading } = this.state

    if (expensesCategoryPieDataArray) {
      return (
        <ViewContainer containerStyle={ styles.pieChart }>
          <AnimatedPieChart
            data={ expensesCategoryPieDataArray }
            highlightedRatio={ 0.04 }
            innerRadiusRatio={ 0.6 }
            isCalculating={ isLoading }
            paddingBottom={ 2 }
            paddingTop={ 2 }
          />
          { this.renderPieChartLegend(expensesCategoryPieDataArray) }
        </ViewContainer>
      )
    }
  }

  renderIncomesPieChart = () => {
    const { incomesCategoryPieDataArray } = this.props
    const { isLoading } = this.state

    if (incomesCategoryPieDataArray) {
      return (
        <ViewContainer containerStyle={ styles.pieChart }>
          <AnimatedPieChart
            data={ incomesCategoryPieDataArray }
            highlightedRatio={ 0.04 }
            innerRadiusRatio={ 0.6 }
            isCalculating={ isLoading }
            paddingBottom={ 2 }
            paddingTop={ 2 }
          />
          { this.renderPieChartLegend(incomesCategoryPieDataArray) }
        </ViewContainer>
      )
    }
  }

  renderPieChartLegend = (dataArray) => {
    const { isLoading } = this.state

    return (
      <Legend
        colorStatistic={ true }
        containerStyle={ styles.legendContainer }
        data={ dataArray }
        generateStatistic={ this.generatePieStatistic }
        isCalculating={ isLoading }
        isHorizontal={ false }
        labelTextStyle={ styles.legendLabelTextStyle }
        showSymbol={ false }
        statisticTextStyle={ styles.legendStatisticTextStyle }
      />
    )
  }

  render = () => {
    const {
      columnPadding,
      expenseError,
      expensesSummary,
      incomeError,
      overviewDataArray,
      overviewError,
      reportPeriod,
      reportSubPeriod,
      totalExpenses,
      totalIncomes,
    } = this.props
    const { isLoading, isRefreshing, isExpensesSelected } = this.state
    const showLoader = isRefreshing || isLoading
    const error = expenseError || incomeError || overviewError

    return (
      <ViewContainer>
        {showLoader &&
          <LoadingModal
            animating={ showLoader }
            size='large'
          />
        }
        <ViewContainer>
          <ViewContainer containerStyle={ styles.overviewPicker } >
            <OverviewPeriodSelector
              onPeriodAllPressed={ this.handlePeriodAllPressed }
              onPeriodHalfYearPressed={ this.handlePeriodHalfYearPressed }
              onPeriodMonthPressed={ this.handlePeriodMonthPressed }
              onPeriodQuarterPressed={ this.handlePeriodQuarterPressed }
              onPeriodWeekPressed={ this.handlePeriodWeekPressed }
              onPeriodYearPressed={ this.handlePeriodYearPressed }
              overviewPeriods={ overviewPeriods }
              selected={ reportPeriod }
            />
          </ViewContainer>
          <ViewContainer containerStyle={ styles.overviewScreen } >
            <ViewContainer style={ styles.lineGraphContainer } >
              <AnimatedComplexSmoothLineChart
                axisColor={ colors.lightNavy }
                data={ overviewDataArray }
                displayXIncrementMarkers={ this.displaySmoothLineXIncrementMarkers }
                generateXAxisLabel={ this.generateSmoothLineXLabel }
                isCalculating={ isLoading }
                maxValue={ Math.max(totalExpenses, totalIncomes) }
                xAxisLabelColor={ colors.lightNavy }
                yAxisLabelColor={ colors.lightNavy }
                yIncrementsColor={ colors.opacityBlack }
              />
            </ViewContainer>
            <OverviewAmountsView
              isCalculating={ isLoading }
              totalExpenses={ totalExpenses }
              totalIncomes={ totalIncomes }
            />
            <ViewContainer containerStyle={ styles.categoryPieChartContainer } >
              <ExpensesIncomesSelector
                onExpensesPressed={ this.handleExpensesPressed }
                onIncomesPressed={ this.handleIncomesPressed }
                isExpensesSelected={ isExpensesSelected }
              />
              <ViewContainer containerStyle={ styles.pieChartContainer }>
                { isExpensesSelected ?
                  this.renderExpensesPieChart()
                : this.renderIncomesPieChart()
                }
              </ViewContainer>
            </ViewContainer>
          </ViewContainer>
        </ViewContainer>
        {error &&
          <SingleAlertView
            title='Error'
            message={ getErrorMessage(error) }
            buttonText='Continue'
            onPress={ this.clearError }
          />
        }
      </ViewContainer>
    )
  }
}

const mapStateToProps = (state) => {
  const period = getGraphReportPeriod(state)
  const { expensesCategoryPieDataArray, expensesDataArray, totalExpenses } = getExpensesDataStructures(state)
  const { incomesCategoryPieDataArray, incomesDataArray, totalIncomes } = getIncomesDataStructures(state)
  const overviewDataArray = [incomesDataArray, expensesDataArray]

  return {
    columnPadding: getGraphColumnPadding(period),
    expenseError: getExpenseError(state),
    expensesCategoryPieDataArray,
    expensesDataArray,
    expensesSummary: getFullExpensesSummary(state),
    hasLoadedData: getHasLoadedData(state),
    incomeError: getIncomeError(state),
    incomesCategoryPieDataArray,
    incomesDataArray,
    labelFormat: getGraphLabelFormat(period),
    overviewDataArray,
    overviewError: getOverviewError(state),
    reportPeriod: getReportPeriod(state),
    reportStartDate: getReportPeriodStartDate(state),
    reportSubPeriod: getReportSubPeriod(period),
    totalExpenses,
    totalIncomes,
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    clearExpenseError: () => dispatch(clearExpenseError()),
    clearIncomeError: () => dispatch(clearIncomeError()),
    clearOverviewError: () => dispatch(clearOverviewError()),
    fetchExpenses: () => dispatch(fetchExpenses()),
    fetchIncomes: () => dispatch(fetchIncomes()),
    setHasLoadedData: () => dispatch(setHasLoadedData()),
    setOverviewPeriod: (period) => dispatch(setOverviewPeriod(period))
  }
}

const styles = StyleSheet.create({
  legendContainer: {
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  legendStatisticTextStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingLeft: 2,
    width: 60
  },
  legendLabelTextStyle: {
    fontSize: 10,
    color: colors.lightNavy,
    paddingLeft: 5
  },
  lineGraphContainer: {
    flex: 6,
    backgroundColor: colors.pureWhite,
  },
  overviewPicker: {
    flex: 1,
  },
  overviewScreen: {
    flex: 10,
  },
  pieChart: {
    flex: 4,
    flexDirection: 'row',
  },
  pieChartContainer: {
    flex: 3,
  },
  categoryPieChartContainer: {
    flex: 5,
    backgroundColor: colors.lightGrey,
  },
})

export const OverviewScreen = connect(mapStateToProps, mapDispatchToProps)(Overview)
