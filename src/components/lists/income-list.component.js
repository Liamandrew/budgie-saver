import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  FlatList,
  RefreshControl,
} from 'react-native'
import {
  IncomeRow,
  ViewContainer
} from '../index'

export class IncomeList extends Component {
  static propTypes = {
    incomes: PropTypes.array.isRequired,
    isCalculating: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    onRefresh: PropTypes.func,
    showDetailView: PropTypes.func
  }

  static defaultProps = {
    isCalculating: false,
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isCalculating) {
      return false
    }
    return true
  }

  keyExtractor = (income, index) => {
    return income.id
  }

  renderRow = (rowData) => {
    const { showDetailView } = this.props

    return (
      <IncomeRow
        income={ rowData.item }
        onPress={ showDetailView }
      />
    )
  }

  render() {
    const { incomes, isRefreshing, onRefresh } = this.props
    //@todo convert view to ViewContainer -- problem with the layout
    return (
      <View>
        <FlatList
          data={ incomes }
          renderItem={ this.renderRow }
          keyExtractor={ this.keyExtractor }
          refreshControl={
            <RefreshControl
              refreshing={ isRefreshing }
              onRefresh={ onRefresh }
            />
          }
        />
      </View>
    )
  }
}
