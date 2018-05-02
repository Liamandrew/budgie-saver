import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native'
import { LoadingContainer } from './index'

export class LoadingModal extends Component {
  static propTypes = {
    animating: PropTypes.bool,
    backdropStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
    indicatorStyle: ViewPropTypes.style,
    onRequestClose: PropTypes.func,
    size: PropTypes.string,
  }

  static defaultProps = {
    onRequestClose: () => {}
  }

  render = () => {
    const {
      animating,
      backdropStyle,
      containerStyle,
      indicatorStyle,
      onRequestClose,
      size,
    } = this.props

    return (
      <Modal
        animationType={ 'fade' }
        transparent={ true }
        visible={ animating }
        onDismiss={ onRequestClose }
        onRequestClose={ onRequestClose }
      >
        <LoadingContainer
          animating={ animating }
          containerStyle={ containerStyle }
          indicatorStyle={ indicatorStyle }
          size={ size }
        />
      </Modal>
    )
  }
}
