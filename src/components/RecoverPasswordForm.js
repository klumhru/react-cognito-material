import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { VerticalForm } from './base'
import { FormStyle } from './style'

class RecoverPasswordForm extends React.Component {
  state = {
    email: '',
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }
  handleSendEmail = () => {
    console.debug('handleSendEmail', this.state)
  }
  render() {
    const { classes } = this.props
    return (
      <Card>
        <CardHeader
          title="Recover password"
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
          </VerticalForm>
        </CardContent>
        <CardActions>
          <Grid container direction="row" justify="space-around">
            <Button raised color="primary" onClick={this.handleSendEmail}>
              Send email
            </Button>
          </Grid>
        </CardActions>
      </Card>
    )
  }
}

RecoverPasswordForm.propTypes = {
  classes: PropTypes.object.isRequired,
  // dispatch: PropTypes.func,
}

RecoverPasswordForm.defaultProps = {
  // dispatch: () => {},
}

export default withStyles(FormStyle)(RecoverPasswordForm)
