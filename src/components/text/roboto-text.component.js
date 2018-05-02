import React, { Component } from 'react'
import { StyleSheet, Text } from 'react-native'
import { colors } from '../../utils'

export class RobotoText extends Component {
  render = () => {
    const { style, ...props } = this.props
    return (
      <Text
        style={ [styles.baseText, style] }
        { ...props }
      >
        { this.props.children }
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Roboto',
    color: colors.lightNavy,
  }
})
