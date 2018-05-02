import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore } from 'redux-persist'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { ViewContainer } from './components'
import { BudgetToolStackNavigator } from './navigation'
import reducers from './reducers'

const middlewares = [thunkMiddleware]

if (__DEV__) {
  middlewares.push(createLogger())
}

const loggerMiddleware = createLogger()
const store = createStore(
  reducers,
  applyMiddleware(...middlewares)
)

const persistor = persistStore(store)

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={ <ViewContainer /> }
          persistor={ persistor }
        >
          <BudgetToolStackNavigator />
        </PersistGate>
      </Provider>
    )
  }
}
// @todo: remove
// process.env.REACT_NAV_LOGGING = true
console.ignoredYellowBox = ['Remote debugger'];
export default App
