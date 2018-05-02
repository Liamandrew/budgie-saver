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
  updateEditExpense,
  // selectors
  getAllExpenseCategoriesFlat,
} from '../index'
import {
  CategoryList,
  ViewContainer,
} from '../../components'
import { colors } from '../../utils'

class ExpenseCategories extends Component {
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
      tabBarLabel: 'Expenses',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={ require('../../assets/images/ic_credit_card_36pt.png') }
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
      expense,
      navigation,
      updateExpense,
    } = this.props
    const {
      selectedCategory,
      selectedSubCategory,
    } = this.state

    updateExpense({
      ...expense,
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
    categories: getAllExpenseCategoriesFlat(state),
    expense: state.expenses.editExpense,
  }
}

const mapDispatchToProps = (dispatch) => {

  return {
    updateExpense: (expense) => dispatch(updateEditExpense(expense))
  }
}

export const ExpenseCategoriesScreen = connect(mapStateToProps, mapDispatchToProps)(ExpenseCategories)
