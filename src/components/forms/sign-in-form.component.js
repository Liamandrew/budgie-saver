import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import {
  LabelledFormInputField,
  ViewContainer
} from '../index'
import { colors } from '../../utils'

export class SignInForm extends Component {
  static propTypes = {
    email: PropTypes.string,
    onEmailChange: PropTypes.func,
    onPasswordChange: PropTypes.func,
    password: PropTypes.string,
  }

  render = () => {
    const {
      email,
      onEmailChange,
      onPasswordChange,
      password,
    } = this.props

    return (
      <ViewContainer>
        <LabelledFormInputField
          fieldContainerStyle={ styles.fieldContainerStyle }
          labelContainerStyle={ styles.labelContainerStyle }
          keyboardType="email-address"
          labelText="Email"
          labelTestStyle={ styles.labelContainerStyle }
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
          onChange={ onPasswordChange }
          placeholder="Enter password"
          value={ password }
        />
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
