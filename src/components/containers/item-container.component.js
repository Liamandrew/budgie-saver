import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
} from 'react-native'

import {
  AnimatedPieChart,
  ComplexColumnChart,
  LabelledFormInputField,
  Legend,
  TextContainer,
  ViewContainer,
} from '../index'
import {
  colors,
  isRecurring,
  momentFormat,
  periodicityMap,
} from '../../utils'

export class ItemContainer extends Component {
  static propTypes = {
    categoryPieCenterText: PropTypes.string,
    categoryPieData: PropTypes.array,
    categoryTotal: PropTypes.number,
    complexColumnChartData: PropTypes.array,
    displayXIncrementMarkers: PropTypes.func,
    generateXAxisLabel: PropTypes.func,
    graphColumnPadding: PropTypes.number,
    isCalculating: PropTypes.bool,
    isExpense: PropTypes.bool,
    item: PropTypes.object,
    itemPieCenterText: PropTypes.string,
    itemPieData: PropTypes.array,
    itemTotal: PropTypes.number,
    lastDate: PropTypes.object,
    nextDate: PropTypes.object,
  }

  static defaultProps = {
    isCalculating: false
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isCalculating) {
      return false
    }
    return true
  }

  render = () => {
    const {
      categoryPieCenterText,
      categoryPieData,
      complexColumnChartData,
      displayXIncrementMarkers,
      generateXAxisLabel,
      graphColumnPadding,
      isExpense,
      item,
      itemPieCenterText,
      itemPieData,
      itemTotal,
      lastDate,
      nextDate,
    } = this.props
    const recurring = isRecurring(item.periodicity)
    const notes = item.notes === "" ? "None" : item.notes
    var itemNames
    var itemLastNoun
    var itemNextNoun
    var next
    var amountTextStyle

    if (isExpense) {
      itemNames = 'Expenses'
      itemLastNoun = 'Paid'
      amountTextStyle = styles.expenseAmountText
    } else {
      itemNames = 'Income'
      itemLastNoun = 'Received'
      amountTextStyle = styles.incomeAmountText
    }

    if (isRecurring) {
      if (item.isEnded) {
        itemNextNoun = 'Ended'
        next = item.endDate
      } else {
        itemNextNoun = 'Next due'
        next = nextDate
      }
    }

    return (
      <ViewContainer containerStyle={ styles.container }>
        <ViewContainer containerStyle={ styles.amountContainer } >
          <ViewContainer>
            <TextContainer
              containerStyle={ styles.amountTitleTextContainer }
              text="Amount"
              textStyle={ styles.amountTitleText }
            />
            <TextContainer
              containerStyle={ styles.amountTextContainer }
              text={`$${item.amount}`}
              textStyle={ [styles.amountText, amountTextStyle] }
            />
          </ViewContainer>
          {recurring &&
            <ViewContainer>
            <TextContainer
              containerStyle={ styles.amountTitleTextContainer }
              text="Total in Period"
              textStyle={ styles.amountTitleText }
            />
            <TextContainer
              containerStyle={ styles.amountTextContainer }
              text={`$${itemTotal}`}
              textStyle={ [styles.amountText, amountTextStyle] }
            />
            </ViewContainer>
          }
        </ViewContainer>
        <ViewContainer containerStyle={ styles.infomationContainer } >
          <ViewContainer containerStyle={ styles.datesContainer } >
            <ViewContainer>
              <TextContainer
                containerStyle={ styles.dateTitleContainer }
                text={ recurring ? `Last ${itemLastNoun}` : `${itemLastNoun}` }
                textStyle={ styles.dateTitleText }
              />
              <TextContainer
                containerStyle={ styles.dateTextContainer }
                text={ momentFormat(lastDate) }
                textStyle={ styles.dateText }
              />
            </ViewContainer>
            <ViewContainer>
              <TextContainer
                containerStyle={ styles.dateTitleContainer }
                text={ recurring ? 'Occurs' : '' }
                textStyle={ styles.dateTitleText }
              />
              <TextContainer
                containerStyle={ styles.dateTextContainer }
                text={ periodicityMap[item.periodicity].name }
                textStyle={ styles.dateText }
              />
            </ViewContainer>
            {next &&
              <ViewContainer>
                <TextContainer
                  containerStyle={ styles.dateTitleContainer }
                  text={ itemNextNoun }
                  textStyle={ styles.dateTitleText }
                />
                <TextContainer
                  containerStyle={ styles.dateTextContainer }
                  text={ momentFormat(next) }
                  textStyle={ styles.dateText }
                />
              </ViewContainer>
            }
          </ViewContainer>
          <ViewContainer containerStyle={ styles.graphContainer } >
            <ViewContainer>
              <Legend
                colorStatistic={ true }
                containerStyle={ styles.legendContainer }
                data={ categoryPieData }
                itemContainerStyle={ styles.legendItemContainer }
                labelTextStyle={ styles.legendText }
                showStatistic={ false }
              />
              <ViewContainer containerStyle={ styles.itemGraphContainer } >
                <AnimatedPieChart
                  centerText={ categoryPieCenterText }
                  centerTextColor={ colors.lightNavy }
                  data={ categoryPieData }
                  highlightedRatio={ 0.04 }
                  innerRadiusRatio={ 0.75 }
                  paddingBottom={ 2 }
                  paddingTop={ 2 }
                />
              </ViewContainer>
            </ViewContainer>
            <ViewContainer>
              <Legend
                containerStyle={ styles.legendContainer }
                data={ itemPieData }
                itemContainerStyle={ styles.legendItemContainer }
                labelTextStyle={ styles.legendText }
                showStatistic={ false }
              />
              <ViewContainer containerStyle={ styles.itemGraphContainer } >
                <AnimatedPieChart
                  centerText={ itemPieCenterText }
                  centerTextColor={ colors.lightNavy }
                  data={ itemPieData }
                  highlightedRatio={ 0.04 }
                  innerRadiusRatio={ 0.70 }
                  paddingBottom={ 2 }
                  paddingTop={ 2 }
                />
              </ViewContainer>
            </ViewContainer>
          </ViewContainer>
          <ViewContainer containerStyle={ styles.complexColumnContainer } >
            <ViewContainer containerStyle={ styles.complexColumnGraph } >
              <ComplexColumnChart
                axisColor={ colors.lightNavy }
                columnPaddingInternal={ 1 }
                columnPaddingExternal={ graphColumnPadding }
                data={ complexColumnChartData }
                displayLeftYAxis={ true }
                displayXIncrementMarkers={ displayXIncrementMarkers }
                generateXAxisLabel={ generateXAxisLabel }
                isStacked={ true }
                paddingLeft={ 25 }
                xAxisLabelColor={ colors.lightNavy }
                yAxisLabelAlignment='right'
                yAxisLabelColor={ colors.lightNavy }
                yAxisLabelXOffset={ -2 }
                yAxisLabelYOffset={ -5 }
                yIncrementsColor={ colors.opacityBlack }
              />
            </ViewContainer>
            <Legend
              containerStyle={ styles.legendContainer }
              data={ complexColumnChartData[0] }
              itemContainerStyle={ styles.legendItemContainer }
              labelTextStyle={ styles.legendText }
              showStatistic={ false }
            />
          </ViewContainer>
        </ViewContainer>
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  amountContainer: {
    flex: 2 ,
    flexDirection: 'row'
  },
  amountTextContainer: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: colors.smoke,
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
  expenseAmountText: {
    color: colors.powderPink,
  },
  incomeAmountText: {
    color: colors.powderBlue
  },
  amountTitleText: {
    color: colors.shadeWhite,
    fontSize: 12
  },
  categoriesGraphContainer: {
    flexDirection: 'column'
  },
  categoryGraphContainer: {
    flex: 5,
  },
  categoryTextContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: colors.smoke
  },
  datesContainer: {
    flex: 2,
    flexDirection: 'row'
  },
  dateText: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  dateTextContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dateTitleContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dateTitleText: {
    fontSize: 14
  },
  graphContainer: {
    flex: 5,
    flexDirection: 'row',
  },
  infomationContainer: {
    flex: 10,
    backgroundColor: colors.pureWhite,
  },
  itemGraphContainer: {
    flex: 12
  },
  legendContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  legendItemContainer: {
    justifyContent: 'center',
  },
  legendText: {
    fontSize: 8,
    paddingLeft: 3,
  },
  complexColumnContainer: {
    flex: 8,
  },
  complexColumnGraph: {
    flex: 10,
  }
})
