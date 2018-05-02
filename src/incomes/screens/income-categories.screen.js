import React, { Component } from 'react'
import {
  Button,
  Image,
  Text,
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'
import {
  // actions
  updateEditIncome,
  // selectors
  getAllIncomeCategoriesFlat,
} from '../index'
import {
  CategoryList,
  ViewContainer,
} from '../../components'
import { colors } from '../../utils'

class IncomeCategories extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation
    const { handleConfirm } = state.params

    return {
      headerRight: (
        <Button
          title='Confirm'
          onPress={ handleConfirm }
          color={ colors.lightNavy }
        />
      ),
      headerStyle: {
        backgroundColor: colors.pureWhite,
      },
      headerTintColor: colors.lightNavy,
      headerTitleStyle: {
        color: colors.lightNavy
      },
      tabBarLabel: 'Income',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_attach_money_36pt.png') }
          style={ [{ tintColor: tintColor }] }
        />
      ),
    }
  }

  state = {
    selectedCategory: null,
    selectedSubCategory: null,
  }

  componentDidMount = () => {
    const { navigation } = this.props
    const { state } = navigation
    const {
      selectedCategory,
      selectedSubCategory,
    } = state.params

    navigation.setParams({ handleConfirm: this.handleConfirm })
    this.setState({
      selectedCategory,
      selectedSubCategory,
    })
  }

  handleCategoryPress = (category) => {
    if (category.isParent === false) {

      this.setState({
        selectedCategory: category.parentName,
        selectedSubCategory: category.name,
      })
    } else {

      this.setState({
        selectedCategory: category.name,
        selectedSubCategory: null,
      })
    }
  }

  handleConfirm = () => {
    const {
      income,
      navigation,
      updateIncome,
    } = this.props
    const {
      selectedCategory,
      selectedSubCategory,
    } = this.state

    updateIncome({
      ...income,
      category: selectedCategory,
      subCategory: selectedSubCategory,
    })
    navigation.goBack()
  }

  render = () => {
    const { categories } = this.props
    const {
      selectedCategory,
      selectedSubCategory,
    } = this.state

    return (
      <ViewContainer>
        <CategoryList
          categories={ categories }
          onCategoryPress={ this.handleCategoryPress }
          selectedCategory={ selectedCategory }
          selectedSubCategory={ selectedSubCategory }
        />
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({

})

const mapStateToProps = (state) => {

  return {
    categories: getAllIncomeCategoriesFlat(state),
    income: state.incomes.editIncome,
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    updateIncome: (income) => dispatch(updateEditIncome(income))
  }
}

export const IncomeCategoriesScreen = connect(mapStateToProps, mapDispatchToProps)(IncomeCategories)
