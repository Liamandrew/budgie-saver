import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet
} from 'react-native'
import {
  BackdropContainer,
  DoubleButton,
  LabelledFormInputField,
  LoadingModal,
  SingleAlert,
  SingleButton,
  ViewContainer,
} from '../index'
import { colors } from '../../utils'

export class ForgotPasswordModal extends Component {
  static propTypes = {
    isSendingReset: PropTypes.bool,
    onCancelPress: PropTypes.func,
    onLoaderClose: PropTypes.func,
    onResetPress: PropTypes.func,
    visible: PropTypes.bool,
  }

  state = {
    email: '',
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.nativeEvent.text })
  }

  handleSubmit = () => {
    const { onResetPress } = this.props
    const { email } = this.state

    if (email.length === 0) {
      SingleAlert('Invalid', 'Please enter a valid email', 'Continue')
    } else {
      onResetPress(email)
    }
  }

  onRequestClose = () => {
    const { onCancelPress } = this.props

    this.setState({ email: '' })
    onCancelPress()
  }

  render = () => {
    const { isSendingReset, onLoaderClose, visible } = this.props
    const { email } = this.state

    return (
      <Modal
        animationType={ 'fade' }
        transparent={ false }
        visible={ visible }
        onRequestClose={ this.onRequestClose }
      >
        <ViewContainer>
          <BackdropContainer containerStyle={ styles.topBackdropContainer } />
          <KeyboardAvoidingView
            style={ styles.modalContainer }
            behavior="height"
          >
            <LabelledFormInputField
              containerStyle={ styles.inputContainer }
              fieldContainerStyle={ styles.fieldContainerStyle }
              labelContainerStyle={ styles.labelContainerStyle }
              labelText="Reset Password"
              labelTextStyle={ styles.resetPaswordTextStyle }
              keyboardType="email-address"
              onChange={ this.handleEmailChange }
              placeholder="Enter email"
              value={ email }
            />
            <ViewContainer containerStyle={ styles.buttonContainer } >
              <DoubleButton
                leftButtonStyle={ styles.cancelButtonContainer }
                leftTextStyle={ styles.cancelButtonText }
                leftOnPress={ this.onRequestClose }
                leftText="Cancel"
                rightButtonStyle={ styles.resetButtonContainer }
                rightTextStyle={ styles.resetButtonText }
                rightOnPress={ this.handleSubmit }
                rightText="Send Reset"
              />
            </ViewContainer>
          </KeyboardAvoidingView>
          <BackdropContainer containerStyle={ styles.bottomBackdropContainer } />
        </ViewContainer>
        <LoadingModal
          animating={ isSendingReset }
          onRequestClose={ onLoaderClose }
          size='large'
        />
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  topBackdropContainer: {
    flex: 4,
  },
  bottomBackdropContainer: {
    flex: 5,
  },
  buttonContainer: {
    paddingTop: 20,
  },
  modalContainer: {
    flex: 4,
    backgroundColor: colors.offWhite,
    opacity: 1,
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
  inputContainer: {
    flex: 2,
  },
  labelContainerStyle: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginBottom: 3,
  },
  resetPaswordTextStyle: {
    fontSize: 16
  },
  cancelButtonContainer: {
    backgroundColor: colors.pureWhite,
  },
  cancelButtonText: {
    color: colors.lightNavy,
  },
  resetButtonContainer: {
    backgroundColor: colors.lightNavy,
  },
  resetButtonText: {
    color: colors.pureWhite,
  },
})
