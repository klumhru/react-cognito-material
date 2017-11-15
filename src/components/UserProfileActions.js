import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import { FormStyle } from './style'
import { cognitoSignout } from '../actions'

class UserProfileActions extends React.Component {
  handleSignout = () => {
    this.props.handleSignout()
  }
  render() {
    return (
      <List>
        <Divider />
        <ListItem button>
          <ListItemText primary="Sign out from everywhere" onClick={this.handleSignout} />
        </ListItem>
      </List>
    )
  }
}

UserProfileActions.propTypes = {
  handleSignout: PropTypes.func.isRequired,
}

UserProfileActions.defaultProps = {
}

const component = withStyles(FormStyle)(UserProfileActions)

const mapStateToProps = (state, ownProps) => ({ // eslint-disable-line
})

const mapDispatchToProps = (dispatch) => ({
  handleSignout: () => dispatch(cognitoSignout(true)),
})

export default connect(mapStateToProps, mapDispatchToProps)(component)
