import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SingleAlert } from './index'
import { sleep } from '../../utils'

export class SingleAlertView extends Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    buttonText: PropTypes.string,
    onPress: PropTypes.func,
  }

  componentWillMount = () => {
    const { title, message, buttonText, onPress } = this.props

    sleep(100)
    .then(() => {
      SingleAlert(title, message, buttonText, onPress)
    })
  }

  render = () => {
    return null
  }
}
