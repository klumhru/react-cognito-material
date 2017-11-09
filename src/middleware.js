import AWS from 'aws-sdk/global'
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

import * as actions from './actions'

export default (config) => {
  const userPool = new CognitoUserPool(config)
  let cognitoUser
  const putAttributes = (store, user, session, creds) => {
    const userWithAttributes = { ...user }
    user.getUserAttributes((err, res) => {
      if (err) {
        return store.dispatch(actions.cognitoError(err))
      }
      let i
      for (i = 0; i < res.length; i++) {
        userWithAttributes[res[i].getName()] = res[i].getValue()
      }

      return store.dispatch(actions.cognitoLoginSuccess(userWithAttributes, session, creds))
    })
  }

  return (store) => (next) => (action) => {
    switch (action.type) {
      case actions.COGNITO_SIGNOUT: {
        try {
          cognitoUser.signOut()
          AWS.config.credentials.clearCacheId()
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
          { Name: 'name', Value: name },
          { Name: 'email', Value: email },
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
        store.dispatch(actions.cognitoLoggingIn())
        const auth = new AuthenticationDetails({ Username: email, Password: password })
        const userData = { Username: email, Pool: userPool }
        cognitoUser = new CognitoUser(userData)
        cognitoUser.authenticateUser(auth, {
          onSuccess: () => {
            store.dispatch(actions.cognitoRefreshCredentials())
          },
          onFailure: (error) => store.dispatch(actions.cognitoLoginFailure(error)),
        })
        break
      }
      case actions.COGNITO_START: {
        cognitoUser = userPool.getCurrentUser()
        if (cognitoUser != null) {
          return store.dispatch(actions.cognitoRefreshCredentials())
        }
        break
      }
      case actions.COGNITO_REFRESH_CREDENTIALS: {
        cognitoUser = userPool.getCurrentUser()
        if (cognitoUser != null) {
          cognitoUser.getSession((err, session) => {
            if (err) {
              return store.dispatch(actions.cognitoLoginFailure(err))
            }
            if (config.RetrieveCredentials) {
              AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: config.IdentityPoolId,
                RoleArn: config.AuthRoleArn,
                Logins: {
                  [`cognito-idp.${userPool.client.config.region}.amazonaws.com/${userPool.userPoolId}`]:
                  session.getIdToken().getJwtToken(),
                },
              })
              AWS.config.region = 'eu-west-1'
              AWS.config.credentials.refresh((error) => {
                if (error) {
                  store.dispatch(actions.cognitoLoginFailure(error))
                } else {
                  const data = AWS.config.credentials.data.Credentials
                  cognitoUser.identityId = AWS.config.credentials.params.IdentityId
                  const creds = {
                    accessKeyId: data.AccessKeyId,
                    secretAccessKey: data.SecretAccessKey || data.SecretKey,
                    sessionToken: data.SessionToken,
                  }
                  return putAttributes(store, cognitoUser, session, creds)
                }
                return undefined
              })
            }
            return undefined
          })
        } else {
          return store.dispatch(actions.cognitoSignout())
        }
        break
      }
      default: break
    }
    return next(action)
  }
}
