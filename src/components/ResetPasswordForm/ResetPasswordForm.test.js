import React from 'react'
import { Provider } from 'react-redux'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import ResetPasswordForm from './'

configure({ adapter: new Adapter() })

describe('<ResetPasswordForm />', () => {
  const div = document.createElement('div')

  it('renders without crashing', () => {
    const store = configureMockStore()(
      {
        cognito: {
          verificationCodeSent: false,
        },
      },
    )
    mount(
      <Provider store={store}>
        <ResetPasswordForm />
      </Provider>, div)
  })

  it('shows enter email when verification code has not been sent', () => {
    const store = configureMockStore()(
      {
        cognito: {
          verificationCodeSent: false,
        },
      },
    )
    const wrapper = mount(
      <Provider store={store}>
        <ResetPasswordForm />
      </Provider>,
      div,
    )

    expect(wrapper.find('EnterEmail').length).toBe(1)
  })

  it('shows enter verification code and new password after verification code has been sent', () => {
    const store = configureMockStore()(
      {
        cognito: {
          verificationCodeSent: true,
        },
      },
    )

    const wrapper = mount(
      <Provider store={store}>
        <ResetPasswordForm />
      </Provider>,
      div,
    )

    expect(wrapper.find('EnterEmail').length).toBe(0)
  })
})
