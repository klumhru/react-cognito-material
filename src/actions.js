export const COGNITO_SEND_VERIFICATION_CODE = 'COGNITO_SEND_VERIFICATION_CODE'
export const COGNITO_SEND_VERIFICATION_CODE_SUCCESS = 'COGNITO_SEND_VERIFICATION_CODE_SUCCESS'
export const COGNITO_SEND_VERIFICATION_CODE_FAILURE = 'COGNITO_SEND_VERIFICATION_CODE_FAILURE'

export const COGNITO_RESET_PASSWORD = 'COGNITO_RESET_PASSWORD'
export const COGNITO_RESET_PASSWORD_SUCCESS = 'COGNITO_RESET_PASSWORD_SUCCESS'
export const COGNITO_RESET_PASSWORD_FAILURE = 'COGNITO_RESET_PASSWORD_FAILURE'


export const COGNITO_CONFIGURE = 'COGNITO_CONFIGURE'
export const COGNITO_USER_ATTRIBUTES = 'COGNITO_USER_ATTRIBUTES'
export const COGNITO_USER_ATTRIBUTES_SUCCESS = 'COGNITO_USER_ATTRIBUTES_SUCCESS'
export const COGNITO_USER_ATTRIBUTES_FAILURE = 'COGNITO_USER_ATTRIBUTES_FAILURE'
export const COGNITO_REGISTER = 'COGNITO_REGISTER'
export const COGNITO_REGISTERED = 'COGNITO_REGISTERED'
export const COGNITO_REGISTERING = 'COGNITO_REGISTERING'
export const COGNITO_REGISTER_SUCCESS = 'COGNITO_REGISTER_SUCCESS'
export const COGNITO_REGISTER_FAILURE = 'COGNITO_REGISTER_FAILURE'
export const COGNITO_START = 'COGNITO_START'
export const COGNITO_REFRESH_CREDENTIALS = 'COGNITO_REFRESH_CREDENTIALS'
export const COGNITO_LOGIN = 'COGNITO_LOGIN'
export const COGNITO_LOGIN_SUCCESS = 'COGNITO_LOGIN_SUCCESS'
export const COGNITO_LOGIN_FAILURE = 'COGNITO_LOGIN_FAILURE'
export const COGNITO_SIGNOUT = 'COGNITO_SIGNOUT'
export const COGNITO_SIGNOUT_FAILURE = 'COGNITO_SIGNOUT_FAILURE'
export const COGNITO_SIGNOUT_SUCCESS = 'COGNITO_SIGNOUT_SUCCESS'
export const COGNITO_ERROR = 'COGNITO_ERROR'

export const cognitoResetPassword = (verificationCode, newPassword) => ({
  type: COGNITO_RESET_PASSWORD,
  verificationCode,
  newPassword,
})

export const cognitoResetPasswordSuccess = () => ({
  type: COGNITO_RESET_PASSWORD_SUCCESS,
})

export const cognitoResetPasswordFailure = (error) => ({
  type: COGNITO_RESET_PASSWORD_FAILURE,
  error,
})

export const cognitoSendVerificationCode = (email) => ({
  type: COGNITO_SEND_VERIFICATION_CODE,
  email,
})

export const cognitoSendVerificationCodeSuccess = () => ({
  type: COGNITO_SEND_VERIFICATION_CODE_SUCCESS,
})

export const cognitoSendVerificationCodeFailure = (error) => ({
  type: COGNITO_SEND_VERIFICATION_CODE_FAILURE,
  error,
})

export const cognitoConfigure = ({ UserPoolId, ClientId }) => ({
  type: COGNITO_CONFIGURE,
  UserPoolId,
  ClientId,
})

export const cognitoUserAttributes = () => ({
  type: COGNITO_USER_ATTRIBUTES,
})

export const cognitoUserAttributesSuccess = (attributes, userProfileAttributes) => ({
  type: COGNITO_USER_ATTRIBUTES_SUCCESS,
  attributes,
  userProfileAttributes,
})

export const cognitoUserAttributesError = (error) => ({
  type: COGNITO_USER_ATTRIBUTES_FAILURE,
  error,
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

export const cognitoLoginSuccess = (user, session, creds) => ({
  type: COGNITO_LOGIN_SUCCESS,
  user,
  session,
  creds,
})

export const cognitoLoginFailure = (error) => ({
  type: COGNITO_LOGIN_FAILURE,
  error,
})

export const cognitoLogin = ({ email, password }) => ({
  type: COGNITO_LOGIN,
  email,
  password,
})

export const cognitoRegister = ({ name, email, password, password1 }) => ({
  type: COGNITO_REGISTER,
  name,
  email,
  password: password || password1,
})

export const cognitoStart = () => ({
  type: COGNITO_START,
})

export const cognitoRefreshCredentials = () => ({
  type: COGNITO_REFRESH_CREDENTIALS,
})

export const cognitoSignout = (signoutFromEverywhere = false) => ({
  type: COGNITO_SIGNOUT,
  signoutFromEverywhere,
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
