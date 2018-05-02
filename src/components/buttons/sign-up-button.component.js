import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native'
import {
  RobotoText,
  ViewContainer
} from '../index'

export class SignupButton extends Component {
  static propTypes = {
    buttonStyle: ViewPropTypes.style,
    onEmailPress: PropTypes.func,
    textStyle: Text.propTypes.style,
  }

  render = () => {
    const {
      buttonStyle,
      onEmailPress,
      textStyle,
    } = this.props

    return (
      <ViewContainer containerStyle={ styles.container }>
        <TouchableOpacity
          style={ [styles.button, buttonStyle] }
          onPress={ onEmailPress }
        >
          <RobotoText style={ textStyle } >
            { "Sign up with email..." }
          </RobotoText>
        </TouchableOpacity>
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
