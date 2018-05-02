import React, { Component} from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import {
  // actions
  clearExpenseError,
  fetchExpenses,
  setDetailExpense,
  setEditExpense,
  setSearchString,
  // selectors
  getAllExpenses,
  getAllExpenseCategoriesFlat,
  getExpenseError,
  getExpenseSearchString,
  getIsExpenseFetching,
  getViewableExpenses,
} from '../index'
import {
  // actions
  setOverviewPeriod,
  // periods
  overviewPeriods,
  // selectors
  getReportPeriod,
} from '../../overview'
import {
  ExpenseList,
  LoadingModal,
  OverviewPeriodSelector,
  SearchNavigationHeader,
  SingleAlertView,
  ViewContainer,
} from '../../components'
import {
  colors,
  getErrorMessage,
  itemShell,
  sleep,
} from '../../utils'

class Expense extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation

    const {
      getSearchString,
      handleAddExpense,
      handleCancelSearchPress,
      handleMenuButtonPress,
      handleSearchStringChange,
      searchString
    } = state.params || {}

    const header = (
      <SearchNavigationHeader
        onAddPressed={ handleAddExpense ? handleAddExpense : () => {} }
        onCancelPressed={ handleCancelSearchPress ? handleCancelSearchPress : () => {} }
        onMenuButtonPressed={ handleMenuButtonPress ? handleMenuButtonPress : () => {} }
        onSearchStringChange={ handleSearchStringChange ? handleSearchStringChange : () => {} }
        searchString={ searchString ? searchString : '' }
      />
    )

    return {
      header: header,
      headerStyle: {
        backgroundColor: colors.pureWhite,
      },
      tabBarLabel: 'Expenses',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_credit_card_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
    }
  }

  state = {
    isLoading: false,
  }

  componentWillMount = () => {
    const { isAnonymous, navigation } = this.props

    navigation.setParams({
      getSearchString: this.getSearchString,
      handleAddExpense: this.showAddExpenseScreen,
      handleCancelSearchPress: this.handleCancelSearchPress,
      handleMenuButtonPress: this.handleMenuButtonPress,
      handleSearchStringChange: this.handleSearchStringChange,
      isAnonymous: isAnonymous,
    })
  }

  clearError = () => {
    const { clearExpenseError } = this.props

    clearExpenseError()
  }

  handleCancelSearchPress = () => {
    const { navigation, setSearchString } = this.props

    // empty search string on cancel
    navigation.setParams({ searchString: '' })
    setSearchString('')
  }

  handleMenuButtonPress = () => {
    this.props.navigation.navigate('DrawerOpen')
  }

  handleSearchStringChange = (e) => {
    const { setSearchString, navigation } = this.props

    navigation.setParams({ searchString: e.nativeEvent.text })
    setSearchString(e.nativeEvent.text)
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

  handleRefresh = () => {
    const { fetchExpenses } = this.props

    fetchExpenses()
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

  showDetailView = (expense) => {
    const { navigation, setDetailExpense } = this.props
    const params = {}

    this.setState({ isLoading: true })
    Promise.all([sleep(10)])
    .then(() => {
      Promise.all([setDetailExpense(expense.id), sleep(100)])
      .then(() => {
        this.setState({ isLoading: false })
        navigation.navigate('DetailExpenseScreen', params)
      })
    })
  }

  showAddExpenseScreen = () => {
    const {
      navigation,
      setEditExpense
    } = this.props
    const param = {}

    setEditExpense(itemShell())
    navigation.navigate('AddExpenseScreen', param)
  }

  render = () => {
    const {
      expenseError,
      expenses,
      isFetching,
      navigation,
      reportPeriod
    } = this.props
    const { isLoading } = this.state

    return (
      <ViewContainer containerStyle={ styles.container }>
        {isLoading &&
          <LoadingModal
            animating={ isLoading }
            size='large'
          />
        }
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
        <ViewContainer containerStyle={ styles.expensesScreen } >
          <ExpenseList
            expenses={ expenses }
            isCalculating={ isLoading }
            isRefreshing={ isFetching }
            navigation={ navigation }
            onRefresh={ this.handleRefresh }
            showDetailView={ this.showDetailView }
          />
        </ViewContainer>
        {expenseError &&
          <SingleAlertView
            title='Error'
            message={ getErrorMessage(expenseError) }
            buttonText='Continue'
            onPress={ this.clearError }
          />
        }
      </ViewContainer>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    categories: getAllExpenseCategoriesFlat(state),
    expenseError: getExpenseError(state),
    expenses: getViewableExpenses(state),
    isFetching: getIsExpenseFetching(state),
    reportPeriod: getReportPeriod(state),
    searchString: getExpenseSearchString(state),
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    clearExpenseError: () => dispatch(clearExpenseError()),
    fetchExpenses: () => dispatch(fetchExpenses()),
    setDetailExpense: (id) => dispatch(setDetailExpense(id)),
    setEditExpense: (expense) => dispatch(setEditExpense(expense)),
    setOverviewPeriod: (period) => dispatch(setOverviewPeriod(period)),
    setSearchString: (string) => dispatch(setSearchString(string)),
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.offWhite,
  },
  overviewPicker: {
    flex: 1,
  },
  expensesScreen: {
    flex: 10,
  },
})

export const ExpenseScreen = connect(mapStateToProps, mapDispatchToProps)(Expense)
