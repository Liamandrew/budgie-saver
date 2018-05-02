import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native'
import {
  BackdropContainer,
  ViewContainer
} from '../index'

export class LoadingContainer extends Component {
  static propTypes = {
    animating: PropTypes.bool,
    containerStyle: ViewPropTypes.style,
    indicatorStyle:ViewPropTypes.style,
    size: PropTypes.string,
  }

  render = () => {
    const {
      animating,
      containerStyle,
      indicatorStyle,
      size,
    } = this.props

    return (
      <BackdropContainer containerStyle={ [styles.container, containerStyle] } >
        <ActivityIndicator
          animating={ animating }
          size={ size }
          style={ [styles.indicator, indicatorStyle] }
        />
      </BackdropContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
  }
})
