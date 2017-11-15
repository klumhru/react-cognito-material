import AWS from 'aws-sdk/global'
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'

import * as actions from './actions'

export default (config) => {
  const userPool = new CognitoUserPool(config)
  let refreshIntervalTimer

  const stopRefreshInterval = () => {
    clearInterval(refreshIntervalTimer)
  }
  const startRefreshInterval = (store) => {
    stopRefreshInterval()

    refreshIntervalTimer = setInterval(() => {
      store.dispatch(actions.cognitoRefreshCredentials())
    }, config.RefreshSessionIntervalSeconds * 1000 || 1000 * 60 * 15)
  }
  const putAttributes = (cognitoUser, attributes) => {
    const user = { ...cognitoUser }
    let i
    for (i = 0; i < attributes.length; i++) {
      user[attributes[i].getName()] = attributes[i].getValue()
    }

    return user
  }
  const refreshCredentials = (cognitoUser) =>
    new Promise((resolve, reject) => {
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err)
        } else if (config.RetrieveCredentials) {
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
              reject(error)
            } else {
              resolve(session)
            }
          })
        }
      })
    })

  return (store) => (next) => (action) => {
    const res = next(action)
    switch (action.type) {
      case actions.COGNITO_SIGNOUT: {
        const cognitoUser = userPool.getCurrentUser()
        stopRefreshInterval()
        try {
          cognitoUser.signOut()
          AWS.config.credentials.clearCachedId()
        } catch (e) {
          store.dispatch(actions.cognitoSignOutFailure(e))
        } finally {
          store.dispatch(actions.cognitoSignOutSuccess())
        }
        break
      }
      case actions.COGNITO_SIGNOUT_SUCCESS: {
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
        const auth = new AuthenticationDetails({ Username: email, Password: password })
        const userData = { Username: email, Pool: userPool }
        const cognitoUser = new CognitoUser(userData)
        cognitoUser.authenticateUser(auth, {
          onSuccess: () => {
            startRefreshInterval(store)
            store.dispatch(actions.cognitoRefreshCredentials())
          },
          onFailure: (error) => store.dispatch(actions.cognitoLoginFailure(error)),
        })
        break
      }
      case actions.COGNITO_START: {
        const cognitoUser = userPool.getCurrentUser()
        if (cognitoUser != null) {
          // Start interval to refresh the session
          startRefreshInterval(store)
          store.dispatch(actions.cognitoRefreshCredentials())
        }
        break
      }
      case actions.COGNITO_REFRESH_CREDENTIALS: {
        const cognitoUser = userPool.getCurrentUser()
        if (cognitoUser != null) {
          refreshCredentials(cognitoUser).then((session) => {
            cognitoUser.getUserAttributes((error, attributes) => {
              if (error) {
                store.dispatch(actions.cognitoError(error))
              } else {
                const user = putAttributes(cognitoUser, attributes)
                user.identityId = AWS.config.credentials.params.IdentityId
                const data = AWS.config.credentials.data.Credentials
                const creds = {
                  accessKeyId: data.AccessKeyId,
                  secretAccessKey: data.SecretAccessKey || data.SecretKey,
                  sessionToken: data.SessionToken,
                  expiration: data.Expiration,
                }

                store.dispatch(actions.cognitoLoginSuccess(user, session, creds))
              }
            })
          }).catch((err) => {
            store.dispatch(actions.cognitoLoginFailure(err))
          })
        }
        break
      }
      default: break
    }
    return res
  }
}
