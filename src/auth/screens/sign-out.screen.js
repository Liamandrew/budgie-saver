import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  // actions
  signUserOut,
  // selectors
  getIsSigningOut,
} from '../index'
import {
  LoadingModal,
  TextContainer,
  ViewContainer,
} from '../../components'
import { resetNavigationTo } from '../../utils'

//@TODO this can become a modal instead
class SignOut extends Component {
  static navigationOptions = {
    header: null,
  }

  componentWillMount = () => {
    const { navigation, signUserOut }  = this.props

    signUserOut()
    .then(() => {
      resetNavigationTo('AuthStackNavigator', navigation)
    })
  }

  render = () => {
    const { isSigningOut } = this.props

    return (
      <ViewContainer>
        {isSigningOut &&
          <LoadingModal
            animating={ isSigningOut }
            size='large'
          />
        }
      </ViewContainer>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isSigningOut: getIsSigningOut(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signUserOut: () => dispatch(signUserOut())
  }
}

export const SignOutScreen = connect(mapStateToProps, mapDispatchToProps)(SignOut)
