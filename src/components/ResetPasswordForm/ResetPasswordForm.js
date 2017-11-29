import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import Card, { CardHeader } from 'material-ui/Card'

import { FormStyle } from '../style'
import { EnterEmail, EnterNewPassword } from './'

const ResetPasswordForm = ({ verificationCodeSent }) => (
  <Card>
    <CardHeader
      title="Reset password"
    />
    { !verificationCodeSent ?
      <EnterEmail />
      :
      <EnterNewPassword />
    }
  </Card>
)

ResetPasswordForm.propTypes = {
  verificationCodeSent: PropTypes.bool,
}

ResetPasswordForm.defaultProps = {
  verificationCodeSent: false,
}

const mapStateToProps = (state) => ({
  verificationCodeSent: state.cognito.verificationCodeSent,
})

export const component = withStyles(FormStyle)(ResetPasswordForm)
export default connect(mapStateToProps)(component)
