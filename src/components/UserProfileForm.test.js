import React from 'react'
import ReactDOM from 'react-dom'
import { component as UserProfileForm } from './UserProfileForm'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<UserProfileForm dispatch={() => { }} />, div)
})
