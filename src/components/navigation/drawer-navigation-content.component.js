import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  StyleSheet,
} from 'react-native'
import {
  DrawerItems,
  SafeAreaView,
} from 'react-navigation'
import {
  SingleButton,
  ViewContainer,
} from '../../components'
import { colors } from '../../utils'

const profileHeight = 100

export class DrawerNavigationContent extends Component {

  onHomePress = () => {
    this.props.navigation.navigate('BudgetToolTabNavigator')
  }

  onCreateAccountPress = () => {
    this.props.navigation.navigate('CreateAccountScreen')
  }

  onSignOutPress = () => {
    this.props.navigation.navigate('SignOutScreen')
  }

  render = () => {
    const { isAnonymous } = this.props

    return (
        <ViewContainer>
          <ViewContainer containerStyle={ styles.profileContainer } >
            <Image
              source={ require('../../assets/images/budgie-logo-plain@1024.png') }
              style={ styles.logo }
            />
          </ViewContainer>
          <ViewContainer containerStyle={ styles.menuContainer }>
            <ViewContainer containerStyle={ styles.rowContainer }>
              <ViewContainer containerStyle={ styles.imageContainer } >
                <Image
                  source={ require('../../assets/images/ic_home.png') }
                  style={ { tintColor: colors.lightNavy } }
                />
              </ViewContainer>
              <SingleButton
                buttonStyle={ styles.button }
                containerStyle={ styles.buttonContainer }
                onPress={ this.onHomePress }
                text="Home"
              />
            </ViewContainer>
            <ViewContainer containerStyle={ styles.rowContainer }>
              <ViewContainer containerStyle={ styles.imageContainer } >
                <Image
                  source={ require('../../assets/images/ic_assessment.png') }
                  style={ { tintColor: colors.darkGrey } }
                />
              </ViewContainer>
              <SingleButton
                buttonStyle={ styles.button }
                containerStyle={ styles.buttonContainer }
                disabled={ true }
                onPress={ this.onEditDetailsPress }
                text="Goals"
                textStyle={ styles.disabledButtonText }
              />
            </ViewContainer>
            <ViewContainer containerStyle={ styles.rowContainer }>
              <ViewContainer containerStyle={ styles.imageContainer } >
                <Image
                  source={ require('../../assets/images/ic_sms.png') }
                  style={ { tintColor: colors.darkGrey } }
                />
              </ViewContainer>
              <SingleButton
                buttonStyle={ styles.button }
                containerStyle={ styles.buttonContainer }
                disabled={ true }
                onPress={ this.onEditDetailsPress }
                text="Notifications"
                textStyle={ styles.disabledButtonText }
              />
            </ViewContainer>
            <ViewContainer containerStyle={ { flex: isAnonymous ? 2 : 3 }} />
            {isAnonymous &&
              <ViewContainer containerStyle={ styles.rowContainer }>
                <ViewContainer containerStyle={ styles.imageContainer } >
                  <Image
                    source={ require('../../assets/images/ic_account_circle.png') }
                    style={ { tintColor: colors.lightNavy } }
                  />
                </ViewContainer>
                <SingleButton
                  buttonStyle={ styles.button }
                  containerStyle={ styles.buttonContainer }
                  onPress={ this.onCreateAccountPress }
                  text="Create Account"
                />
              </ViewContainer>
            }
            <ViewContainer containerStyle={ styles.rowContainer }>
              <ViewContainer containerStyle={ styles.imageContainer } >
                <Image
                  source={ require('../../assets/images/ic_exit_to_app.png') }
                  style={ { tintColor: colors.lightNavy } }
                />
              </ViewContainer>
              <SingleButton
                buttonStyle={ styles.button }
                containerStyle={ styles.buttonContainer }
                onPress={ this.onSignOutPress }
                text="Sign Out"
              />
            </ViewContainer>
          </ViewContainer>
        </ViewContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    alignItems: 'flex-start',
  },
  disabledButtonText: {
    color: colors.darkGrey,
  },
  logo: {
    resizeMode: 'contain',
    width: 100,
  },
  rowContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    flex: 8,
  },
  imageContainer: {
    justifyContent: 'center'
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    flex: 4,
    justifyContent: 'center',
  },
  menuContainer: {
    backgroundColor: colors.pureWhite,
    flex: 6,
  }
})
