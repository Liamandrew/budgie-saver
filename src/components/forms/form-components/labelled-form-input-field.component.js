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
  FormInputField,
  TextContainer,
  ViewContainer
} from '../../index'

export class LabelledFormInputField extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    editable: PropTypes.bool,
    fieldContainerStyle: ViewPropTypes.style,
    fieldInputStyle: Text.propTypes.style,
    isSecured: PropTypes.bool,
    labelContainerStyle: ViewPropTypes.style,
    labelText: PropTypes.string,
    labelTextStyle: Text.propTypes.style,
    placeholder: PropTypes.string,
  }

  render = () => {
    const {
      containerStyle,
      editable,
      fieldContainerStyle,
      fieldInputStyle,
      isSecured,
      labelContainerStyle,
      labelText,
      labelTextStyle,
      ...inputProps
    } = this.props

    return (
      <ViewContainer containerStyle={ containerStyle } >
        <TextContainer
          containerStyle={ labelContainerStyle }
          text={ labelText }
          textStyle={ labelTextStyle }
        />
        <FormInputField
          containerStyle={ fieldContainerStyle }
          editable={ editable }
          fieldInputStyle={ [styles.fieldInput, fieldInputStyle] }
          isSecured={ isSecured }
          underlineColorAndroid='transparent'
          { ...inputProps }
        />
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  fieldInput: {
    flex: 1,
  },
})
