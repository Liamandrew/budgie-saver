import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
} from 'react-native'

import {
  RobotoText,
  ViewContainer
} from '../index'

export class TextContainer extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    text: PropTypes.string,
    textStyle: Text.propTypes.style,
  }

  render = () => {
    const {
      containerStyle,
      text,
      textStyle,
    } = this.props
    
    return (
      <ViewContainer containerStyle={ containerStyle }>
        <RobotoText style={ textStyle }>
          { text }
        </RobotoText>
      </ViewContainer>
    )
  }
}
