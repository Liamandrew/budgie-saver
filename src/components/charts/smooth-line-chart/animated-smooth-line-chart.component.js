import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated } from 'react-native'
import isEqual from 'lodash.isequal'
import { SmoothLineChart } from './smooth-line-chart.component'

const AnimatedSmoothLine = Animated.createAnimatedComponent(SmoothLineChart)

export class AnimatedSmoothLineChart extends Component {
  state = {
    animation: new Animated.Value(0)
  }

  componentDidMount = () => {
    this.startAnimation()
  }

  componentWillReceiveProps = (nextProps) => {
    if (!isEqual(nextProps.data, this.props.data)) {
      this.startAnimation(true)
    }
  }

  startAnimation = (refresh=false) => {
    if (refresh) { this.state.animation.setValue(0) }

    Animated.timing(
      this.state.animation,
      {
        toValue: 1,
        duration: 950,
      }
    ).start()
  }

  render = () => {
    const { ...props } = this.props
    const { animation } = this.state

    return (
      <AnimatedSmoothLine
        animation={ animation }
        { ...props }
      />
    )
  }
}
