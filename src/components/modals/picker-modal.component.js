import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
} from 'react-native'
import {
  BackdropContainer,
  PickerComponent,
  TextContainer,
  SingleButton,
  ViewContainer
} from '../index'

export class PickerModal extends Component {
  static propTypes = {
    bottomBackdropContainerStyle: ViewPropTypes.style,
    buttonContainerStyle: ViewPropTypes.style,
    cancelButtonContainerStyle: ViewPropTypes.style,
    cancelButtonText: PropTypes.string,
    cancelButtonTextStyle: Text.propTypes.style,
    confirmButtonContainerStyle: ViewPropTypes.style,
    confirmButtonText: PropTypes.string,
    confirmButtonTextStyle: Text.propTypes.style,
    containerStyle: ViewPropTypes.style,
    modalContainerStyle: ViewPropTypes.style,
    onCancelPress: PropTypes.func,
    onConfirm: PropTypes.func,
    pickerContainerStyle: ViewPropTypes.style,
    pickerItems: PropTypes.array,
    titleContainerStyle: ViewPropTypes.style,
    titleText: PropTypes.string,
    titleTextStyle: Text.propTypes.style,
    topBackdropContainerStyle: ViewPropTypes.style,
    selected: PropTypes.string,
    visible: PropTypes.bool,
  }

  static defaultProps = {
    onCancelPress: () => {}
  }

  state = {
    selectedItem: null,
  }

  componentWillMount = () => {
    const { selected } = this.props

    this.setState({ selectedItem: selected })
  }

  handleConfirmPress = () => {
    const { onConfirmPress } = this.props
    const { selectedItem } = this.state 

    onConfirmPress(selectedItem)
  }

  handleValueChange = (itemValue, itemIndex) => {
    this.setState({ selectedItem: itemValue })
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
    const {
      bottomBackdropContainerStyle,
      buttonContainerStyle,
      cancelButtonContainerStyle,
      cancelButtonText,
      cancelButtonTextStyle,
      confirmButtonContainerStyle,
      confirmButtonText,
      confirmButtonTextStyle,
      containerStyle,
      modalContainerStyle,
      onCancelPress,
      pickerContainerStyle,
      pickerItems,
      titleContainerStyle,
      titleText,
      titleTextStyle,
      topBackdropContainerStyle,
      visible,
    } = this.props
    const { selectedItem } = this.state

    return (
      <Modal
        animationType={ 'fade' }
        transparent
        visible={ visible }
        onRequestClose={ onCancelPress }
      >
        <ViewContainer containerStyle={ containerStyle } >
          <BackdropContainer containerStyle={ [styles.topBackdropContainer, topBackdropContainerStyle] } />
          <View style={ [styles.modalContainer, modalContainerStyle] } >
            <View style={ [styles.buttonContainer, buttonContainerStyle] } >
              <SingleButton
                buttonStyle={ [styles.cancelButtonContainer, cancelButtonContainerStyle] }
                onPress={ onCancelPress }
                text={ cancelButtonText }
                textStyle={ [styles.cancelButtonText, cancelButtonTextStyle] }
              />
              <TextContainer
                containerStyle={ [styles.titleContainer, titleContainerStyle] }
                text={ titleText }
                textStyle={ [styles.titleText, titleTextStyle] }
              />
              <SingleButton
                buttonStyle={ [styles.confirmButtonContainer, confirmButtonContainerStyle] }
                onPress={ this.handleConfirmPress }
                text={ confirmButtonText }
                textStyle={ [styles.confirmButtonText, confirmButtonTextStyle] }
              />
            </View>
            <View style={ [styles.pickerContainer, pickerContainerStyle] } >
              <Picker
                selectedValue={ selectedItem }
                onValueChange={ (itemValue, itemIndex) => this.handleValueChange(itemValue, itemIndex) }
              >
                { this.renderPickerItems(pickerItems) }
              </Picker>
            </View>
          </View>
          <BackdropContainer containerStyle={ [styles.bottomBackdropContainer, bottomBackdropContainerStyle] } />
        </ViewContainer>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  topBackdropContainer: {
    flex: 4,
  },
  bottomBackdropContainer: {
    flex: 3,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonContainer: {
    flex: 2,
  },
  cancelButtonText: {
    textAlign: 'center'
  },
  confirmButtonContainer: {
    flex: 2,
  },
  confirmButtonText: {
    textAlign: 'center'
  },
  modalContainer: {
    flex: 4,
    backgroundColor: 'white',
    opacity: 1
  },
  titleContainer: {
    flex: 4,
  },
  titleText: {
    textAlign: 'center'
  },
})
