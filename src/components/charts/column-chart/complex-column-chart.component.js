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
 * data prop should be a nested array with each sub array storing objects of
 * the following structure
 * { name, value, color }
 */
export class ComplexColumnChart extends Component {
  static propTypes = {
    animation: PropTypes.number,
    axisColor: PropTypes.string,
    axisLabelColor: PropTypes.string,
    columnPaddingExternal: PropTypes.number,
    columnPaddingInternal: PropTypes.number,
    data: PropTypes.array,
    displayXIncrementMarkers: PropTypes.func, // should return true or false
    displayYIncrementMarkers: PropTypes.bool,
    displayLeftYAxis: PropTypes.bool,
    displayRightYAxis: PropTypes.bool,
    displayXAxis: PropTypes.bool,
    generateXAxisLabel: PropTypes.func, // should return a string or null
    isCalculating: PropTypes.bool,
    isStacked: PropTypes.bool,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    xAxisLabelFont: PropTypes.string,
    xAxisLabelYOffset: PropTypes.number,
    yAxisLabelAlignment: PropTypes.string,
    yAxisLabelFont: PropTypes.string,
    yAxisLabelXOffset: PropTypes.number,
    yAxisLabelYOffset: PropTypes.number,
    yIncrements: PropTypes.number,
    yIncrementsColor: PropTypes.string,
  }

  static defaultProps = {
    axisColor: 'black',
    axisLabelColor: 'black',
    columnPaddingExternal: 15,
    columnPaddingInternal: 2,
    // default to always display x increment markers
    displayXIncrementMarkers: () => true,
    displayYIncrementMarkers: true,
    displayLeftYAxis: false,
    displayRightYAxis: false,
    displayXAxis: true,
    generateXAxisLabel: () => null,
    isCalculating: false,
    isStacked: false,
    paddingBottom: 25,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 15,
    xAxisLabelFont: '10px Roboto',
    xAxisLabelYOffset: 15,
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
    subDataBlockWidth: null,
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
    var validSubData = true

    for (var i = 0; i < data.length; i++) {
      // check to make sure that there is valid sub data
      if (data[i].length === 0) { validSubData = false }

      for (var { value: v } of data[i]) {
        if (isNaN(v)) {
          isUndefined = true
          break
        }
        else if (v > max) {
          max = v
        }
        else if (v < min) {
          min = v
        }
      }
    }

    var range = max - min

    // check to see if the data for the chart is acceptable, otherwise set defaults
    // values and warn the user
    if (data.length === 0 || !validSubData || isUndefined || range === 0 && max === 0) {
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
      columnPaddingExternal,
      columnPaddingInternal,
      isStacked,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
    } = this.props
    const subDataLength = data[0].length

    const columnWidth = isStacked ? (e.nativeEvent.layout.width - paddingLeft - paddingRight - columnPaddingExternal) / data.length - columnPaddingExternal
    : ((e.nativeEvent.layout.width - paddingLeft - paddingRight - columnPaddingExternal - subDataLength * columnPaddingInternal) / data.length) / subDataLength - columnPaddingExternal

    const subDataBlockWidth = isStacked ? columnWidth + columnPaddingExternal : subDataLength * (columnWidth + columnPaddingInternal) + columnPaddingExternal

    this.setState({
      chartHeight: e.nativeEvent.layout.height - paddingTop - paddingBottom,
      chartWidth: e.nativeEvent.layout.width - paddingLeft - paddingRight,
      columnWidth: columnWidth,
      subDataBlockWidth: subDataBlockWidth,
      viewHeight: e.nativeEvent.layout.height,
      viewWidth: e.nativeEvent.layout.width,
    })
  }

  // additional props changes need to change the chart specific dimensions
  setChartDimensions = (props) => {
    const {
      data,
      columnPaddingExternal,
      columnPaddingInternal,
      isStacked,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
    } = props
    const {
      viewHeight,
      viewWidth,
    } = this.state
    const subDataLength = data[0].length

    const columnWidth = isStacked ? (viewWidth - paddingLeft - paddingRight - columnPaddingExternal) / data.length - columnPaddingExternal
    : ((viewWidth- paddingLeft - paddingRight - columnPaddingExternal - subDataLength * columnPaddingInternal) / data.length) / subDataLength - columnPaddingExternal

    const subDataBlockWidth = isStacked ? columnWidth + columnPaddingExternal : subDataLength * (columnWidth + columnPaddingInternal) + columnPaddingExternal

    this.setState({
      chartHeight: viewHeight - paddingTop - paddingBottom,
      chartWidth: viewWidth - paddingLeft - paddingRight,
      columnWidth: columnWidth,
      subDataBlockWidth: subDataBlockWidth,
    })
  }

  renderColumns = () => {
    const {
      animation,
      axisLabelColor,
      columnPaddingExternal,
      columnPaddingInternal,
      data,
      displayXIncrementMarkers,
      generateXAxisLabel,
      isStacked,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      xAxisLabelFont,
      xAxisLabelYOffset,
    } = this.props
    const {
      columnWidth,
      chartHeight,
      subDataBlockWidth,
      upperYIncrement,
    } = this.state
    var height
    var previousValue
    var stackedValue
    var startX
    var renderLabel
    var label
    var subDataWidth
    var maxSubValue

    return data.map((subData, dataIndex) => {
      renderLabel = generateXAxisLabel(subData, dataIndex)
      startX = paddingLeft + columnPaddingExternal + (dataIndex * subDataBlockWidth)

      // the label for the x axis underneath the column
      label = renderLabel && this.renderLabel(startX + subDataBlockWidth / 2, chartHeight + xAxisLabelYOffset, renderLabel, 'center', xAxisLabelFont, axisLabelColor, 1000 + dataIndex)

      // since we assume that the data input should already be ordered, then the
      // max value is always the last element in the list
      if (isStacked && animation) { maxSubValue = subData[subData.length - 1].value }
      previousValue = 0
      return ([
        subData.map((item, subDataIndex) => {

          var column
          var newAnimation = 1
          if (isStacked) {

            // determine the increment for this item ontop of the stacked column
            stackedValue = item.value - previousValue

            // if the increment doesn't exist from the previous value or if the
            // animation value is less than the share of the stack then
            // don't render it
            if (stackedValue <= 0) { return null }

            // todo: fix this animation problem so that it looks half decent
            if (animation) {
              var prevIncrement = previousValue / maxSubValue
              if (animation < prevIncrement) {
                newAnimation = 0
              }
              else {
                newAnimation = animation
              }

            }

            height = chartHeight * (stackedValue / upperYIncrement)
            var previousHeight = chartHeight * (previousValue / upperYIncrement)
            column = this.renderColumn(newAnimation, height, dataIndex * data.length + subDataIndex, startX, chartHeight + paddingTop - previousHeight, columnWidth, item.color)
            previousValue = item.value

          } else {

            height = chartHeight * (item.value / upperYIncrement)
            var x = startX + subDataIndex * (columnWidth + columnPaddingInternal)

            column = this.renderColumn(animation, height, dataIndex * data.length + subDataIndex, x, chartHeight + paddingTop, columnWidth, item.color)
          }

          return column
        }),
        renderLabel && label,
      ])
    })
  }

  renderColumn = (animation, height, index, startX, startY, width, color='red') => {

    return (
      <Column
        animation={ animation }
        color={ color }
        height={ height }
        key={ index }
        startX={ startX }
        startY={ startY }
        width={ width }
      />
    )
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
