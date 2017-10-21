import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { VerticalForm } from './base'
import { FormStyle } from './style'

class VerifyEmailForm extends React.Component {
  state = {
    email: '',
    code: '',
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }
  handleResend = () => {
    console.debug('handleResend', this.state)
    this.props.handleResend(this.state)
  }
  handleConfirm = () => {
    console.debug('handleConfirm', this.state)
    this.props.handleConfirm(this.state)
  }
  render() {
    const { classes } = this.props
    return (
      <Card>
        <CardHeader
          title="Verify email"
        />
        <CardContent>
          <VerticalForm>
            <TextField
              id="email"
              label="Email"
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin="normal"
            />
            <TextField
              id="code"
              label="Code"
              className={classes.textField}
              value={this.state.code}
              onChange={this.handleChange('code')}
              margin="normal"
            />
          </VerticalForm>
        </CardContent>
        <CardActions>
          <Grid container direction="row" justify="space-around">
            <Button color="accent" onClick={this.handleResend}>
              Resend
            </Button>
            <Button raised color="primary" onClick={this.handleConfirm}>
              Confirm
            </Button>
          </Grid>
        </CardActions>
      </Card>
    )
  }
}

VerifyEmailForm.propTypes = {
  handleResend: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  // dispatch: PropTypes.func,
}

VerifyEmailForm.defaultProps = {
  // dispatch: () => {},
}

export default withStyles(FormStyle)(VerifyEmailForm)
