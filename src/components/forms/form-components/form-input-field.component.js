import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewPropTypes,
} from 'react-native'
import {
  RobotoTextInput,
  ViewContainer
} from '../../index'

export class FormInputField extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    editable: PropTypes.bool,
    fieldInputStyle: Text.propTypes.style,
    isSecured: PropTypes.bool,
    placeholder: PropTypes.string
  }

  render = () => {
    const {
      containerStyle,
      editable,
      fieldInputStyle,
      isSecured,
      placeholder,
      ...inputProps
    } = this.props

    return (
      <ViewContainer containerStyle={ containerStyle } >
        <RobotoTextInput
          editable={ editable }
          style={ fieldInputStyle }
          secureTextEntry={ isSecured }
          placeholder={ placeholder }
          { ...inputProps }
        />
      </ViewContainer>
    )
  }
}
