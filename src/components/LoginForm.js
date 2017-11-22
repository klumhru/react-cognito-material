import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import * as valid from './validators'
import { VerticalForm } from './base'
import { FormStyle } from './style'
import { cognitoLogin, cognitoSignout } from '../actions'

class LoginForm extends React.Component {
  state = {
    email: '',
    password: '',
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }
  handleSignout = () => {
    this.props.handleSignout()
  }
  handleForgot = () => {
    this.props.handleForgot(this.state)
  }
  handleLogin = () => {
    this.props.handleLogin(this.state)
  }
  validEmail = () => this.state.email.length === 0 || valid.email(this.state.email)
  validPassword = () => this.state.password.length === 0 || valid.password(this.state.password1)
  validForm = () => (
    this.validEmail() &&
    this.validPassword() &&
    this.state.password.length !== 0 &&
    this.state.email.length !== 0
  )
  render() {
    const { classes } = this.props
    return (
      <Card className={classes.authForm}>
        <CardHeader
          title="Login"
        />
        {
          !this.props.signedIn ?
            <div>
              <CardContent>
                <VerticalForm>
                  <TextField
                    id="email"
                    label="Email"
                    className={classes.textField}
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                    error={!this.validEmail()}
                    margin="normal"
                    disabled={this.props.signingIn}
                    fullWidth
                  />
                  <TextField
                    id="password"
                    type="password"
                    label="Password"
                    className={classes.textField}
                    value={this.state.password}
                    onChange={this.handleChange('password')}
                    margin="normal"
                    error={!this.validPassword() || (!!this.props.error && this.props.error.length !== 0)}
                    disabled={this.props.signingIn}
                    fullWidth
                    helperText={this.props.error}
                  />
                </VerticalForm>
              </CardContent>
              <CardActions>
                <Grid container direction="row" justify="space-around">
                  <Button color="accent" onClick={this.handleForgot}>
                  Forgot?
                  </Button>
                  <Button
                    raised
                    color="primary"
                    onClick={() => this.handleLogin()}
                    disabled={!this.validForm()}
                  >
                  Login
                  </Button>
                </Grid>
              </CardActions>
            </div>
          :
            <CardContent>
              <Button color="accent" raised onClick={this.handleSignout}>
              Sign out
              </Button>
            </CardContent>
        }
      </Card>
    )
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleForgot: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  signingIn: PropTypes.bool,
  signedIn: PropTypes.bool,
  handleSignout: PropTypes.func.isRequired,
  // dispatch: PropTypes.func,
  error: PropTypes.string.isRequired,
}

LoginForm.defaultProps = {
  // dispatch: () => {},
  signedIn: false,
  signingIn: false,
}

export const component = withStyles(FormStyle)(LoginForm)

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
  signingIn: state.cognito.signingIn,
  signedIn: state.cognito.signedIn,
  error: state.cognito.error ? state.cognito.error.message : '',
})

const mapDispatchToProps = (dispatch) => ({
  handleLogin: (data) => dispatch(cognitoLogin(data)),
  handleSignout: () => dispatch(cognitoSignout()),
  handleForgot: () => {}, // TODO
})

export default connect(mapStateToProps, mapDispatchToProps)(component)
