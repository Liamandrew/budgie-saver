import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ART } from 'react-native'

const {
  Path,
  Shape,
} = ART

export class Axis extends Component {
  static propTypes = {
    color: PropTypes.string,
    deltaX: PropTypes.number,
    deltaY: PropTypes.number,
    startX: PropTypes.number,
    startY: PropTypes.number,
    strokeWidth: PropTypes.number,
  }

  static defaultProps = {
    color: 'black',
    strokeWidth: 1
  }

  render = () => {
    const {
      color,
      deltaX,
      deltaY,
      startX,
      startY,
      strokeWidth,
      ...props,
    } = this.props

    var path = new Path()

    path.move(startX, startY)
      .line(deltaX, deltaY)

    path.close()

    return (
      <Shape
        d={ path }
        fill={ color }
        stroke={ color }
        strokeWidth={ strokeWidth }
        { ...props }
      />
    )
  }
}
