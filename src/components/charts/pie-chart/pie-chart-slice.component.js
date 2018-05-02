import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART, Platform } from 'react-native'

const {
  Path,
  Shape,
} = ART

const circleRadians = Math.PI * 2
const radiansPerDegree = Math.PI / 180

export class PieChartSlice extends Component {
  static propTypes = {
    animation: PropTypes.number,
    color: PropTypes.string,
    innerRadius: PropTypes.number,
    outerRadius: PropTypes.number,
    value: PropTypes.number,
    start: PropTypes.number,
  }

  getvalueRadians = (value) => {
    return value * 360 * radiansPerDegree
  }

  /*
   *  Params:
   *  start       -> the start value that this slice will begin from (e.g. 0.1)
   *  value  -> the total value of this slice
   *  animation   -> the value that the animation is at during initial display
   *  outerRadius -> the radius of the outer most point of the slice from the center
   *  innerRadius -> the radius of the inner most point of the slice from the center
   */
  createSlicePath = (start, value, outerRadius, innerRadius, animation) => {
    if (animation && start > animation) { return } //Don't want to display this yet during animation

    var path = new Path()

    var startAngle = this.getvalueRadians(start)
    var startAngleSin = Math.sin(startAngle)
    var startAngleCos = Math.cos(startAngle)

    var endAngle
    var total = start + value

    // this is a workaround for a bug drawing a full circle in android
    if (value === 1 && Platform.OS === 'android') {
      total = 0.9999
    }

    if (animation && total > animation) {
      endAngle = this.getvalueRadians(animation)
    } else {
      endAngle = this.getvalueRadians(total)
    }

    var endAngleSin = Math.sin(endAngle)
    var endAngleCos = Math.cos(endAngle)

    var diffAngleSin = endAngleSin - startAngleSin
    var diffAngleCos = endAngleCos - startAngleCos
    var diffRadius = innerRadius - outerRadius

    var centralAngle = (startAngle > endAngle) ?
      Math.PI * 2 - startAngle + endAngle
      : endAngle - startAngle

    var large = centralAngle > Math.PI

    path.move(outerRadius * -startAngleSin, outerRadius * startAngleCos)
      .arc(outerRadius * -diffAngleSin, outerRadius * diffAngleCos, outerRadius, outerRadius, large)
      .line(diffRadius * -endAngleSin, diffRadius * endAngleCos)

    if (innerRadius) {
      path.counterArcTo(innerRadius * -startAngleSin, innerRadius * startAngleCos, innerRadius, innerRadius, large)
    }

    path.close()

    return path
  }

  render = () => {
    const {
      animation,
      color,
      innerRadius,
      outerRadius,
      value,
      start,
    } = this.props

    var path = this.createSlicePath(start, value, outerRadius, innerRadius, animation)

    return (
      <Shape
        d={ path }
        fill={ color }
        stroke={ color }
      />
    )
  }
}
