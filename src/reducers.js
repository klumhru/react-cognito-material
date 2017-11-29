import { CognitoUserPool } from 'amazon-cognito-identity-js'

import * as actions from './actions'

const cognitoStateInit = {
  registering: false,
  registered: false,
  signingIn: false,
  signedIn: false,
}

export default (state = cognitoStateInit, action) => {
  switch (action.type) {
    case actions.COGNITO_LOGIN: {
      return {
        ...state,
        signingIn: true,
      }
    }
    case actions.COGNITO_RESET_PASSWORD_RESTART: {
      return {
        ...state,
        verificationCodeSent: false,
        sendVerificationCodeError: '',
        resetPasswordError: '',
      }
    }
    case actions.COGNITO_RESET_PASSWORD: {
      return {
        ...state,
        resettingPassword: true,
        resetPasswordError: '',
      }
    }
    case actions.COGNITO_RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        resettingPassword: false,
        passwordResetSuccessful: true,
      }
    }
    case actions.COGNITO_RESET_PASSWORD_FAILURE: {
      return {
        ...state,
        resettingPassword: false,
        passwordResetSuccessful: false,
        resetPasswordError: action.error.message,
      }
    }
    case actions.COGNITO_SEND_VERIFICATION_CODE: {
      return {
        ...state,
        sendingVerificationCode: true,
        sendVerificationCodeError: '',
      }
    }
    case actions.COGNITO_SEND_VERIFICATION_CODE_SUCCESS: {
      return {
        ...state,
        sendingVerificationCode: false,
        verificationCodeSent: true,
      }
    }
    case actions.COGNITO_SEND_VERIFICATION_CODE_FAILURE: {
      return {
        ...state,
        sendingVerificationCode: false,
        verificationCodeSent: false,
        sendVerificationCodeError: action.error.message,
      }
    }
    case actions.COGNITO_REFRESH_CREDENTIALS: {
      return {
        ...state,
        signingIn: true,
      }
    }
    case actions.COGNITO_USER_ATTRIBUTES_SUCCESS: {
      return {
        ...state,
        userAttributes: action.attributes,
        userProfileAttributes: action.userProfileAttributes,
      }
    }
    case actions.COGNITO_LOGIN_SUCCESS: {
      return {
        ...state,
        signingIn: false,
        signedIn: true,
        user: action.user,
        session: action.session,
        creds: action.creds,
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
        signingIn: false,
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
    case actions.COGNITO_ERROR: {
      return {
        ...state,
        error: action.error,
      }
    }
    default: {
      return state
    }
  }
}
