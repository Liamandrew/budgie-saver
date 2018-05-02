import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  FormInputField,
  ViewContainer,
} from '../index'
import { colors } from '../../utils'

const appbar_height = Platform.OS === 'ios' ? 44 : 56
const statusbar_height = Platform.OS === 'ios' ? 20 : 0

export class SearchNavigationHeader extends Component {
  static propTypes = {
    onAddPressed: PropTypes.func,
    onCancelPressed: PropTypes.func,
    onMenuButtonPressed: PropTypes.func,
    onSearchStringChange: PropTypes.func,
    searchString: PropTypes.string,
  }

  static defaultProps = {
    searchString: '',
  }

  state = {
    isSearching: false,
  }

  handleSearchButtonPress = () => {
    this.setState({ isSearching: true })
  }

  handleCancelButtonPress = () => {
    const { onCancelPressed } = this.props

    onCancelPressed()
    this.setState({ isSearching: false })
  }

  render = () => {
    const {
      getSearchString,
      onAddPressed,
      onMenuButtonPressed,
      onSearchStringChange,
      searchString,
    } = this.props
    const { isSearching } = this.state

    return (
      <View style={ styles.container }>
        <ViewContainer containerStyle={ styles.menuButtonContainer }>
          <TouchableOpacity
            onPress={ onMenuButtonPressed }
          >
            <ViewContainer containerStyle={ { justifyContent: 'center' }}>
              <Image
                source={ require('../../assets/images/ic_menu.png') }
                style={ { tintColor: colors.lightNavy } }
              />
            </ViewContainer>
          </TouchableOpacity>
        </ViewContainer>
        {isSearching ?
          <ViewContainer containerStyle={ styles.searchContainer } >
            <FormInputField
              containerStyle={ styles.searchFieldContainer }
              fieldInputStyle={ { flex: 1 } }
              onChange={ onSearchStringChange }
              placeholder="Search"
              value={ searchString }
            />
            <ViewContainer containerStyle={ styles.rightButtonContainer }>
              <TouchableOpacity
                onPress={ this.handleCancelButtonPress }
              >
                <ViewContainer containerStyle={ { justifyContent: 'center' }}>
                  <Image
                    source={ require('../../assets/images/ic_cancel.png') }
                    style={ { tintColor: colors.smoke } }
                  />
                </ViewContainer>
              </TouchableOpacity>
            </ViewContainer>
          </ViewContainer>
        :
          <ViewContainer containerStyle={ styles.searchContainer } >
            <ViewContainer containerStyle={ { flex: 2 } }/>
            <ViewContainer containerStyle={ styles.rightButtonContainer }>
              <ViewContainer containerStyle={ { alignItems: 'flex-end' } }>
                <TouchableOpacity
                  onPress={ this.handleSearchButtonPress }
                >
                  <ViewContainer containerStyle={ { justifyContent: 'center' }}>
                    <Image
                      source={ require('../../assets/images/ic_search.png') }
                      style={ { tintColor: colors.lightNavy } }
                    />
                  </ViewContainer>
                </TouchableOpacity>
              </ViewContainer>
              <ViewContainer containerStyle={ { alignItems: 'flex-end' } } >
                <TouchableOpacity
                  onPress={ onAddPressed }
                >
                  <ViewContainer containerStyle={ { justifyContent: 'center' }}>
                    <Image
                      source={ require('../../assets/images/ic_add.png') }
                      style={ { tintColor: colors.lightNavy } }
                    />
                  </ViewContainer>
                </TouchableOpacity>
              </ViewContainer>
            </ViewContainer>
          </ViewContainer>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.pureWhite,
    paddingTop: statusbar_height,
    height: statusbar_height + appbar_height,
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
  },
  menuButtonContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 15,
  },
  rightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20
  },
  searchFieldContainer: {
    flex: 3,
  },
  searchContainer: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
