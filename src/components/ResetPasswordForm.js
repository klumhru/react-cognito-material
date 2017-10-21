import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { VerticalForm } from './base'
import { FormStyle } from './style'

class ResetPasswordForm extends React.Component {
  state = {
    password1: '',
    password2: '',
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }
  handleReset = () => {
    console.debug('handleReset', this.state)
    this.props.handleReset(this.state)
  }
  render() {
    const { classes } = this.props
    return (
      <Card>
        <CardHeader
          title="Reset password"
        />
        <CardContent>
          <VerticalForm>
            <TextField
              id="password1"
              type="password"
              label="New password"
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange('password1')}
              margin="normal"
            />
            <TextField
              id="password2"
              type="password"
              label="Confirm password"
              className={classes.textField}
              value={this.state.password2}
              onChange={this.handleChange('password2')}
              margin="normal"
            />
          </VerticalForm>
        </CardContent>
        <CardActions>
          <Grid container direction="row" justify="space-around">
            <Button raised color="primary" onClick={this.handleReset}>
              Confirm
            </Button>
          </Grid>
        </CardActions>
      </Card>
    )
  }
}

ResetPasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleReset: PropTypes.func.isRequired,
}

export default withStyles(FormStyle)(ResetPasswordForm)
