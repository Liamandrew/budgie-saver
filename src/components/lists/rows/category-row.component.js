import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
} from 'react-native'
import {
  TextContainer,
  ViewContainer
} from '../../index'
import {
  colors,
  getImage,
} from '../../../utils'

export class CategoryRow extends Component {
  static propTypes = {
    borderColor: PropTypes.string,
    category: PropTypes.object.isRequired,
    image: PropTypes.string,
    isSelected: PropTypes.bool,
    onPress: PropTypes.func,
    rowStyle: ViewPropTypes.style,
  }

  handlePress = () => {
    const { category, onPress } = this.props

    onPress(category)
  }

  render = () => {
    const {
      borderColor,
      category,
      image,
      isSelected,
      rowStyle,
    } = this.props

    return (
      <TouchableOpacity
        style={ styles.touchableContainer }
        onPress={ this.handlePress }
      >
        <ViewContainer
          containerStyle={ [styles.container, { borderLeftColor: borderColor }, !category.isParent && styles.childStyle, isSelected && { backgroundColor: colors.smoke }] } >
          <ViewContainer>
            <Image
              source={ getImage(image) }
            />
          </ViewContainer>
          <TextContainer
            containerStyle={ [styles.labelContainer] }
            text={ category.name }
            textStyle={ [isSelected && { color: colors.pureWhite }] }
          />
          <ViewContainer containerStyle={ styles.spaceContainer } />
        </ViewContainer>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    paddingLeft: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.offWhite,
    borderLeftWidth: 6,
  },
  childStyle: {
    backgroundColor: colors.lightGrey,
    paddingLeft: 35
  },
  labelContainer: {
    flex: 2,
  },
  spaceContainer: {
    flex: 1,
  },
  touchableContainer: {
    flex: 1,
  },
})
