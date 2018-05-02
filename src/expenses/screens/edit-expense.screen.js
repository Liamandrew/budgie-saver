import React, { Component } from 'react'
import {
  Alert,
  Button,
  Image,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'

import {
  // actions
  clearExpenseError,
  deleteExpense,
  updateEditExpense,
  updateExpense,
  // selectors
  getEditExpense,
  getExpenseError,
  getIsExpenseUpdating,
} from '../index'
import {
  DoubleAlert,
  LoadingModal,
  SingleAlert,
  SingleAlertView,
  ItemForm,
  ViewContainer,
} from '../../components'
import {
  colors,
  getErrorMessage,
  getMomentNow,
  itemIsValidInput,
  sleep,
} from '../../utils'

class EditExpense extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    const { handleDelete } = state.params

    return {
      headerBackTitle: 'Cancel',
      headerRight: (
        <Button
          title="Delete"
          onPress={ handleDelete ? handleDelete : () => {} }
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
      tabBarLabel: 'Expenses',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_credit_card_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
      title: 'Edit Expense'
    }
  }

  state = {
    endDatePickerModalVisible: false,
    firstDatePickerModalVisible: false,
    isUpdating: false,
  }

  componentDidMount = () => {
    const { navigation } = this.props

    navigation.setParams({ handleDelete: this.handleDeletePress })
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
      endDate: null,
    })
  }

  handleConfirm = () => {
    const { expense } = this.props
    const errArray = itemIsValidInput(expense)

    if (errArray.length === 0) {
      this.onConfirmClick()
    } else {
      SingleAlert('Invalid', errArray[0], 'Continue')
    }
  }

  handleConfirmDelete = () => {
    const {
      confirmDeleteExpense,
      expense,
      navigation
    } = this.props

    this.setState({ isUpdating: true })
    Promise.all([sleep(10)])
    .then(() => {
      Promise.all([confirmDeleteExpense(expense), sleep(400)])
      .then(() => {
        this.setState({ isUpdating: false })
        navigation.goBack(navigation.state.params.detailExpenseKey)
      })
    })
  }

  handleDeletePress = () => {
    DoubleAlert("Are you sure?", "This will permamently delete this expense.", "Cancel",
    null, "Confirm", this.handleConfirmDelete)
  }

  handleEditCategoryPress = () => {
    const {
      expense,
      navigation,
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

  handleEndDateChange = (date) => {
    const {
      expense,
      updateExpense,
    } = this.props

    updateExpense({
      ...expense,
      endDate: date
    })
    this.setState({ endDatePickerModalVisible: false })
  }

  handleFirstDateChange = (date) => {
    const {
      expense,
      updateExpense,
    } = this.props

    updateExpense({
      ...expense,
      firstDate: date
    })
    this.setState({ firstDatePickerModalVisible: false })
  }

  handleNameChange = (e) => {
    const {
      expense,
      updateExpense,
    } = this.props

    updateExpense({
      ...expense,
      name: e.nativeEvent.text
    })
  }

  handleSetEndDatePress = () => {
    const {
      expense,
      updateExpense,
    } = this.props

    updateExpense({
      ...expense,
      endDate: getMomentNow()
    })
    this.handleEditEndDatePress()
  }

  onConfirmClick = () => {
    const {
      confirmUpdateExpense,
      expense,
      navigation,
    } = this.props

    this.setState({ isUpdating: true })
    Promise.all([sleep(10)])
    .then(() => {
      Promise.all([confirmUpdateExpense(expense), sleep(400)])
      .then(() => {
        this.setState({ isUpdating: false })
        navigation.goBack()
      })
    })
  }

  render = () => {
    const { expense, expenseError } = this.props
    const {
      endDatePickerModalVisible,
      firstDatePickerModalVisible,
      isUpdating,
    } = this.state

    return (
      <ViewContainer>
        {expense &&
          <ItemForm
            editEndDateModalVisible={ endDatePickerModalVisible }
            editFirstDateModalVisible={ firstDatePickerModalVisible }
            editPeriodicityModalVisible={ false }
            isExpense={ true }
            isNewItem={ false }
            item={ expense }
            onAmountChange={ this.handleAmountChange }
            onCategoryChange={ this.handleCategoryChange }
            onClearEndDate={ this.handleClearEndDate }
            onConfirmItemPress={ this.handleConfirm }
            onEditCategoryPress={ this.handleEditCategoryPress }
            onEditEndDatePress={ this.handleEditEndDatePress }
            onEditFirstDatePress={ this.handleEditFirstDatePress }
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
    clearExpenseError: () => dispatch(clearExpenseError()),
    confirmUpdateExpense: (expense) => dispatch(updateExpense(expense)),
    confirmDeleteExpense: (expense) => dispatch(deleteExpense(expense)),
    updateExpense: (expense) => dispatch(updateEditExpense(expense)),
  }
}

export const EditExpenseScreen = connect(mapStateToProps, mapDispatchToProps)(EditExpense)
