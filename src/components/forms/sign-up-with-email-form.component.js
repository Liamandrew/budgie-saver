import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  LabelledFormInputField,
  ViewContainer
} from '../index'
import { colors } from '../../utils'

export class SignupWithEmailForm extends Component {
  static propTypes = {
    email: PropTypes.string,
    firstName: PropTypes.string,
    onEmailChange: PropTypes.func,
    onFirstNameChange: PropTypes.func,
    onPasswordOneChange: PropTypes.func,
    onPasswordTwoChange: PropTypes.func,
    passwordOne: PropTypes.string,
    passwordTwo: PropTypes.string,
  }

  render = () => {
    const {
      email,
      firstName,
      onEmailChange,
      onFirstNameChange,
      onPasswordOneChange,
      onPasswordTwoChange,
      passwordOne,
      passwordTwo,
    } = this.props

    return (
      <ViewContainer>
        <LabelledFormInputField
          fieldContainerStyle={ styles.fieldContainerStyle }
          labelContainerStyle={ styles.labelContainerStyle }
          labelText="First Name"
          labelTestStyle={ styles.labelContainerStyle }
          onChange={ onFirstNameChange }
          placeholder="Enter first name"
          value={ firstName }
        />
        <LabelledFormInputField
          fieldContainerStyle={ styles.fieldContainerStyle }
          labelContainerStyle={ styles.labelContainerStyle }
          labelText="Email"
          labelTestStyle={ styles.labelContainerStyle }
          keyboardType="email-address"
          onChange={ onEmailChange }
          placeholder="Enter email"
          value={ email }
        />
        <LabelledFormInputField
          fieldContainerStyle={ styles.fieldContainerStyle }
          labelContainerStyle={ styles.labelContainerStyle }
          labelText="Password"
          labelTestStyle={ styles.labelContainerStyle }
          isSecured={ true }
          onChange={ onPasswordOneChange }
          placeholder="Enter a password"
          value={ passwordOne }
        />
        <LabelledFormInputField
          fieldContainerStyle={ styles.fieldContainerStyle }
          labelContainerStyle={ styles.labelContainerStyle }
          labelText="Retype Password"
          isSecured={ true }
          onChange={ onPasswordTwoChange }
          placeholder="Retype password.."
          value={ passwordTwo }
        />
        <ViewContainer />
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
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
  labelContainerStyle: {
    flex: 3,
    justifyContent: 'flex-end',
    marginLeft: 10,
    marginBottom: 3,
  },
})
