import React from 'react'
import ReactDOM from 'react-dom'
import RecoverPasswordForm from './RecoverPasswordForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<RecoverPasswordForm />, div)
})
