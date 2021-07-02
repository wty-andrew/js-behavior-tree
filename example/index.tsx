import * as React from 'react'
import { render } from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'

import App from './App'

render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept()
}
