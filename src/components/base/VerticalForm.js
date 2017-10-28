import React from 'react'
import PropTypes from 'prop-types'

import Grid from 'material-ui/Grid'
import { withStyles } from 'material-ui/styles'
import { FormStyle } from '../style'

const VerticalForm = (props) => {
  const { classes, children } = props
  return (
    <Grid
      container
      className={classes.verticalForm}
      alignItems="center"
      justify="center"
      direction="column"
    >
      <form>
        {children}
      </form>
    </Grid>
  )
}

VerticalForm.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
}

VerticalForm.defaultProps = {
  children: [],
}

export default withStyles(FormStyle)(VerticalForm)
