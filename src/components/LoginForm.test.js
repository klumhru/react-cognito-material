import React from 'react'
import ReactDOM from 'react-dom'
import { component as LoginForm } from './LoginForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<LoginForm
    handleForgot={() => {}}
    handleLogin={() => {}}
    handleSignout={() => {}}
    error=""
  />, div)
})
