import React, { Component } from 'react'
import { StyleSheet, TextInput } from 'react-native'

export class RobotoTextInput extends Component {
  render = () => {
    const { style, ...props } = this.props

    return (
      <TextInput
        style={ [styles.baseText, style] }
        underlineColorAndroid='transparent'
        { ...this.props}
      />
    )
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Roboto',
  }
})
