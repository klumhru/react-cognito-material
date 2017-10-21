import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Grid from 'material-ui/Grid'
import Card, { CardMedia, CardHeader, CardContent, CardActions } from 'material-ui/Card'
import Button from 'material-ui/Button'

import { VerticalForm } from './base'
import { FormStyle } from './style'

class MFAConfigForm extends React.Component {
  state = {
    code1: '',
    code2: '',
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
          title="Configure MFA"
          subheader="Capture the image with your Virtual MFA device. Type in two consecutive codes."
        />
        <CardMedia
          className={classes.media}
          image="https://material-ui-1dab0.firebaseapp.com/static/images/cards/contemplative-reptile.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <VerticalForm>
            <TextField
              id="code1"
              label="First code"
              className={classes.textField}
              value={this.state.code1}
              onChange={this.handleChange('code1')}
              margin="normal"
            />
            <TextField
              id="code2"
              label="Second code"
              className={classes.textField}
              value={this.state.code2}
              onChange={this.handleChange('code2')}
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

MFAConfigForm.propTypes = {
  classes: PropTypes.object.isRequired,
  // dispatch: PropTypes.func,
}

MFAConfigForm.defaultProps = {
  // dispatch: () => {},
}

export default withStyles(FormStyle)(MFAConfigForm)
