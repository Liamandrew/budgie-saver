import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { TextContainer, ViewContainer } from '../index'
import { colors } from '../../utils'

export class OverviewAmountsView extends Component {
  static propTypes = {
    isCalculating: PropTypes.bool,
    totalExpenses: PropTypes.number,
    totalIncomes: PropTypes.number,
  }

  static defaultProps = {
    totalExpenses: 0,
    totalIncomes: 0
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isCalculating) {
      return false
    }
    else if (nextProps.isCalculating !== this.props.isCalculating) {
      return true
    }
    else if (nextProps.totalExpenses !== this.props.totalExpenses
        && nextProps.totalIncomes !== this.props.totalIncomes) {
      return false
    }
    return true
  }

  render = () => {
    const { totalExpenses, totalIncomes } = this.props

    return (
      <ViewContainer style={ styles.infoContainer } >
        <ViewContainer>
          <TextContainer
            containerStyle={ styles.amountTitleTextContainer }
            text="Expenses"
            textStyle={ [styles.amountTitleText, styles.expenseText] }
          />
          <TextContainer
            containerStyle={ styles.amountTextContainer }
            text={`$${(totalExpenses).toFixed(2)}`}
            textStyle={ [styles.amountText, styles.expenseText] }
          />
        </ViewContainer>
        <ViewContainer>
          <TextContainer
            containerStyle={ styles.amountTitleTextContainer }
            text="Income"
            textStyle={ [styles.amountTitleText, styles.incomeText] }
          />
          <TextContainer
            containerStyle={ styles.amountTextContainer }
            text={`$${(totalIncomes).toFixed(2)}`}
            textStyle={ [styles.amountText, styles.incomeText] }
          />
      </ViewContainer>
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  infoContainer: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: colors.lightNavy,
  },
  amountTextContainer: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: colors.lightNavy,
    justifyContent: 'flex-start',
  },
  amountTitleTextContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  amountText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  amountTitleText: {
    fontSize: 12,
  },
  expenseText: {
    color: colors.powderPink,
  },
  incomeText: {
    color: colors.powderBlue,
  },
})
