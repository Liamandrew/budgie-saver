import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'
import isEqual from 'lodash.isequal'
import {
  Axis,
  Column,
  ViewContainer
} from '../../index'

const {
  Group,
  Path,
  Shape,
  Surface,
  Text,
} = ART

/*
 * Data prop should be an array of object with the following structure
 * { name, value, color }
 */
export class ColumnChart extends Component {
  static propTypes = {
    animation: PropTypes.number,
    columnPadding: PropTypes.number,
    data: PropTypes.array,
    displayColumnValues: PropTypes.bool,
    displayXIncrementMarkers: PropTypes.func, // should return true or false
    displayYIncrementMarkers: PropTypes.bool,
    displayLeftYAxis: PropTypes.bool,
    displayRightYAxis: PropTypes.bool,
    displayXAxis: PropTypes.bool,
    generateXAxisLabel: PropTypes.func, // should return a string or null
    isCalculating: PropTypes.bool,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    xAxisLabelColor: PropTypes.string,
    xAxisLabelFont: PropTypes.string,
    xAxisLabelYOffset: PropTypes.number,
    yAxisLabelAlignment: PropTypes.string,
    yAxisLabelColor: PropTypes.string,
    yAxisLabelFont: PropTypes.string,
    yAxisLabelXOffset: PropTypes.number,
    yAxisLabelYOffset: PropTypes.number,
    yIncrements: PropTypes.number,
    yIncrementsColor: PropTypes.string,
  }

  static defaultProps = {
    axisColor: 'black',
    columnPadding: 30,
    displayColumnValues: false,
    // default to always display x increment markers
    displayXIncrementMarkers: () => true,
    displayYIncrementMarkers: true,
    displayLeftYAxis: false,
    displayRightYAxis: false,
    displayXAxis: true,
    generateXAxisLabel: () => null,
    isCalculating: false,
    paddingBottom: 30,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 15,
    xAxisLabelColor: 'black',
    xAxisLabelFont: '10px Roboto',
    xAxisLabelYOffset: 15,
    yAxisLabelColor: 'black',
    yAxisLabelAlignment: 'left',
    yAxisLabelFont: '10px Roboto',
    yAxisLabelXOffset: 5,
    yAxisLabelYOffset: -15,
    yIncrements: 4,
    yIncrementsColor: 'gray'
  }

  state = {
    columnWidth: null,
    chartWidth: null,
    chartHeight: null,
    upperYIncrement: null,
    viewHeight: null,
    viewWidth: null,
    noData: false,
    yIncrementHeight: null,
  }

  componentWillMount = () => {
    this.checkDataAndSetConstraints(this.props)
  }

  componentWillReceiveProps = (nextProps) => {
    if (!isEqual(nextProps.data, this.props.data)) {
      this.checkDataAndSetConstraints(nextProps)
      this.setChartDimensions(nextProps)
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isCalculating) {
      return false
    }
    return true
  }

  checkDataAndSetConstraints = ({ data }) => {
    const { yIncrements } = this.props

    // calculate the max value of the y axis, and therefore calculate the
    // increments for which it will jump
    var max = -Number.MIN_VALUE
    var min = Number.MAX_VALUE
    var isUndefined = false

    for (var { value: v } of data) {
      if (isNaN(v)) {
        isUndefinted = true
        break
      }
      else if (v > max) {
        max = v
      }
      else if (v < min) {
        min = v
      }
    }

    var range = max - min

    // check to see if the data for the chart is acceptable, otherwise set defaults
    // values and warn the user
    if (data.length === 0 || isUndefined || range === 0 && max === 0) {
      this.setState({
        upperYIncrement: yIncrements * 50,
        noData: true,
        yIncrementHeight: 50,
      })
    } else {
      var unroundIncrementSize = max / yIncrements
      var x = Math.ceil(Math.log10(unroundIncrementSize) - 1)
      var power10x = Math.pow(10, x)
      var roundIncrementRange = Math.ceil(unroundIncrementSize / power10x) * power10x

      this.setState({
        upperYIncrement: yIncrements * roundIncrementRange,
        yIncrementHeight: roundIncrementRange
      })
    }
  }

  setLayout = (e) => {
    const {
      data,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      columnPadding,
    } = this.props

    this.setState({
      chartHeight: e.nativeEvent.layout.height - paddingTop - paddingBottom,
      chartWidth: e.nativeEvent.layout.width - paddingLeft - paddingRight,
      columnWidth: (e.nativeEvent.layout.width  - paddingLeft - paddingRight - columnPadding) / data.length - columnPadding,
      viewHeight: e.nativeEvent.layout.height,
      viewWidth: e.nativeEvent.layout.width,
    })
  }

  // additional props changes need to change the chart specific dimensions
  setChartDimensions = (props) => {
    const {
      data,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      columnPadding,
    } = props
    const {
      viewHeight,
      viewWidth,
    } = this.state

    this.setState({
      columnWidth: (viewWidth - paddingLeft - paddingRight - columnPadding) / data.length - columnPadding,
      chartHeight: viewHeight - paddingTop - paddingBottom,
      chartWidth: viewWidth - paddingLeft - paddingRight,
    })
  }

