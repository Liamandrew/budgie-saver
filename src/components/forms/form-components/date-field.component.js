import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  DatePickerAndroid,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native'
import {
  DatePickerModal,
  TextContainer,
  TouchableFormField,
  ViewContainer
} from '../../index'
import {
  dateToMoment,
  momentFormat,
  momentToDate,
  momentToISOString,
  stringToMoment,
} from '../../../utils'

export class DateField extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    date: PropTypes.string,
    dateTextStyle: Text.propTypes.style,
    onCancelPress: PropTypes.func,
    onConfirmPress: PropTypes.func,
    onEditDatePress: PropTypes.func,
    fieldContainerStyle: ViewPropTypes.style,
    modalTitleText: PropTypes.string,
    modalVisible: PropTypes.bool,
  }

  handleEditDatePress = () => {
    const { onEditDatePress } = this.props

    if (Platform.OS === 'ios') {
      onEditDatePress()
    } else {
      this.openAndroidDatePicker()
    }
  }

  async openAndroidDatePicker() {
    const { date, onConfirmPress } = this.props

    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: momentToDate(stringToMoment(date))
      })
      if (action !== DatePickerAndroid.dismissedAction) {

        const newDate = new Date(year, month, day)

        onConfirmPress(momentToISOString(dateToMoment(newDate).startOf()))

      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message)
    }
  }

  render = () => {
    const {
      containerStyle,
      date,
      dateTextStyle,
      onCancelPress,
      onConfirmPress,
      fieldContainerStyle,
      modalTitleText,
      modalVisible,
    } = this.props
    const showIOSModal = modalVisible && Platform.OS === 'ios'

    return (
      <ViewContainer containerStyle={ containerStyle }>
        {showIOSModal &&
          <DatePickerModal
            cancelButtonText="Cancel"
            confirmButtonText="Confirm"
            date={ momentToDate(stringToMoment(date)) }
            onCancelPress={ onCancelPress }
            onConfirmPress={ onConfirmPress }
            titleText={ modalTitleText }
            visible={ modalVisible }
          />
        }
        <TouchableFormField
          containerStyle={ fieldContainerStyle }
          fieldText={ momentFormat(date) }
          fieldTextStyle={ dateTextStyle }
          onPress={ this.handleEditDatePress }
        />
      </ViewContainer>
    )
  }
}
