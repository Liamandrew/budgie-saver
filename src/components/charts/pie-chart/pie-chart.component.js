import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'
import isEqual from 'lodash.isequal'
import { PieChartSlice } from './index'
import { ViewContainer } from '../../containers'

const {
  Group,
  Surface,
  Text,
} = ART

/*
 * Data prop should be an array of objects with the following structure
 * { name, value, color, isHighlighted }
 */
export class PieChart extends Component {
  static propTypes = {
    animation: PropTypes.number,
    data: PropTypes.array,
    centerText: PropTypes.string,
    centerTextColor: PropTypes.string,
    centerTextFont: PropTypes.string,
    centerTextYOffset: PropTypes.number,
    chartLabel: PropTypes.string,
    chartLabelColor: PropTypes.string,
    chartLabelFont: PropTypes.string,
    chartLabelYOffset: PropTypes.number,
    highlightedRatio: PropTypes.number,
    innerRadiusRatio: PropTypes.number,
    isCalculating: PropTypes.bool,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    noDataColor: PropTypes.string,
  }

  static defaultProps = {
    centerLabelColor: 'black',
    centerTextFont: '14px Roboto',
    centerTextYOffset: -10,
    chartLabelColor: 'black',
    chartLabelFont: '10px Roboto',
    chartLabelYOffset: 10,
    highlightedRatio: 0,
    innerRadiusRatio: 0,
    isCalculating: false,
    offsetX: 0,
    offsetY: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    noDataColor: '#EEEEEE',
  }

  state = {
    centerX: 0,
    centerY: 0,
    innerRadius: 0,
    noData: false,
    outerRadius: 0,
    viewHeight: null,
    viewWidth: null,
  }

  componentWillMount = () => {
    this.checkData(this.props)
  }

  componentWillReceiveProps = (nextProps) => {
    if (!isEqual(nextProps.data, this.props.data)) {
      this.checkData(nextProps)
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isCalculating) {
      return false
    }
    return true
  }

  checkData = ({ data }) => {
    // if a value is undefined or there isn't any range in the data set then
    // we will just display a blank pie chart
    var max = -Number.MIN_VALUE
    var min = Number.MAX_VALUE
    var isUndefined = false

    for (var { value: s } of data) {
      if (isNaN(s)) {
        isUndefined = true
        break
      }
      else if (s > max) {
        max = s
      }
      else if (s < min) {
        min = s
      }
    }
    var range = max - min

    if (data.length === 0 || isUndefined || range === 0 && max === 0) {
      this.setState({ noData: true })
    }
  }

  setLayout = (e) => {
    const {
      highlightedRatio,
      innerRadiusRatio,
      paddingBottom,
      offsetX,
      offsetY,
      paddingLeft,
      paddingRight,
      paddingTop,
    } = this.props

    const centerX = (e.nativeEvent.layout.width - paddingLeft - paddingRight) / 2 + offsetX
    const centerY = (e.nativeEvent.layout.height - paddingBottom - paddingTop) / 2 + offsetY

    this.setState({
      centerX: centerX + paddingLeft,
      centerY: centerY + paddingTop,
      innerRadius: Math.min(centerX, centerY) * (1 - highlightedRatio) * innerRadiusRatio,
      outerRadius: Math.min(centerX, centerY) * (1 - highlightedRatio),
      viewHeight: e.nativeEvent.layout.height,
      viewWidth: e.nativeEvent.layout.width,
    })
  }

  renderLabel = (text, font, color, x, y) => {
    return (
      <Text
        font={ font }
        x={ x }
        y={ y }
        alignment="center"
        fill={ color }
      >
        {`${text}` }
      </Text>
    )
  }

  renderNoData = () => {
    const { animation, noDataColor } = this.props
    const { innerRadius, outerRadius } = this.state

    return (
      <PieChartSlice
        animation={ animation }
        color={ noDataColor }
        innerRadius={ innerRadius }
        outerRadius={ outerRadius }
        value={ 1 }
        start={ 0 }
      />
    )
  }

  renderSlices = () => {
    const { animation, data, highlightedRatio } = this.props
    const { innerRadius, outerRadius } = this.state
    const highlightedOuterRadius = outerRadius * (1 + highlightedRatio)
    const highlightedInnerRadius = innerRadius * (1 - highlightedRatio)
    var start = 0

    return data.map((slice, index) => {
      start = start + slice.value

      return (
        <PieChartSlice
          animation={ animation }
          color={ slice.color }
          innerRadius={ slice.isHighlighted ? highlightedInnerRadius : innerRadius }
          key={ index }
          outerRadius={ slice.isHighlighted ? highlightedOuterRadius : outerRadius  }
          value={ slice.value }
          start={ start - slice.value }
        />
      )
    })
  }

  render = () => {
    const {
      centerText,
      centerTextColor,
      centerTextFont,
      centerTextYOffset,
      chartLabel,
      chartLabelColor,
      chartLabelFont,
      chartLabelYOffset,
    } = this.props
    const {
      centerX,
      centerY,
      noData,
      outerRadius,
      viewHeight,
      viewWidth,
    } = this.state

    return (
      <ViewContainer onLayout={ (e) => this.setLayout(e) } >
        <Surface
          height={ viewHeight }
          width={ viewWidth }
        >
          <Group
            height={ viewHeight  }
            width={ viewWidth }
            x={ centerX }
            y={ centerY }
            originX={ centerX }
            originY={ centerY }
          >
            {centerText &&
              this.renderLabel(centerText, centerTextFont, centerTextColor, 0, centerTextYOffset)
            }
            {!noData ?
              this.renderSlices()
            : this.renderNoData()
            }
            {chartLabel &&
              this.renderLabel(chartLabel, chartLabelFont, chartLabelColor, 0, outerRadius + chartLabelYOffset)
            }
          </Group>
        </Surface>
      </ViewContainer>
    )
  }
}
