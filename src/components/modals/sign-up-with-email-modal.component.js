import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
} from 'react-native'
import {
  BackdropContainer,
  DoubleButton,
  LoadingModal,
  SignupWithEmailForm,
  SingleAlert,
  ViewContainer,
} from '../index'
import {
  colors,
  isValidSignup
} from '../../utils'

export class SignupWithEmailModal extends Component {
  static propTypes = {
    isSigningUp: PropTypes.bool,
    onCancelPress: PropTypes.func,
    onLoaderClose: PropTypes.func,
    onSubmitPress: PropTypes.func,
    visible: PropTypes.bool,
  }

  state = {
    email: '',
    firstName: '',
    passwordOne: '',
    passwordTwo: ''
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.nativeEvent.text })
  }

  handleFirstNameChange = (e) => {
    this.setState({ firstName: e.nativeEvent.text })
  }

  handlePasswordOneChange = (e) => {
    this.setState({ passwordOne: e.nativeEvent.text })
  }

  handlePasswordTwoChange = (e) => {
    this.setState({ passwordTwo: e.nativeEvent.text })
  }

  handleSubmit = () => {
    const { onSubmitPress } = this.props
    const {
      email,
      firstName,
      passwordOne,
      passwordTwo,
    } = this.state

    const errArray = isValidSignup(email, firstName, passwordOne, passwordTwo)

    if (errArray.length === 0) {
      onSubmitPress(this.state)
    } else {
      SingleAlert('Invalid', errArray[0], 'Continue')
    }
  }

  onRequestClose = () => {
    const { onCancel } = this.props

    this.setState({
      email: '',
      firstName: '',
      passwordOne: '',
      passwordTwo: '',
    })
    onCancel()
  }

  render = () => {
    const {
      isSigningUp,
      onCancelPress,
      onLoaderClose,
      visible,
    } = this.props
    const {
      email,
      firstName,
      passwordOne,
      passwordTwo
    } = this.state

    return (
      <Modal
        animationType={ 'slide' }
        transparent={ false }
        visible={ visible }
        onRequestClose={ this.onRequestClose }
      >
        <KeyboardAvoidingView
          style={ styles.formContainer }
          behavior="height"
          keyboardVerticalOffset={ -500 }
        >
          <ViewContainer containerStyle={ styles.modalContainer } >
            <ViewContainer containerStyle={ styles.formContainer } >
              <SignupWithEmailForm
                email={ email }
                firstName={ firstName }
                onEmailChange={ this.handleEmailChange }
                onFirstNameChange={ this.handleFirstNameChange }
                onPasswordOneChange={ this.handlePasswordOneChange }
                onPasswordTwoChange={ this.handlePasswordTwoChange }
                passwordOne={ passwordOne }
                passwordTwo={ passwordTwo }
              />
            </ViewContainer>
            <ViewContainer />
            <ViewContainer>
              <DoubleButton
                leftButtonStyle={ styles.cancelButtonContainer }
                leftTextStyle={ styles.cancelButtonText }
                leftOnPress={ onCancelPress }
                leftText="Cancel"
                rightButtonStyle={ styles.signupButtonContainer }
                rightTextStyle={ styles.signupButtonText }
                rightOnPress={ this.handleSubmit }
                rightText="Sign up"
              />
            </ViewContainer>
          </ViewContainer>
          <LoadingModal
            animating={ isSigningUp }
            onRequestClose={ onLoaderClose }
            size='large'
          />
        </KeyboardAvoidingView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  spaceContainer: {
    flex: 2,
  },
  formContainer: {
    flex: 9
  },
  modalContainer: {
    flex: 9,
    backgroundColor: colors.offWhite,
    opacity: 1,
  },
  cancelButtonContainer: {
    backgroundColor: colors.pureWhite,
  },
  cancelButtonText: {
    color: colors.powderBlue,
  },
  signupButtonContainer: {
    backgroundColor: colors.powderBlue,
  },
  signupButtonText: {
    color: colors.pureWhite,
  },
})
