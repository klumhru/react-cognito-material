import React from 'react'
import ReactDOM from 'react-dom'
import { component as UserProfileActions } from './UserProfileActions'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<UserProfileActions handleSignout={() => {}} />, div)
})
