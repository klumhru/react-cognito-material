import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import { CircularProgress } from 'material-ui/Progress'
import Grid from 'material-ui/Grid'
import { CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import * as valid from '../validators'
import { FormStyle } from '../style'
import { cognitoSendVerificationCode, cognitoResetPassword } from '../../actions'

class EnterEmail extends React.Component {
  state = {
    email: '',
    verificationCode: '',
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }
  validEmail = () => this.state.email.length === 0 || valid.email(this.state.email)
  validVerificationCode = () => this.state.verificationCode.length > 0
  handleSendVerificationCode = () => {
    this.props.handleSendVerificationCode(this.state.email)
  }
  render() {
    const {
      classes,
      sendingVerificationCode,
    } = this.props
    return (
      <div>
        <CardContent>
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleChange('email')}
            error={!this.validEmail()}
            margin="normal"
            disabled={sendingVerificationCode}
            fullWidth
            type="email"
          />
        </CardContent>
        <CardActions>
          <Grid container direction="row" justify="space-around">
            <div className={classes.buttonLoadingWrapper}>
              <Button
                raised
                color="primary"
                onClick={this.handleSendVerificationCode}
                disabled={sendingVerificationCode}
              >
                { !sendingVerificationCode ?
                'Send verification code'
                :
                'Sending verification code'
              }
              </Button>
              { sendingVerificationCode && <CircularProgress size={24} className={classes.buttonProgress} /> }
            </div>
          </Grid>
        </CardActions>
      </div>
    )
  }
}

EnterEmail.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSendVerificationCode: PropTypes.func.isRequired,
  sendingVerificationCode: PropTypes.bool,
}

EnterEmail.defaultProps = {
  sendingVerificationCode: false,
}

const component = withStyles(FormStyle)(EnterEmail)

const mapStateToProps = (state) => ({
  sendingVerificationCode: state.cognito.sendingVerificationCode,
})

const mapDispatchToProps = (dispatch) => ({
  handleSendVerificationCode: (email) => dispatch(cognitoSendVerificationCode(email)),
  handleResetPassword: (verificationCode, newPassword) => dispatch(cognitoResetPassword(verificationCode, newPassword)),
})

export default connect(mapStateToProps, mapDispatchToProps)(component)
