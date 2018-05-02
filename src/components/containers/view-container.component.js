import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  ViewPropTypes
} from 'react-native'

export class ViewContainer extends Component {
  static propTypes: {
    containerStyle: ViewPropTypes.style,
  }

  render = () => {
    const {
      containerStyle,
      ...props
    } = this.props

    return (
      <View
        style={ [styles.container, containerStyle] }
        { ...props }
      >
        { this.props.children }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
