import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Picker,
  Platform,
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native'

export class PickerComponent extends Component {
  static propTypes = {
    onConfirmPress: PropTypes.func,
    pickerContainerStyle: ViewPropTypes.style,
    pickerItems: PropTypes.array,
    selected: PropTypes.string,
  }

  state = {
    selectedItem: null,
  }

  componentWillMount = () => {
    const { selected } = this.props

    this.setState({ selectedItem: selected })
  }

  handleValueChange = (itemValue, itemIndex) => {
    const { onConfirmPress } = this.props

    this.setState({ selectedItem: itemValue })
    if (Platform.OS !== 'ios') {
      onConfirmPress(itemValue)
    }
  }

  renderPickerItems = (items) => {
    return items.map((item, index) =>
      <Picker.Item
        label={ item.name }
        value={ item.id }
        key={ index }
      />
    )
  }

  render = () => {
    const { pickerContainerStyle, pickerItems, selected }  = this.props
    const { selectedItem } = this.state

    return (
      <View style={ pickerContainerStyle } >
        <Picker
          selectedValue={ selectedItem }
          onValueChange={ (itemValue, itemIndex) => this.handleValueChange(itemValue, itemIndex) }
        >
          { this.renderPickerItems(pickerItems) }
        </Picker>
      </View>
    )
  }
}

const styles = StyleSheet.create({

})
