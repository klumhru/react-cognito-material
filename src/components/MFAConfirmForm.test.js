import React from 'react'
import ReactDOM from 'react-dom'
import MFAConfirmForm from './MFAConfirmForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<MFAConfirmForm />, div)
})
