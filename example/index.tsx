import * as React from 'react'
import { render } from 'react-dom'

import './assets/styles/main.css'
import App from './App'

render(<App />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept()
}
