import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { VerticalForm } from './base'
import { FormStyle } from './style'

class MFARecoveryForm extends React.Component {
  state = {
    email: '',
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }
  handleEmailInstructions = () => {
    console.debug('handleEmailInstructions', this.state)
  }
  render() {
    const { classes } = this.props
    return (
      <Card>
        <CardHeader
          title="Recover MFA"
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
            <Button raised color="primary" onClick={this.handleEmailInstructions}>
              Email instructions
            </Button>
          </Grid>
        </CardActions>
      </Card>
    )
  }
}

MFARecoveryForm.propTypes = {
  classes: PropTypes.object.isRequired,
  // dispatch: PropTypes.func,
}

MFARecoveryForm.defaultProps = {
  // dispatch: () => {},
}

export default withStyles(FormStyle)(MFARecoveryForm)
