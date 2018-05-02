import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  ViewPropTypes,
} from 'react-native'
import { ViewContainer } from '../index'

// Enable LayoutAnimation under Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

export class AnimatedPlaceholderView extends Component {
  static propTypes = {
    animationType: PropTypes.string,
    collapsedView: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    shouldExpand: PropTypes.bool,
    expandedView: PropTypes.object,
    placeholderView: PropTypes.object,
  }

  state = {
    expanded: false,
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.shouldExpand !== nextProps.shouldExpand) {
      this.setState({ expanded: nextProps.shouldExpand })
    }
  }

  componentWillUpdate = () => {
    LayoutAnimation.spring()
  }

  render = () => {
    const {
      collapsedView,
      containerStyle,
      expandedView,
      placeholderView,
    } = this.props
    const { expanded } = this.state

    return (
      <ViewContainer containerStyle={ containerStyle } >
        { collapsedView }
        {expanded ?
          expandedView
        :
          placeholderView
       }
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  collapsed: {
    // backgroundColor: 'yellow'
  },
  expanded: {
    // backgroundColor: 'red'
  }
})
