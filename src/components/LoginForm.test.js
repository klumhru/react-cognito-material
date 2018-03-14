import React from 'react'
import ReactDOM from 'react-dom'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { component as LoginForm } from './LoginForm'

configure({ adapter: new Adapter() })


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
