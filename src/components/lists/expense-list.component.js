import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  FlatList,
  RefreshControl,
} from 'react-native'
import {
  ExpenseRow,
  ViewContainer
} from '../index'

export class ExpenseList extends Component {
  static propTypes = {
    expenses: PropTypes.array.isRequired,
    isCalculating: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    onRefresh: PropTypes.func,
    showDetailView: PropTypes.func,
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

  keyExtractor = (expense, index) => {
    return expense.id
  }

  renderRow = (rowData) => {
    const { showDetailView } = this.props

    return (
      <ExpenseRow
        expense={ rowData.item }
        onPress={ showDetailView }
      />
    )
  }

  render() {
    const { expenses, isRefreshing, onRefresh } = this.props

    //@todo convert view to ViewContainer -- problem with the layout
    return (
      <View>
        <FlatList
          data={ expenses }
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
