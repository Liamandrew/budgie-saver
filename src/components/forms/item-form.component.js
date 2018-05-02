import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import {
  AnimatedPlaceholderView,
  DateField,
  FormFieldWithDetailButton,
  LabelledFormInputField,
  PickerComponent,
  PickerModal,
  SingleButton,
  TextContainer,
  TouchableFormField,
  ViewContainer
} from '../index'
import {
  colors,
  isRecurring,
  periodicities,
  periodicityMap,
} from '../../utils'


export class ItemForm extends Component {
  static propTypes = {
    editEndDateModalVisible: PropTypes.bool,
    editFirstDateModalVisible: PropTypes.bool,
    editPeriodicityModalVisible: PropTypes.bool,
    isExpense: PropTypes.bool,
    isNewItem: PropTypes.bool,
    item: PropTypes.object,
    onAmountChange: PropTypes.func,
    onCategoryChange: PropTypes.func,
    onClearEndDate: PropTypes.func,
    onConfirmItemPress: PropTypes.func,
    onEditCategoryPress: PropTypes.func,
    onEditEndDatePress: PropTypes.func,
    onEditFirstDatePress: PropTypes.func,
    onEditPeriodicityPress: PropTypes.func,
    onEndDateChange: PropTypes.func,
    onFirstDateChange: PropTypes.func,
    onNameChange: PropTypes.func,
    onNotesChange: PropTypes.func,
    onPeriodicityChange: PropTypes.func,
    onSetEndDatePress: PropTypes.func,
  }

  handleEditCategoryPress = () => {
    const { onEditCategoryPress } = this.props

    Keyboard.dismiss()
    onEditCategoryPress()
  }

