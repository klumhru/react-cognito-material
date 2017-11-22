import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { CircularProgress } from 'material-ui/Progress'
import Icon from 'material-ui/Icon'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import { CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'
import { VerticalForm } from '../base'

import * as valid from '../validators'
import { FormStyle } from '../style'
import { cognitoSendVerificationCode, cognitoResetPassword } from '../../actions'

class EnterNewPassword extends React.Component {
  state = {
    email: '',
    verificationCode: '',
    password1: '',
    password2: '',
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }
  validEmail = () => this.state.email.length === 0 || valid.email(this.state.email)
  validVerificationCode = () => this.state.verificationCode.length > 0
  validPassword1 = () =>
    this.state.password1.length === 0
    || valid.password(this.state.password1)
  validPassword2 = () =>
    this.state.password2.length === 0
    || valid.password(this.state.password2)
  validPasswordsMatch = () => this.state.password1 === this.state.password2
  handleSendVerificationCode = () => {
    this.props.handleSendVerificationCode(this.state.email)
  }
  handleResetPassword = () => {
    this.props.handleResetPassword(this.state.verificationCode, this.state.password2)
  }
  render() {
    const {
      classes,
      resettingPassword,
      passwordResetSuccessful,
    } = this.props

    if (passwordResetSuccessful) {
      return (
        <CardContent>
          <Typography>
            <Icon className={classes.iconAlignBottom}>done</Icon> Password was changed successfully
          </Typography>
        </CardContent>
      )
    }
    return (
      <div>
        <CardContent>
          <VerticalForm>
            <TextField
              id="password1"
              type="password"
              label="New password"
              className={classes.textField}
              value={this.state.password1}
              onChange={this.handleChange('password1')}
              margin="normal"
              disabled={resettingPassword}
              fullWidth
              error={
                  !this.validPassword1()
                  || !this.validPasswordsMatch()
                  || (!!this.props.resetPasswordError && this.props.resetPasswordError.length !== 0)
                  }
            />
            <TextField
              id="password2"
              type="password"
              label="Confirm password"
              className={classes.textField}
              value={this.state.password2}
              onChange={this.handleChange('password2')}
              margin="normal"
              disabled={resettingPassword}
              fullWidth
              error={
                  !this.validPassword2()
                  || !this.validPasswordsMatch()
                  || (!!this.props.resetPasswordError && this.props.resetPasswordError.length !== 0)
                  }
            />

            <TextField
              id="verificationCode"
              label="Verification code"
              className={classes.textField}
              value={this.state.verificationCode}
              onChange={this.handleChange('verificationCode')}
              error={!this.validVerificationCode()}
              margin="normal"
              fullWidth
              type="number"
              helperText="Verification code was sent to your email address"
              disabled={resettingPassword}
            />
          </VerticalForm>
        </CardContent>
        <CardActions>
          <Grid container direction="row" justify="space-around">
            <div className={classes.buttonLoadingWrapper}>
              <Button
                raised
                color="primary"
                onClick={this.handleResetPassword}
                disabled={resettingPassword}
              >
                { resettingPassword ?
                     'Changing password'
                     :
                     'Change password'
                  }
              </Button>
              { resettingPassword && <CircularProgress size={24} className={classes.buttonProgress} /> }
            </div>
          </Grid>
        </CardActions>
      </div>
    )
  }
}

EnterNewPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSendVerificationCode: PropTypes.func.isRequired,
  handleResetPassword: PropTypes.func.isRequired,
  resettingPassword: PropTypes.bool,
  resetPasswordError: PropTypes.string.isRequired,
  passwordResetSuccessful: PropTypes.bool,
}

EnterNewPassword.defaultProps = {
  resettingPassword: false,
  passwordResetSuccessful: false,
}

const component = withStyles(FormStyle)(EnterNewPassword)

const mapStateToProps = (state) => ({
  sendingVerificationCode: state.cognito.sendingVerificationCode,
  verificationCodeSent: state.cognito.verificationCodeSent,
  resettingPassword: state.cognito.resettingPassword,
  passwordResetSuccessful: state.cognito.passwordResetSuccessful,
  resetPasswordError: state.cognito.resetPasswordError ? state.cognito.resetPasswordError.message : '',
})

const mapDispatchToProps = (dispatch) => ({
  handleSendVerificationCode: (email) => dispatch(cognitoSendVerificationCode(email)),
  handleResetPassword: (verificationCode, newPassword) => dispatch(cognitoResetPassword(verificationCode, newPassword)),
})

export default connect(mapStateToProps, mapDispatchToProps)(component)
