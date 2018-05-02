import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  DatePickerIOS,
  Modal,
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native'
import {
  BackdropContainer,
  SingleButton,
  TextContainer,
  ViewContainer
} from '../index'
import {
  dateToMoment,
  momentToISOString,
} from '../../utils'

export class DatePickerModal extends Component {
  static propTypes = {
    bottomBackdropContainerStyle: ViewPropTypes.style,
    buttonContainerStyle: ViewPropTypes.style,
    cancelButtonContainerStyle: ViewPropTypes.style,
    cancelButtonText: PropTypes.string,
    cancelButtonTextStyle: Text.propTypes.style,
    confirmButtonContainerStyle: ViewPropTypes.style,
    confirmButtonText: PropTypes.string,
    confirmButtonTextStyle: Text.propTypes.style,
    containerStyle: ViewPropTypes.style,
    date: PropTypes.object,
    modalContainerStyle: ViewPropTypes.style,
    onCancelPress: PropTypes.func,
    onConfirmPress: PropTypes.func,
    pickerContainerStyle: ViewPropTypes.style,
    titleContainerStyle: ViewPropTypes.style,
    titleText: PropTypes.string,
    titleTextStyle: Text.propTypes.style,
    topBackdropContainerStyle: ViewPropTypes.style,
    visible: PropTypes.bool,
  }

  state = {
    selectedDate: null,
  }

  componentWillMount = () => {
    const { date } = this.props

    this.setState({ selectedDate: date })
  }

  handleConfirmPress = () => {
    const { onConfirmPress } = this.props
    const { selectedDate } = this.state

    onConfirmPress(momentToISOString(dateToMoment(selectedDate).startOf()))
  }

  onDateChange = (date) => {
    this.setState({ selectedDate: date })
  }

  render = () => {
    const {
      bottomBackdropContainerStyle,
      buttonContainerStyle,
      cancelButtonContainerStyle,
      cancelButtonText,
      cancelButtonTextStyle,
      confirmButtonContainerStyle,
      confirmButtonText,
      confirmButtonTextStyle,
      containerStyle,
      modalContainerStyle,
      onCancelPress,
      pickerContainerStyle,
      titleContainerStyle,
      titleText,
      titleTextStyle,
      topBackdropContainerStyle,
      visible,
    } = this.props
    const { selectedDate } = this.state

    return (
      <Modal
        animationType={ 'fade' }
        transparent={ true }
        visible={ visible }
      >
        <ViewContainer containerStyle={ containerStyle } >
          <BackdropContainer containerStyle={ [styles.topBackdropContainer, topBackdropContainerStyle] } />
          <View style={ [styles.modalContainer, modalContainerStyle] } >
            <View style={ [styles.buttonContainer, buttonContainerStyle] } >
              <SingleButton
                buttonStyle={ [styles.cancelButtonContainer, cancelButtonContainerStyle] }
                onPress={ onCancelPress }
                text={ cancelButtonText }
                textStyle={ [styles.cancelButtonText, cancelButtonTextStyle] }
              />
              <TextContainer
                containerStyle={ [styles.titleContainer, titleContainerStyle] }
                text={ titleText }
                textStyle={ [styles.titleText, titleTextStyle] }
              />
              <SingleButton
                buttonStyle={ [styles.confirmButtonContainer, confirmButtonContainerStyle] }
                onPress={ this.handleConfirmPress }
                text={ confirmButtonText }
                textStyle={ [styles.confirmButtonText, confirmButtonTextStyle] }
              />
            </View>
            <View style={ [styles.pickerContainer, pickerContainerStyle] } >
              <DatePickerIOS
                date={ selectedDate }
                mode='date'
                onDateChange={ this.onDateChange }
              />
            </View>
          </View>
          <BackdropContainer containerStyle={ [styles.bottomBackdropContainer, bottomBackdropContainerStyle] } />
        </ViewContainer>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  topBackdropContainer: {
    flex: 4,
  },
  bottomBackdropContainer: {
    flex: 3,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonContainer: {
    flex: 2,
  },
  cancelButtonText: {
    textAlign: 'center'
  },
  confirmButtonContainer: {
    flex: 2,
  },
  confirmButtonText: {
    textAlign: 'center'
  },
  modalContainer: {
    flex: 4,
    backgroundColor: 'white',
    opacity: 1
  },
  pickerContainer: {},
  titleContainer: {
    flex: 4,
  },
  titleText: {
    textAlign: 'center'
  },
})
