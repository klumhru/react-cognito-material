import React from 'react'
import ReactDOM from 'react-dom'
import MFARecoveryForm from './MFARecoveryForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<MFARecoveryForm />, div)
})
