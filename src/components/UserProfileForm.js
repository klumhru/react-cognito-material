import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Typography from 'material-ui/Typography'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import { withStyles } from 'material-ui/styles'
import { FormStyle } from './style'
import { cognitoUserAttributes } from '../actions'
import { UserProfileActions } from '.'

class UserProfileForm extends React.Component {
  componentDidMount = () => {
    this.props.dispatch(cognitoUserAttributes())
  }
  render() {
    const {
      classes,
      signedIn,
    } = this.props
    const userAttributes = this.props.userAttributes
      .filter((attribute) =>
        this.props.userProfileAttributes.includes(attribute.getName()))
    return (
      <Card className={classes.authForm}>
        {
        signedIn ?
          <div>
            <CardHeader
              title="Profile"
            />
            { userAttributes != null ?
              <CardContent>
                { userAttributes.map((attribute) =>
                  <Typography key={attribute.getName()}>{ attribute.getValue() }</Typography>)
                }
              </CardContent>
            :
              <CardContent>
                Loading...
              </CardContent>
            }
            <CardActions>
              <UserProfileActions />
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
}

UserProfileForm.propTypes = {
  classes: PropTypes.object.isRequired,
  signedIn: PropTypes.bool,
  userAttributes: PropTypes.array,
  userProfileAttributes: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
}

UserProfileForm.defaultProps = {
  signedIn: false,
  userAttributes: [],
  userProfileAttributes: [],
}

export const component = withStyles(FormStyle)(UserProfileForm)

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
  signedIn: state.cognito.signedIn,
  userAttributes: state.cognito.userAttributes,
  userProfileAttributes: state.cognito.userProfileAttributes,
})

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(component)
