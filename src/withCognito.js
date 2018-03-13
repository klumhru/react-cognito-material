import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export const withCognito = (WrappedComponent) => {
  const ReturnComponent = (props) => <WrappedComponent cognito={props.cognito} {...props} />
  ReturnComponent.propTypes = {
    cognito: PropTypes.object.isRequired,
  }
  const mapStateToProps = (state) => ({
    cognito: state.cognito,
  })
  return connect(mapStateToProps)(ReturnComponent)
}

export default withCognito
