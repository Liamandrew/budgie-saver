import React, { Component } from 'react'
import {
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'
import {
  ForgotPasswordModal,
  LoadingModal,
  SignInForm,
  SingleAlert,
  SingleAlertView,
  SingleButton,
  SignupButton,
  SignupWithEmailModal,
  ViewContainer,
} from '../../components'
import {
  colors,
  getErrorMessage,
  isValidSignin,
  navigateTo
} from '../../utils'
import * as firebase from '../../firebase'
import {
  // actions
  clearAuthError,
  sendUserResetPassword,
  signUserIn,
  signUserInAnonymously,
  signUserUp,
  // selectors
  getAuthError,
  getAuthUser,
  getIsSendingPasswordReset,
  getIsSigningIn,
  getIsSigningUp,
  getPasswordResetSent,
} from '../index'

class SignIn extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    isForgotPasswordModalVisible: false,
    isSignupWithEmailVisible: false,
    signInEmail: '',
    signInPassword: '',
  }

  componentWillReceiveProps = (nextProps) => {
    const { authError, user, navigation } = nextProps
    const params = {}

    if (user) {
      navigateTo('BudgetToolDrawerNavigator', navigation)
      this.setState({
        isForgotPasswordModalVisible: false,
        isSignupWithEmailVisible: false,
      })
    }
  }

  clearError = () => {
    const { clearAuthError } = this.props

    clearAuthError()
  }

  handleCancelSignup = () => {
    this.setState({ isSignupWithEmailVisible: false })
  }

  handleSignInEmailChange = (e) => {
    this.setState({ signInEmail: e.nativeEvent.text })
  }

  handleSignInPasswordChange = (e) => {
    this.setState({ signInPassword: e.nativeEvent.text })
  }

  handleForgotPasswordPress = () => {
    this.setState({ isForgotPasswordModalVisible: true })
  }

  handleForgotPasswordCancelPress = () => {
    this.setState({ isForgotPasswordModalVisible: false })
  }

  handlePasswordResetPress = (email) => {
    const { sendPasswordResetEmail } = this.props

    sendPasswordResetEmail(email)
    this.handleForgotPasswordCancelPress()
  }

  handleSignInPress = () => {
    const { signUserIn } = this.props
    const {
      signInEmail,
      signInPassword
    } = this.state

    const errArray = isValidSignin(signInEmail, signInPassword)

    if (errArray.length === 0) {
      signUserIn(signInEmail, signInPassword)
    } else {
      SingleAlert('Invalid', errArray[0], 'Continue')
    }
  }

  handleSigninAsGuestPress = () => {
    const { signUserInAnonymously } = this.props

    signUserInAnonymously()
  }

  handleSignupPress = () => {
    this.setState({ isSignupWithEmailVisible: true })
  }

  handleSubmitSignup = ({ email, firstName, passwordOne, passwordTwo }) => {
    const { signUserUp } = this.props

    signUserUp(email, firstName, passwordOne)
  }

  render = () => {
    const {
      isForgotPasswordModalVisible,
      isSignupWithEmailVisible,
      signInEmail,
      signInPassword,
    } = this.state
    const {
      authError,
      isSendingPasswordReset,
      isSigningIn,
      isSigningUp,
      passwordResetSent,
    } = this.props

    const showLoader =  isSigningIn || isSigningUp && !authError
    const showForgotPasswordLoader = passwordResetSent || isSendingPasswordReset

    return (
      <ViewContainer containerStyle={ styles.container }>
        <View style={ styles.logoContainer } >
        <Image
          source={ require('../../assets/images/budgie-logo-plain@1024.png') }
          style={ styles.logo }
        />
        </View>
        <View style={ styles.signInContainer }>
          <SignInForm
            email={ signInEmail }
            onEmailChange={ this.handleSignInEmailChange }
            onPasswordChange={ this.handleSignInPasswordChange }
            password={ signInPassword }
          />
        </View>
        <ViewContainer containerStyle={ styles.signupOptionsContainer }>
          <SingleButton
            onPress={ this.handleForgotPasswordPress }
            text="Forgotten Password?"
          />
          <SingleButton
            onPress={ this.handleSigninAsGuestPress }
            text="Sign in as guest"
          />
        </ViewContainer>
        <View style={ styles.belowSignInContainer } />
        <View style={ styles.buttonContainer }>
          <SingleButton
            buttonStyle={ styles.signInButtonContainer }
            onPress={ this.handleSignInPress }
            text="Log in"
            textStyle={ styles.signInButtonText }
          />
          <SignupButton
            buttonStyle={ styles.signUpButtonContainer }
            onEmailPress={ this.handleSignupPress }
            textStyle={ styles.signupButtonText }
          />
        </View>
        {showLoader &&
          <LoadingModal
            animating={ showLoader }
            onRequestClose={ this.handleModalErrorCheck }
            size='large'
          />
        }
        {isSignupWithEmailVisible &&
          <SignupWithEmailModal
            isSigningUp={ isSigningUp }
            onCancelPress={ this.handleCancelSignup }
            onSubmitPress={ this.handleSubmitSignup }
            visible={ isSignupWithEmailVisible }
          />
        }
        {isForgotPasswordModalVisible &&
          <ForgotPasswordModal
            isSendingReset={ showForgotPasswordLoader }
            onCancelPress={ this.handleForgotPasswordCancelPress }
            onResetPress={ this.handlePasswordResetPress }
            visible={ isForgotPasswordModalVisible }
          />
        }
        {authError &&
          <SingleAlertView
            title='Error'
            message={ getErrorMessage(authError) }
            buttonText='Continue'
            onPress={ this.clearError }
          />
        }
      </ViewContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authError: getAuthError(state),
    user: getAuthUser(state),
    isSendingPasswordReset: getIsSendingPasswordReset(state),
    isSigningIn: getIsSigningIn(state),
    isSigningUp: getIsSigningUp(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearAuthError: () => dispatch(clearAuthError()),
    sendPasswordResetEmail: (email) => dispatch(sendUserResetPassword(email)),
    signUserIn: (email, password) => dispatch(signUserIn(email, password)),
    signUserInAnonymously: () => dispatch(signUserInAnonymously()),
    signUserUp: (email, firstName, password) => dispatch(signUserUp(email, firstName, password))
  }
}

const styles = StyleSheet.create({
  belowSignInContainer: {
    flex: 3,
  },
  buttonContainer: {
    flex: 3
  },
  container: {
    backgroundColor: colors.offWhite,
  },
  signInButtonContainer: {
    backgroundColor: colors.powderBlue,
  },
  signInContainer: {
    flex: 6
  },
  signInButtonText: {
    color: colors.pureWhite,
    fontSize: 20,
    fontWeight: 'bold'
  },
  signUpButtonContainer: {
    backgroundColor: colors.powderPink,
  },
  logoContainer: {
    alignItems: 'center',
    flex: 5,
    justifyContent: 'center',
    paddingTop: 50
  },
  logo: {
    resizeMode: 'contain',
    width: 100,
  },
  signupOptionsContainer: {
    flexDirection: 'row'
  },
  signupButtonText: {
    color: colors.pureWhite,
    fontSize: 20,
  }
})

export const SignInScreen = connect(mapStateToProps, mapDispatchToProps)(SignIn)
