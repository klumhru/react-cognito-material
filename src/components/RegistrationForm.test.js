import React from 'react'
import ReactDOM from 'react-dom'
import { component as RegistrationForm } from './RegistrationForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<RegistrationForm dispatch={() => {}} />, div)
})
