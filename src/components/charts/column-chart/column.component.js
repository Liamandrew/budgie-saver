import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'

const {
  Path,
  Shape,
  Text,
} = ART

export class Column extends Component {
  static propTypes = {
    animation: PropTypes.number,
    color: PropTypes.string,
    displayValue: PropTypes.bool,
    height: PropTypes.number,
    startX: PropTypes.number,
    startY: PropTypes.number,
    width: PropTypes.number,
  }

  createColumnPath = (startX, startY, height, width, animation) => {
    var path = new Path()
    var drawHeight

    path.move(startX, startY)

    drawHeight = animation ? height * animation : height

    path.line(0, -drawHeight)
      .line(width, 0)
      .line(0, drawHeight)
      .line(-width, 0)

    path.close()

    return path
  }

  render = () => {
    const {
      animation,
      displayValue,
      color,
      height,
      startX,
      startY,
      width,
    } = this.props

    var path = this.createColumnPath(startX, startY, height, width, animation)

    return (
      <Shape
        d={ path }
        fill={ color }
        stroke={ color }
      />
    )
  }
}
