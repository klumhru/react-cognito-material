import React from 'react'
import ReactDOM from 'react-dom'
import { mount } from 'enzyme'

import { component as LoginForm } from './LoginForm'

const emptyFunc = () => {}
const emptyProps = {
  handleForgot: emptyFunc,
  handleLogin: emptyFunc,
  handleSignout: emptyFunc,
  error: '',
}

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<LoginForm {...emptyProps} />, div)
})

test('updates state on input', () => {
  const div = document.createElement('div')
  const form = mount(<LoginForm {...emptyProps} />, div)
  expect(form.find('TextField').length).toEqual(2)
  expect(form.find('Button').length).toEqual(2)
})
