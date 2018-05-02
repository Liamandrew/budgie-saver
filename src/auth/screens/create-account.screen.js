import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
} from 'react-native'
import {
  // actions
  linkAnonymousWithCredential,
  // selectors
  getIsAnonymous,
  getIsLinkingCredential,
} from '../index'
import {
  BackdropContainer,
  DoubleButton,
  LoadingModal,
  SignupWithEmailForm,
  SingleAlert,
  ViewContainer,
} from '../../components'
import {
  colors,
  isValidSignup,
  resetNavigationTo
} from '../../utils'

class CreateAccount extends Component {
  state = {
    email: '',
    firstName: '',
    passwordOne: '',
    passwordTwo: ''
  }

  componentWillReceiveProps = (nextProps) => {
    const { isAnonymous, navigation } = nextProps

    if (!isAnonymous) {
      resetNavigationTo('BudgetToolDrawerNavigator', navigation)
    }
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

  handleCancelPress = () => {
    const { navigation } = this.props

    resetNavigationTo('BudgetToolDrawerNavigator', navigation)
  }

  handleCreateAccountSubmit = ({ email, firstName, passwordOne }) => {
    const { linkAnonymousWithCredential } = this.props

    linkAnonymousWithCredential(email, passwordOne, firstName)
  }

  handleSubmit = () => {
    const {
      email,
      firstName,
      passwordOne,
      passwordTwo,
    } = this.state

    const errArray = isValidSignup(email, firstName, passwordOne, passwordTwo)

    if (errArray.length === 0) {
      this.handleCreateAccountSubmit(this.state)
    } else {
      SingleAlert('Invalid', errArray[0], 'Continue')
    }
  }

  render = () => {
    const { isLinking } = this.props
    const {
      email,
      firstName,
      passwordOne,
      passwordTwo
    } = this.state

    return (
      <ViewContainer>
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
              leftOnPress={ this.handleCancelPress }
              leftText="Cancel"
              rightButtonStyle={ styles.signupButtonContainer }
              rightTextStyle={ styles.signupButtonText }
              rightOnPress={ this.handleSubmit }
              rightText="Create"
            />
            </ViewContainer>
          </ViewContainer>
          <LoadingModal
            animating={ isLinking }
            size='large'
          />
        </KeyboardAvoidingView>
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
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

const mapStateToProps = (state) => {

  return {
    isAnonymous: getIsAnonymous(state),
    isLinking: getIsLinkingCredential(state),
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    linkAnonymousWithCredential: (email, password, firstName) => dispatch(linkAnonymousWithCredential(email, password, firstName))
  }
}

export const CreateAccountScreen = connect(mapStateToProps, mapDispatchToProps)(CreateAccount)
