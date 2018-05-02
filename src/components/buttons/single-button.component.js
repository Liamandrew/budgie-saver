import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native'
import { RobotoText } from '../index'

export class SingleButton extends Component {
  static propTypes = {
    buttonStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
    onPress: PropTypes.func,
    text: PropTypes.string,
    textStyle: Text.propTypes.style,
  }

  render = () => {
    const {
      buttonStyle,
      containerStyle,
      onPress,
      text,
      textStyle,
      ...props,
    } = this.props

    return (
      <View style={ [styles.container, containerStyle] }>
        <TouchableOpacity
          style={ [styles.button, buttonStyle] }
          onPress={ onPress }
          { ...props }
        >
          <RobotoText style={ textStyle } >
            { text }
          </RobotoText>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
