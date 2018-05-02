import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import {
  SingleButton,
  ViewContainer
} from '../index'
import { colors } from '../../utils'

export class ExpensesIncomesSelector extends Component {
  static propTypes = {
    onExpensesPressed: PropTypes.func,
    onIncomesPressed: PropTypes.func,
    isExpenseSelected: PropTypes.string,
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isExpenseSelected && this.props.isExpenseSelected) {
      return false
    }
    return true
  }

  render = () => {
    const {
      onExpensesPressed,
      onIncomesPressed,
      isExpensesSelected,
    } = this.props

    return (
      <ViewContainer containerStyle={ styles.container } >
        <SingleButton
          buttonStyle={ [styles.button, isExpensesSelected && styles.selectedButton] }
          onPress={ onExpensesPressed }
          text='Expenses'
          textStyle={ [styles.buttonText, isExpensesSelected && styles.selectedButtonText] }
        />
        <SingleButton
          buttonStyle={ [styles.button, !isExpensesSelected && styles.selectedButton] }
          onPress={ onIncomesPressed }
          text='Incomes'
          textStyle={ [styles.buttonText, !isExpensesSelected && styles.selectedButtonText] }
        />
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.pureWhite,
    borderColor: colors.smoke,
    borderBottomWidth: 1,
  },
  buttonText: {
    fontSize: 10,
    color: colors.darkGrey,
  },
  selectedButton: {
    borderColor: colors.lightNavy,
    borderBottomWidth: 3,
  },
  selectedButtonText: {
    color: colors.lightNavy,
  }
})
