import { CognitoUserPool } from 'amazon-cognito-identity-js'

import * as actions from './actions'

const cognitoStateInit = {
  registering: false,
  registered: false,
  signedIn: false,
}

export default (state = cognitoStateInit, action) => {
  switch (action.type) {
    case actions.COGNITO_LOGGING_IN: {
      return {
        ...state,
        loggingIn: true,
      }
    }
    case actions.COGNITO_LOGIN_SUCCESS: {
      return {
        ...state,
        loggingIn: false,
        signedIn: true,
        user: action.user,
        session: action.session,
      }
    }
    case actions.COGNITO_LOGIN_FAILURE: {
      const error = {
        email: '',
        password: '',
        name: '',
      }
      if (action.error.message && action.error.message.toLowerCase().indexOf('password') > -1) {
        error.password = action.error.message
      }
      if (action.error.message && action.error.message.toLowerCase().indexOf('email') > -1) {
        error.email = action.error.message
      }
      error.message = action.error.message
      return {
        ...state,
        loggingIn: false,
        error,
      }
    }
    case actions.COGNITO_CONFIGURE: {
      const poolData = {
        UserPoolId: action.UserPoolId,
        ClientId: action.ClientId,
      }
      return {
        ...state,
        poolData,
        userPool: new CognitoUserPool(poolData),
      }
    }
    case actions.COGNITO_REGISTERING: {
      return {
        ...state,
        registering: true,
        registered: false,
      }
    }
    case actions.COGNITO_REGISTER: {
      return {
        ...state,
        data: {
          email: action.email,
          password: action.password,
        },
        registering: false,
        registered: false,
      }
    }
    case actions.COGNITO_REGISTER_SUCCESS: {
      return {
        ...state,
        registering: false,
        registered: true,
      }
    }
    case actions.COGNITO_REGISTER_FAILURE: {
      const error = {
        email: '',
        password: '',
        name: '',
      }
      if (action.error.message && action.error.message.toLowerCase().indexOf('password') > -1) {
        error.password = action.error.message
      }
      if (action.error.message && action.error.message.toLowerCase().indexOf('email') > -1) {
        error.email = action.error.message
      }
      return {
        ...state,
        error,
        registered: false,
        registering: false,
      }
    }
    case actions.COGNITO_SIGNOUT_SUCCESS: {
      return {
        ...cognitoStateInit,
        userPool: state.userPool,
      }
    }
    case actions.COGNITO_SIGNOUT_FAILURE: {
      return {
        ...cognitoStateInit,
        userPool: state.userPool,
      }
    }
    default: {
      return state
    }
    case actions.COGNITO_ERROR: {
      return {
        ...state,
        error,
      }
    }
  }
}