  renderColumns = () => {
    const {
      animation,
      columnPadding,
      data,
      displayXIncrementMarkers,
      generateXAxisLabel,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      xAxisLabelColor,
      xAxisLabelFont,
      xAxisLabelYOffset,
    } = this.props
    const {
      columnWidth,
      chartHeight,
      upperYIncrement,
    } = this.state
    var height
    var startX
    var renderLabel
    var renderXIncrement

    return data.map((item, index) => {
      height = chartHeight * (item.value / upperYIncrement)
      startX = paddingLeft + columnPadding + (index * (columnWidth + columnPadding))
      renderLabel = generateXAxisLabel(item, index)
      renderXIncrement = displayXIncrementMarkers(item, index)

      return ([
        <Column
          animation={ animation }
          color='red'
          height={ height }
          key={ index }
          startX={ startX }
          startY={ chartHeight + paddingTop }
          width={ columnWidth }
        />,
        // the label for the x axis underneath the column
        renderLabel && this.renderLabel(startX + columnWidth / 2, chartHeight + xAxisLabelYOffset, renderLabel, 'center', xAxisLabelFont, xAxisLabelColor, 100 + index),
        // the x Axis increment marker
        renderXIncrement && this.renderAxisWithKey(startX + columnWidth + columnPadding / 2, chartHeight + paddingTop, 0, 3)

      ])
    })
  }

  renderAxis = (startX, startY, deltaX, deltaY, color='black', strokeWidth=1) => {
    return (
      <Axis
        startX={ startX }
        startY={ startY }
        deltaX={ deltaX }
        deltaY={ deltaY }
        color={ color }
        strokeWidth={ strokeWidth }
      />
    )
  }

  renderAxisWithKey = (startX, startY, deltaX, deltaY, key, color='black', strokeWidth=1) => {
    return (
      <Axis
        startX={ startX }
        startY={ startY }
        deltaX={ deltaX }
        deltaY={ deltaY }
        color={ color }
        key={ key }
        strokeWidth={ strokeWidth }
      />
    )
  }

  renderLabel = (x, y, label, alignment, font, color='black', key) => {
    return (
      <Text
        font={ font }
        x={ x }
        y={ y }
        alignment={ alignment }
        fill={ color }
        key={ key }
      >
        { `${label}` }
      </Text>
    )
  }

  renderLeftYAxis = () => {
    const {
      paddingLeft,
      paddingTop,
    } = this.props
    const { chartHeight } = this.state

    return this.renderAxis(paddingLeft, paddingTop, 0, chartHeight)
  }

  renderRightYAxis = () => {
    const {
      paddingLeft,
      paddingTop,
    } = this.props
    const {
      chartHeight,
      chartWidth,
    } = this.state

    return this.renderAxis(paddingLeft + chartWidth, paddingTop, 0, chartHeight)
  }

  renderXAxis = () => {
    const {
      paddingLeft,
      paddingTop,
    } = this.props
    const {
      chartHeight,
      chartWidth,
    } = this.state

    return this.renderAxis(paddingLeft, chartHeight + paddingTop, chartWidth, 0)
  }

  renderYIncrements = () => {
    const {
      displayYIncrementMarkers,
      paddingLeft,
      paddingTop,
      yAxisLabelAlignment,
      yAxisLabelFont,
      yAxisLabelXOffset,
      yAxisLabelYOffset,
      yIncrements,
      yIncrementsColor,
    } = this.props
    const {
      chartHeight,
      chartWidth,
      upperYIncrement,
      yIncrementHeight,
    } = this.state
    var increments = []
    var amount
    var height
    var line
    var label

    for (i = 1; i <= yIncrements; i++) {
      amount = i * yIncrementHeight
      // inverse the height so that the labels are correct
      height = chartHeight * ((upperYIncrement - amount) / upperYIncrement)
      if (displayYIncrementMarkers) {
        line = this.renderAxisWithKey(paddingLeft, height + paddingTop, chartWidth, 0, i, yIncrementsColor)
      }
      label = this.renderLabel(paddingLeft + yAxisLabelXOffset, height + paddingTop + yAxisLabelYOffset, amount, yAxisLabelAlignment, yAxisLabelFont, 'black', yIncrements + i)

      increments.push(line)
      increments.push(label)
    }

    return increments
  }

  render = () => {
    const {
      displayLeftYAxis,
      displayRightYAxis,
    } = this.props
    const {
      viewHeight,
      viewWidth,
    } = this.state

    return (
      <ViewContainer onLayout={ (e) => this.setLayout(e) } >
        {viewHeight &&
          <Surface
            height={ viewHeight }
            width={ viewWidth }
          >
            <Group
              height={ viewHeight }
              width={ viewWidth }
            >
              { this.renderYIncrements() }
              { this.renderColumns() }
              { displayLeftYAxis && this.renderLeftYAxis() }
              { displayRightYAxis && this.renderRightYAxis() }
              { this.renderXAxis() }
            </Group>
          </Surface>
        }
      </ViewContainer>
    )
  }
}
