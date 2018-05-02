import React, { Component} from 'react'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import {
  // actions
  clearIncomeError,
  fetchIncomes,
  setDetailIncome,
  setEditIncome,
  setSearchString,
  // selectors
  getAllIncomes,
  getAllIncomeCategoriesFlat,
  getIncomeError,
  getIncomeSearchString,
  getIsIncomeFetching,
  getViewableIncomes,
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
  IncomeList,
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

class Income extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    const {
      getSearchSting,
      handleAddIncome,
      handleCancelSearchPress,
      handleMenuButtonPress,
      handleSearchStringChange,
      searchString,
    } = state.params || {}

    const header = (
      <SearchNavigationHeader
        onAddPressed={ handleAddIncome ? handleAddIncome : () => {} }
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
      tabBarLabel: 'Income',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_attach_money_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
    }
  }

  state = {
    isLoading: false,
  }

  componentDidMount = () => {
    const { navigation } = this.props

    navigation.setParams({
      getSearchString: this.getSearchString,
      handleAddIncome: this.showAddIncomeScreen,
      handleCancelSearchPress: this.handleCancelSearchPress,
      handleMenuButtonPress: this.handleMenuButtonPress,
      handleSearchStringChange: this.handleSearchStringChange,
    })
  }

  clearError = () => {
    const { clearIncomeError } = this.props

    clearIncomeError()
  }

  handleCancelSearchPress = () => {
    const { navigation, setSearchString } = this.props

    // empty search string on cacnel
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
    const { fetchIncomes } = this.props

    fetchIncomes()
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

  showDetailView = (income) => {
    const { navigation, setDetailIncome } = this.props
    const params = {}

    this.setState({ isLoading: true })
    Promise.all([sleep(10)])
    .then(() => {
      Promise.all([setDetailIncome(income.id), sleep(100)])
      .then(() => {
        this.setState({ isLoading: false })
        navigation.navigate('DetailIncomeScreen', params)
      })
    })
  }

  showAddIncomeScreen = () => {
    const { navigation, setEditIncome } = this.props
    const param = {}

    setEditIncome(itemShell())
    navigation.navigate('AddIncomeScreen', param)
  }

  render = () => {
    const {
      incomeError,
      incomes,
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
        <ViewContainer containerStyle={ styles.incomeScreen } >
          <IncomeList
            incomes={ incomes }
            isCalculating={ isLoading }
            isRefreshing={ isFetching }
            navigation={ navigation }
            onRefresh={ this.handleRefresh }
            showDetailView={ this.showDetailView }
          />
        </ViewContainer>
        {incomeError &&
          <SingleAlertView
            title='Error'
            message={ getErrorMessage(incomeError) }
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
    categories: getAllIncomeCategoriesFlat(state),
    incomeError: getIncomeError(state),
    incomes: getViewableIncomes(state),
    isFetching: getIsIncomeFetching(state),
    reportPeriod: getReportPeriod(state),
    searchString: getIncomeSearchString(state),
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    clearIncomeError: () => dispatch(clearIncomeError()),
    fetchIncomes: () => dispatch(fetchIncomes()),
    setDetailIncome: (id) => dispatch(setDetailIncome(id)),
    setEditIncome: (income) => dispatch(setEditIncome(income)),
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
  incomeScreen: {
    flex: 10,
  },
})

export const IncomeScreen = connect(mapStateToProps, mapDispatchToProps)(Income)
