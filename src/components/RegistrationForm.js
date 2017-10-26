import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

import * as valid from './validators'
import { VerticalForm } from './base'
import { FormStyle } from './style'
import { cognitoRegister } from '../actions'

class RegistrationForm extends React.Component {
  state = {
    name: '',
    email: '',
    password1: '',
    password2: '',
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }
  handleRegister = () => {
    console.log('handleRegister', this.state)
    const data = {
      ...this.state,
      password: this.state.password1,
    }
  }
  validForm = () => (
    this.state.password1.length !== 0 &&
    this.validEmail() &&
    this.validPassword2() &&
    this.validPassword1() &&
    this.state.password1 === this.state.password2
  )
  validName = () => this.state.name.length === 0 || valid.name(this.state.name)
  validEmail = () => this.state.email.length === 0 || valid.email(this.state.email)
  validPassword1 = () => this.state.password1.length === 0 || valid.password(this.state.password1)
  validPassword2 = () => (
    this.state.password2.length === 0
    || (
      valid.password(this.state.password2)
      && this.state.password1 === this.state.password2
    )
  )
  render() {
    const {
      classes,
      error,
      registering,
      registered,
    } = this.props
    console.log(error.name)
    return (
      <Card className={classes.authForm}>
        <CardHeader
          title="Registration"
        />
        { registered ?
          <CardContent>
            <Typography component="h2" type="headline" gutterBottom>
              Email sent
            </Typography>
            <Typography component="p">
              Check you email and click the link to verify your email.
            </Typography>
          </CardContent>
          :
          <CardContent>
            <VerticalForm>
              <TextField
                id="name"
                label="Name"
                className={classes.textField}
                value={this.state.name}
                onChange={this.handleChange('name')}
                disabled={registering}
                margin="normal"
                error={!this.validName() || (!!error.name && error.name.length > 0)}
                fullWidth
                helperText={error.name}
              />
              <TextField
                id="email"
                label="Email"
                className={classes.textField}
                value={this.state.email}
                onChange={this.handleChange('email')}
                disabled={registering}
                margin="normal"
                error={!this.validEmail() || (!!error.email && error.email.length > 0)}
                fullWidth
                helperText={error.email}
              />
              <TextField
                id="password1"
                type="password"
                label="Password"
                className={classes.textField}
                value={this.state.password}
                onChange={this.handleChange('password1')}
                disabled={registering}
                margin="normal"
                error={!this.validPassword1() || (!!error.password && error.password.length > 0)}
                fullWidth
                helperText={error.password}
              />
              <TextField
                id="password2"
                type="password"
                label="Confirm password"
                className={classes.textField}
                value={this.state.password2}
                onChange={this.handleChange('password2')}
                disabled={registering}
                margin="normal"
                error={!this.validPassword2() || (!!error.password && error.password.length > 0)}
                fullWidth
                helperText={error.password}
              />
            </VerticalForm>
          </CardContent>
        }
        { !registered &&
          <CardActions>
            <Grid container direction="row" justify="space-around">
              <Button
                raised
                disabled={
                  !this.validForm() ||
                  registering
                }
                color="primary"
                onClick={this.handleRegister}
              >
                Register
              </Button>
            </Grid>
          </CardActions>
        }
      </Card>
    )
  }
}

RegistrationForm.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.object,
  registering: PropTypes.bool,
  registered: PropTypes.bool,
}

RegistrationForm.defaultProps = {
  error: {
    name: '',
    email: '',
    password: '',
  },
  registering: false,
  registered: false,
}

const mapStateToProps = (state) => ({
  error: state.cognito.error,
  registering: state.cognito.registering,
  registered: state.cognito.registered,
})

const mapDispatchToProps = (dispatch, ownProps) => ({ // eslint-disable-line
  handleRegister: (data) => dispatch(cognitoRegister(data)),
})

const component = withStyles(FormStyle)(RegistrationForm)
export default connect(mapStateToProps, mapDispatchToProps)(component)
