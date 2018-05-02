import React, { Component } from 'react'
import {
  Alert,
  Image,
  Text,
  View
} from 'react-native'
import { connect } from 'react-redux'

import {
  // actions
  addExpense,
  clearExpenseError,
  updateEditExpense,
  // selectors
  getEditExpense,
  getExpenseError,
  getIsExpenseUpdating,
} from '../index'
import {
  ItemForm,
  LoadingModal,
  SingleAlertView,
  ViewContainer,
} from '../../components'
import {
  colors,
  getErrorMessage,
  getMomentNow,
  itemIsValidInput,
  sleep
} from '../../utils'

class AddExpense extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerBackTitle: 'Cancel',
      headerStyle: {
        backgroundColor: colors.pureWhite,
      },
      headerTintColor: colors.lightNavy,
      headerTitleStyle: {
        color: colors.lightNavy
      },
      tabBarLabel: 'Expenses', tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_credit_card_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
      title: `New Expense`
    }
  }

  state = {
    editPeriodicityModalVisible: false,
    endDatePickerModalVisisble: false,
    firstDatePickerModalVisible: false,
    isUpdating: false,
  }

  clearError = () => {
    const { clearExpenseError } = this.props

    clearExpenseError()
  }

  handleAmountChange = (e) => {
    const {
      expense,
      updateExpense,
    } = this.props

    updateExpense({
      ...expense,
      amount: e.nativeEvent.text,
    })
  }

  handleClearEndDate = () => {
    const {
      expense,
      updateExpense,
    } = this.props

    updateExpense({
      ...expense,
      isEnded: false
    })
  }

  handleConfirm = () => {
    const { expense } = this.props
    const errArray = itemIsValidInput(expense)

    if (errArray.length === 0) {
      this.onConfirmClick()
    } else {
      Alert.alert(
        'Invalid',
        errArray[0]
      )
    }
  }

  handleEditCategoryPress = () => {
    const {
      expense,
      navigation
    } = this.props
    const props = {
      selectedCategory: expense.category,
      selectedSubCategory: expense.subCategory,
      // dummy function to avoid warning about required onPress handler on confirm button
      handleConfirm: () => { return }
    }

    navigation.navigate('ExpenseCategoriesScreen', props)
  }

  handleEditEndDatePress = () => {
    this.setState({ endDatePickerModalVisible: !this.state.endDatePickerModalVisible })
  }

  handleEditFirstDatePress = () => {
    this.setState({ firstDatePickerModalVisible: !this.state.firstDatePickerModalVisible })
  }

  handleEditPeriodicityPress = () => {
    this.setState({ editPeriodicityModalVisible: !this.state.editPeriodicityModalVisible })
  }

  handleEndDateChange = (date) => {
    const { expense, updateExpense } = this.props

    updateExpense({
      ...expense,
      endDate: date
    })
    this.handleEditEndDatePress()
  }

  handleFirstDateChange = (date) => {
    const { expense, updateExpense } = this.props

    updateExpense({
      ...expense,
      firstDate: date
    })
    this.handleEditFirstDatePress()
  }

  handleNameChange = (e) => {
    const { expense, updateExpense } = this.props

    updateExpense({
      ...expense,
      name: e.nativeEvent.text
    })
  }

  handleNotesChange = (e) => {
    const { expense, updateExpense } = this.props

    updateExpense({
      ...expense,
      notes: e.nativeEvent.text
    })
  }

  handlePeriodicityChange = (periodicity) => {
    const { expense, updateExpense } = this.props

    updateExpense({
      ...expense,
      periodicity
    })
    this.setState({ editPeriodicityModalVisible: false })
  }

  handleSetEndDatePress = () => {
    const { expense, updateExpense } = this.props

    updateExpense({
      ...expense,
      isEnded: true,
    })
    this.handleEditEndDatePress()
  }

  onConfirmClick = () => {
    const { expense, navigation, addExpense } = this.props

    this.setState({ isUpdating: true })
    Promise.all([sleep(10)])
    .then(() => {
      Promise.all([addExpense(expense), sleep(400)])
      .then(() => {
        this.setState({ isUpdating: false })
        navigation.goBack()
      })
    })
  }

  render = () => {
    const { expense, expenseError } = this.props
    const {
      editPeriodicityModalVisible,
      endDatePickerModalVisible,
      firstDatePickerModalVisible,
      isUpdating
    } = this.state

    return (
      <ViewContainer>
        {expense &&
          <ItemForm
            editEndDateModalVisible={ endDatePickerModalVisible }
            editFirstDateModalVisible={ firstDatePickerModalVisible }
            editPeriodicityModalVisible={ editPeriodicityModalVisible }
            isExpense={ true }
            isNewItem={ true }
            item={ expense }
            onAmountChange={ this.handleAmountChange }
            onCategoryChange={ this.handleCategoryChange }
            onClearEndDate={ this.handleClearEndDate }
            onConfirmItemPress={ this.handleConfirm }
            onEditCategoryPress={ this.handleEditCategoryPress }
            onEditEndDatePress={ this.handleEditEndDatePress }
            onEditFirstDatePress={ this.handleEditFirstDatePress }
            onEditPeriodicityPress={ this.handleEditPeriodicityPress }
            onEndDateChange={ this.handleEndDateChange }
            onFirstDateChange={ this.handleFirstDateChange }
            onNameChange={ this.handleNameChange }
            onNotesChange={ this.handleNotesChange }
            onPeriodicityChange={ this.handlePeriodicityChange }
            onSetEndDatePress={ this.handleSetEndDatePress }
          />
        }
        {expenseError &&
          <SingleAlertView
            title='Error'
            message={ getErrorMessage(expenseError) }
            buttonText='Continue'
            onPress={ this.clearError }
          />
        }
        {isUpdating &&
          <LoadingModal
            animating={ isUpdating }
            size='large'
          />
        }
      </ViewContainer>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    expense: getEditExpense(state),
    expenseError: getExpenseError(state),
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    addExpense: (expense) => dispatch(addExpense(expense)),
    clearExpenseError: () => dispatch((clearExpenseError())),
    updateExpense: (expense) => dispatch(updateEditExpense(expense))
  }
}

export const AddExpenseScreen = connect(mapStateToProps, mapDispatchToProps)(AddExpense)
