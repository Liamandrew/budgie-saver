import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import {
  SingleButton,
  ViewContainer
} from '../index'
import { colors } from '../../utils'

export class OverviewPeriodSelector extends Component {
  static propTypes = {
    onPeriodAllPressed: PropTypes.func,
    onPeriodHalfYearPressed: PropTypes.func,
    onPeriodMonthPressed: PropTypes.func,
    onPeriodQuarterPressed: PropTypes.func,
    onPeriodWeekPressed: PropTypes.func,
    onPeriodYearPressed: PropTypes.func,
    overviewPeriods: PropTypes.object,
    selected: PropTypes.string,
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.selected === this.props.selected) {
      return false
    }
    return true
  }

  getIsPeriodButtonSelected = (selectedPeriod, overviewPeriods) => {
    var all = false
    var year = false
    var halfYear = false
    var quarter = false
    var month = false
    var week = false

    switch (selectedPeriod) {
      case overviewPeriods.all.id:
        all = true
        break

      case overviewPeriods.year.id:
        year = true
        break

      case overviewPeriods.halfYear.id:
        halfYear = true
        break

      case overviewPeriods.quarter.id:
        quarter = true
        break

      case overviewPeriods.month.id:
        month = true
        break

      case overviewPeriods.week.id:
        week = true
        break

      default:
        break
    }

    return {
      all,
      year,
      halfYear,
      quarter,
      month,
      week
    }
  }

  render = () => {
    const {
      onPeriodAllPressed,
      onPeriodHalfYearPressed,
      onPeriodMonthPressed,
      onPeriodQuarterPressed,
      onPeriodWeekPressed,
      onPeriodYearPressed,
      overviewPeriods,
      selected,
    } = this.props

    const {
      all,
      year,
      halfYear,
      quarter,
      month,
      week
    } = this.getIsPeriodButtonSelected(selected, overviewPeriods)

    return (
      <ViewContainer containerStyle={ styles.container } >
        <SingleButton
          buttonStyle={ [styles.periodButton, all && styles.selectedPeriodButton] }
          onPress={ onPeriodAllPressed }
          text={ overviewPeriods.all.name }
          textStyle={ [styles.periodButtonText, all && styles.selectedPeriodButtonText] }
        />
        <SingleButton
          buttonStyle={ [styles.periodButton, week && styles.selectedPeriodButton ] }
          onPress={ onPeriodWeekPressed }
          text={ overviewPeriods.week.name }
          textStyle={ [styles.periodButtonText, week && styles.selectedPeriodButtonText] }
        />
        <SingleButton
          buttonStyle={ [styles.periodButton, month && styles.selectedPeriodButton] }
          onPress={ onPeriodMonthPressed }
          text={ overviewPeriods.month.name }
          textStyle={ [styles.periodButtonText, month && styles.selectedPeriodButtonText] }
        />
        <SingleButton
          buttonStyle={ [styles.periodButton, quarter && styles.selectedPeriodButton] }
          onPress={ onPeriodQuarterPressed }
          text={ overviewPeriods.quarter.name }
          textStyle={ [styles.periodButtonText, quarter && styles.selectedPeriodButtonText] }
        />
        <SingleButton
          buttonStyle={ [styles.periodButton, halfYear && styles.selectedPeriodButton] }
          onPress={ onPeriodHalfYearPressed }
          text={ overviewPeriods.halfYear.name }
          textStyle={ [styles.periodButtonText, halfYear && styles.selectedPeriodButtonText] }
        />
        <SingleButton
          buttonStyle={ [styles.periodButton, year && styles.selectedPeriodButton] }
          onPress={ onPeriodYearPressed }
          text={ overviewPeriods.year.name }
          textStyle={ [styles.periodButtonText, year && styles.selectedPeriodButtonText] }
        />
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 20,
  },
  periodsContainer: {
    flex: 2
  },
  periodButton: {
    backgroundColor: colors.pureWhite,
  },
  periodButtonText: {
    fontSize: 11,
    color: colors.darkGrey,
  },
  selectedPeriodButton: {
    borderColor: colors.lightNavy,
    borderBottomWidth: 2,
  },
  selectedPeriodButtonText: {
    color: colors.lightNavy,
    fontWeight: 'bold',
  },
})
