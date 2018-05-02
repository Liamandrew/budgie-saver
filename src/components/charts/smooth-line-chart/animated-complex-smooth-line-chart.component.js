import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated } from 'react-native'
import isEqual from 'lodash.isequal'

import { ComplexSmoothLineChart } from './complex-smooth-line-chart.component'

const AnimatedSmoothLine = Animated.createAnimatedComponent(ComplexSmoothLineChart)

export class AnimatedComplexSmoothLineChart extends Component {
  state = {
    animation: new Animated.Value(0)
  }

  componentDidMount = () => {
    this.startAnimation()
  }

  componentWillReceiveProps = (nextProps) => {
    if (!isEqual(nextProps.data, this.props.data) || (!nextProps.isCalculating && this.props.isCalculating) ) {
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
