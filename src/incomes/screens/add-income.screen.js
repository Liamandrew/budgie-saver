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
  addIncome,
  clearIncomeError,
  updateEditIncome,
  // selectors
  getEditIncome,
  getIncomeError,
  getIsIncomeUpdating,
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


class AddIncome extends Component {
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
      tabBarLabel: 'Income',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_attach_money_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
      title: `New Income`
    }
  }

  state = {
    editPeriodicityModalVisible: false,
    endDatePickerModalVisisble: false,
    firstDatePickerModalVisible: false,
    isUpdating: false,
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
      isEnded: false
    })
  }

  handleConfirm = () => {
    const { income } = this.props
    const errArray = itemIsValidInput(income)

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

  handleEditPeriodicityPress = () => {
    this.setState({ editPeriodicityModalVisible: !this.state.editPeriodicityModalVisible })
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

  handleNotesChange = (e) => {
    const { income, updateIncome } = this.props

    updateIncome({
      ...income,
      notes: e.nativeEvent.text
    })
  }

  handlePeriodicityChange = (periodicity) => {
    const { income, updateIncome } = this.props

    updateIncome({
      ...income,
      periodicity
    })
    this.setState({ editPeriodicityModalVisible: false })
  }

  handleSetEndDatePress = () => {
    const { income, updateIncome } = this.props

    updateIncome({
      ...income,
      isEnded: true,
    })
    this.handleEditEndDatePress()
  }

  onConfirmClick = () => {
    const { addIncome, income, navigation } = this.props

    this.setState({ isUpdating: true })
    Promise.all([sleep(10)])
    .then(() => {
      Promise.all([addIncome(income), sleep(400)])
      .then(() => {
        this.setState({ isUpdating: false })
        navigation.goBack()
      })
    })
  }

  render = () => {
    const { income, incomeError } = this.props
    const {
      editPeriodicityModalVisible,
      endDatePickerModalVisible,
      firstDatePickerModalVisible,
      isUpdating
    } = this.state

    return (
      <ViewContainer>
        {income &&
          <ItemForm
            editEndDateModalVisible={ endDatePickerModalVisible }
            editFirstDateModalVisible={ firstDatePickerModalVisible }
            editPeriodicityModalVisible={ editPeriodicityModalVisible }
            isExpense={ false }
            isNewItem={ true }
            item={ income }
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
    addIncome: (income) => dispatch(addIncome(income)),
    clearIncomeError: () => dispatch(clearIncomeError()),
    updateIncome: (income) => dispatch(updateEditIncome(income))
  }
}

export const AddIncomeScreen = connect(mapStateToProps, mapDispatchToProps)(AddIncome)
