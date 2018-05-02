import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'
import isEqual from 'lodash.isequal'
import {
  Axis,
  SmoothLine,
  ViewContainer
} from '../../index'

const {
  Group,
  Path,
  Shape,
  Surface,
  Text,
} = ART

export class ComplexSmoothLineChart extends Component {
  static propTypes = {
    animation: PropTypes.number,
    axisColor: PropTypes.string,
    data: PropTypes.array,
    displayXIncrementMarkers: PropTypes.func, // should return true or false
    displayYIncrementMarkers: PropTypes.bool,
    displayLeftYAxis: PropTypes.bool,
    displayRightYAxis: PropTypes.bool,
    displayXAxis: PropTypes.bool,
    generateXAxisLabel: PropTypes.func, // should return a string or null
    isCalculating: PropTypes.bool,
    maxValue: PropTypes.number,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingTop: PropTypes.number,
    xAxisLabelColor: PropTypes.string,
    xAxisLabelFont: PropTypes.string,
    xAxisLabelYOffset: PropTypes.number,
    yAxisLabelColor: PropTypes.string,
    yAxisLabelAlignment: PropTypes.string,
    yAxisLabelFont: PropTypes.string,
    yAxisLabelXOffset: PropTypes.number,
    yAxisLabelYOffset: PropTypes.number,
    yIncrements: PropTypes.number,
    yIncrementsColor: PropTypes.string,
  }

  static defaultProps = {
    axisColor: 'black',
    // default to always display x increment markers
    displayXIncrementMarkers: () => true,
    displayYIncrementMarkers: true,
    displayLeftYAxis: false,
    displayRightYAxis: false,
    displayXAxis: true,
    generateXAxisLabel: () => null,
    isCalculating: false,
    paddingBottom: 20,
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
    sectionWidth: null,
    chartWidth: null,
    chartHeight: null,
    noData: false,
    upperYIncrement: null,
    viewHeight: null,
    viewWidth: null,
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

  checkDataAndSetConstraints = ({ data, maxValue }) => {
    const { yIncrements } = this.props

    // calculate the max value of the y axis, and therefore calculate the
    // increments for which it will jump
    var max = -Number.MIN_VALUE
    var min = Number.MAX_VALUE
    var isUndefined = false
    var validSubData = true

    // if we know the max value ahead of time then we can skip the loop
    if (maxValue) {
      max = maxValue
      min = 0 //assume  min will be 0
    } else {
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
    }

    var range = max - min

    // check to see if the data for the chart is acceptable, otherwise set
    // default values and warn the user
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
    } = this.props
    const subDataLength = data[0].length

    this.setState({
      sectionWidth: (e.nativeEvent.layout.width - paddingLeft - paddingRight) / subDataLength,
      chartHeight: e.nativeEvent.layout.height - paddingTop - paddingBottom,
      chartWidth: e.nativeEvent.layout.width - paddingLeft - paddingRight,
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
    } = props
    const {
      viewHeight,
      viewWidth,
    } = this.state
    const subDataLength = data[0].length

    this.setState({
      sectionWidth: (viewWidth - paddingLeft - paddingRight) / subDataLength,
      chartHeight: viewHeight - paddingTop - paddingBottom,
      chartWidth: viewWidth - paddingLeft - paddingRight,
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

  renderLeftYAxis = () => {
    const {
      axisColor,
      paddingLeft,
      paddingTop,
    } = this.props
    const { chartHeight } = this.state

    return this.renderAxis(paddingLeft, paddingTop, 0, chartHeight, axisColor)
  }

  renderLines = () => {
    const {
      animation,
      data,
      lineColor,
      paddingLeft,
      paddingTop,
    } = this.props
    const {
      chartHeight,
      chartWidth,
      sectionWidth,
      upperYIncrement,
    } = this.state

    return data.map((subData, index) => {

      return (
        <SmoothLine
          animation={ animation }
          data={ subData }
          fillColor={ subData[0].color }
          chartHeight={ chartHeight }
          chartWidth={ chartWidth }
          lineColor={ subData[0].color }
          key={ index }
          paddingLeft={ paddingLeft }
          paddingTop={ paddingTop }
          sectionWidth={ sectionWidth }
          startX={ paddingLeft }
          upperYIncrement={ upperYIncrement }
        />
      )
    })
  }

  renderRightYAxis = () => {
    const {
      axisColor,
      paddingLeft,
      paddingTop,
    } = this.props
    const {
      chartHeight,
      chartWidth,
    } = this.state

    return this.renderAxis(paddingLeft + chartWidth, paddingTop, 0, chartHeight, axisColor)
  }

  renderXAxis = () => {
    const {
      axisColor,
      paddingLeft,
      paddingTop,
    } = this.props
    const {
      chartHeight,
      chartWidth,
    } = this.state

    return this.renderAxis(paddingLeft, chartHeight + paddingTop, chartWidth, 0, axisColor)
  }

  renderXIncrements = () => {
    const {
      axisColor,
      data,
      displayXIncrementMarkers,
      generateXAxisLabel,
      paddingLeft,
      paddingTop,
      xAxisLabelColor,
      xAxisLabelFont,
      xAxisLabelYOffset,
    } = this.props
    const {
      chartHeight,
      chartWidth,
      sectionWidth,
    } = this.state
    var startX
    var renderLabel
    var renderXIncrement

    return data[0].map((item, index) => {
      startX = paddingLeft + index * sectionWidth
      renderLabel = generateXAxisLabel(item, index)
      renderXIncrement = displayXIncrementMarkers(item, index)

      return ([
        // the label for the x axis undereath the section
        renderLabel && this.renderLabel(startX + sectionWidth / 2, chartHeight + xAxisLabelYOffset, renderLabel, 'center', xAxisLabelFont, xAxisLabelColor, 100 + index),
        // the x axis increment marker
        renderXIncrement && this.renderAxisWithKey(startX + sectionWidth, chartHeight + paddingTop, 0, 3, 2000 + index, axisColor)
      ])
    })
  }

  renderYIncrements = () => {
    const {
      displayYIncrementMarkers,
      paddingLeft,
      paddingTop,
      yAxisLabelAlignment,
      yAxisLabelColor,
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
      label = this.renderLabel(paddingLeft + yAxisLabelXOffset, height + paddingTop + yAxisLabelYOffset, amount, yAxisLabelAlignment, yAxisLabelFont, yAxisLabelColor, yIncrements + i)

      increments.push(line)
      increments.push(label)
    }

    return increments
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

  render = () => {
    const {
      displayLeftYAxis,
      displayRightYAxis,
    } = this.props
    const {
      viewHeight,
      viewWidth
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
              { this.renderLines() }
              { displayLeftYAxis && this.renderLeftYAxis() }
              { displayRightYAxis && this.renderRightYAxis() }
              { this.renderXAxis() }
              { this.renderXIncrements() }
            </Group>
          </Surface>
        }
      </ViewContainer>
    )
  }

}
