import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native'
import {
  SingleButton,
  ViewContainer
} from '../index'

export class DoubleButton extends Component {
  static propTypes = {
    leftButtonStyle: ViewPropTypes.style,
    rightButtonStyle: ViewPropTypes.style,
    leftOnPress: PropTypes.func,
    rightOnPress: PropTypes.func,
    leftText: PropTypes.string,
    rightText: PropTypes.string,
    leftTextStyle: Text.propTypes.style,
    rightTextStyle: Text.propTypes.style,
  }

  render = () => {
    const {
      leftButtonStyle,
      rightButtonStyle,
      leftOnPress,
      rightOnPress,
      leftText,
      rightText,
      leftTextStyle,
      rightTextStyle,
    } = this.props

    return (
      <ViewContainer containerStyle={ styles.container }>
        <SingleButton
          buttonStyle={ leftButtonStyle }
          onPress={ leftOnPress }
          text={ leftText }
          textStyle={ leftTextStyle }
        />
        <SingleButton
          buttonStyle={ rightButtonStyle }
          onPress={ rightOnPress }
          text={ rightText }
          textStyle={ rightTextStyle }
        />
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  }
})
