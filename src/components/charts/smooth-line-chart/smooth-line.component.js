import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'

const {
  Path,
  Shape,
} = ART

export class SmoothLine extends Component {
  static propTypes = {
    animation: PropTypes.number,
    data: PropTypes.array,
    fillColor: PropTypes.string,
    chartHeight: PropTypes.number,
    chartWidth: PropTypes.number,
    lineColor: PropTypes.string,
    paddingLeft: PropTypes.number,
    paddingTop: PropTypes.number,
    sectionWidth: PropTypes.number,
    startX: PropTypes.number,
    upperYIncrement: PropTypes.number,
  }

  createSmoothLine = () => {
    const {
      animation,
      data,
      chartHeight,
      chartWidth,
      paddingLeft,
      paddingTop,
      startX,
      sectionWidth,
      upperYIncrement,
    } = this.props

    var path = new Path()
    var startY = chartHeight + paddingTop
    var animValue
    var x = 0
    var y
    var prevX
    var prevY
    var i = 0

    // move the line to the bottom left hand corner of the chart
    path.move(startX, startY)

    for (var { value: v } of data ) {
      animValue = animation ? v * animation : v
      y = startY - ( animValue / upperYIncrement) * chartHeight
      x = startX + (i * sectionWidth)

      // the first point shouldn't curve as we are on the x axis
      if (i === 0) {
        path.lineTo(x, y)
      } else {
        path.curveTo(prevX + (sectionWidth / 2), prevY, x - (sectionWidth / 2), y, x, y)
      }
      prevX = x
      prevY = y
      i += 1
    }

    // close the line off by following the perimeter of the chart
    path.line(sectionWidth, 0)
      .lineTo(startX + chartWidth, chartHeight + paddingTop)
      .line(-chartWidth, 0)

    path.close()

    return path
  }

  render = () => {
    const {
      fillColor,
      lineColor,
    } = this.props
    var path = this.createSmoothLine()

    return (
      <Shape
        d={ path }
        fill={ fillColor }
        stroke={ lineColor }
        strokeWidth={ 1 }
      />
    )
  }
}
