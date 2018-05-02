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
  TextContainer,
  ViewContainer
} from '../../index'

export class TouchableFormField extends Component {
  static propTypes = {
    containerStyle: ViewPropTypes.style,
    disabled: PropTypes.bool,
    fieldText: PropTypes.string,
    fieldTextContainerStyle: ViewPropTypes.style,
    fieldTextStyle: Text.propTypes.style,
    onPress: PropTypes.func,
  }

  render = () => {
    const {
      containerStyle,
      disabled,
      fieldText,
      fieldTextContainerStyle,
      fieldTextStyle,
      onPress,
    } = this.props

    return (
      <ViewContainer containerStyle={ [styles.container, containerStyle] }>
        <TouchableOpacity
          style={ {flex: 1, alignSelf: 'stretch' } }
          disabled={ disabled }
          onPress={ onPress }
        >
          <TextContainer
            containerStyle={ [styles.fieldTextContainer, fieldTextContainerStyle] }
            text={ fieldText }
            textStyle={ fieldTextStyle }
          />
        </TouchableOpacity>
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  fieldTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
})