  render = () => {
    const {
      editEndDateModalVisible,
      editFirstDateModalVisible,
      editPeriodicityModalVisible,
      isExpense,
      isNewItem,
      item,
      onAmountChange,
      onCategoryChange,
      onClearEndDate,
      onConfirmItemPress,
      onEditEndDatePress,
      onEditFirstDatePress,
      onEditPeriodicityPress,
      onEndDateChange,
      onFirstDateChange,
      onNameChange,
      onNotesChange,
      onPeriodicityChange,
      onSetEndDatePress,
    } = this.props
    const itemTitle = (isExpense) ? 'Expense' : 'Income'

    return (
      <ViewContainer>
      {editPeriodicityModalVisible &&
        <PickerModal
          cancelButtonText="Cancel"
          confirmButtonText="Confirm"
          onCancelPress={ onEditPeriodicityPress }
          onConfirmPress={ onPeriodicityChange }
          pickerItems={ periodicities }
          selected={ item.periodicity }
          titleText="Select Periodicity"
          visible={ editPeriodicityModalVisible }
        />
      }
        <ViewContainer containerStyle={ styles.formContainer } >
          <ViewContainer containerStyle={ styles.mainFormContainer } >
            <ViewContainer containerStyle={ styles.amountContainer } >
              <LabelledFormInputField
                containerStyle={ styles.fieldContainer }
                fieldContainerStyle={ styles.fieldContainerStyle }
                keyboardType='numeric'
                labelContainerStyle={ styles.labelContainerStyle }
                labelText="Amount"
                labelTextStyle={ styles.fieldTitle }
                onChange={ onAmountChange }
                placeholder="Enter amount"
                value={ item.amount }
              />
              <ViewContainer containerStyle={ styles.fieldContainer } />
            </ViewContainer>
            <LabelledFormInputField
              containerStyle={ styles.fieldContainer }
              fieldContainerStyle={ styles.fieldContainerStyle }
              labelContainerStyle={ styles.labelContainerStyle }
              labelText="Name"
              labelTextStyle={ styles.fieldTitle }
              onChange={ onNameChange }
              placeholder="Enter name"
              value={ item.name }
            />
            <AnimatedPlaceholderView
              containerStyle={ styles.categoryContainer }
              collapsedView={
                <ViewContainer containerStyle={ styles.fieldContainer } >
                  <TextContainer
                    containerStyle={ styles.labelContainerStyle }
                    text="Category"
                    textStyle={ styles.fieldTitle }
                  />
                  <TouchableFormField
                    containerStyle={ styles.fieldContainerStyle }
                    fieldText={ item.category }
                    onPress={ this.handleEditCategoryPress }
                  />
                </ViewContainer>
              }
              shouldExpand={ item.subCategory ? true : false }
              expandedView={
                <ViewContainer containerStyle={ styles.fieldContainer } >
                  <TextContainer
                    containerStyle={ styles.labelContainerStyle }
                    text="Sub-Category"
                    textStyle={ styles.fieldTitle }
                  />
                  <TouchableFormField
                    containerStyle={ styles.fieldContainerStyle }
                    fieldText={ item.subCategory }
                    onPress={ this.handleEditCategoryPress }
                  />
                </ViewContainer>
              }
              placeholderView={
                <ViewContainer containerStyle={ styles.fieldContainer } />
              }
            />
            <ViewContainer containerStyle={ styles.fieldContainer }>
              <TextContainer
                containerStyle={ styles.labelContainerStyle }
                text="Periodicity"
                textStyle={ styles.fieldTitle }
              />
              {Platform.OS === 'ios' ?
                <TouchableFormField
                  containerStyle={ styles.fieldContainerStyle }
                  disabled={ !isNewItem }
                  fieldText={ periodicityMap[item.periodicity].name }
                  onPress={ onEditPeriodicityPress }
                />
              :
                <PickerComponent
                  onConfirmPress={ onPeriodicityChange }
                  pickerContainerStyle={ styles.fieldContainerStyle }
                  pickerItems={ periodicities }
                  selected={ item.periodicity }
                />
              }
            </ViewContainer>
            <AnimatedPlaceholderView
              containerStyle={ styles.categoryContainer }
              collapsedView={
                <ViewContainer containerStyle={ styles.fieldContainer } >
                  <TextContainer
                    containerStyle={ styles.labelContainerStyle }
                    text="Start Date"
                    textStyle={ styles.fieldTitle }
                  />
                  <DateField
                    containerStyle={ styles.fieldContainerStyle }
                    date={ item.firstDate }
                    modalTitleText="Select First Date"
                    modalVisible={ editFirstDateModalVisible }
                    onCancelPress={ onEditFirstDatePress }
                    onConfirmPress={ onFirstDateChange }
                    onEditDatePress={ onEditFirstDatePress }
                  />
                </ViewContainer>
              }
              shouldExpand={ isRecurring(item.periodicity) }
              expandedView={
                <ViewContainer containerStyle={ styles.fieldContainer }>
                  <ViewContainer containerStyle={ [styles.labelContainerStyle, styles.endDateContainer] } >
                    <TextContainer
                      containerStyle={ styles.labelContainerStyle }
                      text="End Date"
                      textStyle={ styles.fieldTitle }
                    />
                    <SingleButton
                      buttonStyle={ styles.labelContainerStyle, { justifyContent: 'flex-end' } }
                      containerStyle={ styles.labelContainerStyle }
                      disabled={ !item.isEnded }
                      onPress={ onClearEndDate }
                      text="Clear"
                    />
                  </ViewContainer>
                  {item.isEnded ?
                    <DateField
                      containerStyle={ styles.fieldContainerStyle }
                      date={ item.endDate }
                      modalTitleText="Select End Date"
                      modalVisible={ editEndDateModalVisible }
                      onCancelPress={ onEditEndDatePress }
                      onConfirmPress={ onEndDateChange }
                      onEditDatePress={ onEditEndDatePress }
                    />
                  :
                    <TouchableFormField
                      containerStyle={ styles.fieldContainerStyle }
                      fieldText="None"
                      onPress={ onSetEndDatePress }
                    />
                  }
                </ViewContainer>
              }
              placeholderView={
                <ViewContainer containerStyle={ styles.fieldContainer } />
              }
            />
          </ViewContainer>
          <ViewContainer containerStyle={ styles.spaceContainer } />
        </ViewContainer>
        <SingleButton
          buttonStyle={ styles.confirmButton }
          onPress={ onConfirmItemPress }
          text="Confirm"
          textStyle={ styles.confirmButtonText }
        />
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  amountContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  categoryContainer: {
    flexDirection: 'row',
    flex: 2
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.lightNavy,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmButtonText: {
    color: colors.pureWhite,
    fontSize: 15,
    fontWeight: 'bold',
  },
  fieldContainerStyle: {
    backgroundColor: colors.pureWhite,
    borderColor: colors.lightGrey,
    borderRadius: 3,
    borderWidth: 1.5,
    flex: 3,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  fieldContainer: {
    flex: 2,
  },
  fieldTitle: {
    color: colors.navy
  },
  formContainer: {
    flex: 8,
    backgroundColor: colors.offWhite,
  },
  labelContainerStyle: {
    flex: 2,
    justifyContent: 'flex-end',
    marginLeft: 10,
    marginBottom: 3,
  },
  endDateContainer: {
    flexDirection: 'row'
  },
  mainFormContainer: {
    flex: 5
  },
  spaceContainer: {
    flex: 1,
  },
})
