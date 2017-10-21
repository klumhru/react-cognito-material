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
    console.debug('handleRegister', this.state)
    const data = {
      ...this.state,
      password: this.state.password1,
    }
    this.props.handleRegister(data)
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
    const { classes } = this.props
    console.log('this.props', this.props)
    return (
      <Card className={classes.authForm}>
        <CardHeader
          title="Registration"
        />
        { this.props.registered ?
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
                disabled={this.props.registering}
                margin="normal"
                error={!this.validName() || (!!this.props.error.name && this.props.error.name.length > 0)}
                fullWidth
                helperText={this.props.error.name}
              />
              <TextField
                id="email"
                label="Email"
                className={classes.textField}
                value={this.state.email}
                onChange={this.handleChange('email')}
                disabled={this.props.registering}
                margin="normal"
                error={!this.validEmail() || (!!this.props.error.email && this.props.error.email.length > 0)}
                fullWidth
                helperText={this.props.error.email}
              />
              <TextField
                id="password1"
                type="password"
                label="Password"
                className={classes.textField}
                value={this.state.password}
                onChange={this.handleChange('password1')}
                disabled={this.props.registering}
                margin="normal"
                error={!this.validPassword1() || (!!this.props.error.password && this.props.error.password.length > 0)}
                fullWidth
                helperText={this.props.error.password}
              />
              <TextField
                id="password2"
                type="password"
                label="Confirm password"
                className={classes.textField}
                value={this.state.password2}
                onChange={this.handleChange('password2')}
                disabled={this.props.registering}
                margin="normal"
                error={!this.validPassword2() || (!!this.props.error.password && this.props.error.password.length > 0)}
                fullWidth
                helperText={this.props.error.password}
              />
            </VerticalForm>
          </CardContent>
        }
        { !this.props.registered &&
          <CardActions>
            <Grid container direction="row" justify="space-around">
              <Button
                raised
                disabled={
                  !this.validForm() ||
                  this.props.registering
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
  handleRegister: (userFactory, data) => dispatch(cognitoRegister(userFactory, data)),
})

const component = withStyles(FormStyle)(RegistrationForm)
export default connect(mapStateToProps, mapDispatchToProps)(component)
