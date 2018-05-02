import React, { Component } from 'react'
import {
  Image,
  View,
  StyleSheet,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ViewContainer } from '../../components'
import { colors, navigateTo, resetNavigationTo, sleep } from '../../utils'
import {
  // actions
  getUser,
  // selectors
  getAuthUser,
} from '../index'

class Splash extends Component {
  static navigationOptions = {
    header: null,
  }

  componentDidMount = () => {
    const { getUser, navigation, user } = this.props
    const props = {}

    getUser()

    sleep(1000)
    .then(() => {

      if (user) {
        navigateTo('BudgetToolDrawerNavigator', navigation)
      } else {
        resetNavigationTo('AuthStackNavigator', navigation)
      }

    })
  }

  render = () => {
    return (
      <ViewContainer>
        <ViewContainer containerStyle={ styles.background } >
          <Image
            source={ require('../../assets/images/budgie-logo-plain@1024.png') }
            style={ styles.logo }
          />
        </ViewContainer>
      </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: 250,
  }
})

const mapStateToProps = (state) => {

  return {
    user: getAuthUser(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: () => dispatch(getUser()),
  }
}

export const SplashScreen = connect(mapStateToProps, mapDispatchToProps)(Splash)
