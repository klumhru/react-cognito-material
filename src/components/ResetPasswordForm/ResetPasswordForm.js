import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import Card, { CardHeader } from 'material-ui/Card'

import { FormStyle } from '../style'
import { EnterEmail, EnterNewPassword } from './'

class ResetPasswordForm extends React.Component {
  state = {
  }
  render() {
    const {
      verificationCodeSent,
    } = this.props
    return (
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
  }
}

ResetPasswordForm.propTypes = {
  verificationCodeSent: PropTypes.bool,
}

ResetPasswordForm.defaultProps = {
  verificationCodeSent: false,
}

const component = withStyles(FormStyle)(ResetPasswordForm)

const mapStateToProps = (state) => ({
  verificationCodeSent: state.cognito.verificationCodeSent,
})


export default connect(mapStateToProps)(component)
