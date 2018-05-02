import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native'
import {
  SingleButton,
  TextContainer,
  ViewContainer
} from '../../index'

export class FormFieldWithDetailButton extends Component {
  static propTypes = {
    buttonContainerStyle: ViewPropTypes.style,
    buttonText: PropTypes.string,
    buttonTextStyle: Text.propTypes.style,
    containerStyle: ViewPropTypes.style,
    disabled: PropTypes.bool,
    fieldContainerStyle: ViewPropTypes.style,
    fieldText: PropTypes.string,
    fieldTextStyle: Text.propTypes.style,
    labelContainerStyle: ViewPropTypes.style,
    labelText: PropTypes.string,
    labelTextStyle: Text.propTypes.style,
    onButtonPress: PropTypes.func,
  }

  render = () => {
    const {
      buttonContainerStyle,
      buttonStyle,
      buttonText,
      buttonTextStyle,
      containerStyle,
      disabled,
      fieldContainerStyle,
      fieldText,
      fieldTextStyle,
      labelContainerStyle,
      labelText,
      labelTextStyle,
      onButtonPress,
    } = this.props

    return (
      <ViewContainer containerStyle={ [styles.container, containerStyle] } >
        <TextContainer
          containerStyle={ [styles.labelContainer, labelContainerStyle] }
          text={ labelText }
          textStyle={ [styles.labelText, labelTextStyle] }
        />
        <TextContainer
          containerStyle={ [styles.fieldContainer, fieldContainerStyle] }
          text={ fieldText }
          textStyle={ [styles.fieldText, fieldTextStyle] }
        />
        {!disabled &&
          <SingleButton
            onPress={ onButtonPress }
            text="Edit"
            textStyle={ styles.buttonText }
          />
        }
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 2,
    backgroundColor: 'red',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'blue'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  fieldContainer: {
    flex: 4,
  },
  fieldText: {

  },
  labelContainer: {
    flex: 2,
  },
  labelText: {

  },
})
