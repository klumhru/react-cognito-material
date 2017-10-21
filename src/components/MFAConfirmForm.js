import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { VerticalForm } from './base'
import { FormStyle } from './style'

class MFAConfirmForm extends React.Component {
  state = {
    code: '',
  }
  handleChange = (name) => (event) => {
    this.setState({
      [name]: event.target.value,
    })
  }
  handleConfirm = () => {
    console.debug('handleConfirm', this.state)
  }
  render() {
    const { classes } = this.props
    return (
      <Card>
        <CardHeader
          title="Confirm MFA"
        />
        <CardContent>
          <VerticalForm>
            <TextField
              id="code"
              label="MFA code"
              className={classes.textField}
              value={this.state.mfa}
              onChange={this.handleChange('code')}
              margin="normal"
            />
          </VerticalForm>
        </CardContent>
        <CardActions>
          <Grid container direction="row" justify="space-around">
            <Button raised color="primary" onClick={this.handleConfirm}>
              Confirm
            </Button>
          </Grid>
        </CardActions>
      </Card>
    )
  }
}

MFAConfirmForm.propTypes = {
  classes: PropTypes.object.isRequired,
  // dispatch: PropTypes.func,
}

MFAConfirmForm.defaultProps = {
  // dispatch: () => {},
}

export default withStyles(FormStyle)(MFAConfirmForm)
