import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native'

import { ViewContainer } from './index'

export class BackdropContainer extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
  }

  render = () => {
    const { containerStyle } = this.props

    return (
      <ViewContainer containerStyle={ [styles.container, containerStyle] }>
        { this.props.children }
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    opacity: 0.55
  }
})
