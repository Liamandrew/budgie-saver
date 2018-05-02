import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import {
  RobotoText,
  RobotoTextInput
} from '../index'

export class SingleTextInputModal extends Component {
  static propTypes = {
    isValidText: PropTypes.func,
    onCancelClick: PropTypes.func,
    onConfirmClick: PropTypes.func,
    text: PropTypes.string,
    visible: PropTypes.bool
  }

  static defaultProps = {
    onCancelClick: () => {}
  }

  state = { text: '' }

  componentWillReceiveProps = (props) => {
    const { text } = props

    if (text) {
      this.setState({ text })
    }
  }

  handleTextChange = (text) => {
    this.setState({ text })
  }

  handleConfirmPress = () => {
    const { isValidText, onConfirmClick } = this.props
    const { text } = this.state
    const errArray = isValidText(text)

    if (errArray.length === 0) {
      onConfirmClick(text)
      this.setState({ text: '' })
    } else {
      Alert.alert(
        'Invalid',
        errArray[0]
      )
    }
  }

  render = () => {
    const {
      visible,
      onCancelClick
    } = this.props
    const { text } = this.state

    return (
      <Modal
        animationType={ 'slide' }
        transparent={ true }
        visible={ visible }
        onRequestClose={ onCancelClick }
      >
        <View style={ styles.backdrop } />
        <KeyboardAvoidingView
          behavior="height"
          style={ styles.container }
        >
          <View style={ styles.fieldContainer }>
            <RobotoTextInput
              value={ text }
              placeholder="Enter category name..."
              onChangeText={ (text) => this.handleTextChange(text) }
            />
          </View>
          <View style={ styles.buttonContainer } >
            <TouchableOpacity
              style= { styles.confirmButton }
              onPress={ this.handleConfirmPress }
            >
              <RobotoText style={ styles.confirmText }>Confirm</RobotoText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    )
  }
}

const { height, weight } = Dimensions.get('window')

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.7,
    backgroundColor: 'black'
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#6495ed',
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmText: {
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  fieldContainer: {
    flex: 1,
  }
})
