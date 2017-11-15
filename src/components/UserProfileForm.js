import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Tooltip from 'material-ui/Tooltip'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import { withStyles } from 'material-ui/styles'
import { FormStyle } from './style'
import { UserProfileActions } from '.'

const UserProfileForm = (props) => {
  const { classes, signedIn, user } = props
  return (
    <Card className={classes.authForm}>
      {
        signedIn ?
          <div>
            <CardHeader
              title="Profile"
            />
            <CardContent>
              <Typography>{ user.name }</Typography>
              <Typography>
                { user.email } { user.email_verified ?
                  <Tooltip id="tooltip-top-end" title="Verified" placement="top">
                    <Icon className={classes.verifyEmailIcon}>done
                    </Icon>
                  </Tooltip> :
                  <Tooltip id="tooltip-top-end" title="Not verified" placement="top">
                    <Icon className={classes.verifyEmailIcon}>error_outline
                    </Icon>
                  </Tooltip>
                }
              </Typography>
            </CardContent>
            <CardActions>
              <UserProfileActions user={user} />
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
  user: PropTypes.object.isRequired,
}

UserProfileForm.defaultProps = {
  signedIn: false,
}

const component = withStyles(FormStyle)(UserProfileForm)

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
  signedIn: state.cognito.signedIn,
  user: state.cognito.user,
})

const mapDispatchToProps = (dispatch, ownProps) => ({ // eslint-disable-line
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(component)
