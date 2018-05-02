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
  AnimatedExpandableView,
  ViewContainer
} from '../index'

export class TouchableAnimatedExpandableView extends Component {
  static propTypes = {
    animationType: PropTypes.string,
    collapsedContainerStyle: ViewPropTypes.style,
    collapsedView: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    expandedContainerStyle: ViewPropTypes.style,
    expandedView: PropTypes.object,
  }

  state = {
    expanded: false,
  }

  animate = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  render = () => {
    const {
      animationType,
      collapsedContainerStyle,
      collapsedView,
      containerStyle,
      expandedContainerStyle,
      expandedView,
    } = this.props
    const { expanded } = this.state

    return (
      <AnimatedExpandableView
        animationType={ animationType }
        collapsedContainerStyle={ collapsedContainerStyle }
        collapsedView={
          <TouchableOpacity
            style={ styles.touchableContainer }
            onPress={ this.animate }
          >
            { collapsedView }
          </TouchableOpacity>
        }
        expanded={ expanded }
        expandedContainerStyle={ expandedContainerStyle }
        expandedView={ expandedView }
      />
    )
  }
}

const styles = StyleSheet.create({
  touchableContainer: {
    flex: 1
  }
})
