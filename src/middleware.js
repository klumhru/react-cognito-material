import AWS from 'aws-sdk/global'
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

import * as actions from './actions'

export default (config, {
  onSigninSuccess,
  onSignoutSuccess,
}) => {
  const userPool = new CognitoUserPool(config)
  let cognitoUser
  const putAttributes = (store, creds, user) => {
    user.getUserAttributes((err, res) => {
      if (err) {
        return store.dispatch(actions.cognitoError(err))
      }
      let i
      const user = {}
      for (i = 0; i < res.length; i++) {
        user[res[i].getName()] = res[i].getValue()
      }
      store.dispatch(actions.cognitoLoginSuccess(creds, user))
      if (onSigninSuccess !== undefined) {
        store.dispatch(onSigninSuccess())
      }
    })
  }

  return (store) => (next) => (action) => {
    switch (action.type) {
      case actions.COGNITO_SIGNOUT: {
        try {
          cognitoUser.signOut()
        } catch (e) {
          store.dispatch(actions.cognitoSignOutFailure(e))
        } finally {
          store.dispatch(actions.cognitoSignOutSuccess())
        }
        break
      }
      case actions.COGNITO_SIGNOUT_SUCCESS: {
        cognitoUser = undefined
        break
      }
      case actions.COGNITO_REGISTER: {
        const { name, email, password } = action
        const attributes = [
          { Name: "name", Value: name },
          { Name: "email", Value: email },
        ]
        store.dispatch(actions.cognitoRegistering({ email, password }))
        userPool.signUp(email, password, attributes, null, (err, result) => {
          if (err) {
            store.dispatch(actions.cognitoRegisterFailure(err))
          }
          store.dispatch(actions.cognitoRegisterSuccess(result.user))
        })
        break
      }
      case actions.COGNITO_LOGIN: {
        const { email, password } = action
        store.dispatch(actions.cognitoLoggingIn({ email, password }))
        const auth = new AuthenticationDetails({ Username: email, Password: password })
        const userData = { Username: email, Pool: userPool }
        const user = new CognitoUser(userData)
        user.authenticateUser(auth, {
          onSuccess: (result) => {
            AWS.config.region = userPool.client.config.region
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: userPool.userPoolId,
              Logins: {
                [`cognito-idp.${userPool.client.config.region}.amazonaws.com/${userPool.userPoolId}`]:
                  result.getIdToken().getJwtToken(),
              },
            })
            putAttributes(store, AWS.config.credentials, user)
          },
          onFailure: (error) => store.dispatch(actions.cognitoLoginFailure(error)),
        })
        break
      }
      case actions.COGNITO_REFRESH_CREDENTIALS: {
        cognitoUser = userPool.getCurrentUser()
        console.log('refreshing credentials')
        if (cognitoUser != null) {
          cognitoUser.getSession((err, session) => {
            if (err) {
              store.dispatch(actions.cognitoLoginFailure(err))
            }
            console.log(`session validity: ${session.isValid()}`)

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: userPool.userPoolId,
              Logins: {
                [`cognito-idp.${userPool.client.config.region}.amazonaws.com/${userPool.userPoolId}`]:
                session.getIdToken().getJwtToken(),
              },
            })
            putAttributes(store, AWS.config.credentials, cognitoUser)
          })
        }
        break
      }
      default: break
    }
    return next(action)
  }
}
