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

export class AnimatedExpandableView extends Component {
  static propTypes = {
    animationType: PropTypes.string,
    collapsedContainerStyle: ViewPropTypes.style,
    collapsedView: PropTypes.object,
    containerStyle: ViewPropTypes.style,
    expanded: PropTypes.bool,
    expandedContainerStyle:ViewPropTypes.style,
    expandedView: PropTypes.object,
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.expanded !== nextProps.expanded) {

      switch (this.props.animationType) {
        case "easeInEaseOut":
          LayoutAnimation.easeInEaseOut()

        case "linear":

          LayoutAnimation.linear()

        case "spring":
          LayoutAnimation.spring()

        default:
          LayoutAnimation.spring()
      }
    }
  }

  animate = () => {
    LayoutAnimation.spring();
  }

  getContainerFlex = (expanded) => {
    if (expanded) {
      return {
        flex: 2
      }
    }
    return {
      flex: 1
    }
  }

  getExpandedFlex = (expanded) => {
    if (expanded) {
      return {
        flex: 1
      }
    }

    return {
      height: 0,
      flex: 0,
    }
  }

  render = () => {
    const {
      collapsedContainerStyle,
      collapsedView,
      containerStyle,
      expanded,
      expandedContainerStyle,
      expandedView,
    } = this.props

    return (
      <ViewContainer containerStyle={ [styles.container, containerStyle, this.getContainerFlex(expanded)] } >
        <ViewContainer containerStyle={ [styles.collapsed, collapsedContainerStyle] }>
          { collapsedView }
        </ViewContainer>
        <ViewContainer containerStyle={ [styles.expanded, expandedContainerStyle, this.getExpandedFlex(expanded)] }>
          {expanded &&
            expandedView
          }
        </ViewContainer>
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
