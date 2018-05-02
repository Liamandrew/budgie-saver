import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  FlatList,
  StyleSheet,
} from 'react-native'
import {
  CategoryRow,
  ViewContainer
} from '../index'
import {
  categoryColors,
  colors,
} from '../../utils'

export class CategoryList extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    onCategoryPress: PropTypes.func,
    selectedCategory: PropTypes.string,
    selectedSubCategory: PropTypes.string,
  }

  keyExtractor = (category, index) => {
    return category.name
  }

  renderRow = ({ item }) => {
    const {
      onCategoryPress,
      selectedCategory,
      selectedSubCategory,
    } = this.props

    const { name, image, index, isParent } = item
    const borderColor = isParent ? categoryColors[index % categoryColors.length] : colors.pureWhite
    const isSelected = (selectedCategory === name) ? true
                     : (selectedSubCategory === name) ? true
                     : false

    return (
      <CategoryRow
        borderColor={ borderColor }
        category={ item }
        image={ image }
        isSelected={ isSelected }
        onPress={ onCategoryPress }
      />
    )
  }

  render = () => {
    const { categories, selectedCategory, selectedSubCategory } = this.props

    return (
      <ViewContainer>
        <FlatList
          data={ categories }
          renderItem={ this.renderRow }
          keyExtractor={ this.keyExtractor }
          extraData={ { selectedCategory, selectedSubCategory } }
        />
      </ViewContainer>
    )
  }
}
