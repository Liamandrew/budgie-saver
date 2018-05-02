import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash.isequal'
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes
} from 'react-native'
import {
  RobotoText,
  ViewContainer,
} from '../../index'

export class Legend extends Component {
  static propTypes = {
    colorStatistic: PropTypes.bool,
    containerStyle: ViewPropTypes.style,
    data: PropTypes.array,
    generateStatistic: PropTypes.func,
    isCalculating: PropTypes.bool,
    isHorizontal: PropTypes.bool,
    itemContainerStyle: ViewPropTypes.style,
    labelTextStyle: Text.propTypes.style,
    showStatistic: PropTypes.bool,
    showSymbol: PropTypes.bool,
    statisticTextStyle: Text.propTypes.style,
  }

  static defaultProps = {
    colorStatistic: false,
    isCalculating: false,
    isHorizontal: true,
    showStatistic: true,
    showSymbol: true,
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isCalculating) {
      return false
    }
    else if (nextProps.isCalculating !== this.props.isCalculating) {
      return true
    }
    else if (isEqual(nextProps.data, this.props.data)) {
      return false
    }
    return true
  }

  renderLegendItems = () => {
    const {
      colorStatistic,
      data,
      generateStatistic,
      itemContainerStyle,
      labelTextStyle,
      showStatistic,
      showSymbol,
      statisticTextStyle,
    } = this.props

    return data.map((item, index) => {
      var statistic = generateStatistic ? generateStatistic(item.value) : `${item.value}`

      return (
        <ViewContainer
          containerStyle={ [styles.horizontalContainer, itemContainerStyle] }
          key={ index }
        >
          {showSymbol &&
            <View style={ [styles.symbol, { backgroundColor: item.color }] } />
          }
          {showStatistic &&
            <RobotoText style={ [statisticTextStyle, colorStatistic && { color: item.color }] }>
              { statistic }
            </RobotoText>
          }
          <RobotoText style={ labelTextStyle }>
            { item.legendLabel }
          </RobotoText>
        </ViewContainer>
      )
    })
  }

  render = () => {
    const {
      containerStyle,
      isHorizontal
    } = this.props

    return (
      <ViewContainer containerStyle={ [containerStyle, isHorizontal && styles.horizontalContainer] }>
        { this.renderLegendItems() }
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
  },
  symbol: {
    height: 13,
    width: 13,
    borderRadius: 13,
    paddingLeft: 5,
  }
})
