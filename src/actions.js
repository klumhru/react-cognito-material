export const COGNITO_CONFIGURE = 'COGNITO_CONFIGURE'
export const COGNITO_REGISTER = 'COGNITO_REGISTER'
export const COGNITO_REGISTERED = 'COGNITO_REGISTERED'
export const COGNITO_REGISTERING = 'COGNITO_REGISTERING'
export const COGNITO_REGISTER_SUCCESS = 'COGNITO_REGISTER_SUCCESS'
export const COGNITO_REGISTER_FAILURE = 'COGNITO_REGISTER_FAILURE'
export const COGNITO_REFRESH_CREDENTIALS = 'COGNITO_REFRESH_CREDENTIALS'
export const COGNITO_LOGIN = 'COGNITO_LOGIN'
export const COGNITO_LOGGING_IN = 'COGNITO_LOGGING_IN'
export const COGNITO_LOGIN_SUCCESS = 'COGNITO_LOGIN_SUCCESS'
export const COGNITO_LOGIN_FAILURE = 'COGNITO_LOGIN_FAILURE'
export const COGNITO_SIGNOUT = 'COGNITO_SIGNOUT'
export const COGNITO_SIGNOUT_FAILURE = 'COGNITO_SIGNOUT_FAILURE'
export const COGNITO_SIGNOUT_SUCCESS = 'COGNITO_SIGNOUT_SUCCESS'
export const COGNITO_ERROR = 'COGNITO_ERROR'

export const cognitoConfigure = ({ UserPoolId, ClientId }) => ({
  type: COGNITO_CONFIGURE,
  UserPoolId,
  ClientId,
})

export const cognitoRegistering = ({ email, password }) => ({
  type: COGNITO_REGISTERING,
  email,
  password,
})

export const cognitoRegisterSuccess = (user) => ({
  type: COGNITO_REGISTER_SUCCESS,
  user,
})

export const cognitoRegisterFailure = (error) => ({
  type: COGNITO_REGISTER_FAILURE,
  error,
})

export const cognitoLoginSuccess = (credentials, user) => ({
  type: COGNITO_LOGIN_SUCCESS,
  credentials,
  user,
})

export const cognitoLoginFailure = (error) => ({
  type: COGNITO_LOGIN_FAILURE,
  error,
})

export const cognitoLoggingIn = ({ email, password }) => ({
  type: COGNITO_LOGGING_IN,
  email,
  password,
})

export const cognitoLogin = ({ email, password }) => ({
  type: COGNITO_LOGIN,
  email,
  password,
})

export const cognitoRegister = ({ name, email, password }) => ({
  type: COGNITO_REGISTER,
  name,
  email,
  password,
})

export const cognitoRefreshCredentials = () => ({
  type: COGNITO_REFRESH_CREDENTIALS,
})

export const cognitoSignout = () => ({
  type: COGNITO_SIGNOUT,
})

export const cognitoSignOutSuccess = () => ({
  type: COGNITO_SIGNOUT_SUCCESS,
})

export const cognitoSignOutFailure = (error) => ({
  type: COGNITO_SIGNOUT_FAILURE,
  error,
})

export const cognitoError = (error) => ({
  type: COGNITO_ERROR,
  error,
})
