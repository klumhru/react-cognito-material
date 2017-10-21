import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import { withStyles } from 'material-ui/styles'
import { FormStyle } from './style'

const UserProfileForm = (props) => {
  const { classes, signedIn } = props
  return (
    <Card className={classes.authForm}>
      {
        signedIn ?
        <div>
          <CardHeader
            title="Profile"
          />
          <CardContent>
            Content
          </CardContent>
          <CardActions>
            Actions
          </CardActions>
        </div>
        :
        <div>
          <CardHeader
            title="Profile"
          />
          <CardContent>
            You must be signed in to update your profile
          </CardContent>
        </div>
      }
    </Card>
  )
}

UserProfileForm.propTypes = {
  classes: PropTypes.object.isRequired,
  signedIn: PropTypes.bool,
}

UserProfileForm.defaultProps = {
  signedIn: false,
}

const component = withStyles(FormStyle)(UserProfileForm)

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
  signedIn: state.cognito.signedIn,
})

const mapDispatchToProps = (dispatch, ownProps) => ({ // eslint-disable-line
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(component)
