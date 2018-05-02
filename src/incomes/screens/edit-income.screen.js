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
  clearIncomeError,
  deleteIncome,
  updateEditIncome,
  updateIncome,
  // selectors
  getEditIncome,
  getIncomeError,
  getIsIncomeUpdating,
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

class EditIncome extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    const { handleDelete } = state.params

    return {
      headerBackTitle: 'Cancel',
      headerRight: (
        <Button
          title="Delete"
          color={ colors.lightNavy }
          onPress={ handleDelete ? handleDelete : () => {} }
        />
      ),
      headerStyle: {
        backgroundColor: colors.pureWhite,
      },
      headerTintColor: colors.lightNavy,
      headerTitleStyle: {
        color: colors.lightNavy
      },
      tabBarLabel: 'Income',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_attach_money_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
      title: 'Edit Income'
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
    const { clearIncomeError } = this.props

    clearIncomeError()
  }

  handleAmountChange = (e) => {
    const { income, updateIncome } = this.props

    updateIncome({
      ...income,
      amount: e.nativeEvent.text,
    })
  }

  handleClearEndDate = () => {
    const { income, updateIncome } = this.props

    updateIncome({
      ...income,
      endDate: null,
    })
  }

  handleConfirm = () => {
    const { income } = this.props
    const errArray = itemIsValidInput(income)

    if (errArray.length === 0) {
      this.onConfirmClick()
    } else {
      SingleAlert('Invalid', errArray[0], 'Continue')
    }
  }

  handleConfirmDelete = () => {
    const { confirmDeleteIncome, income, navigation } = this.props

    this.setState({ isUpdating: true })
    Promise.all([sleep(10)])
    .then(() => {
      Promise.all([confirmDeleteIncome(income), sleep(400)])
      .then(() => {
        this.setState({ isUpdating: false })
        navigation.goBack(navigation.state.params.detailIncomeKey)
      })
    })
  }

  handleDeletePress = () => {
    DoubleAlert("Are you sure?", "This will permamently delete this expense.", "Cancel",
    null, "Confirm", this.handleConfirmDelete)
  }

  handleEditCategoryPress = () => {
    const { income, navigation } = this.props
    const props = {
      selectedCategory: income.category,
      selectedSubCategory: income.subCategory,
      // dummy function to avoid warning about required onPress handler on confirm button
      handleConfirm: () => { return }
    }

    navigation.navigate('IncomeCategoriesScreen', props)
  }

  handleEditEndDatePress = () => {
    this.setState({ endDatePickerModalVisible: !this.state.endDatePickerModalVisible })
  }

  handleEditFirstDatePress = () => {
    this.setState({ firstDatePickerModalVisible: !this.state.firstDatePickerModalVisible })
  }

  handleEndDateChange = (date) => {
    const { income, updateIncome } = this.props

    updateIncome({
      ...income,
      endDate: date
    })
    this.setState({ endDatePickerModalVisible: false })
  }

  handleFirstDateChange = (date) => {
    const { income, updateIncome } = this.props

    updateIncome({
      ...income,
      firstDate: date
    })
    this.setState({ firstDatePickerModalVisible: false })
  }

  handleNameChange = (e) => {
    const { income, updateIncome } = this.props

    updateIncome({
      ...income,
      name: e.nativeEvent.text
    })
  }

  handleSetEndDatePress = () => {
    const { income, updateIncome } = this.props

    updateIncome({
      ...income,
      endDate: getMomentNow()
    })
    this.handleEditEndDatePress()
  }

  onConfirmClick = () => {
    const { confirmUpdateIncome, income, navigation } = this.props

    this.setState({ isUpdating: true })
    Promise.all([sleep(10)])
    .then(() => {
      Promise.all([confirmUpdateIncome(income), sleep(400)])
      .then(() => {
        this.setState({ isUpdating: false })
        navigation.goBack()
      })
    })
  }

  render = () => {
    const { income, incomeError } = this.props
    const { endDatePickerModalVisible, firstDatePickerModalVisible, isUpdating } = this.state

    return (
      <ViewContainer>
        {income &&
          <ItemForm
            editEndDateModalVisible={ endDatePickerModalVisible }
            editFirstDateModalVisible={ firstDatePickerModalVisible }
            editPeriodicityModalVisible={ false }
            isExpense={ false }
            isNewItem={ false }
            item={ income }
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
        {incomeError &&
          <SingleAlertView
            title='Error'
            message={ getErrorMessage(incomeError) }
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
    income: getEditIncome(state),
    incomeError: getIncomeError(state),
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    clearIncomeError: () => dispatch(clearIncomeError()),
    confirmUpdateIncome: (income) => dispatch(updateIncome(income)),
    confirmDeleteIncome: (income) => dispatch(deleteIncome(income)),
    updateIncome: (income) => dispatch(updateEditIncome(income)),
  }
}

export const EditIncomeScreen = connect(mapStateToProps, mapDispatchToProps)(EditIncome)
