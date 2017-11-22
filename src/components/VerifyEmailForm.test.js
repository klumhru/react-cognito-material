import React from 'react'
import ReactDOM from 'react-dom'
import VerifyEmailForm from './VerifyEmailForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<VerifyEmailForm
    handleResend={() => { }}
    handleConfirm={() => { }}
  />, div)
})
