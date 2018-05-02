import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native'

import {
  TextContainer,
  ViewContainer
} from '../../index'
import {
  colors,
  isRecurring,
  momentFormat,
  periodicityMap,
} from '../../../utils'

export class ExpenseRow extends Component {
  static propTypes = {
    expense: PropTypes.object.isRequired,
    onPress: PropTypes.func
  }

  handlePress = () => {
    const { expense, onPress } = this.props

    onPress(expense)
  }

  render = () => {
    const { expense } = this.props

    const dateString = isRecurring(expense.periodicity) ?
      expense.isEnded ?
      `Ended on ${momentFormat(expense.endDate)}`
      :
      `Next due on ${momentFormat(expense.nextDate)}`
    : `${momentFormat(expense.firstDate)}`

    return (
      <ViewContainer style={ styles.container } >
        <TouchableOpacity
          style={ styles.rowButton }
          onPress={ this.handlePress }
        >
          <ViewContainer style={ styles.container }>
            <ViewContainer style={ styles.namesContainer } >
              <TextContainer
                containerStyle={ styles.nameTextContainer }
                text={ expense.name }
                textStyle={ styles.nameText }
              />
              <ViewContainer style={ styles.detailsContainer } >
                <TextContainer
                  containerStyle={ styles.categoryTextContainer }
                  text={ expense.category }
                  textStyle={ styles.categoryText }
                />
                <TextContainer
                  containerStyle={ styles.dueNextTextContainer }
                  text={ dateString }
                  textStyle={ [styles.categoryText, styles.leftBorder] }
                />
              </ViewContainer>
            </ViewContainer>
            <ViewContainer style={ styles.amountContainer } >
              <TextContainer
                containerStyle={ styles.amountTextContainer }
                text={ `$${expense.amount}` }
                textStyle={ styles.amountText }
              />
              <TextContainer
                containerStyle={ styles.periodicityTextContainer }
                text={ periodicityMap[expense.periodicity].name }
                textStyle={ styles.periodictyText }
              />
            </ViewContainer>
          </ViewContainer>
        </TouchableOpacity>
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  amountContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  amountText: {
    fontSize: 20,
    color: colors.lightNavy
  },
  amountTextContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 25
  },
  categoryText: {
    fontSize: 10,
    color: colors.darkGrey,
  },
  categoryTextContainer: {
    flex: 2,
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingTop: 5,
    paddingRight: 10,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: colors.pureWhite,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.powderPink,
    height: 90
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  dueNextTextContainer: {
    flex: 3,
    alignItems: 'flex-start',
    paddingBottom: 30,
    paddingTop: 5,
  },
  leftBorder: {
    borderLeftWidth: 1,
    borderLeftColor: colors.darkGrey,
    paddingLeft: 10,
  },
  namesContainer: {
    flex: 2,
    flexDirection: 'column',
  },
  nameText: {
    fontSize: 16,
    color: colors.lightNavy
  },
  nameTextContainer: {
    marginLeft: 20,
    justifyContent: 'flex-end'
  },
  periodictyText: {
    fontSize: 10,
    color: colors.darkGrey,
  },
  periodicityTextContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginRight: 25,
    marginTop: 5,
  },
  rowButton: {
    flex: 1
  }
})
